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

export type PlanRankingTrend = "up" | "down" | "stable";

export type PlanRankingItem = {
  planName: string;
  approvedSales: number;
  revenue: number;
  sharePercent: number;
  averageTicket: number;
  operationalConversion: number;
  trend: PlanRankingTrend;
  trendPercent: number;
};

export type PlanRankingSnapshot = {
  generatedAt: string;
  filters: DashboardFilters;
  source: "supabase";
  items: PlanRankingItem[];
  totalRevenue: number;
  totalApprovedSales: number;
  views: string[];
  unsupportedFilters: string[];
};

export type SalesByHourBucket = {
  hour: string;
  hourNumber: number;
  sales: number;
  percent: number;
  revenue: number;
};

export type SalesByHourSnapshot = {
  generatedAt: string;
  filters: DashboardFilters;
  source: "supabase";
  buckets: SalesByHourBucket[];
  totalSales: number;
  totalRevenue: number;
  unsupportedFilters: string[];
};
