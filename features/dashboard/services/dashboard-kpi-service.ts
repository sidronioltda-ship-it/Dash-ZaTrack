"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  formatCurrency,
  formatDecimal,
  formatNumber,
  getMetricDateRange,
  getTrafficSourceLabel,
  normalize,
  toNumber,
} from "@/features/dashboard/services/dashboard-data-utils";
import type {
  DashboardFilters,
  DashboardKpi,
  DashboardKpiSnapshot,
} from "@/features/dashboard/types/dashboard";

type RevenueRow = {
  metric_date: string;
  pixel_id: string | null;
  currency: string | null;
  plan_name: string | null;
  purchase_events: number | string | null;
  successful_purchase_events: number | string | null;
  gross_revenue: number | string | null;
  commission_revenue: number | string | null;
  failed_events: number | string | null;
};

type DailyLeadRow = {
  metric_date: string;
  client_id: string | null;
  source: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  utm_campaign: string | null;
  total_leads: number | string | null;
  leads_with_phone: number | string | null;
  leads_with_ctwa: number | string | null;
  unique_phones: number | string | null;
};

type FunnelRow = {
  metric_date: string;
  client_id: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  leads_count: number | string | null;
  ctwa_leads_count: number | string | null;
  checkout_events: number | string | null;
  purchase_events: number | string | null;
  successful_purchase_events: number | string | null;
  gross_revenue: number | string | null;
  commission_revenue: number | string | null;
};

type CtwaClickRow = {
  client_id: string | null;
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
  click_timestamp: string | null;
  whatsapp_clicks: number | string | null;
  dedup_key: string | null;
  payload_raw: Record<string, unknown> | null;
};

const analyticsViews = [
  "analytics_daily_revenue",
  "analytics_daily_leads",
  "analytics_campaign_performance",
  "analytics_purchase_funnel",
];

function getLineageKey(row: {
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
}) {
  return [row.campaign_id ?? "", row.adset_id ?? "", row.ad_id ?? ""].join("|");
}

function matchesLineageFilter<T extends {
  campaign_id: string | null;
  adset_id: string | null;
  ad_id: string | null;
}>(row: T, allowedLineageKeys: Set<string> | null) {
  if (!allowedLineageKeys) {
    return true;
  }

  return allowedLineageKeys.has(getLineageKey(row));
}

function matchesProductFilter(row: RevenueRow, filters: DashboardFilters) {
  if (filters.product === "all") {
    return true;
  }

  return normalize(row.plan_name).includes(filters.product.replaceAll("_", " "));
}

function extractPayloadAmount(
  payload: Record<string, unknown> | null,
  keys: string[],
) {
  if (!payload) {
    return 0;
  }

  for (const key of keys) {
    const value = payload[key];

    if (typeof value === "number" || typeof value === "string") {
      return toNumber(value);
    }
  }

  return 0;
}

function createCostKpi(
  label: string,
  numerator: number,
  denominator: number,
  helper: string,
  key: DashboardKpi["key"],
): DashboardKpi {
  return {
    key,
    label,
    value: denominator > 0 ? formatCurrency(numerator / denominator) : "—",
    helper,
    tone: denominator > 0 ? "default" : "muted",
  };
}

function formatEfficiencyRatio({
  basePlural,
  baseSingular,
  denominator,
  emptyLabel,
  numerator,
  outcomePlural,
  outcomeSingular,
}: {
  numerator: number;
  denominator: number;
  outcomeSingular: string;
  outcomePlural: string;
  baseSingular: string;
  basePlural: string;
  emptyLabel: string;
}) {
  if (numerator <= 0 || denominator <= 0) {
    return emptyLabel;
  }

  const basePerOutcome = numerator / denominator;

  if (basePerOutcome >= 1) {
    return `1 ${outcomeSingular} a cada ${formatDecimal(basePerOutcome)} ${basePlural}`;
  }

  return `${formatDecimal(denominator / numerator)} ${outcomePlural} por ${baseSingular}`;
}

export async function getDashboardKpis(
  filters: DashboardFilters,
): Promise<DashboardKpiSnapshot> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const supabase = createClient();
  const { startDate, endDate, startIso } = getMetricDateRange(filters);
  const trafficSourceLabel = getTrafficSourceLabel(filters);

  const [revenueResult, leadsResult, campaignResult, funnelResult, ctwaResult] =
    await Promise.all([
      supabase
        .from("analytics_daily_revenue")
        .select(
          "metric_date,pixel_id,currency,plan_name,purchase_events,successful_purchase_events,gross_revenue,commission_revenue,failed_events",
        )
        .gte("metric_date", startDate)
        .lte("metric_date", endDate)
        .limit(5000),
      supabase
        .from("analytics_daily_leads")
        .select(
          "metric_date,client_id,source,campaign_id,adset_id,ad_id,utm_campaign,total_leads,leads_with_phone,leads_with_ctwa,unique_phones",
        )
        .gte("metric_date", startDate)
        .lte("metric_date", endDate)
        .limit(5000),
      supabase
        .from("analytics_campaign_performance")
        .select(
          "metric_date,client_id,campaign_id,adset_id,ad_id,utm_campaign,total_leads,ctwa_attributed_leads,total_events,purchase_events,successful_purchase_events,gross_revenue,commission_revenue,failed_events",
        )
        .gte("metric_date", startDate)
        .lte("metric_date", endDate)
        .limit(5000),
      supabase
        .from("analytics_purchase_funnel")
        .select(
          "metric_date,client_id,campaign_id,adset_id,ad_id,leads_count,ctwa_leads_count,checkout_events,purchase_events,successful_purchase_events,gross_revenue,commission_revenue",
        )
        .gte("metric_date", startDate)
        .lte("metric_date", endDate)
        .limit(5000),
      supabase
        .from("ctwa_clicks")
        .select(
          "client_id,campaign_id,adset_id,ad_id,click_timestamp,whatsapp_clicks,dedup_key,payload_raw",
        )
        .gte("click_timestamp", startIso)
        .limit(5000),
    ]);

  for (const result of [
    revenueResult,
    leadsResult,
    campaignResult,
    funnelResult,
    ctwaResult,
  ]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const rawLeads = (leadsResult.data ?? []) as DailyLeadRow[];
  const leadRows = rawLeads.filter((row) => {
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

  const revenueRows = ((revenueResult.data ?? []) as RevenueRow[]).filter((row) =>
    matchesProductFilter(row, filters),
  );
  const funnelRows = ((funnelResult.data ?? []) as FunnelRow[]).filter((row) =>
    matchesLineageFilter(row, allowedLineageKeys),
  );
  const ctwaRows = ((ctwaResult.data ?? []) as CtwaClickRow[]).filter((row) => {
    const matchesAccount =
      filters.adAccountId === "all" || row.client_id === filters.adAccountId;
    const matchesLineage = matchesLineageFilter(row, allowedLineageKeys);

    return matchesAccount && matchesLineage;
  });

  const netRevenue = revenueRows.reduce(
    (total, row) =>
      total +
      (toNumber(row.commission_revenue) > 0
        ? toNumber(row.commission_revenue)
        : toNumber(row.gross_revenue)),
    0,
  );
  const trafficSpend = ctwaRows.reduce(
    (total, row) =>
      total +
      extractPayloadAmount(row.payload_raw, [
        "amount_spent",
        "spend",
        "traffic_spend",
        "valor_investido",
      ]),
    0,
  );
  const metaAdsTax = ctwaRows.reduce(
    (total, row) =>
      total +
      extractPayloadAmount(row.payload_raw, [
        "meta_ads_tax",
        "tax",
        "tax_amount",
        "imposto_meta",
      ]),
    0,
  );
  const profit = netRevenue - trafficSpend - metaAdsTax;
  const roi = trafficSpend > 0 ? profit / trafficSpend : null;

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
  const approvedPurchases = funnelRows.reduce(
    (total, row) => total + toNumber(row.successful_purchase_events),
    0,
  );
  const averageTicket =
    approvedPurchases > 0 ? netRevenue / approvedPurchases : 0;

  const unsupportedFilters = [
    filters.platform !== "all" ? "platform" : null,
  ].filter(Boolean) as string[];

  return {
    generatedAt: new Date().toISOString(),
    filters,
    source: "supabase",
    views: analyticsViews,
    unsupportedFilters,
    financialKpis: [
      {
        key: "net_revenue",
        label: "Faturamento Liquido",
        value: formatCurrency(netRevenue),
        helper: "analytics_daily_revenue",
        detail: "commission_value quando disponivel; fallback gross_revenue",
      },
      {
        key: "traffic_spend",
        label: "Investido em Trafego",
        value: formatCurrency(trafficSpend),
        helper: "ctwa_clicks.payload_raw",
        detail: "Soma real dos campos de investimento capturados",
      },
      {
        key: "meta_ads_tax",
        label: "Imposto Meta Ads",
        value: formatCurrency(metaAdsTax),
        helper: "ctwa_clicks.payload_raw",
        detail: "Usa campos fiscais quando presentes no payload",
      },
      {
        key: "roi",
        label: "ROI",
        value: roi === null ? "—" : formatDecimal(roi, "x"),
        helper: "Lucro / trafego",
        detail: trafficSpend > 0 ? "Calculado com dados reais" : "Sem spend no periodo",
      },
      {
        key: "profit",
        label: "Lucro",
        value: formatCurrency(profit),
        helper: "faturamento - trafego - imposto Meta",
        detail: "Indicador financeiro principal",
        tone: "success",
        emphasis: true,
      },
    ],
    operationalKpis: [
      {
        key: "link_clicks",
        label: "Cliques no Link",
        value: formatNumber(linkClicks),
        helper: "ctwa_clicks.whatsapp_clicks",
      },
      createCostKpi("CPC", trafficSpend, linkClicks, "trafego / cliques", "cpc"),
      {
        key: "started_conversations",
        label: "Conversas Iniciadas",
        value: formatNumber(startedConversations),
        helper: "analytics_daily_leads.leads_with_ctwa",
      },
      createCostKpi(
        "CPV",
        trafficSpend,
        startedConversations,
        "trafego / conversas",
        "cpv",
      ),
      {
        key: "qualified_leads",
        label: "Leads Qualificados",
        value: formatNumber(qualifiedLeads),
        helper: "analytics_daily_leads.leads_with_phone",
      },
      createCostKpi(
        "CPL",
        trafficSpend,
        qualifiedLeads,
        "trafego / leads",
        "cpl",
      ),
      {
        key: "checkout_initiated",
        label: "IC's",
        value: formatNumber(checkoutInitiated),
        helper: "analytics_purchase_funnel.checkout_events",
      },
      createCostKpi(
        "CPI",
        trafficSpend,
        checkoutInitiated,
        "trafego / ICs",
        "cpi",
      ),
      {
        key: "approved_purchases",
        label: "Compras Aprovadas",
        value: formatNumber(approvedPurchases),
        helper: "analytics_purchase_funnel.successful_purchase_events",
      },
      createCostKpi(
        "CPA",
        trafficSpend,
        approvedPurchases,
        "trafego / compras",
        "cpa",
      ),
      {
        key: "average_ticket",
        label: "Ticket Medio",
        value: approvedPurchases > 0 ? formatCurrency(averageTicket) : "—",
        helper: "faturamento / compras",
      },
    ],
    efficiencyKpis: [
      {
        key: "clicks_per_conversation",
        label: "Clique → Conversa",
        value: formatEfficiencyRatio({
          numerator: linkClicks,
          denominator: startedConversations,
          outcomeSingular: "Conversa",
          outcomePlural: "Conversas",
          baseSingular: "Clique",
          basePlural: "Cliques",
          emptyLabel: "Sem cliques CTWA",
        }),
        helper: "Velocidade de aquisicao CTWA",
      },
      {
        key: "conversations_per_lead",
        label: "Conversa → Lead",
        value: formatEfficiencyRatio({
          numerator: startedConversations,
          denominator: qualifiedLeads,
          outcomeSingular: "Lead",
          outcomePlural: "Leads",
          baseSingular: "Conversa",
          basePlural: "Conversas",
          emptyLabel: "Sem leads",
        }),
        helper: "Qualificacao por telefone",
      },
      {
        key: "conversations_per_checkout",
        label: "Conversa → IC",
        value: formatEfficiencyRatio({
          numerator: startedConversations,
          denominator: checkoutInitiated,
          outcomeSingular: "IC",
          outcomePlural: "ICs",
          baseSingular: "Conversa",
          basePlural: "Conversas",
          emptyLabel: "Sem ICs",
        }),
        helper: "Intencao de compra",
      },
      {
        key: "conversations_per_sale",
        label: "Conversa → Venda",
        value: formatEfficiencyRatio({
          numerator: startedConversations,
          denominator: approvedPurchases,
          outcomeSingular: "Venda",
          outcomePlural: "Vendas",
          baseSingular: "Conversa",
          basePlural: "Conversas",
          emptyLabel: "Sem vendas",
        }),
        helper: "Eficiencia comercial",
      },
      {
        key: "conversation_to_sale_rate",
        label: "Conversao Conversa → Venda",
        value:
          startedConversations > 0
            ? formatDecimal((approvedPurchases / startedConversations) * 100, "%")
            : "0%",
        helper: "Compras aprovadas / conversas",
      },
    ],
  };
}
