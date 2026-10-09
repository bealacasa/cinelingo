-- Fase 1: rate limiting en Postgres (ventana fija).
-- Las claves llegan ya firmadas con HMAC desde el servidor: aquí no se guardan IPs ni emails.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.rate_limits (
  key text not null check (char_length(key) <= 128),
  window_start timestamptz not null,
  count integer not null default 1,
  primary key (key, window_start)
);

alter table private.rate_limits enable row level security;

-- Devuelve true si la petición está permitida.
create function public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_window timestamptz;
  v_count integer;
begin
  if p_key is null or char_length(p_key) > 128
     or p_limit < 1 or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'invalid rate limit arguments';
  end if;

  v_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);

  insert into private.rate_limits as r (key, window_start, count)
  values (p_key, v_window, 1)
  on conflict (key, window_start) do update set count = r.count + 1
  returning r.count into v_count;

  -- Limpieza perezosa de ventanas antiguas (~1 % de las llamadas).
  if random() < 0.01 then
    delete from private.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_count <= p_limit;
end;
$$;

-- Solo el servidor (clave secreta → rol service_role) puede llamarla.
revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
