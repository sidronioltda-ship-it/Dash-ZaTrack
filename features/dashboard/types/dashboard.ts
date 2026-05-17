export type DashboardPeriod = "today" | "7d" | "30d" | "90d";

export type DashboardTrafficSource =
  | "all"
  | "meta_ads"
  | "whatsapp"
  | "organic"
  | "checkout";

export type DashboardPlatform =
  | "all"
  | "whatsapp"
  | "meta"
  | "checkout"
  | "site";

export type DashboardFilters = {
  period: DashboardPeriod;
  adAccountId: string;
  trafficSource: DashboardTrafficSource;
  platform: DashboardPlatform;
  product: string;
};

export type DashboardFilterAction =
  | { type: "set_period"; period: DashboardPeriod }
  | { type: "set_ad_account"; adAccountId: string }
  | { type: "set_traffic_source"; trafficSource: DashboardTrafficSource }
  | { type: "set_platform"; platform: DashboardPlatform }
  | { type: "set_product"; product: string }
  | { type: "reset" };

export type DashboardKpiKey =
  | "leads_today"
  | "purchases_today"
  | "revenue"
  | "commission"
  | "conversion";

export type DashboardKpi = {
  key: DashboardKpiKey;
  label: string;
  value: string;
  helper: string;
  trend: string;
};

export type DashboardKpiSnapshot = {
  generatedAt: string;
  filters: DashboardFilters;
  kpis: DashboardKpi[];
};
