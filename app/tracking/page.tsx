import { Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TrackingKPIs } from "@/components/tracking/tracking-kpis";
import { LiveEventsFeed } from "@/components/tracking/live-events-feed";
import { FunnelChart } from "@/components/tracking/funnel-chart";
import { CampaignCards } from "@/components/tracking/campaign-cards";
import { campaigns } from "@/data/tracking";

export default function TrackingPage() {
  return (
    <div className="space-y-6 py-6 lg:py-8">
      <header>
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Zap className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Tracking
            </h1>
            <p className="text-sm text-muted-foreground">
              Eventos em tempo real, campanhas e funil de conversao
            </p>
          </div>
          <Badge className="ml-auto gap-1.5">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Realtime
          </Badge>
        </div>
      </header>

      <TrackingKPIs />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <LiveEventsFeed />
        <FunnelChart />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Campanhas ativas
          </h2>
          <span className="text-sm text-muted-foreground">
            {campaigns.length} campanhas
          </span>
        </div>
        <CampaignCards />
      </section>
    </div>
  );
}
