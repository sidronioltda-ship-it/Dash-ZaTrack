import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { AnalyticsFoundationPanel } from "@/features/dashboard/components/analytics-foundation-panel";
import { DashboardFilterBar } from "@/features/dashboard/components/dashboard-filter-bar";
import { DashboardHero } from "@/features/dashboard/components/dashboard-hero";
import { KpiSection } from "@/features/dashboard/components/kpi-section";
import { RealtimeReadinessPanel } from "@/features/dashboard/components/realtime-readiness-panel";

export function DashboardCoreShell() {
  return (
    <main className="min-h-screen">
      <DashboardSidebar />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-6 px-4 py-4 sm:px-6 lg:pl-[320px] lg:pr-6">
        <TopBar />
        <DashboardHero />
        <DashboardFilterBar />
        <KpiSection />
        <AnalyticsFoundationPanel />
        <RealtimeReadinessPanel />
      </div>
    </main>
  );
}
