"use client";

import { useEffect, useMemo, useState } from "react";

import { useDashboardFilters } from "@/features/dashboard/providers/dashboard-filter-provider";
import { useDashboardQueryInvalidation } from "@/features/dashboard/providers/dashboard-query-provider";
import { dashboardTemporalQuery } from "@/features/dashboard/queries/dashboard-temporal-query";
import type { SalesByHourSnapshot } from "@/features/dashboard/types/dashboard";

type SalesByHourState = {
  data: SalesByHourSnapshot | null;
  isLoading: boolean;
  error: Error | null;
};

export function useSalesByHour() {
  const { filters } = useDashboardFilters();
  const { revision } = useDashboardQueryInvalidation();
  const [state, setState] = useState<SalesByHourState>({
    data: null,
    isLoading: true,
    error: null,
  });

  const queryKey = useMemo(
    () => dashboardTemporalQuery.getKey(filters).join(":"),
    [filters],
  );

  useEffect(() => {
    let isCurrent = true;

    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    dashboardTemporalQuery
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
