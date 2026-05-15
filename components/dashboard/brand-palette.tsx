import { colorTokens } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BrandPalette() {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader>
        <CardTitle>Identidade visual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f0f0f] p-0">
          {colorTokens.map((token, index) => (
            <div
              key={token.label}
              className={cn(
                "flex h-16 items-center px-6 font-mono text-sm tracking-[0.18em]",
                token.className,
                token.text,
              )}
              style={{
                borderTopLeftRadius: index === 0 ? "1.75rem" : undefined,
                borderTopRightRadius: index === 0 ? "1.75rem" : undefined,
                borderBottomLeftRadius:
                  index === colorTokens.length - 1 ? "1.75rem" : undefined,
                borderBottomRightRadius:
                  index === colorTokens.length - 1 ? "1.75rem" : undefined,
              }}
            >
              {token.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
