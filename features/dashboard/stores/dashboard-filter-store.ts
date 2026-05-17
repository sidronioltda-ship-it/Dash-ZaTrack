import type {
  DashboardFilterAction,
  DashboardFilters,
  DashboardPeriod,
  DashboardPlatform,
  DashboardTrafficSource,
} from "@/features/dashboard/types/dashboard";

export const dashboardFilterStorageKey = "zatrack.dashboard.filters.v1";

export const defaultDashboardFilters: DashboardFilters = {
  period: "today",
  adAccountId: "all",
  trafficSource: "all",
  platform: "all",
  product: "all",
};

const allowedPeriods = new Set<DashboardPeriod>(["today", "7d", "30d", "90d"]);
const allowedTrafficSources = new Set<DashboardTrafficSource>([
  "all",
  "meta_ads",
  "whatsapp",
  "organic",
  "checkout",
]);
const allowedPlatforms = new Set<DashboardPlatform>([
  "all",
  "whatsapp",
  "meta",
  "checkout",
  "site",
]);

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
      period:
        parsed.period && allowedPeriods.has(parsed.period)
          ? parsed.period
          : defaultDashboardFilters.period,
      adAccountId:
        typeof parsed.adAccountId === "string"
          ? parsed.adAccountId
          : defaultDashboardFilters.adAccountId,
      trafficSource:
        parsed.trafficSource && allowedTrafficSources.has(parsed.trafficSource)
          ? parsed.trafficSource
          : defaultDashboardFilters.trafficSource,
      platform:
        parsed.platform && allowedPlatforms.has(parsed.platform)
          ? parsed.platform
          : defaultDashboardFilters.platform,
      product:
        typeof parsed.product === "string"
          ? parsed.product
          : defaultDashboardFilters.product,
    };
  } catch {
    return defaultDashboardFilters;
  }
}
