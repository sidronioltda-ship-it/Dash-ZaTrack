import { Radio, RefreshCcw, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const realtimeNotes = [
  {
    label: "Invalidation first",
    detail: "Refresh manual hoje; Supabase Realtime pode acionar a mesma API.",
    icon: RefreshCcw,
  },
  {
    label: "Subscriptions filtradas",
    detail: "Evita flood em eventos e preserva performance operacional.",
    icon: ShieldCheck,
  },
  {
    label: "Widgets independentes",
    detail: "Cada bloco consome query layer, nao outro widget.",
    icon: Radio,
  },
];

export function RealtimeReadinessPanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {realtimeNotes.map((note) => {
        const Icon = note.icon;

        return (
          <Card key={note.label} className="glass-panel">
            <CardContent className="p-5">
              <Icon className="size-5 text-primary" />
              <p className="mt-4 font-semibold text-foreground">
                {note.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {note.detail}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
