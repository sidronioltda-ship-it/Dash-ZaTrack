import { ArrowUpRight } from "lucide-react";

import { pipelineRows } from "@/data/dashboard";
import { OperationalState } from "@/components/dashboard/operational-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PipelineTable() {
  const hasRows = pipelineRows.length > 0;

  return (
    <Card className="premium-surface">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Pipeline prioritario</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Contas com maior propensao de fechamento.
          </p>
        </div>
        <Badge variant="outline" className="hidden gap-1.5 sm:flex">
          Ver CRM
          <ArrowUpRight className="size-3.5" />
        </Badge>
      </CardHeader>
      <CardContent>
        {!hasRows ? (
          <OperationalState kind="empty" />
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.018]">
            <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_1fr] gap-4 bg-white/[0.04] px-4 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground md:grid">
              <span>Conta</span>
              <span>Etapa</span>
              <span>Valor</span>
              <span>Score</span>
            </div>
            {pipelineRows.map((row) => (
              <div
                key={row.company}
                className="grid gap-3 border-t border-white/10 px-4 py-4 text-sm transition-colors duration-300 first:border-t-0 hover:bg-white/[0.035] md:grid-cols-[1.2fr_1fr_0.8fr_1fr] md:items-center"
              >
                <span className="font-medium">{row.company}</span>
                <span className="flex items-center justify-between gap-3 text-muted-foreground md:block">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 md:hidden">
                    Etapa
                  </span>
                  {row.stage}
                </span>
                <span className="flex items-center justify-between gap-3 md:block">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 md:hidden">
                    Valor
                  </span>
                  {row.value}
                </span>
                <span className="flex items-center gap-3">
                  <Progress value={row.confidence} className="min-w-28" />
                  <span className="font-mono text-xs text-primary">
                    {row.confidence}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
