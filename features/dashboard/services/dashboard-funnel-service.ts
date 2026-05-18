"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  extractPayloadNumber,
  getLineageKey,
  getMetricDateRange,
  getTrafficSourceLabel,
  matchesLineageFilter,
  normalize,
  toNumber,
} from "@/features/dashboard/services/dashboard-data-utils";
import type {
  DashboardFilters,
  WhatsAppFunnelSnapshot,
  WhatsAppFunnelStage,
  WhatsAppFunnelStageKey,
} from "@/features/dashboard/types/dashboard";

type DailyLeadRow = {
  client_id: string | null;
  source: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  leads_with_phone: number | string | null;
  leads_with_ctwa: number | string | null;
};

type FunnelRow = {
  client_id: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  checkout_events: number | string | null;
  successful_purchase_events: number | string | null;
};

type CtwaClickRow = {
  client_id: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  whatsapp_clicks: number | string | null;
  payload_raw: Record<string, unknown> | null;
};

type RawStage = {
  key: WhatsAppFunnelStageKey;
  label: string;
  value: number;
  helper: string;
};

const minThickness = 14;
const maxThickness = 84;

function getVisualReference(stages: RawStage[]) {
  const impressions = stages[0]?.value ?? 0;

  if (impressions > 0) {
    return {
      referenceValue: impressions,
      referenceLabel: "Impressões",
      isImpressionReferenceAvailable: true,
    };
  }

  return {
    referenceValue: Math.max(...stages.map((stage) => stage.value), 1),
    referenceLabel: "Maior volume observado",
    isImpressionReferenceAvailable: false,
  };
}

function buildStages(rawStages: RawStage[]): WhatsAppFunnelStage[] {
  const { referenceValue } = getVisualReference(rawStages);
  let previousDisplayValue = referenceValue;

  return rawStages.map((stage, index) => {
    const displayValue =
      index === 0
        ? referenceValue
        : Math.min(stage.value, previousDisplayValue);
    const previousRawValue = index > 0 ? rawStages[index - 1].value : null;
    const conversionFromPrevious =
      previousRawValue && previousRawValue > 0
        ? (stage.value / previousRawValue) * 100
        : null;
    const dropFromPrevious =
      previousRawValue && previousRawValue > 0
        ? Math.max(0, ((previousRawValue - stage.value) / previousRawValue) * 100)
        : null;
    const shareOfReference =
      referenceValue > 0 ? (displayValue / referenceValue) * 100 : 0;
    const thickness =
      minThickness +
      ((Math.max(shareOfReference, 0) / 100) * (maxThickness - minThickness));

    previousDisplayValue = displayValue;

    return {
      ...stage,
      displayValue,
      conversionFromPrevious,
      dropFromPrevious,
      shareOfReference,
      thickness,
    };
  });
}

export async function getWhatsAppFunnel(
  filters: DashboardFilters,
): Promise<WhatsAppFunnelSnapshot> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const supabase = createClient();
  const { startDate, endDate, startIso } = getMetricDateRange(filters);
  const trafficSourceLabel = getTrafficSourceLabel(filters);

  const [leadsResult, funnelResult, ctwaResult] = await Promise.all([
    supabase
      .from("analytics_daily_leads")
      .select(
        "client_id,source,campaign_id,adset_id,ad_id,leads_with_phone,leads_with_ctwa",
      )
      .gte("metric_date", startDate)
      .lte("metric_date", endDate)
      .limit(5000),
    supabase
      .from("analytics_purchase_funnel")
      .select(
        "client_id,campaign_id,adset_id,ad_id,checkout_events,successful_purchase_events",
      )
      .gte("metric_date", startDate)
      .lte("metric_date", endDate)
      .limit(5000),
    supabase
      .from("ctwa_clicks")
      .select(
        "client_id,campaign_id,adset_id,ad_id,whatsapp_clicks,payload_raw",
      )
      .gte("click_timestamp", startIso)
      .limit(5000),
  ]);

  for (const result of [leadsResult, funnelResult, ctwaResult]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const leadRows = ((leadsResult.data ?? []) as DailyLeadRow[]).filter((row) => {
    const matchesSource = trafficSourceLabel
      ? normalize(row.source) === trafficSourceLabel
      : true;
    const matchesAccount =
      filters.adAccountId === "all" || row.client_id === filters.adAccountId;

    return matchesSource && matchesAccount;
  });
  const allowedLineageKeys =
    trafficSourceLabel || filters.adAccountId !== "all"
      ? new Set(leadRows.map(getLineageKey))
      : null;
  const funnelRows = ((funnelResult.data ?? []) as FunnelRow[]).filter((row) =>
    matchesLineageFilter(row, allowedLineageKeys),
  );
  const ctwaRows = ((ctwaResult.data ?? []) as CtwaClickRow[]).filter((row) => {
    const matchesAccount =
      filters.adAccountId === "all" || row.client_id === filters.adAccountId;

    return matchesAccount && matchesLineageFilter(row, allowedLineageKeys);
  });

  const impressions = ctwaRows.reduce(
    (total, row) =>
      total +
      extractPayloadNumber(row.payload_raw, [
        "impressions",
        "impression",
        "total_impressions",
        "meta_impressions",
      ]),
    0,
  );
  const linkClicks = ctwaRows.reduce(
    (total, row) => total + toNumber(row.whatsapp_clicks),
    0,
  );
  const startedConversations = leadRows.reduce(
    (total, row) => total + toNumber(row.leads_with_ctwa),
    0,
  );
  const qualifiedLeads = leadRows.reduce(
    (total, row) => total + toNumber(row.leads_with_phone),
    0,
  );
  const checkoutInitiated = funnelRows.reduce(
    (total, row) => total + toNumber(row.checkout_events),
    0,
  );
  const sales = funnelRows.reduce(
    (total, row) => total + toNumber(row.successful_purchase_events),
    0,
  );
  const rawStages: RawStage[] = [
    {
      key: "impressions",
      label: "Impressões",
      value: impressions,
      helper: "ctwa_clicks.payload_raw.impressions",
    },
    {
      key: "link_clicks",
      label: "Cliques no Link",
      value: linkClicks,
      helper: "ctwa_clicks.whatsapp_clicks",
    },
    {
      key: "started_conversations",
      label: "Conversas Iniciadas",
      value: startedConversations,
      helper: "analytics_daily_leads.leads_with_ctwa",
    },
    {
      key: "qualified_leads",
      label: "Leads Qualificados",
      value: qualifiedLeads,
      helper: "analytics_daily_leads.leads_with_phone",
    },
    {
      key: "initiate_checkout",
      label: "Initiate Checkout",
      value: checkoutInitiated,
      helper: "analytics_purchase_funnel.checkout_events",
    },
    {
      key: "sales",
      label: "Vendas",
      value: sales,
      helper: "analytics_purchase_funnel.successful_purchase_events",
    },
  ];
  const reference = getVisualReference(rawStages);

  return {
    generatedAt: new Date().toISOString(),
    filters,
    source: "supabase",
    stages: buildStages(rawStages),
    unsupportedFilters: [
      filters.platform !== "all" ? "platform" : null,
      !reference.isImpressionReferenceAvailable
        ? "impressions in ctwa_clicks.payload_raw"
        : null,
    ].filter(Boolean) as string[],
    ...reference,
  };
}
