"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DashboardQueryContextValue = {
  revision: number;
  invalidateDashboardQueries: () => void;
};

const DashboardQueryContext =
  createContext<DashboardQueryContextValue | null>(null);

export function DashboardQueryProvider({ children }: { children: ReactNode }) {
  const [revision, setRevision] = useState(0);

  const invalidateDashboardQueries = useCallback(() => {
    setRevision((currentRevision) => currentRevision + 1);
  }, []);

  const value = useMemo(
    () => ({
      revision,
      invalidateDashboardQueries,
    }),
    [invalidateDashboardQueries, revision],
  );

  return (
    <DashboardQueryContext.Provider value={value}>
      {children}
    </DashboardQueryContext.Provider>
  );
}

export function useDashboardQueryInvalidation() {
  const context = useContext(DashboardQueryContext);

  if (!context) {
    throw new Error(
      "useDashboardQueryInvalidation must be used inside DashboardQueryProvider.",
    );
  }

  return context;
}
