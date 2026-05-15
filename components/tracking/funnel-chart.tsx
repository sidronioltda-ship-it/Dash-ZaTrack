"use client";

import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { funnelStages } from "@/data/tracking";

const maxCount = funnelStages[0].count;

export function FunnelChart() {
  const totalRate =
    (funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100;

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-lg">Funil de conversao</CardTitle>
        <p className="text-sm text-muted-foreground">
          Ad Click → WhatsApp → Checkout → Purchase
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {funnelStages.map((stage, i) => {
          const pct = (stage.count / maxCount) * 100;
          const convRate =
            i > 0
              ? ((stage.count / funnelStages[i - 1].count) * 100).toFixed(1)
              : null;

          return (
            <div key={stage.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">
                  {stage.label}
                </span>
                <div className="flex items-center gap-3">
                  {convRate && (
                    <span className="text-xs text-muted-foreground">
                      {convRate}%
                    </span>
                  )}
                  <span className="font-mono text-xs text-primary">
                    {stage.count.toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
              <div className="h-8 overflow-hidden rounded-lg bg-white/[0.04]">
                <motion.div
                  className="h-full rounded-lg"
                  style={{
                    background: `linear-gradient(90deg, #5DD62C ${100 - i * 20}%, #337418)`,
                    opacity: 1 - i * 0.15,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>
          );
        })}

        <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Taxa de conversao total
          </p>
          <p className="mt-1 text-xl font-semibold text-primary">
            {totalRate.toFixed(1)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
