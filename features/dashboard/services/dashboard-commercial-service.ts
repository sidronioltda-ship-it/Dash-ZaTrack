"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getMetricDateRange,
  getTrafficSourceLabel,
  normalize,
  toNumber,
} from "@/features/dashboard/services/dashboard-data-utils";
import type {
  DashboardFilters,
  PlanRankingItem,
  PlanRankingSnapshot,
  PlanRankingTrend,
} from "@/features/dashboard/types/dashboard";

type RevenueRow = {
  metric_date: string;
  plan_name: string | null;
  successful_purchase_events: number | string | null;
  gross_revenue: number | string | null;
  commission_revenue: number | string | null;
};

type LeadRow = {
  source: string | null;
  client_id: string | null;
  total_leads: number | string | null;
  leads_with_phone: number | string | null;
};

const commercialViews = [
  "analytics_daily_revenue",
  "analytics_daily_leads",
];

function getPlanName(row: RevenueRow) {
  return row.plan_name?.trim() || "Plano nao identificado";
}

function getRevenueValue(row: RevenueRow) {
  const commissionRevenue = toNumber(row.commission_revenue);

  return commissionRevenue > 0 ? commissionRevenue : toNumber(row.gross_revenue);
}

function getTrend(currentRevenue: number, previousRevenue: number) {
  if (previousRevenue <= 0 && currentRevenue <= 0) {
    return { trend: "stable" as PlanRankingTrend, trendPercent: 0 };
  }

  if (previousRevenue <= 0) {
    return { trend: "up" as PlanRankingTrend, trendPercent: 100 };
  }

  const trendPercent = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

  if (Math.abs(trendPercent) < 3) {
    return { trend: "stable" as PlanRankingTrend, trendPercent };
  }

  return {
    trend: trendPercent > 0 ? "up" : "down",
    trendPercent,
  } satisfies { trend: PlanRankingTrend; trendPercent: number };
}

export async function getPlanRanking(
  filters: DashboardFilters,
): Promise<PlanRankingSnapshot> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const supabase = createClient();
  const { startDate, endDate } = getMetricDateRange(filters);
  const trafficSourceLabel = getTrafficSourceLabel(filters);

  const [revenueResult, leadsResult] = await Promise.all([
    supabase
      .from("analytics_daily_revenue")
      .select(
        "metric_date,plan_name,successful_purchase_events,gross_revenue,commission_revenue",
      )
      .gte("metric_date", startDate)
      .lte("metric_date", endDate)
      .limit(5000),
    supabase
      .from("analytics_daily_leads")
      .select("source,client_id,total_leads,leads_with_phone")
      .gte("metric_date", startDate)
      .lte("metric_date", endDate)
      .limit(5000),
  ]);

  if (revenueResult.error) {
    throw new Error(revenueResult.error.message);
  }

  if (leadsResult.error) {
    throw new Error(leadsResult.error.message);
  }

  const leadRows = ((leadsResult.data ?? []) as LeadRow[]).filter((row) => {
    const matchesSource = trafficSourceLabel
      ? normalize(row.source) === trafficSourceLabel
      : true;
    const matchesAccount =
      filters.adAccountId === "all" || row.client_id === filters.adAccountId;

    return matchesSource && matchesAccount;
  });

  const qualifiedLeads = leadRows.reduce(
    (total, row) => total + toNumber(row.leads_with_phone),
    0,
  );
  const midpoint = new Date(`${startDate}T00:00:00.000Z`).getTime() +
    (new Date(`${endDate}T23:59:59.999Z`).getTime() -
      new Date(`${startDate}T00:00:00.000Z`).getTime()) /
      2;
  const planMap = new Map<
    string,
    {
      approvedSales: number;
      revenue: number;
      currentRevenue: number;
      previousRevenue: number;
    }
  >();

  for (const row of (revenueResult.data ?? []) as RevenueRow[]) {
    const planName = getPlanName(row);

    if (
      filters.product !== "all" &&
      !normalize(planName).includes(filters.product.replaceAll("_", " "))
    ) {
      continue;
    }

    const currentPlan = planMap.get(planName) ?? {
      approvedSales: 0,
      revenue: 0,
      currentRevenue: 0,
      previousRevenue: 0,
    };
    const revenue = getRevenueValue(row);
    const rowDate = new Date(`${row.metric_date}T12:00:00.000Z`).getTime();

    currentPlan.approvedSales += toNumber(row.successful_purchase_events);
    currentPlan.revenue += revenue;

    if (rowDate >= midpoint) {
      currentPlan.currentRevenue += revenue;
    } else {
      currentPlan.previousRevenue += revenue;
    }

    planMap.set(planName, currentPlan);
  }

  const totalRevenue = Array.from(planMap.values()).reduce(
    (total, item) => total + item.revenue,
    0,
  );
  const totalApprovedSales = Array.from(planMap.values()).reduce(
    (total, item) => total + item.approvedSales,
    0,
  );

  const items: PlanRankingItem[] = Array.from(planMap.entries())
    .map(([planName, item]) => {
      const { trend, trendPercent } = getTrend(
        item.currentRevenue,
        item.previousRevenue,
      );

      return {
        planName,
        approvedSales: item.approvedSales,
        revenue: item.revenue,
        sharePercent: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0,
        averageTicket:
          item.approvedSales > 0 ? item.revenue / item.approvedSales : 0,
        operationalConversion:
          qualifiedLeads > 0 ? (item.approvedSales / qualifiedLeads) * 100 : 0,
        trend,
        trendPercent,
      };
    })
    .sort((firstItem, secondItem) => secondItem.revenue - firstItem.revenue);

  return {
    generatedAt: new Date().toISOString(),
    filters,
    source: "supabase",
    views: commercialViews,
    unsupportedFilters: [
      filters.platform !== "all" ? "platform" : null,
      filters.adAccountId !== "all" ? "account-level revenue attribution" : null,
      filters.trafficSource !== "all" ? "source-level revenue attribution" : null,
    ].filter(Boolean) as string[],
    items,
    totalRevenue,
    totalApprovedSales,
  };
}
