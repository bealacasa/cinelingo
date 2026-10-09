-- Fase 2: contenido educativo (obras, citas, expresiones, etiquetas, cita del día).
-- Lectura pública solo de lo publicado; escritura reservada a administradores.

create type public.work_type as enum ('film', 'series');
create type public.register as enum ('formal', 'neutral', 'informal', 'slang');
create type public.expression_type as enum (
  'phrasal_verb', 'idiom', 'collocation', 'slang', 'discourse_marker', 'grammar', 'other'
);
create type public.english_variety as enum ('us', 'uk', 'au', 'ie', 'ca', 'other');
create type public.content_status as enum ('draft', 'review', 'published');

create table public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  type public.work_type not null,
  year smallint not null check (year between 1888 and 2100),
  created_at timestamptz not null default now(),
  unique (title, year)
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works (id) on delete restrict,
  -- Citas breves (una o dos frases): límite duro de longitud.
  text text not null check (char_length(text) between 1 and 280),
  character_name text not null check (char_length(character_name) between 1 and 120),
  season smallint check (season between 1 and 99),
  episode smallint check (episode between 1 and 999),
  scene_context_es text not null check (char_length(scene_context_es) between 1 and 1000),
  translation_es text not null check (char_length(translation_es) between 1 and 500),
  cultural_note_es text check (char_length(cultural_note_es) <= 1000),
  level public.cefr_level not null default 'C1',
  variety public.english_variety not null default 'us',
  status public.content_status not null default 'draft',
  -- null = pendiente de verificar la literalidad y la atribución.
  reviewed_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (episode is null or season is not null)
);

create index quotes_published_idx on public.quotes (created_at, id) where status = 'published';
create index quotes_work_idx on public.quotes (work_id);

create trigger quotes_set_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

create table public.expressions (
  id uuid primary key default gen_random_uuid(),
  phrase text not null unique check (char_length(phrase) between 1 and 120),
  type public.expression_type not null,
  register public.register not null,
  meaning_en text not null check (char_length(meaning_en) between 1 and 500),
  meaning_es text not null check (char_length(meaning_es) between 1 and 500),
  note_es text check (char_length(note_es) <= 1000),
  level public.cefr_level not null default 'C1',
  created_at timestamptz not null default now()
);

-- Posición de la expresión dentro del texto de la cita (para resaltarla sin HTML).
-- Offsets en unidades de carácter, extremo final exclusivo.
create table public.quote_expressions (
  quote_id uuid not null references public.quotes (id) on delete cascade,
  expression_id uuid not null references public.expressions (id) on delete restrict,
  start_offset smallint not null check (start_offset >= 0),
  end_offset smallint not null,
  primary key (quote_id, expression_id),
  check (end_offset > start_offset)
);

create index quote_expressions_expression_idx on public.quote_expressions (expression_id);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  name_es text not null check (char_length(name_es) between 1 and 60)
);

create table public.quote_tags (
  quote_id uuid not null references public.quotes (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (quote_id, tag_id)
);

create index quote_tags_tag_idx on public.quote_tags (tag_id);

-- Programación manual de la cita del día (si no hay fila, la app elige una de forma determinista).
create table public.daily_quotes (
  day date primary key,
  quote_id uuid not null references public.quotes (id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- RLS y privilegios
-- ---------------------------------------------------------------------------
alter table public.works enable row level security;
alter table public.quotes enable row level security;
alter table public.expressions enable row level security;
alter table public.quote_expressions enable row level security;
alter table public.tags enable row level security;
alter table public.quote_tags enable row level security;
alter table public.daily_quotes enable row level security;

revoke all on table
  public.works, public.quotes, public.expressions, public.quote_expressions,
  public.tags, public.quote_tags, public.daily_quotes
from anon, authenticated;

grant select on table
  public.works, public.quotes, public.expressions, public.quote_expressions,
  public.tags, public.quote_tags, public.daily_quotes
to anon, authenticated;

grant insert, update, delete on table
  public.works, public.quotes, public.expressions, public.quote_expressions,
  public.tags, public.quote_tags, public.daily_quotes
to authenticated;

-- Lectura pública
create policy "quotes: lectura de publicadas" on public.quotes
  for select to anon, authenticated using (status = 'published');

create policy "works: lectura pública" on public.works
  for select to anon, authenticated using (true);

create policy "expressions: lectura pública" on public.expressions
  for select to anon, authenticated using (true);

create policy "tags: lectura pública" on public.tags
  for select to anon, authenticated using (true);

create policy "quote_expressions: lectura si la cita está publicada" on public.quote_expressions
  for select to anon, authenticated
  using (exists (select 1 from public.quotes q where q.id = quote_id and q.status = 'published'));

create policy "quote_tags: lectura si la cita está publicada" on public.quote_tags
  for select to anon, authenticated
  using (exists (select 1 from public.quotes q where q.id = quote_id and q.status = 'published'));

create policy "daily_quotes: lectura si la cita está publicada" on public.daily_quotes
  for select to anon, authenticated
  using (exists (select 1 from public.quotes q where q.id = quote_id and q.status = 'published'));

-- Administración (lectura total + escritura). is_admin() se evalúa en el servidor de BD.
create policy "quotes: admin" on public.quotes
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "works: admin" on public.works
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "expressions: admin" on public.expressions
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "quote_expressions: admin" on public.quote_expressions
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "tags: admin" on public.tags
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "quote_tags: admin" on public.quote_tags
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "daily_quotes: admin" on public.daily_quotes
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
