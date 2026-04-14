import Link from "next/link";
import { DashboardMetrics } from "../../types/dashboard";
import {
  formatProjectedFromK,
  riskValueCategoryFromQuadrant,
  guardrailCoveragePct,
} from "../../lib/dashboardDerived";

type ModuleStatus = "active" | "attention";

function StatusBadge({ status }: { status: ModuleStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden />
      Needs Attention
    </span>
  );
}

interface ModuleBlockProps {
  href: string;
  title: string;
  status: ModuleStatus;
  rows: { label: string; value: string; valueClass?: string }[];
}

function ModuleBlock({ href, title, status, rows }: ModuleBlockProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-tight text-gray-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
          {title}
        </h4>
        <StatusBadge status={status} />
      </div>
      <dl className="mt-auto space-y-2 text-xs">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-2 text-gray-600 dark:text-gray-400">
            <dt>{row.label}</dt>
            <dd
              className={`text-right font-medium ${row.valueClass ?? "text-gray-900 dark:text-gray-200"}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </Link>
  );
}

function riskTierCounts(useCases: { risk_score: number }[]) {
  const low = useCases.filter((u) => u.risk_score < 34).length;
  const mid = useCases.filter((u) => u.risk_score >= 34 && u.risk_score < 67).length;
  const high = useCases.filter((u) => u.risk_score >= 67).length;
  return `${low}/${mid}/${high}`;
}

interface Props {
  metrics: DashboardMetrics;
  riskValueCategory: string;
}

export function ModuleIntelligence({ metrics, riskValueCategory }: Props) {
  const m = metrics.maturity;
  const p = metrics.portfolio;
  const uc = metrics.useCases;
  const alerts = metrics.governanceAlerts;
  const gr = metrics.guardrails;

  const investedK = p.total_realized_value_k;
  const projectedK = p.total_projected_value_k;
  const roiMultiple = investedK > 0 ? (projectedK / investedK).toFixed(1) : "—";

  const scaled = uc.filter((u) => u.status === "Production" || u.status === "Scaling").length;
  const pilot = uc.filter((u) => u.status === "Pilot").length;
  const intake = uc.filter((u) => u.status === "Intake").length;
  const pipeline = pilot + intake;

  const coverage = guardrailCoveragePct(gr);
  const pendingApprovals = alerts.length;

  const readinessAttention = m.level === "Unassessed" || m.overall_score === 0;
  const blueprintAttention = false;
  const portfolioAttention = uc.length > 0 && pilot + intake > scaled;
  const govAttention = pendingApprovals > 0 || (coverage != null && coverage < 80);
  const valueAttention = investedK === 0 && projectedK > 0;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Module Intelligence</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Strategic signals from each module — click a card to open the module.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <ModuleBlock
          href="/readiness"
          title="AI Readiness Diagnostic"
          status={readinessAttention ? "attention" : "active"}
          rows={[
            { label: "Maturity Score", value: `${m.overall_score.toFixed(1)} / 5` },
            { label: "Readiness Stage", value: m.level },
            {
              label: "Risk Category",
              value: riskValueCategory,
              valueClass: "text-gray-900 dark:text-gray-100",
            },
          ]}
        />
        <ModuleBlock
          href="/blueprint"
          title="AI Org Blueprint"
          status={blueprintAttention ? "attention" : "active"}
          rows={[
            {
              label: "Operating Model",
              value: "Defined",
              valueClass: "text-emerald-600 dark:text-emerald-400",
            },
            { label: "AI Academy", value: "3 Tiers Active" },
            {
              label: "PARC Framework",
              value: "In Use",
              valueClass: "text-emerald-600 dark:text-emerald-400",
            },
          ]}
        />
        <ModuleBlock
          href="/portfolio"
          title="UseCaseX Portfolio"
          status={portfolioAttention ? "attention" : "active"}
          rows={[
            { label: "Total Initiatives", value: String(uc.length) },
            {
              label: "At Scale",
              value: String(scaled),
              valueClass: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Pipeline (Pilot+Idea)",
              value: String(pipeline),
              valueClass: "text-amber-600 dark:text-amber-400",
            },
          ]}
        />
        <ModuleBlock
          href="/governance-stack"
          title="AI Governance Stack"
          status={govAttention ? "attention" : "active"}
          rows={[
            {
              label: "Risk Assessed",
              value: coverage != null ? `${coverage}%` : "—",
              valueClass:
                coverage != null && coverage < 80
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-900 dark:text-gray-200",
            },
            {
              label: "Pending Approvals",
              value: String(pendingApprovals),
              valueClass: "text-red-600 dark:text-red-400",
            },
            { label: "Tier Distribution", value: uc.length ? riskTierCounts(uc) : "—" },
          ]}
        />
        <ModuleBlock
          href="/value-forecast"
          title="Value Forecast"
          status={valueAttention ? "attention" : "active"}
          rows={[
            { label: "Total Invested", value: `$${investedK.toLocaleString()}K` },
            {
              label: "Projected ROI",
              value: formatProjectedFromK(projectedK),
              valueClass: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "ROI Multiple",
              value: `${roiMultiple}x`,
              valueClass: "text-emerald-600 dark:text-emerald-400",
            },
          ]}
        />
      </div>
    </section>
  );
}
