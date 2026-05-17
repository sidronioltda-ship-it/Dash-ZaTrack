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
  | "net_revenue"
  | "traffic_spend"
  | "meta_ads_tax"
  | "roi"
  | "profit"
  | "link_clicks"
  | "cpc"
  | "started_conversations"
  | "cpv"
  | "qualified_leads"
  | "cpl"
  | "checkout_initiated"
  | "cpi"
  | "approved_purchases"
  | "cpa"
  | "average_ticket"
  | "clicks_per_conversation"
  | "conversations_per_lead"
  | "conversations_per_checkout"
  | "conversations_per_sale"
  | "conversation_to_sale_rate";

export type DashboardKpi = {
  key: DashboardKpiKey;
  label: string;
  value: string;
  helper: string;
  detail?: string;
  tone?: "default" | "success" | "warning" | "muted";
  emphasis?: boolean;
};

export type DashboardKpiSnapshot = {
  generatedAt: string;
  filters: DashboardFilters;
  source: "supabase";
  views: string[];
  financialKpis: DashboardKpi[];
  operationalKpis: DashboardKpi[];
  efficiencyKpis: DashboardKpi[];
  unsupportedFilters: string[];
};
