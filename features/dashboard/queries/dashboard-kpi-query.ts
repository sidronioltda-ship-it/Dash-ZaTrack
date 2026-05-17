import { getDashboardKpis } from "@/features/dashboard/services/dashboard-kpi-service";
import type { DashboardFilters } from "@/features/dashboard/types/dashboard";

export const dashboardKpiQuery = {
  staleTimeMs: 30_000,
  getKey(filters: DashboardFilters) {
    return [
      "dashboard",
      "kpis",
      filters.period,
      filters.adAccountId,
      filters.trafficSource,
      filters.platform,
      filters.product,
    ] as const;
  },
  queryFn: getDashboardKpis,
};
