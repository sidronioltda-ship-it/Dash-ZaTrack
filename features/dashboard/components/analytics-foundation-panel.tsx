import { BarChart3, Blocks, Clock3 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const analyticsRegions = [
  "daily revenue",
  "daily leads",
  "campaign performance",
  "purchase funnel",
];

export function AnalyticsFoundationPanel() {
  return (
    <section id="analytics" className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="size-5 text-primary" />
            Analytics region
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Area reservada para graficos e funis futuros. A primeira fase expoe
            apenas containers responsivos e contratos de dados.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid min-h-64 place-items-center rounded-[1.75rem] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
            <div>
              <Blocks className="mx-auto size-8 text-primary" />
              <p className="mt-4 font-semibold text-foreground">
                Widgets futuros entram aqui sem acoplamento.
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Ranking operacional, funil volumetrico, series temporais e feed
                live devem consumir queries centralizadas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock3 className="size-5 text-primary" />
            Query orchestration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analyticsRegions.map((region) => (
            <div
              key={region}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3"
            >
              <span className="text-sm text-muted-foreground">{region}</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                prepared
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
