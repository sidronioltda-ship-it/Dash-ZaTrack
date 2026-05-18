"use client";

import { useEffect, useMemo, useState } from "react";

import { useDashboardFilters } from "@/features/dashboard/providers/dashboard-filter-provider";
import { useDashboardQueryInvalidation } from "@/features/dashboard/providers/dashboard-query-provider";
import { dashboardFunnelQuery } from "@/features/dashboard/queries/dashboard-funnel-query";
import type { WhatsAppFunnelSnapshot } from "@/features/dashboard/types/dashboard";

type WhatsAppFunnelState = {
  data: WhatsAppFunnelSnapshot | null;
  isLoading: boolean;
  error: Error | null;
};

export function useWhatsAppFunnel() {
  const { filters } = useDashboardFilters();
  const { revision } = useDashboardQueryInvalidation();
  const [state, setState] = useState<WhatsAppFunnelState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const queryKey = useMemo(
    () => dashboardFunnelQuery.getKey(filters).join(":"),
    [filters],
  );

  useEffect(() => {
    let isCurrent = true;

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    dashboardFunnelQuery
      .queryFn(filters)
      .then((data) => {
        if (!isCurrent) {
          return;
        }

        setState({ data, isLoading: false, error: null });
      })
      .catch((error: Error) => {
        if (!isCurrent) {
          return;
        }

        setState({ data: null, isLoading: false, error });
      });

    return () => {
      isCurrent = false;
    };
  }, [filters, queryKey, revision]);

  return {
    ...state,
    queryKey,
  };
}
