"use client";

import type { ReactNode } from "react";

import { DashboardFilterProvider } from "@/features/dashboard/providers/dashboard-filter-provider";
import { DashboardQueryProvider } from "@/features/dashboard/providers/dashboard-query-provider";

export function DashboardProviders({ children }: { children: ReactNode }) {
  return (
    <DashboardFilterProvider>
      <DashboardQueryProvider>{children}</DashboardQueryProvider>
    </DashboardFilterProvider>
  );
}
