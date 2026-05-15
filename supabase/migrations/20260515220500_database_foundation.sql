-- ZaTrack Project 2 - Phase 1 database foundation.
-- Scope: core tracking database only. No frontend, dashboard, analytics,
-- Edge Functions, webhooks, Meta events, or external automations.

begin;

create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.clientes (
  id uuid primary key default extensions.gen_random_uuid(),
  external_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clientes_external_id_key unique (external_id),
  constraint clientes_payload_object_chk check (jsonb_typeof(payload) = 'object')
);

create table public.ctwa_cliques (
  id uuid primary key default extensions.gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  external_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ctwa_cliques_cliente_external_id_key unique (cliente_id, external_id),
  constraint ctwa_cliques_payload_object_chk check (jsonb_typeof(payload) = 'object')
);

create table public.conduzencias (
  id uuid primary key default extensions.gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  ctwa_clique_id uuid references public.ctwa_cliques(id) on delete set null,
  external_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conduzencias_cliente_external_id_key unique (cliente_id, external_id),
  constraint conduzencias_payload_object_chk check (jsonb_typeof(payload) = 'object')
);

create table public.eventos (
  id uuid primary key default extensions.gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  conduzencia_id uuid references public.conduzencias(id) on delete set null,
  ctwa_clique_id uuid references public.ctwa_cliques(id) on delete set null,
  external_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint eventos_cliente_external_id_key unique (cliente_id, external_id),
  constraint eventos_payload_object_chk check (jsonb_typeof(payload) = 'object')
);

create table public.evento_logs (
  id uuid primary key default extensions.gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  evento_id uuid not null references public.eventos(id) on delete cascade,
  external_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint evento_logs_cliente_external_id_key unique (cliente_id, external_id),
  constraint evento_logs_payload_object_chk check (jsonb_typeof(payload) = 'object')
);

create trigger set_clientes_updated_at
before update on public.clientes
for each row
execute function public.set_updated_at();

create trigger set_ctwa_cliques_updated_at
before update on public.ctwa_cliques
for each row
execute function public.set_updated_at();

create trigger set_conduzencias_updated_at
before update on public.conduzencias
for each row
execute function public.set_updated_at();

create trigger set_eventos_updated_at
before update on public.eventos
for each row
execute function public.set_updated_at();

create trigger set_evento_logs_updated_at
before update on public.evento_logs
for each row
execute function public.set_updated_at();

alter table public.clientes enable row level security;
alter table public.ctwa_cliques enable row level security;
alter table public.conduzencias enable row level security;
alter table public.eventos enable row level security;
alter table public.evento_logs enable row level security;

create index clientes_created_at_idx on public.clientes (created_at desc);
create index clientes_payload_gin_idx on public.clientes using gin (payload);

create index ctwa_cliques_cliente_created_at_idx on public.ctwa_cliques (cliente_id, created_at desc);
create index ctwa_cliques_payload_gin_idx on public.ctwa_cliques using gin (payload);

create index conduzencias_cliente_created_at_idx on public.conduzencias (cliente_id, created_at desc);
create index conduzencias_ctwa_clique_id_idx on public.conduzencias (ctwa_clique_id);
create index conduzencias_payload_gin_idx on public.conduzencias using gin (payload);

create index eventos_cliente_created_at_idx on public.eventos (cliente_id, created_at desc);
create index eventos_conduzencia_id_idx on public.eventos (conduzencia_id);
create index eventos_ctwa_clique_id_idx on public.eventos (ctwa_clique_id);
create index eventos_payload_gin_idx on public.eventos using gin (payload);

create index evento_logs_cliente_created_at_idx on public.evento_logs (cliente_id, created_at desc);
create index evento_logs_evento_id_created_at_idx on public.evento_logs (evento_id, created_at desc);
create index evento_logs_payload_gin_idx on public.evento_logs using gin (payload);

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    alter publication supabase_realtime add table
      public.clientes,
      public.ctwa_cliques,
      public.conduzencias,
      public.eventos,
      public.evento_logs;
  end if;
end;
$$;

commit;
