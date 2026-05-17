"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import {
  dashboardFilterReducer,
  dashboardFilterStorageKey,
  defaultDashboardFilters,
  parseDashboardFilters,
} from "@/features/dashboard/stores/dashboard-filter-store";
import type {
  DashboardFilters,
  DashboardPeriod,
  DashboardPlatform,
  DashboardTrafficSource,
} from "@/features/dashboard/types/dashboard";

type DashboardFilterContextValue = {
  filters: DashboardFilters;
  setPeriod: (period: DashboardPeriod) => void;
  setAdAccountId: (adAccountId: string) => void;
  setTrafficSource: (trafficSource: DashboardTrafficSource) => void;
  setPlatform: (platform: DashboardPlatform) => void;
  setProduct: (product: string) => void;
  resetFilters: () => void;
};

const DashboardFilterContext =
  createContext<DashboardFilterContextValue | null>(null);

export function DashboardFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [filters, dispatch] = useReducer(
    dashboardFilterReducer,
    defaultDashboardFilters,
  );

  useEffect(() => {
    const storedFilters = parseDashboardFilters(
      window.localStorage.getItem(dashboardFilterStorageKey),
    );

    dispatch({ type: "reset" });
    dispatch({ type: "set_period", period: storedFilters.period });
    dispatch({
      type: "set_ad_account",
      adAccountId: storedFilters.adAccountId,
    });
    dispatch({
      type: "set_traffic_source",
      trafficSource: storedFilters.trafficSource,
    });
    dispatch({ type: "set_platform", platform: storedFilters.platform });
    dispatch({ type: "set_product", product: storedFilters.product });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(
      dashboardFilterStorageKey,
      JSON.stringify(filters),
    );
  }, [filters, isHydrated]);

  const setPeriod = useCallback((period: DashboardPeriod) => {
    dispatch({ type: "set_period", period });
  }, []);

  const setAdAccountId = useCallback((adAccountId: string) => {
    dispatch({ type: "set_ad_account", adAccountId });
  }, []);

  const setTrafficSource = useCallback(
    (trafficSource: DashboardTrafficSource) => {
      dispatch({ type: "set_traffic_source", trafficSource });
    },
    [],
  );

  const setPlatform = useCallback((platform: DashboardPlatform) => {
    dispatch({ type: "set_platform", platform });
  }, []);

  const setProduct = useCallback((product: string) => {
    dispatch({ type: "set_product", product });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setPeriod,
      setAdAccountId,
      setTrafficSource,
      setPlatform,
      setProduct,
      resetFilters,
    }),
    [
      filters,
      resetFilters,
      setAdAccountId,
      setPeriod,
      setPlatform,
      setProduct,
      setTrafficSource,
    ],
  );

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilters() {
  const context = useContext(DashboardFilterContext);

  if (!context) {
    throw new Error(
      "useDashboardFilters must be used inside DashboardFilterProvider.",
    );
  }

  return context;
}
