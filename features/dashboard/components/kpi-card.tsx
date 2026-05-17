import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardKpi } from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

export function KpiCard({ kpi }: { kpi: DashboardKpi }) {
  return (
    <Card
      className={cn(
        "glass-panel overflow-hidden",
        kpi.emphasis &&
          "border-primary/40 bg-primary/[0.08] shadow-[0_0_70px_rgba(93,214,44,0.18)]",
      )}
    >
      <CardContent className={cn("p-5", kpi.emphasis && "p-6")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p
              className={cn(
                "mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground",
                kpi.emphasis && "text-4xl text-primary",
              )}
            >
              {kpi.value}
            </p>
          </div>
          <span
            className={cn(
              "grid size-10 place-items-center rounded-2xl bg-primary/15 text-primary",
              kpi.tone === "warning" && "bg-amber-400/15 text-amber-300",
              kpi.tone === "muted" && "bg-white/10 text-muted-foreground",
            )}
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xs leading-5 text-muted-foreground">
            {kpi.helper}
          </p>
          {kpi.detail ? (
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {kpi.detail}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
