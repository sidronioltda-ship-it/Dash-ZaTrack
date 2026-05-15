"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Eye,
  MessageCircle,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrackingStore, type EventType } from "@/stores/tracking-store";
import { eventTemplates } from "@/data/tracking";

const eventConfig: Record<
  EventType,
  { icon: LucideIcon; color: string; label: string }
> = {
  pageview: { icon: Eye, color: "#a3a3a3", label: "Pageview" },
  whatsapp_click: { icon: MessageCircle, color: "#25D366", label: "WhatsApp" },
  checkout_init: { icon: ShoppingCart, color: "#F59E0B", label: "Checkout" },
  purchase: { icon: CreditCard, color: "#5DD62C", label: "Compra" },
  lead: { icon: UserPlus, color: "#3B82F6", label: "Lead" },
};

function formatTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return "agora";
  if (diff < 60) return `${diff}s`;
  return `${Math.floor(diff / 60)}min`;
}

export function LiveEventsFeed() {
  const events = useTrackingStore((s) => s.events);
  const addEvent = useTrackingStore((s) => s.addEvent);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulate = useCallback(() => {
    const template =
      eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    const value = template.valueRange
      ? Math.floor(
          template.valueRange[0] +
            Math.random() * (template.valueRange[1] - template.valueRange[0]),
        )
      : undefined;

    addEvent({
      type: template.type,
      source: template.source,
      campaign: template.campaign,
      value,
    });
  }, [addEvent]);

  useEffect(() => {
    for (let i = 0; i < 8; i++) simulate();

    const tick = () => {
      simulate();
      intervalRef.current = setTimeout(tick, 2000 + Math.random() * 3000);
    };
    intervalRef.current = setTimeout(tick, 2000);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [simulate]);

  return (
    <Card className="glass-panel">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg">Eventos em tempo real</CardTitle>
        <span className="flex items-center gap-2 text-xs text-primary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Live
        </span>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-2 overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {events.slice(0, 15).map((event) => {
            const config = eventConfig[event.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <div
                  className="grid size-8 shrink-0 place-items-center rounded-lg"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  <Icon className="size-4" style={{ color: config.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </span>
                    {event.campaign && (
                      <span className="truncate text-xs text-muted-foreground">
                        — {event.campaign}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {event.source}
                    {event.value != null && (
                      <span className="ml-2 font-medium text-primary">
                        R$ {event.value}
                      </span>
                    )}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatTime(event.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
