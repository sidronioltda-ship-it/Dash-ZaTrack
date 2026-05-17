import { Activity, ArrowUpRight, DatabaseZap, Layers3, Radio } from "lucide-react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { BrandPalette } from "@/components/dashboard/brand-palette";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PipelineTable } from "@/components/dashboard/pipeline-table";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StrategyCard } from "@/components/dashboard/strategy-card";
import { TopBar } from "@/components/dashboard/top-bar";
import { OperationalState } from "@/components/dashboard/operational-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { metrics } from "@/data/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-primary/75">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#f8f8f8] sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(93,214,44,0.72)]" />
        sistema ativo
      </span>
    </div>
  );
}

export function DashboardShell() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <main className="min-h-screen">
      <DashboardSidebar />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:pl-[320px] lg:pr-6">
        <TopBar />

        <section id="overview" className="py-4 lg:py-5">
          <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
            <div className="glass-panel relative overflow-hidden rounded-[1.8rem] p-5 sm:p-6">
              <div className="absolute -right-24 -top-28 size-72 rounded-full bg-primary/18 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-primary/8 to-transparent" />
              <div className="relative max-w-4xl">
                <Badge className="gap-2 text-[11px]">
                  <span className="size-1.5 rounded-full bg-primary shadow-[0_0_14px_rgba(93,214,44,0.9)]" />
                  Context header operacional
                </Badge>
                <div className="mt-5 max-w-3xl">
                  <h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#f8f8f8] sm:text-5xl lg:text-[3.15rem]">
                    Controle receita, clientes e operacao em um cockpit premium.
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Uma central operacional proprietaria para leitura de receita,
                    risco, pagamentos e expansao com densidade analitica sem
                    perder clareza.
                  </p>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button>
                    Explorar insights
                    <ArrowUpRight className="size-4" />
                  </Button>
                  <Button variant="outline">
                    Ver arquitetura modular
                  </Button>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {[
                    { label: "MRR", value: "sincronizado", icon: Activity },
                    {
                      label: "Supabase",
                      value: supabaseReady ? "online" : "pendente",
                      icon: DatabaseZap,
                    },
                    { label: "Ops", value: "observavel", icon: Radio },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-300 hover:border-primary/20 hover:bg-white/[0.055]"
                    >
                      <item.icon className="size-4 text-primary" />
                      <span className="font-medium text-[#f8f8f8]">
                        {item.label}
                      </span>
                      <span className="ml-auto text-xs">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <StrategyCard />
          </div>
        </section>

        <section className="space-y-4 py-3">
          <SectionHeader
            eyebrow="KPI engine"
            title="Indicadores operacionais"
            description="Leitura rapida dos sinais que orientam receita, saude e pagamentos."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <section id="revenue" className="space-y-4 py-5">
          <SectionHeader
            eyebrow="Commercial intelligence"
            title="Receita, expansao e sinais em tempo real"
            description="Agrupamento visual para analise temporal, identidade e atividade operacional."
          />
          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <Card className="premium-surface">
              <CardHeader className="flex-row items-start justify-between gap-4">
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

            <div className="grid gap-5">
              <BrandPalette />
              <ActivityFeed />
            </div>
          </div>
        </section>

        <section id="ops" className="space-y-4 pb-6">
          <SectionHeader
            eyebrow="Operational workflow"
            title="Arquitetura e funil prioritario"
            description="Separacao clara entre camada operacional, readiness analytics e contas em execucao."
          />
          <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
            <Card className="premium-surface overflow-hidden">
              <CardHeader>
                <CardTitle>Arquitetura modular</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "app router Next.js 15",
                  "tokens Tailwind v4",
                  "componentes shadcn/ui",
                  "modulos de dashboard",
                  "helpers Supabase",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition-colors duration-300 hover:border-primary/20 hover:bg-white/[0.055]"
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
                {!supabaseReady ? <OperationalState kind="source" /> : null}
              </CardContent>
            </Card>

            <PipelineTable />
          </div>
        </section>

        <details className="developer-observability mb-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[10px] opacity-55 transition-opacity duration-300 hover:opacity-85">
          <summary className="cursor-pointer list-none">
            query observability | revenue.monthly | pipeline.priority |
            activity.live
          </summary>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <span>supabase:{supabaseReady ? "ready" : "awaiting-source"}</span>
            <span>filters:none</span>
            <span>cache:operational</span>
          </div>
        </details>
      </div>
    </main>
  );
}
