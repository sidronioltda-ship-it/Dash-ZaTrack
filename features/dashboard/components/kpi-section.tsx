"use client";

import { RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDashboardKpis } from "@/features/dashboard/hooks/use-dashboard-kpis";
import { useDashboardRefresh } from "@/features/dashboard/hooks/use-dashboard-refresh";
import { KpiCard } from "@/features/dashboard/components/kpi-card";

export function KpiSection() {
  const { data, error, isLoading, queryKey } = useDashboardKpis();
  const { refreshDashboard } = useDashboardRefresh();

  return (
    <section id="kpis" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-primary">
            KPI Query Layer
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Indicadores MVP
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Cards consomem um hook centralizado; o service pode trocar mock por
            analytics views sem alterar componentes visuais.
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {isLoading && !data
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.04]"
              />
            ))
          : data?.kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
        Query key: <span className="font-mono text-primary">{queryKey}</span>
      </div>
    </section>
  );
}
