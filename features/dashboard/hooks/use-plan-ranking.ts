"use client";

import { useEffect, useMemo, useState } from "react";

import { useDashboardFilters } from "@/features/dashboard/providers/dashboard-filter-provider";
import { useDashboardQueryInvalidation } from "@/features/dashboard/providers/dashboard-query-provider";
import { dashboardCommercialQuery } from "@/features/dashboard/queries/dashboard-commercial-query";
import type { PlanRankingSnapshot } from "@/features/dashboard/types/dashboard";

type PlanRankingState = {
  data: PlanRankingSnapshot | null;
  isLoading: boolean;
  error: Error | null;
};

export function usePlanRanking() {
  const { filters } = useDashboardFilters();
  const { revision } = useDashboardQueryInvalidation();
  const [state, setState] = useState<PlanRankingState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const queryKey = useMemo(
    () => dashboardCommercialQuery.getKey(filters).join(":"),
    [filters],
  );

  useEffect(() => {
    let isCurrent = true;

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    dashboardCommercialQuery
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
