import { ArrowUpRight } from "lucide-react";

import { pipelineRows } from "@/data/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PipelineTable() {
  return (
    <Card className="glass-panel">
      <CardHeader className="flex-row items-center justify-between">
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
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr] gap-4 bg-white/[0.04] px-4 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>Conta</span>
            <span>Etapa</span>
            <span>Valor</span>
            <span>Score</span>
          </div>
          {pipelineRows.map((row) => (
            <div
              key={row.company}
              className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr] items-center gap-4 border-t border-white/10 px-4 py-4 text-sm"
            >
              <span className="font-medium">{row.company}</span>
              <span className="text-muted-foreground">{row.stage}</span>
              <span>{row.value}</span>
              <span className="flex items-center gap-3">
                <Progress value={row.confidence} className="hidden sm:block" />
                <span className="font-mono text-xs text-primary">
                  {row.confidence}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
