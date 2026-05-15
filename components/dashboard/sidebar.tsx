import { ChevronRight, Command, LifeBuoy, Settings2 } from "lucide-react";

import { navItems } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function DashboardSidebar() {
  return (
    <aside className="glass-panel fixed inset-y-4 left-4 z-30 hidden w-[280px] overflow-hidden rounded-[2rem] lg:flex lg:flex-col">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(93,214,44,0.22),transparent_72%)]" />
      <div className="relative flex items-center gap-3 p-5">
        <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_40px_rgba(93,214,44,0.36)]">
          <Command className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-[0.28em] text-primary">
            ZATRACK
          </p>
          <p className="text-xs text-muted-foreground">Revenue Command OS</p>
        </div>
      </div>

      <Separator className="mx-5 w-auto" />

      <ScrollArea className="relative flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-3 py-3 text-sm text-muted-foreground transition-all hover:bg-white/8 hover:text-foreground",
                item.active &&
                  "bg-primary text-primary-foreground shadow-[0_14px_44px_rgba(93,214,44,0.26)] hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon className="size-4" />
                {item.label}
              </span>
              {item.active ? (
                <ChevronRight className="size-4" />
              ) : (
                <span className="size-1.5 rounded-full bg-white/10 transition group-hover:bg-primary" />
              )}
            </a>
          ))}
        </div>
      </ScrollArea>

      <div className="relative m-3 rounded-[1.75rem] border border-white/10 bg-[#202020]/80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <Badge>Premium</Badge>
          <span className="flex items-center gap-1 text-xs text-primary">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_16px_rgba(93,214,44,0.8)]" />
            Live
          </span>
        </div>
        <p className="text-sm font-medium">Dark sidebar suite</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Navegacao compacta, glassmorphism e tokens visuais da referencia.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <LifeBuoy className="size-3.5" />
            Help
          </Button>
          <Button variant="secondary" size="sm">
            <Settings2 className="size-3.5" />
            Setup
          </Button>
        </div>
      </div>
    </aside>
  );
}
