import { getSalesByHour } from "@/features/dashboard/services/dashboard-temporal-service";
import type { DashboardFilters } from "@/features/dashboard/types/dashboard";

export const dashboardTemporalQuery = {
  staleTimeMs: 45_000,
  getKey(filters: DashboardFilters) {
    return [
      "dashboard",
      "temporal",
      "sales-by-hour",
      filters.period,
      filters.adAccountId,
      filters.trafficSource,
      filters.platform,
      filters.product,
    ] as const;
  },
  queryFn: getSalesByHour,
};
