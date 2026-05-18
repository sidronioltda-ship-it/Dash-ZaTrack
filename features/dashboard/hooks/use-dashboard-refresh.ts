"use client";

import { useCallback } from "react";

import { useDashboardQueryInvalidation } from "@/features/dashboard/providers/dashboard-query-provider";

export function useDashboardRefresh() {
  const { invalidateDashboardQueries, revision } =
    useDashboardQueryInvalidation();

  const refreshDashboard = useCallback(() => {
    invalidateDashboardQueries();
  }, [invalidateDashboardQueries]);

  return {
    refreshDashboard,
    revision,
  };
}
