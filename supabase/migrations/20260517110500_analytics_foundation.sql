-- ZaTrack Project 2 - Phase 1 analytics foundation.
--
-- Scope:
-- - Performance indexes for the operational tracking path.
-- - Read-only analytics views for the future KPI Engine.
-- - No operational schema rewrites, no destructive operations, no frontend.

begin;

-- leads: canonical lead identity, deterministic attribution, campaign lineage.
create index if not exists leads_phone_created_at_idx
  on public.leads (phone, created_at desc);

create index if not exists leads_ctwa_clid_created_at_idx
  on public.leads (ctwa_clid, created_at desc);

create index if not exists leads_campaign_lineage_created_at_idx
  on public.leads (campaign_id, adset_id, ad_id, created_at desc);

create index if not exists leads_utm_campaign_created_at_idx
  on public.leads (utm_campaign, created_at desc);

create index if not exists leads_external_id_created_at_idx
  on public.leads (external_id, created_at desc);

create index if not exists leads_client_created_at_idx
  on public.leads (client_id, created_at desc);

-- eventos: operational event store for server-side events and Meta processing.
create index if not exists eventos_created_at_idx
  on public.eventos (created_at desc);

create index if not exists eventos_event_name_created_at_idx
  on public.eventos (event_name, created_at desc);

create index if not exists eventos_lead_created_at_idx
  on public.eventos (lead_id, created_at desc);

create index if not exists eventos_phone_created_at_idx
  on public.eventos (phone, created_at desc);

create index if not exists eventos_status_created_at_idx
  on public.eventos (status, created_at desc);

create index if not exists eventos_pixel_created_at_idx
  on public.eventos (pixel_id, created_at desc);

create index if not exists eventos_event_id_created_at_idx
  on public.eventos (event_id, created_at desc);

-- ctwa_clicks: CTWA source of truth and click attribution lookup.
create index if not exists ctwa_clicks_client_campaign_click_idx
  on public.ctwa_clicks (client_id, campaign_id, click_timestamp desc);

create index if not exists ctwa_clicks_campaign_click_idx
  on public.ctwa_clicks (campaign_id, click_timestamp desc);

create index if not exists ctwa_clicks_dedup_key_lookup_idx
  on public.ctwa_clicks (dedup_key);

create or replace view public.analytics_daily_revenue as
select
  (e.created_at at time zone 'UTC')::date as metric_date,
  e.pixel_id,
  coalesce(nullif(e.currency, ''), 'BRL') as currency,
  count(*) filter (
    where lower(coalesce(e.event_name, '')) = 'purchase'
  ) as purchase_events,
  count(*) filter (
    where lower(coalesce(e.event_name, '')) = 'purchase'
      and lower(coalesce(e.status, e.success, '')) in ('success', 'succeeded', 'true', '200', 'ok')
  ) as successful_purchase_events,
  coalesce(sum(e.value) filter (
    where lower(coalesce(e.event_name, '')) = 'purchase'
  ), 0) as gross_revenue,
  count(*) filter (
    where lower(coalesce(e.status, '')) in ('error', 'failed', 'failure')
      or e.status_code >= 400
  ) as failed_events,
  min(e.created_at) as first_event_at,
  max(e.created_at) as last_event_at
from public.eventos e
group by
  (e.created_at at time zone 'UTC')::date,
  e.pixel_id,
  coalesce(nullif(e.currency, ''), 'BRL');

create or replace view public.analytics_daily_leads as
select
  (l.created_at at time zone 'UTC')::date as metric_date,
  l.client_id,
  l.source,
  l.campaign_id,
  l.adset_id,
  l.ad_id,
  l.utm_campaign,
  count(l.id) as total_leads,
  count(l.id) filter (where l.phone is not null and l.phone <> '') as leads_with_phone,
  count(l.id) filter (where l.ctwa_clid is not null and l.ctwa_clid <> '') as leads_with_ctwa,
  count(distinct l.phone) filter (where l.phone is not null and l.phone <> '') as unique_phones,
  min(l.created_at) as first_lead_at,
  max(l.created_at) as last_lead_at
from public.leads l
group by
  (l.created_at at time zone 'UTC')::date,
  l.client_id,
  l.source,
  l.campaign_id,
  l.adset_id,
  l.ad_id,
  l.utm_campaign;

create or replace view public.analytics_campaign_performance as
with event_metrics_by_lead as (
  select
    e.lead_id,
    count(e.id) as total_events,
    count(e.id) filter (
      where lower(coalesce(e.event_name, '')) = 'purchase'
    ) as purchase_events,
    count(e.id) filter (
      where lower(coalesce(e.event_name, '')) = 'purchase'
        and lower(coalesce(e.status, e.success, '')) in ('success', 'succeeded', 'true', '200', 'ok')
    ) as successful_purchase_events,
    coalesce(sum(e.value) filter (
      where lower(coalesce(e.event_name, '')) = 'purchase'
    ), 0) as gross_revenue,
    count(e.id) filter (
      where lower(coalesce(e.status, '')) in ('error', 'failed', 'failure')
        or e.status_code >= 400
    ) as failed_events
  from public.eventos e
  where e.lead_id is not null
  group by e.lead_id
)
select
  (l.created_at at time zone 'UTC')::date as metric_date,
  l.client_id,
  l.campaign_id,
  l.adset_id,
  l.ad_id,
  l.utm_campaign,
  count(l.id) as total_leads,
  count(l.id) filter (where l.ctwa_clid is not null and l.ctwa_clid <> '') as ctwa_attributed_leads,
  coalesce(sum(em.total_events), 0) as total_events,
  coalesce(sum(em.purchase_events), 0) as purchase_events,
  coalesce(sum(em.successful_purchase_events), 0) as successful_purchase_events,
  coalesce(sum(em.gross_revenue), 0) as gross_revenue,
  coalesce(sum(em.failed_events), 0) as failed_events,
  min(l.created_at) as first_lead_at,
  max(l.created_at) as last_lead_at
from public.leads l
left join event_metrics_by_lead em on em.lead_id = l.id
group by
  (l.created_at at time zone 'UTC')::date,
  l.client_id,
  l.campaign_id,
  l.adset_id,
  l.ad_id,
  l.utm_campaign;

create or replace view public.analytics_purchase_funnel as
with lead_metrics as (
  select
    (l.created_at at time zone 'UTC')::date as metric_date,
    l.client_id,
    l.campaign_id,
    l.adset_id,
    l.ad_id,
    count(l.id) as leads_count,
    count(l.id) filter (where l.ctwa_clid is not null and l.ctwa_clid <> '') as ctwa_leads_count
  from public.leads l
  group by
    (l.created_at at time zone 'UTC')::date,
    l.client_id,
    l.campaign_id,
    l.adset_id,
    l.ad_id
),
event_metrics as (
  select
    (l.created_at at time zone 'UTC')::date as metric_date,
    l.client_id,
    l.campaign_id,
    l.adset_id,
    l.ad_id,
    count(e.id) filter (
      where lower(coalesce(e.event_name, '')) in ('checkout', 'checkout_init', 'initiatecheckout')
    ) as checkout_events,
    count(e.id) filter (
      where lower(coalesce(e.event_name, '')) = 'purchase'
    ) as purchase_events,
    count(e.id) filter (
      where lower(coalesce(e.event_name, '')) = 'purchase'
        and lower(coalesce(e.status, e.success, '')) in ('success', 'succeeded', 'true', '200', 'ok')
    ) as successful_purchase_events,
    coalesce(sum(e.value) filter (
      where lower(coalesce(e.event_name, '')) = 'purchase'
    ), 0) as gross_revenue
  from public.leads l
  left join public.eventos e on e.lead_id = l.id
  group by
    (l.created_at at time zone 'UTC')::date,
    l.client_id,
    l.campaign_id,
    l.adset_id,
    l.ad_id
)
select
  lm.metric_date,
  lm.client_id,
  lm.campaign_id,
  lm.adset_id,
  lm.ad_id,
  lm.leads_count,
  lm.ctwa_leads_count,
  coalesce(em.checkout_events, 0) as checkout_events,
  coalesce(em.purchase_events, 0) as purchase_events,
  coalesce(em.successful_purchase_events, 0) as successful_purchase_events,
  coalesce(em.gross_revenue, 0) as gross_revenue,
  case
    when lm.leads_count > 0
      then coalesce(em.checkout_events, 0)::numeric / lm.leads_count
    else 0
  end as lead_to_checkout_rate,
  case
    when lm.leads_count > 0
      then coalesce(em.successful_purchase_events, 0)::numeric / lm.leads_count
    else 0
  end as lead_to_purchase_rate
from lead_metrics lm
left join event_metrics em
  on em.metric_date = lm.metric_date
  and em.client_id is not distinct from lm.client_id
  and em.campaign_id is not distinct from lm.campaign_id
  and em.adset_id is not distinct from lm.adset_id
  and em.ad_id is not distinct from lm.ad_id;

commit;
