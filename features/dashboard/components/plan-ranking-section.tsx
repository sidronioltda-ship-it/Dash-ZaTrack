"use client";

import { ArrowDown, ArrowUp, Minus, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlanRanking } from "@/features/dashboard/hooks/use-plan-ranking";
import {
  formatCurrency,
  formatDecimal,
  formatNumber,
} from "@/features/dashboard/services/dashboard-data-utils";
import type {
  PlanRankingItem,
  PlanRankingTrend,
} from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

const podiumStyles = [
  "border-amber-300/30 bg-amber-300/[0.07] shadow-[0_0_48px_rgba(251,191,36,0.12)]",
  "border-slate-200/25 bg-slate-200/[0.06]",
  "border-orange-300/25 bg-orange-400/[0.06]",
];

export function PlanRankingSection() {
  const { data, error, isLoading, queryKey } = usePlanRanking();

  return (
    <section id="plan-ranking" className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-primary">
          Commercial Intelligence
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          Ranking de Planos Mais Vendidos
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Produtos ordenados por performance operacional no periodo filtrado,
          usando dados reais das views analiticas.
        </p>
      </div>

      <Card className="glass-panel">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="size-5 text-primary" />
              Performance comercial
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              {data
                ? `${formatNumber(data.totalApprovedSales)} vendas · ${formatCurrency(data.totalRevenue)}`
                : "Carregando performance por plano"}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground">
            {data?.items.length ?? 0} planos
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Falha ao carregar ranking: {error.message}
            </div>
          ) : null}

          {isLoading && !data
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-[1.5rem] border border-white/10 bg-white/[0.04]"
                />
              ))
            : null}

          {!isLoading && data && data.items.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.03] p-6 text-center text-sm text-muted-foreground">
              Nenhum plano vendido no periodo filtrado.
            </div>
          ) : null}

          {data?.items.map((item, index) => (
            <PlanRankingRow
              key={`${item.planName}-${index}`}
              item={item}
              position={index + 1}
            />
          ))}

          {data?.unsupportedFilters.length ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">
              Filtros aguardando granularidade de receita:{" "}
              {data.unsupportedFilters.join(", ")}.
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
            Query key: <span className="font-mono text-primary">{queryKey}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function PlanRankingRow({
  item,
  position,
}: {
  item: PlanRankingItem;
  position: number;
}) {
  const isTopThree = position <= 3;

  return (
    <article
      className={cn(
        "rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 transition hover:border-primary/30",
        isTopThree && podiumStyles[position - 1],
      )}
    >
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-muted-foreground",
              position === 1 && "border-amber-300/40 text-amber-200",
              position === 2 && "border-slate-200/30 text-slate-100",
              position === 3 && "border-orange-300/30 text-orange-200",
            )}
          >
            #{position}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {item.planName}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <MetricBadge label="vendas" value={formatNumber(item.approvedSales)} />
              <MetricBadge label="share" value={formatDecimal(item.sharePercent, "%")} />
              <TrendBadge trend={item.trend} trendPercent={item.trendPercent} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-right">
          <MiniMetric label="Faturamento" value={formatCurrency(item.revenue)} />
          <MiniMetric label="Ticket" value={formatCurrency(item.averageTicket)} />
          <MiniMetric
            label="Conversao"
            value={formatDecimal(item.operationalConversion, "%")}
          />
        </div>
      </div>
    </article>
  );
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-muted-foreground">
      {value} {label}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function TrendBadge({
  trend,
  trendPercent,
}: {
  trend: PlanRankingTrend;
  trendPercent: number;
}) {
  const Icon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const label =
    trend === "stable" ? "Estavel" : `${trendPercent > 0 ? "+" : ""}${formatDecimal(trendPercent, "%")}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs",
        trend === "up" && "border-primary/25 bg-primary/10 text-primary",
        trend === "down" && "border-red-300/25 bg-red-400/10 text-red-200",
        trend === "stable" &&
          "border-white/10 bg-white/[0.04] text-muted-foreground",
      )}
    >
      <Icon className="size-3" />
      {label}
    </span>
  );
}
