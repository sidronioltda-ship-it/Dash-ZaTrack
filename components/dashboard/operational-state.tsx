import * as React from "react";
import { Activity, Cable, CircleDashed, FilterX, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type OperationalStateKind = "source" | "empty" | "fallback" | "filters" | "loading";

const stateCopy: Record<
  OperationalStateKind,
  {
    icon: typeof Activity;
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  source: {
    icon: Cable,
    eyebrow: "Analytics layer",
    title: "Conecte a camada analytics",
    description:
      "Aguardando fonte operacional para sincronizar eventos, contas e playbooks.",
  },
  empty: {
    icon: CircleDashed,
    eyebrow: "Operational data",
    title: "Sem dados disponiveis para o periodo",
    description: "A visao permanece preparada para receber novos sinais.",
  },
  fallback: {
    icon: Activity,
    eyebrow: "Fallback operacional",
    title: "Aguardando fonte operacional",
    description:
      "Os modulos continuam estaveis enquanto a origem de dados e normalizada.",
  },
  filters: {
    icon: FilterX,
    eyebrow: "Filtros",
    title: "Nenhum filtro aplicado",
    description: "Use segmentos e periodos para aprofundar a leitura operacional.",
  },
  loading: {
    icon: Loader2,
    eyebrow: "Sincronizando",
    title: "Carregando sinais operacionais",
    description: "Preservando layout enquanto as metricas sao preparadas.",
  },
};

export function OperationalState({
  kind,
  className,
}: {
  kind: OperationalStateKind;
  className?: string;
}) {
  const state = stateCopy[kind];
  const Icon = state.icon;

  return (
    <div className={cn("operational-state rounded-[1.5rem] p-4", className)}>
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-amber-300/15 bg-amber-300/10 text-amber-200 shadow-[0_0_30px_rgba(245,158,11,0.12)]">
          <Icon className={cn("size-4", kind === "loading" && "animate-spin")} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-amber-100/60">
            {state.eyebrow}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#f8f8f8]">
            {state.title}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {state.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PremiumSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("premium-skeleton rounded-2xl", className)} {...props} />
  );
}
