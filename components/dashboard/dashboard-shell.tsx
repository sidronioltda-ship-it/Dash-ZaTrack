import { ArrowUpRight, Layers3 } from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { BrandPalette } from "@/components/dashboard/brand-palette";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PipelineTable } from "@/components/dashboard/pipeline-table";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StrategyCard } from "@/components/dashboard/strategy-card";
import { TopBar } from "@/components/dashboard/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { metrics } from "@/data/dashboard";

export function DashboardShell() {
  return (
    <main className="min-h-screen">
      <DashboardSidebar />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:pl-[320px] lg:pr-6">
        <TopBar />

        <section id="overview" className="py-6 lg:py-8">
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="glass-panel relative overflow-hidden rounded-[2.25rem] p-6 sm:p-8">
              <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-primary/10 to-transparent" />
              <div className="relative">
                <Badge className="gap-2">
                  <span className="size-1.5 rounded-full bg-primary shadow-[0_0_14px_rgba(93,214,44,0.9)]" />
                  Dashboard premium dark
                </Badge>
                <div className="mt-8 max-w-3xl">
                  <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[#f8f8f8] sm:text-6xl">
                    Controle receita, clientes e operacao em um cockpit visual.
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                    Uma interface modular inspirada em Stripe e Vercel, com
                    contraste profundo, camadas arredondadas e o verde
                    eletrico da identidade ZaTrack.
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg">
                    Explorar insights
                    <ArrowUpRight className="size-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Ver arquitetura modular
                  </Button>
                </div>
              </div>
            </div>

            <StrategyCard />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section
          id="revenue"
          className="grid gap-6 py-6 xl:grid-cols-[1.35fr_0.65fr]"
        >
          <Card className="glass-panel">
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle className="text-xl">Receita e expansao</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Evolucao mensal com foco em retencao e upsell.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
                <p className="text-xs text-muted-foreground">ARR run-rate</p>
                <p className="font-semibold text-primary">R$ 5.14M</p>
              </div>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <BrandPalette />
            <ActivityFeed />
          </div>
        </section>

        <section id="ops" className="grid gap-6 pb-6 xl:grid-cols-[0.7fr_1.3fr]">
          <Card className="glass-panel overflow-hidden">
            <CardHeader>
              <CardTitle>Arquitetura modular</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "app router Next.js 15",
                "tokens Tailwind v4",
                "componentes shadcn/ui",
                "modulos de dashboard",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                >
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-sm font-semibold text-primary">
                    0{index + 1}
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
              <div className="rounded-[1.5rem] bg-[#f8f8f8] p-5 text-[#202020]">
                <Layers3 className="mb-4 size-5 text-[#337418]" />
                <p className="text-sm font-semibold">
                  Escala visual sem perder consistencia.
                </p>
                <p className="mt-2 text-sm text-[#202020]/65">
                  A paleta da referencia foi convertida em tokens globais e
                  aplicada nos estados, cards e navegacao.
                </p>
              </div>
            </CardContent>
          </Card>

          <PipelineTable />
        </section>
      </div>
    </main>
  );
}
