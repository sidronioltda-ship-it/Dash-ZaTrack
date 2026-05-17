import { CheckCircle2 } from "lucide-react";

import { activities } from "@/data/dashboard";
import { OperationalState } from "@/components/dashboard/operational-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityFeed() {
  const hasActivities = activities.length > 0;

  return (
    <Card className="premium-surface h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Atividade em tempo real</CardTitle>
          <span className="rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
            live
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasActivities ? (
          <OperationalState kind="empty" />
        ) : (
          activities.map((activity) => (
            <div
              key={activity.title}
              className="group flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3 transition-all duration-300 hover:border-primary/18 hover:bg-white/[0.045]"
            >
              <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/18 transition-transform duration-300 group-hover:scale-105">
                <CheckCircle2 className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{activity.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {activity.detail}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
