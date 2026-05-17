import { colorTokens } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BrandPalette() {
  return (
    <Card className="premium-surface overflow-hidden">
      <CardHeader>
        <CardTitle>Identidade visual</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tokens aplicados com contraste operacional.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0f0f0f] p-0 shadow-inner">
          {colorTokens.map((token, index) => (
            <div
              key={token.label}
              className={cn(
                "flex h-12 items-center px-5 font-mono text-xs tracking-[0.18em] transition-transform duration-300 hover:translate-x-1 sm:h-14",
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
