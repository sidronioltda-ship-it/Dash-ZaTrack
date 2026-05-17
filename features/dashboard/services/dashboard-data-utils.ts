import type { DashboardFilters } from "@/features/dashboard/types/dashboard";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDecimal(value: number, suffix = "") {
  return `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value > 0 && value < 10 ? 1 : 0,
  }).format(value)}${suffix}`;
}

export function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (!value) {
    return 0;
  }

  const normalizedValue = String(value).replace(",", ".");
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function getMetricDateRange(filters: DashboardFilters) {
  const endDate = new Date();
  const startDate = new Date(endDate);
  const daysByPeriod = {
    today: 0,
    "7d": 6,
    "30d": 29,
    "90d": 89,
  };

  startDate.setUTCDate(startDate.getUTCDate() - daysByPeriod[filters.period]);

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    startIso: startDate.toISOString(),
  };
}

export function getTrafficSourceLabel(filters: DashboardFilters) {
  const sourceByFilter = {
    all: null,
    meta_ads: "meta ads",
    whatsapp: "whatsapp",
    organic: "organic",
    checkout: "checkout",
  } satisfies Record<DashboardFilters["trafficSource"], string | null>;

  return sourceByFilter[filters.trafficSource];
}

export function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function isSuccessfulPurchase(row: {
  event_name?: string | null;
  status?: string | null;
  success?: string | null;
  status_code?: number | string | null;
}) {
  const eventName = normalize(row.event_name);
  const status = normalize(row.status ?? row.success);
  const statusCode = toNumber(row.status_code);

  return (
    eventName === "purchase" &&
    (status === "" ||
      ["success", "succeeded", "true", "200", "ok"].includes(status)) &&
    (statusCode === 0 || statusCode < 400)
  );
}
