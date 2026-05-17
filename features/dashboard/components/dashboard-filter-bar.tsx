"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDashboardFilters } from "@/features/dashboard/providers/dashboard-filter-provider";
import type {
  DashboardPeriod,
  DashboardPlatform,
  DashboardTrafficSource,
} from "@/features/dashboard/types/dashboard";

const periods: { label: string; value: DashboardPeriod }[] = [
  { label: "Hoje", value: "today" },
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "90 dias", value: "90d" },
];

const adAccounts = [
  { label: "Todas as contas", value: "all" },
  { label: "Meta BR - Principal", value: "act_br_main" },
  { label: "Meta Scale - WhatsApp", value: "act_scale_wpp" },
];

const trafficSources: { label: string; value: DashboardTrafficSource }[] = [
  { label: "Todas as fontes", value: "all" },
  { label: "Meta Ads", value: "meta_ads" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Organico", value: "organic" },
  { label: "Checkout", value: "checkout" },
];

const platforms: { label: string; value: DashboardPlatform }[] = [
  { label: "Todas plataformas", value: "all" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Meta", value: "meta" },
  { label: "Checkout", value: "checkout" },
  { label: "Site", value: "site" },
];

const products = [
  { label: "Todos produtos", value: "all" },
  { label: "Cronograma tratamento", value: "cronograma tratamento" },
  { label: "ZaTrack Core", value: "zatrack_core" },
  { label: "Mentoria WhatsApp", value: "mentoria_whatsapp" },
  { label: "Checkout Scale", value: "checkout_scale" },
];

export function DashboardFilterBar() {
  const {
    filters,
    resetFilters,
    setAdAccountId,
    setPeriod,
    setPlatform,
    setProduct,
    setTrafficSource,
  } = useDashboardFilters();

  return (
    <section className="glass-panel rounded-[2rem] p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-primary">
            Global Filter Engine
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            Filtros operacionais
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          <RotateCcw className="size-3.5" />
          Resetar
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <FilterSelect
          label="Periodo"
          value={filters.period}
          options={periods}
          onChange={(value) => setPeriod(value as DashboardPeriod)}
        />
        <FilterSelect
          label="Conta de anuncio"
          value={filters.adAccountId}
          options={adAccounts}
          onChange={setAdAccountId}
        />
        <FilterSelect
          label="Fonte"
          value={filters.trafficSource}
          options={trafficSources}
          onChange={(value) =>
            setTrafficSource(value as DashboardTrafficSource)
          }
        />
        <FilterSelect
          label="Plataforma"
          value={filters.platform}
          options={platforms}
          onChange={(value) => setPlatform(value as DashboardPlatform)}
        />
        <FilterSelect
          label="Produto"
          value={filters.product}
          options={products}
          onChange={setProduct}
        />
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-card">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
