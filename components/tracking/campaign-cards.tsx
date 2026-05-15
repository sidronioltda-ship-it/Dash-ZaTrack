"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { campaigns } from "@/data/tracking";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const statusLabel: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  completed: "Finalizado",
};

const statusStyle: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  completed: "bg-muted text-muted-foreground border-white/10",
};

export function CampaignCards() {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {campaigns.map((campaign) => (
        <motion.div key={campaign.id} variants={item}>
          <Card className="group border-white/10 bg-[#202020] transition-all duration-300 hover:border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {campaign.name}
                  </p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {campaign.source.replace("_", " ")}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={statusStyle[campaign.status]}
                >
                  {statusLabel[campaign.status]}
                </Badge>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Investido</p>
                  <p className="mt-0.5 text-sm font-medium">
                    R$ {(campaign.spend / 1000).toFixed(1)}k
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Receita</p>
                  <p className="mt-0.5 text-sm font-medium text-primary">
                    R$ {(campaign.revenue / 1000).toFixed(1)}k
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Leads</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {campaign.leads.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Compras</p>
                  <p className="mt-0.5 text-sm font-medium">
                    {campaign.purchases}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] p-3">
                <span className="text-xs text-muted-foreground">ROAS</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <TrendingUp className="size-3.5" />
                  {campaign.roas.toFixed(2)}x
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
