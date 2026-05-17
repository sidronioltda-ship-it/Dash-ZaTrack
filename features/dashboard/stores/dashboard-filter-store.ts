import type {
  DashboardFilterAction,
  DashboardFilters,
} from "@/features/dashboard/types/dashboard";

export const dashboardFilterStorageKey = "zatrack.dashboard.filters.v1";

export const defaultDashboardFilters: DashboardFilters = {
  period: "today",
  adAccountId: "all",
  trafficSource: "all",
  platform: "all",
  product: "all",
};

export function dashboardFilterReducer(
  state: DashboardFilters,
  action: DashboardFilterAction,
): DashboardFilters {
  switch (action.type) {
    case "set_period":
      return { ...state, period: action.period };
    case "set_ad_account":
      return { ...state, adAccountId: action.adAccountId };
    case "set_traffic_source":
      return { ...state, trafficSource: action.trafficSource };
    case "set_platform":
      return { ...state, platform: action.platform };
    case "set_product":
      return { ...state, product: action.product };
    case "reset":
      return defaultDashboardFilters;
    default:
      return state;
  }
}

export function parseDashboardFilters(value: string | null): DashboardFilters {
  if (!value) {
    return defaultDashboardFilters;
  }

  try {
    const parsed = JSON.parse(value) as Partial<DashboardFilters>;

    return {
      ...defaultDashboardFilters,
      ...parsed,
    };
  } catch {
    return defaultDashboardFilters;
  }
}
