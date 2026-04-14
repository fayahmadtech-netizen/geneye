"use client";

import { useEffect, useState } from "react";
import { Globe, Briefcase, Shield, DollarSign, Loader2 } from "lucide-react";
import { dashboardService } from "./services/dashboardService";
import { DashboardMetrics } from "./types/dashboard";
import { DashboardKpiCard } from "./components/dashboard/DashboardKpiCard";
import { ReadinessRadarPanel } from "./components/dashboard/ReadinessRadarPanel";
import { StrategicPostureCard } from "./components/dashboard/StrategicPostureCard";
import { GovernanceAlertsCard } from "./components/dashboard/GovernanceAlertsCard";
import { ModuleIntelligence } from "./components/dashboard/ModuleIntelligence";
import {
  deriveStrategicPosture,
  formatProjectedFromK,
  guardrailCoveragePct,
  pipelineCounts,
  valueMultiplier,
} from "./lib/dashboardDerived";

export default function Home() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await dashboardService.getOverview();
        setMetrics(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error || "Unknown error occurred"}
      </div>
    );
  }

  const m = metrics.maturity;
  const p = metrics.portfolio;
  const alerts = metrics.governanceAlerts;
  const gr = metrics.guardrails;

  const { scaled, pilot, idea } = pipelineCounts(metrics.useCases);
  const mult = valueMultiplier(p.total_realized_value_k, p.total_projected_value_k);
  const multLabel = mult != null ? `${mult.toFixed(1)}x` : "—";
  const investedK = p.total_realized_value_k;
  const projectedK = p.total_projected_value_k;
  const projectedDisplay = formatProjectedFromK(projectedK);
  const strategic = deriveStrategicPosture(p);

  const coveragePct = guardrailCoveragePct(gr);
  const govValue = coveragePct != null ? `${coveragePct}%` : "—";
  const activeGr = gr.filter((g) => g.is_active).length;
  const govSubtitle =
    gr.length > 0
      ? `${activeGr} active / ${gr.length} guardrails · ${alerts.length} open alert${alerts.length === 1 ? "" : "s"}`
      : `${alerts.length} open alert${alerts.length === 1 ? "" : "s"}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardKpiCard
          title="AI Readiness Index"
          value={`${m.overall_score.toFixed(1)} / 5`}
          subtitle={`Stage: ${m.level}`}
          icon={Globe}
          accent="blue"
        />
        <DashboardKpiCard
          title="Portfolio Pipeline"
          value={`${p.total_active_use_cases} Initiatives`}
          subtitle={`${scaled} production/scaling · ${pilot} pilot · ${idea} intake`}
          icon={Briefcase}
          accent="emerald"
        />
        <DashboardKpiCard
          title="Governance coverage"
          value={govValue}
          subtitle={govSubtitle}
          icon={Shield}
          accent="amber"
        />
        <DashboardKpiCard
          title="Value Multiplier"
          value={multLabel}
          subtitle={`$${investedK.toLocaleString()}K invested → ${projectedDisplay} projected`}
          icon={DollarSign}
          accent="emerald"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ReadinessRadarPanel domainScores={m.domain_scores} />
        </div>
        <div className="flex flex-col gap-6 xl:col-span-1">
          {strategic ? (
            <StrategicPostureCard
              category={strategic.category}
              avgValueScore={strategic.avgValueScore}
              highRiskTier3Pct={strategic.highRiskTier3Pct}
              scaleConversionPct={strategic.scaleConversionPct}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 p-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
              Strategic posture appears when at least one portfolio initiative exists with value and risk
              scores.
            </div>
          )}
          <GovernanceAlertsCard alerts={alerts} />
        </div>
      </div>

      <ModuleIntelligence metrics={metrics} />
    </div>
  );
}
