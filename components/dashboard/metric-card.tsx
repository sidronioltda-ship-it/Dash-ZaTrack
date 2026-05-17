import { ArrowUpRight } from "lucide-react";

import type { Metric } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const toneClassName: Record<Metric["tone"], string> = {
  lime:
    "border-primary/25 bg-primary text-primary-foreground shadow-[0_18px_58px_rgba(93,214,44,0.18)]",
  dark: "border-white/10 bg-[#202020]/85 text-[#f8f8f8]",
  white: "border-white/10 bg-[#f8f8f8] text-[#202020]",
};

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card
      className={cn(
        "group overflow-hidden p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_20px_70px_rgba(0,0,0,0.3)] sm:p-5",
        toneClassName[metric.tone],
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid size-11 place-items-center rounded-2xl bg-black/10 ring-1 ring-white/10">
          <metric.icon className="size-5" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2.5 py-1 text-xs font-medium ring-1 ring-white/10">
          {metric.delta}
          <ArrowUpRight className="size-3" />
        </span>
      </div>
      <div className="mt-6">
        <p className="text-sm opacity-70">{metric.label}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">
          {metric.value}
        </p>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/10">
        <div className="h-full w-3/4 rounded-full bg-current opacity-40 transition-all duration-500 group-hover:w-full" />
      </div>
    </Card>
  );
}
