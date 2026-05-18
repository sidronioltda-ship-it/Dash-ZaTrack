"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getMetricDateRange,
  getTrafficSourceLabel,
  isSuccessfulPurchase,
  normalize,
  toNumber,
} from "@/features/dashboard/services/dashboard-data-utils";
import type {
  DashboardFilters,
  SalesByHourBucket,
  SalesByHourSnapshot,
} from "@/features/dashboard/types/dashboard";

type EventRow = {
  created_at: string | null;
  event_name: string | null;
  lead_id: string | null;
  value: number | string | null;
  status: string | null;
  success: string | null;
  status_code: number | string | null;
  plan_name: string | null;
  commission_value: number | string | null;
};

type LeadIdentityRow = {
  id: string;
  client_id: string | null;
  source: string | null;
};

function getEventRevenue(row: EventRow) {
  const commissionValue = toNumber(row.commission_value);

  return commissionValue > 0 ? commissionValue : toNumber(row.value);
}

function createEmptyBuckets(): SalesByHourBucket[] {
  return Array.from({ length: 24 }).map((_, hourNumber) => ({
    hour: `${String(hourNumber).padStart(2, "0")}h`,
    hourNumber,
    sales: 0,
    percent: 0,
    revenue: 0,
  }));
}

export async function getSalesByHour(
  filters: DashboardFilters,
): Promise<SalesByHourSnapshot> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const supabase = createClient();
  const { startIso } = getMetricDateRange(filters);
  const trafficSourceLabel = getTrafficSourceLabel(filters);

  const [eventsResult, leadsResult] = await Promise.all([
    supabase
      .from("eventos")
      .select(
        "created_at,event_name,lead_id,value,status,success,status_code,plan_name,commission_value",
      )
      .gte("created_at", startIso)
      .limit(5000),
    supabase
      .from("leads")
      .select("id,client_id,source")
      .gte("created_at", startIso)
      .limit(5000),
  ]);

  if (eventsResult.error) {
    throw new Error(eventsResult.error.message);
  }

  if (leadsResult.error) {
    throw new Error(leadsResult.error.message);
  }

  const leadRows = (leadsResult.data ?? []) as LeadIdentityRow[];
  const allowedLeadIds =
    trafficSourceLabel || filters.adAccountId !== "all"
      ? new Set(
          leadRows
            .filter((lead) => {
              const matchesSource = trafficSourceLabel
                ? normalize(lead.source) === trafficSourceLabel
                : true;
              const matchesAccount =
                filters.adAccountId === "all" ||
                lead.client_id === filters.adAccountId;

              return matchesSource && matchesAccount;
            })
            .map((lead) => lead.id),
        )
      : null;
  const buckets = createEmptyBuckets();

  for (const event of (eventsResult.data ?? []) as EventRow[]) {
    if (!event.created_at || !isSuccessfulPurchase(event)) {
      continue;
    }

    if (allowedLeadIds && (!event.lead_id || !allowedLeadIds.has(event.lead_id))) {
      continue;
    }

    if (
      filters.product !== "all" &&
      !normalize(event.plan_name).includes(filters.product.replaceAll("_", " "))
    ) {
      continue;
    }

    const hour = new Date(event.created_at).getHours();

    buckets[hour].sales += 1;
    buckets[hour].revenue += getEventRevenue(event);
  }

  const totalSales = buckets.reduce((total, bucket) => total + bucket.sales, 0);
  const totalRevenue = buckets.reduce(
    (total, bucket) => total + bucket.revenue,
    0,
  );
  const bucketsWithPercent = buckets.map((bucket) => ({
    ...bucket,
    percent: totalSales > 0 ? (bucket.sales / totalSales) * 100 : 0,
  }));

  return {
    generatedAt: new Date().toISOString(),
    filters,
    source: "supabase",
    buckets: bucketsWithPercent,
    totalSales,
    totalRevenue,
    unsupportedFilters: [
      filters.platform !== "all" ? "platform" : null,
      totalSales === 0 ? "eventos read policy or hourly event volume" : null,
    ].filter(Boolean) as string[],
  };
}
