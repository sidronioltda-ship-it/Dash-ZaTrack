"use client";

import { useEffect, useMemo, useState } from "react";

import { useDashboardFilters } from "@/features/dashboard/providers/dashboard-filter-provider";
import { useDashboardQueryInvalidation } from "@/features/dashboard/providers/dashboard-query-provider";
import { dashboardKpiQuery } from "@/features/dashboard/queries/dashboard-kpi-query";
import type { DashboardKpiSnapshot } from "@/features/dashboard/types/dashboard";

type DashboardKpiState = {
  data: DashboardKpiSnapshot | null;
  isLoading: boolean;
  error: Error | null;
};

export function useDashboardKpis() {
  const { filters } = useDashboardFilters();
  const { revision } = useDashboardQueryInvalidation();
  const [state, setState] = useState<DashboardKpiState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const queryKey = useMemo(
    () => dashboardKpiQuery.getKey(filters).join(":"),
    [filters],
  );

  useEffect(() => {
    let isCurrent = true;

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    dashboardKpiQuery
      .queryFn(filters)
      .then((data) => {
        if (!isCurrent) {
          return;
        }

        setState({
          data,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: Error) => {
        if (!isCurrent) {
          return;
        }

        setState({
          data: null,
          isLoading: false,
          error,
        });
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
