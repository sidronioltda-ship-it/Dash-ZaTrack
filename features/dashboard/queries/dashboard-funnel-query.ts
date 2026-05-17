import { getWhatsAppFunnel } from "@/features/dashboard/services/dashboard-funnel-service";
import type { DashboardFilters } from "@/features/dashboard/types/dashboard";

export const dashboardFunnelQuery = {
  staleTimeMs: 45_000,
  getKey(filters: DashboardFilters) {
    return [
      "dashboard",
      "funnel",
      "whatsapp-marketing",
      filters.period,
      filters.adAccountId,
      filters.trafficSource,
      filters.platform,
      filters.product,
    ] as const;
  },
  queryFn: getWhatsAppFunnel,
};
