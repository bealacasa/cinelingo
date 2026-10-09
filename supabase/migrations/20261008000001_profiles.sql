-- Fase 1: perfiles de usuario, roles y helper is_admin().
-- Regla general: RLS activada en todas las tablas; privilegios concedidos explícitamente.

create type public.cefr_level as enum ('B2', 'C1', 'C2');
create type public.user_role as enum ('user', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 50),
  role public.user_role not null default 'user',
  target_level public.cefr_level not null default 'C1',
  timezone text not null default 'Europe/Madrid' check (char_length(timezone) <= 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Privilegios: nadie anónimo; el usuario autenticado solo puede leer y
-- actualizar columnas no sensibles. `role` no es actualizable por el usuario.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, target_level, timezone) on table public.profiles to authenticated;

create policy "profiles: el usuario lee su perfil"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: el usuario actualiza su perfil"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- updated_at automático (reutilizable por otras tablas).
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Alta automática del perfil al crear el usuario en auth.users.
-- No copiamos el email (minimización de datos: ya vive en auth.users).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ¿Es admin el usuario actual? SECURITY DEFINER para evitar recursión de RLS.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
