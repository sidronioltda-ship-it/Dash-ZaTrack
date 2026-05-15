import { Bell, Menu, Search, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { commandItems } from "@/data/dashboard";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 -mx-4 border-b border-white/8 bg-[#0f0f0f]/70 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>

        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-muted-foreground shadow-inner md:flex">
          <Search className="size-4 text-primary" />
          <span>Pesquisar metricas, contas, playbooks...</span>
          <kbd className="ml-auto rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] text-muted-foreground">
            CMD K
          </kbd>
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          {commandItems.map((item) => (
            <Badge key={item.label} variant="secondary" className="gap-1.5">
              <item.icon className="size-3.5 text-primary" />
              {item.label}
            </Badge>
          ))}
        </div>

        <Button variant="outline" size="icon">
          <Bell className="size-4" />
          <span className="sr-only">Notificacoes</span>
        </Button>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3">
          <Avatar>
            <AvatarFallback>ZA</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">ZaTrack Ops</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              Pro workspace
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
