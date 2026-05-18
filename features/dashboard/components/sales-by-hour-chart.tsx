"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSalesByHour } from "@/features/dashboard/hooks/use-sales-by-hour";
import {
  formatCurrency,
  formatDecimal,
  formatNumber,
} from "@/features/dashboard/services/dashboard-data-utils";
import type { SalesByHourBucket } from "@/features/dashboard/types/dashboard";

type TooltipPayload = {
  payload: SalesByHourBucket;
};

type SalesTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
};

export function SalesByHourChart() {
  const { data, error, isLoading, queryKey } = useSalesByHour();

  return (
    <section id="sales-by-hour" className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-primary">
          Temporal Analytics
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          Vendas por Horario
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Distribuicao percentual das compras aprovadas ao longo das 24h.
        </p>
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">Distribuicao temporal</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              {data
                ? `${formatNumber(data.totalSales)} vendas · ${formatCurrency(data.totalRevenue)}`
                : "Carregando vendas por horario"}
            </p>
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
            00h → 23h
          </span>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Falha ao carregar vendas por horario: {error.message}
            </div>
          ) : null}

          <div className="relative h-[320px] rounded-[1.75rem] border border-white/10 bg-[#07110f]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="absolute inset-x-12 top-6 h-20 rounded-full bg-primary/10 blur-3xl" />
            {isLoading && !data ? (
              <div className="relative h-full animate-pulse rounded-[1.25rem] bg-white/[0.04]" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.buckets ?? []} barCategoryGap={8}>
                  <CartesianGrid
                    stroke="rgba(248,248,248,0.08)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: "#a3a3a3", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={1}
                  />
                  <YAxis
                    tick={{ fill: "#a3a3a3", fontSize: 11 }}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(93,214,44,0.08)" }}
                    content={<SalesTooltip />}
                  />
                  <Bar
                    dataKey="percent"
                    fill="#5dd62c"
                    radius={[10, 10, 4, 4]}
                    animationDuration={700}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {data?.totalSales === 0 ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground">
              Sem vendas por horario expostas para o periodo/filtro atual.
            </div>
          ) : null}

          {data?.unsupportedFilters.length ? (
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">
              Dependencias futuras: {data.unsupportedFilters.join(", ")}.
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-muted-foreground">
            Query key: <span className="font-mono text-primary">{queryKey}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SalesTooltip({ active, payload }: SalesTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const bucket = payload[0].payload;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101714]/95 p-3 shadow-2xl">
      <p className="text-sm font-semibold text-foreground">
        {bucket.hour.replace("h", ":00")}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        {formatNumber(bucket.sales)} vendas
      </p>
      <p className="text-xs text-primary">{formatDecimal(bucket.percent, "%")}</p>
      <p className="text-xs text-muted-foreground">
        {formatCurrency(bucket.revenue)}
      </p>
    </div>
  );
}
