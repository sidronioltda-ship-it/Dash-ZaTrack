"use client";

import { motion } from "framer-motion";
import {
  Activity,
  MousePointerClick,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";

const kpis = [
  { label: "Eventos hoje", value: "14.283", delta: "+22%", icon: Activity },
  {
    label: "Leads ativos",
    value: "2.654",
    delta: "+18%",
    icon: MousePointerClick,
  },
  {
    label: "Taxa conversao",
    value: "18,2%",
    delta: "+3,4pp",
    icon: ShoppingCart,
  },
  {
    label: "Receita hoje",
    value: "R$ 42,8k",
    delta: "+31%",
    icon: TrendingUp,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function TrackingKPIs() {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {kpis.map((kpi) => (
        <motion.div key={kpi.label} variants={item}>
          <Card className="group border-white/10 bg-[#202020] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20">
            <div className="flex items-start justify-between">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <kpi.icon className="size-5" />
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {kpi.delta}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {kpi.value}
              </p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
