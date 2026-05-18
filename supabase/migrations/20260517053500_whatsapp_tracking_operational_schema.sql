-- ZaTrack Project 2 - incremental WhatsApp-first tracking schema.
--
-- Conflict analysis from Project 2:
-- - Existing semantic tables are kept intact: clientes, ctwa_cliques,
--   conduzencias, eventos, evento_logs.
-- - Operational tables missing by real names are created with IF NOT EXISTS:
--   clients, ctwa_clicks, leads, event_logs.
-- - eventos already exists, so this migration only adds missing real columns.
--
-- Safety rules:
-- - No destructive table operations.
-- - No existing column type changes.
-- - No table recreation or data reset.
-- - All changes are additive and idempotent where PostgreSQL supports it.

begin;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.clients (
  id uuid not null default extensions.gen_random_uuid(),
  created_at timestamp without time zone not null default now(),
  name text,
  email text,
  whatsapp_number text,
  meta_access_token text,
  pixel_ids jsonb,
  plan text,
  meta_ad_account_id text,
  pixel_token text,
  constraint clients_pkey primary key (id)
);

alter table public.clients
  add column if not exists id uuid default extensions.gen_random_uuid(),
  add column if not exists created_at timestamp without time zone default now(),
  add column if not exists name text,
  add column if not exists email text,
  add column if not exists whatsapp_number text,
  add column if not exists meta_access_token text,
  add column if not exists pixel_ids jsonb,
  add column if not exists plan text,
  add column if not exists meta_ad_account_id text,
  add column if not exists pixel_token text;

create table if not exists public.ctwa_clicks (
  id uuid not null default extensions.gen_random_uuid(),
  client_id uuid not null,
  campaign_id text,
  adset_id text,
  ad_id text,
  campaign_name text,
  adset_name text,
  ad_name text,
  click_timestamp timestamp with time zone not null,
  whatsapp_clicks integer default 0,
  client_whatsapp text,
  date_start date,
  date_stop date,
  payload_raw jsonb,
  created_at timestamp with time zone default now(),
  dedup_key text,
  constraint ctwa_clicks_pkey primary key (id),
  constraint ctwa_clicks_dedup_key_key unique (dedup_key)
);

alter table public.ctwa_clicks
  add column if not exists id uuid default extensions.gen_random_uuid(),
  add column if not exists client_id uuid,
  add column if not exists campaign_id text,
  add column if not exists adset_id text,
  add column if not exists ad_id text,
  add column if not exists campaign_name text,
  add column if not exists adset_name text,
  add column if not exists ad_name text,
  add column if not exists click_timestamp timestamp with time zone,
  add column if not exists whatsapp_clicks integer default 0,
  add column if not exists client_whatsapp text,
  add column if not exists date_start date,
  add column if not exists date_stop date,
  add column if not exists payload_raw jsonb,
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists dedup_key text;

create table if not exists public.leads (
  id uuid not null default extensions.gen_random_uuid(),
  created_at timestamp with time zone default now(),
  client_id uuid,
  phone text,
  ctwa_clid text,
  name text,
  source text,
  event_type text,
  status_id text,
  status_name text,
  total_messages text,
  client_ip text,
  visit text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_campaign_id text,
  utm_adset_id text,
  utm_ad_id text,
  campaign_id text,
  adset_id text,
  ad_id text,
  external_id text,
  id_scalex1 text,
  updated text,
  updated_isoformat text,
  country text,
  state text,
  amount_spent text,
  updated_at timestamp with time zone default now(),
  ad_account_id text,
  sale_amount text,
  created text,
  created_isoformat text,
  payload_raw jsonb,
  payload_last jsonb,
  email text,
  constraint leads_pkey primary key (id)
);

alter table public.leads
  add column if not exists id uuid default extensions.gen_random_uuid(),
  add column if not exists created_at timestamp with time zone default now(),
  add column if not exists client_id uuid,
  add column if not exists phone text,
  add column if not exists ctwa_clid text,
  add column if not exists name text,
  add column if not exists source text,
  add column if not exists event_type text,
  add column if not exists status_id text,
  add column if not exists status_name text,
  add column if not exists total_messages text,
  add column if not exists client_ip text,
  add column if not exists visit text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_campaign_id text,
  add column if not exists utm_adset_id text,
  add column if not exists utm_ad_id text,
  add column if not exists campaign_id text,
  add column if not exists adset_id text,
  add column if not exists ad_id text,
  add column if not exists external_id text,
  add column if not exists id_scalex1 text,
  add column if not exists updated text,
  add column if not exists updated_isoformat text,
  add column if not exists country text,
  add column if not exists state text,
  add column if not exists amount_spent text,
  add column if not exists updated_at timestamp with time zone default now(),
  add column if not exists ad_account_id text,
  add column if not exists sale_amount text,
  add column if not exists created text,
  add column if not exists created_isoformat text,
  add column if not exists payload_raw jsonb,
  add column if not exists payload_last jsonb,
  add column if not exists email text;

alter table public.eventos
  add column if not exists event_name text,
  add column if not exists event_id text,
  add column if not exists pixel_id text,
  add column if not exists value numeric,
  add column if not exists currency text default ''::text,
  add column if not exists lead_id uuid,
  add column if not exists payload_raw jsonb,
  add column if not exists "timestamp" timestamp without time zone default now(),
  add column if not exists status text,
  add column if not exists phone text,
  add column if not exists success text,
  add column if not exists status_code numeric,
  add column if not exists error_message text;

create table if not exists public.event_logs (
  id uuid not null default extensions.gen_random_uuid(),
  event_id uuid not null,
  meta_response jsonb,
  created_at timestamp without time zone default now(),
  constraint event_logs_pkey primary key (id)
);

alter table public.event_logs
  add column if not exists id uuid default extensions.gen_random_uuid(),
  add column if not exists event_id uuid,
  add column if not exists meta_response jsonb,
  add column if not exists created_at timestamp without time zone default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.ctwa_clicks'::regclass
      and conname = 'ctwa_clicks_client_id_fkey'
  ) then
    alter table public.ctwa_clicks
      add constraint ctwa_clicks_client_id_fkey
      foreign key (client_id) references public.clients(id) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.eventos'::regclass
      and conname = 'eventos_lead_id_fkey'
  ) then
    alter table public.eventos
      add constraint eventos_lead_id_fkey
      foreign key (lead_id) references public.leads(id) not valid;
  end if;
end;
$$;

create index if not exists leads_phone_idx on public.leads (phone);
create index if not exists leads_ctwa_clid_idx on public.leads (ctwa_clid);
create index if not exists leads_campaign_id_idx on public.leads (campaign_id);
create index if not exists leads_adset_id_idx on public.leads (adset_id);
create index if not exists leads_ad_id_idx on public.leads (ad_id);
create index if not exists leads_external_id_idx on public.leads (external_id);
create index if not exists leads_created_at_idx on public.leads (created_at);
create index if not exists leads_updated_at_idx on public.leads (updated_at);

create index if not exists ctwa_clicks_client_id_idx on public.ctwa_clicks (client_id);
create index if not exists ctwa_clicks_campaign_id_idx on public.ctwa_clicks (campaign_id);
create index if not exists ctwa_clicks_adset_id_idx on public.ctwa_clicks (adset_id);
create index if not exists ctwa_clicks_ad_id_idx on public.ctwa_clicks (ad_id);
create index if not exists ctwa_clicks_click_timestamp_idx on public.ctwa_clicks (click_timestamp);

create index if not exists eventos_lead_id_idx on public.eventos (lead_id);
create index if not exists eventos_phone_idx on public.eventos (phone);
create index if not exists eventos_event_name_idx on public.eventos (event_name);
create index if not exists eventos_event_id_idx on public.eventos (event_id);
create index if not exists eventos_timestamp_idx on public.eventos ("timestamp");

create index if not exists event_logs_event_id_idx on public.event_logs (event_id);
create index if not exists event_logs_created_at_idx on public.event_logs (created_at);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.ctwa_clicks'::regclass
      and conname = 'ctwa_clicks_dedup_key_key'
  ) and not exists (
    select 1
    from public.ctwa_clicks
    where dedup_key is not null
    group by dedup_key
    having count(*) > 1
  ) then
    alter table public.ctwa_clicks
      add constraint ctwa_clicks_dedup_key_key unique (dedup_key);
  end if;
end;
$$;

do $$
declare
  realtime_table regclass;
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    foreach realtime_table in array array[
      'public.clients'::regclass,
      'public.ctwa_clicks'::regclass,
      'public.leads'::regclass,
      'public.eventos'::regclass,
      'public.event_logs'::regclass
    ]
    loop
      if not exists (
        select 1
        from pg_publication p
        join pg_publication_rel pr on pr.prpubid = p.oid
        where p.pubname = 'supabase_realtime'
          and pr.prrelid = realtime_table
      ) then
        execute format(
          'alter publication supabase_realtime add table %s',
          realtime_table
        );
      end if;
    end loop;
  end if;
end;
$$;

commit;
