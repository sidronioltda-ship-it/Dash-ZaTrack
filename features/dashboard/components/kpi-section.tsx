"use client";

import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDashboardKpis } from "@/features/dashboard/hooks/use-dashboard-kpis";
import { useDashboardRefresh } from "@/features/dashboard/hooks/use-dashboard-refresh";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import type { DashboardKpi } from "@/features/dashboard/types/dashboard";

export function KpiSection() {
  const { data, error, isLoading, queryKey } = useDashboardKpis();
  const { refreshDashboard } = useDashboardRefresh();

  return (
    <section id="kpis" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-primary">
            Real KPI Engine
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Central operacional viva
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            KPIs calculados a partir de analytics views e CTWA operacional via
            service → query → hook → component.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refreshDashboard}>
          <RefreshCcw className="size-3.5" />
          Atualizar
        </Button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Falha ao carregar KPIs: {error.message}
        </div>
      ) : null}

      {data?.unsupportedFilters.length ? (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Filtros aguardando suporte nas views:{" "}
          {data.unsupportedFilters.join(", ")}.
        </div>
      ) : null}

      <KpiLayer
        isLoading={isLoading && !data}
        title="KPIs financeiros"
        columns="xl:grid-cols-5"
        skeletons={5}
        kpis={data?.financialKpis}
      />

      <KpiLayer
        isLoading={isLoading && !data}
        title="Funil operacional"
        columns="xl:grid-cols-6"
        skeletons={11}
        kpis={data?.operationalKpis}
      />

      <KpiLayer
        compact
        isLoading={isLoading && !data}
        title="Eficiencia operacional"
        columns="xl:grid-cols-5"
        skeletons={5}
        kpis={data?.efficiencyKpis}
      />

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
        Query key: <span className="font-mono text-primary">{queryKey}</span>
        {data ? (
          <>
            {" "}
            · Views:{" "}
            <span className="font-mono text-primary">
              {data.views.join(", ")}
            </span>
          </>
        ) : null}
      </div>
    </section>
  );
}

function KpiLayer({
  columns,
  compact = false,
  isLoading,
  kpis,
  skeletons,
  title,
}: {
  title: string;
  columns: string;
  skeletons: number;
  compact?: boolean;
  isLoading: boolean;
  kpis?: DashboardKpi[];
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </h3>
      <div className={`grid gap-4 md:grid-cols-2 ${columns}`}>
        {isLoading
          ? Array.from({ length: skeletons }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.04]"
              />
            ))
          : kpis?.map((kpi) => (
              <div key={kpi.key} className={compact ? "text-sm" : undefined}>
                <KpiCard kpi={kpi} />
              </div>
            ))}
      </div>
    </div>
  );
}
