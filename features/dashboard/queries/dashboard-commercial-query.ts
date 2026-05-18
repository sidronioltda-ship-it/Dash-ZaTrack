import { getPlanRanking } from "@/features/dashboard/services/dashboard-commercial-service";
import type { DashboardFilters } from "@/features/dashboard/types/dashboard";

export const dashboardCommercialQuery = {
  staleTimeMs: 45_000,
  getKey(filters: DashboardFilters) {
    return [
      "dashboard",
      "commercial",
      "plan-ranking",
      filters.period,
      filters.adAccountId,
      filters.trafficSource,
      filters.platform,
      filters.product,
    ] as const;
  },
  queryFn: getPlanRanking,
};
