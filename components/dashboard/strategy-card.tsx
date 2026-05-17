import { Flame, Radar, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function StrategyCard() {
  return (
    <Card className="relative isolate overflow-hidden border-primary/20 bg-[#5dd62c] text-[#0f0f0f] shadow-[0_20px_70px_rgba(93,214,44,0.18)]">
      <div className="absolute -right-20 -top-28 size-64 rounded-full bg-[#f8f8f8]/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#337418]/30 to-transparent" />
      <CardContent className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <Badge className="border-[#0f0f0f]/10 bg-[#0f0f0f]/10 text-[#0f0f0f] shadow-none">
            Ops command
          </Badge>
          <Radar className="size-6" />
        </div>
        <h2 className="mt-7 text-2xl font-semibold tracking-tight sm:text-3xl">
          Proxima melhor acao para receita
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-[#0f0f0f]/70">
          Combine sinais de uso, pagamentos e engajamento para priorizar contas
          com maior impacto no crescimento.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-[#0f0f0f]/10 p-4 transition-colors duration-300 hover:bg-[#0f0f0f]/14">
            <Flame className="mb-3 size-5" />
            <p className="text-sm font-semibold">14 riscos mitigados</p>
            <p className="mt-1 text-xs text-[#0f0f0f]/65">Playbooks ativos</p>
          </div>
          <div className="rounded-3xl bg-[#0f0f0f]/10 p-4 transition-colors duration-300 hover:bg-[#0f0f0f]/14">
            <Target className="mb-3 size-5" />
            <p className="text-sm font-semibold">R$ 312k em expansao</p>
            <p className="mt-1 text-xs text-[#0f0f0f]/65">Cohort recomendada</p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="mt-5 bg-[#0f0f0f] text-[#f8f8f8] hover:bg-[#202020]"
        >
          Abrir plano de acao
        </Button>
      </CardContent>
    </Card>
  );
}
