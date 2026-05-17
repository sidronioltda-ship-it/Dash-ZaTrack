import type {
  DashboardFilters,
  DashboardKpi,
  DashboardKpiSnapshot,
} from "@/features/dashboard/types/dashboard";

const baseKpis: DashboardKpi[] = [
  {
    key: "leads_today",
    label: "Leads Hoje",
    value: "184",
    helper: "Canonical leads com telefone validado",
    trend: "+12.8%",
  },
  {
    key: "purchases_today",
    label: "Purchases Hoje",
    value: "37",
    helper: "Eventos purchase server-side",
    trend: "+6.4%",
  },
  {
    key: "revenue",
    label: "Revenue",
    value: "R$ 48,7k",
    helper: "Receita atribuida no event store",
    trend: "+18.1%",
  },
  {
    key: "commission",
    label: "Comissao",
    value: "R$ 7,9k",
    helper: "Base preparada para commission tracking",
    trend: "+9.7%",
  },
  {
    key: "conversion",
    label: "Conversao",
    value: "20.1%",
    helper: "Purchase / lead no periodo",
    trend: "+3.2%",
  },
];

function getFilterMultiplier(filters: DashboardFilters) {
  const periodMultiplier = {
    today: 1,
    "7d": 4.8,
    "30d": 14.2,
    "90d": 33.7,
  }[filters.period];

  const trafficMultiplier = filters.trafficSource === "all" ? 1 : 0.72;
  const platformMultiplier = filters.platform === "all" ? 1 : 0.86;
  const accountMultiplier = filters.adAccountId === "all" ? 1 : 0.68;
  const productMultiplier = filters.product === "all" ? 1 : 0.74;

  return (
    periodMultiplier *
    trafficMultiplier *
    platformMultiplier *
    accountMultiplier *
    productMultiplier
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function getDashboardKpis(
  filters: DashboardFilters,
): Promise<DashboardKpiSnapshot> {
  const multiplier = getFilterMultiplier(filters);

  const leads = Math.round(184 * multiplier);
  const purchases = Math.round(37 * multiplier);
  const revenue = 48700 * multiplier;
  const commission = 7900 * multiplier;
  const conversion = leads > 0 ? (purchases / leads) * 100 : 0;

  return {
    generatedAt: new Date().toISOString(),
    filters,
    kpis: baseKpis.map((kpi) => {
      if (kpi.key === "leads_today") {
        return { ...kpi, value: String(leads) };
      }

      if (kpi.key === "purchases_today") {
        return { ...kpi, value: String(purchases) };
      }

      if (kpi.key === "revenue") {
        return { ...kpi, value: formatCurrency(revenue) };
      }

      if (kpi.key === "commission") {
        return { ...kpi, value: formatCurrency(commission) };
      }

      if (kpi.key === "conversion") {
        return { ...kpi, value: `${conversion.toFixed(1)}%` };
      }

      return kpi;
    }),
  };
}
