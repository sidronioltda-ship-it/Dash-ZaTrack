import { CheckCircle2 } from "lucide-react";

import { activities } from "@/data/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityFeed() {
  return (
    <Card className="glass-panel h-full">
      <CardHeader>
        <CardTitle>Atividade em tempo real</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {activities.map((activity) => (
          <div key={activity.title} className="flex gap-3">
            <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
              <CheckCircle2 className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium">{activity.title}</p>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {activity.detail}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
