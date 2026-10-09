-- Fase 3: ejercicios con contenido redactado a mano (p. ej. reformulación con respuesta modelo).
-- Los ejercicios de huecos, significado y "¿Quién lo dijo?" se generan a partir de las citas.

create type public.exercise_type as enum ('gap_fill', 'meaning_mcq', 'register_rewrite', 'who_said_it');

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  type public.exercise_type not null,
  -- Validado con Zod en la app según el tipo; aquí solo forma y tamaño.
  payload jsonb not null check (jsonb_typeof(payload) = 'object' and pg_column_size(payload) <= 4096),
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quote_id, type)
);

create index exercises_quote_idx on public.exercises (quote_id);

create trigger exercises_set_updated_at
  before update on public.exercises
  for each row execute function public.set_updated_at();

alter table public.exercises enable row level security;

revoke all on table public.exercises from anon, authenticated;
grant select on table public.exercises to anon, authenticated;
grant insert, update, delete on table public.exercises to authenticated;

create policy "exercises: lectura si está publicado y su cita también" on public.exercises
  for select to anon, authenticated
  using (
    status = 'published'
    and exists (select 1 from public.quotes q where q.id = quote_id and q.status = 'published')
  );

create policy "exercises: admin" on public.exercises
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
