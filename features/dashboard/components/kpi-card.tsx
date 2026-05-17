import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardKpi } from "@/features/dashboard/types/dashboard";

export function KpiCard({ kpi }: { kpi: DashboardKpi }) {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {kpi.value}
            </p>
          </div>
          <span className="grid size-10 place-items-center rounded-2xl bg-primary/15 text-primary">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xs leading-5 text-muted-foreground">
            {kpi.helper}
          </p>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {kpi.trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
