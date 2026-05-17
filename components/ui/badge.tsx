import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-300",
  {
    variants: {
      variant: {
        default:
          "border-primary/25 bg-primary/12 text-primary shadow-[0_0_20px_rgba(93,214,44,0.16)]",
        secondary: "border-white/10 bg-white/[0.055] text-muted-foreground",
        outline: "border-white/10 bg-white/[0.025] text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
