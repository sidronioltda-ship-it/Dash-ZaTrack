"use client";

import { ArrowRight, GitBranch, Waves } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWhatsAppFunnel } from "@/features/dashboard/hooks/use-whatsapp-funnel";
import {
  formatDecimal,
  formatNumber,
} from "@/features/dashboard/services/dashboard-data-utils";
import type { WhatsAppFunnelStage } from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

export function WhatsAppFunnelSection() {
  const { data, error, isLoading, queryKey } = useWhatsAppFunnel();

  return (
    <section id="whatsapp-funnel" className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-primary">
          WhatsApp Marketing Funnel
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          Funil de Conversão WhatsApp Marketing
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Fluxo operacional volumetrico: a espessura muda conforme o volume real
          e evidencia gargalos sem depender de grafico pronto.
        </p>
      </div>

      <Card className="glass-panel overflow-hidden">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Waves className="size-5 text-primary" />
              Engine visual volumetrica
            </CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              {data
                ? `Referencia: ${data.referenceLabel} · ${formatNumber(data.referenceValue)}`
                : "Calculando volumetria operacional"}
            </p>
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
            horizontal flow
          </span>
        </CardHeader>
        <CardContent className="space-y-5">
          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Falha ao carregar funil: {error.message}
            </div>
          ) : null}

          {isLoading && !data ? (
            <div className="h-80 animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.04]" />
          ) : null}

          {data ? <VolumetricFlow stages={data.stages} /> : null}

          {data?.unsupportedFilters.length ? (
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs text-amber-100">
              Dependencias futuras: {data.unsupportedFilters.join(", ")}.
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

function VolumetricFlow({ stages }: { stages: WhatsAppFunnelStage[] }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[1180px]">
        <div className="grid grid-cols-6 gap-3">
          {stages.map((stage, index) => (
            <StageCard key={stage.key} index={index} stage={stage} />
          ))}
        </div>

        <div className="relative mt-5 flex items-center px-3">
          {stages.map((stage, index) => (
            <div key={stage.key} className="flex flex-1 items-center">
              <div
                className={cn(
                  "relative flex-1 rounded-full bg-gradient-to-r from-primary/80 via-primary/55 to-primary/25 shadow-[0_0_44px_rgba(93,214,44,0.22)] transition-all",
                  index === 0 && "from-primary via-primary/70",
                )}
                style={{ height: `${stage.thickness}px` }}
              >
                <div className="absolute inset-0 rounded-full bg-white/10" />
              </div>
              {index < stages.length - 1 ? (
                <div className="grid w-10 place-items-center text-primary/80">
                  <ArrowRight className="size-5" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-5 gap-3">
          {stages.slice(1).map((stage) => (
            <DropCard key={stage.key} stage={stage} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StageCard({
  index,
  stage,
}: {
  index: number;
  stage: WhatsAppFunnelStage;
}) {
  return (
    <article className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
            Etapa {index + 1}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-foreground">
            {stage.label}
          </h3>
        </div>
        <GitBranch className="size-4 text-primary" />
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-foreground">
        {formatNumber(stage.value)}
      </p>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {stage.helper}
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${Math.min(stage.shareOfReference, 100)}%` }}
        />
      </div>
    </article>
  );
}

function DropCard({ stage }: { stage: WhatsAppFunnelStage }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs font-medium text-foreground">{stage.label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          Conv.{" "}
          {stage.conversionFromPrevious === null
            ? "—"
            : formatDecimal(stage.conversionFromPrevious, "%")}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs",
            stage.dropFromPrevious && stage.dropFromPrevious > 40
              ? "bg-red-400/10 text-red-200"
              : "bg-primary/10 text-primary",
          )}
        >
          Perda{" "}
          {stage.dropFromPrevious === null
            ? "—"
            : formatDecimal(stage.dropFromPrevious, "%")}
        </span>
      </div>
    </div>
  );
}
