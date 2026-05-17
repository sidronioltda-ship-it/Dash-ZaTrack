import { Activity, DatabaseZap, Radio } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const architecturePillars = [
  {
    label: "Operational path preservado",
    detail: "Leads, CTWA e eventos continuam desacoplados do visual.",
    icon: DatabaseZap,
  },
  {
    label: "Analytics path preparado",
    detail: "Widgets futuros entram pela query layer central.",
    icon: Activity,
  },
  {
    label: "Realtime safe",
    detail: "Invalidation pronta sem subscriptions pesadas.",
    icon: Radio,
  },
];

export function DashboardHero() {
  return (
    <section className="glass-panel relative overflow-hidden rounded-[2.25rem] p-6 sm:p-8">
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative">
        <Badge className="gap-2">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_14px_rgba(93,214,44,0.9)]" />
          ZaTrack Dashboard Core
        </Badge>
        <div className="mt-7 max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[#f8f8f8] sm:text-6xl">
            Cockpit operacional para tracking WhatsApp-first.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            Fundacao estrutural para KPI Engine, filtros globais, realtime
            futuro e analytics escalaveis sem acoplar widgets ao backend.
          </p>
        </div>
        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {architecturePillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <Icon className="size-5 text-primary" />
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {pillar.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {pillar.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
