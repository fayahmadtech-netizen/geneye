import Link from "next/link";
import { DashboardMetrics } from "../../types/dashboard";
import { formatProjectedFromK, riskValueCategoryFromQuadrant, guardrailCoveragePct } from "../../lib/dashboardDerived";

type ModuleStatus = "active" | "attention";

function StatusBadge({ status }: { status: ModuleStatus }) {
  if (status === "active") {
    return (
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
        Active
      </span>
    );
  }
  return (
    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
      Needs Attention
    </span>
  );
}

interface ModuleBlockProps {
  href: string;
  title: string;
  status: ModuleStatus;
  rows: { label: string; value: string }[];
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
            <dd className="text-right font-medium text-gray-900 dark:text-gray-200">{row.value}</dd>
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
}

export function ModuleIntelligence({ metrics }: Props) {
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

  const coverage = guardrailCoveragePct(gr);
  const activeGr = gr.filter((g) => g.is_active).length;

  const riskCat = riskValueCategoryFromQuadrant(p.quadrant_data);

  const readinessAttention = m.level === "Unassessed" || m.overall_score === 0;
  const portfolioAttention = scaled < pilot + intake;
  const govAttention = alerts.length > 0;
  const valueAttention = investedK === 0 && projectedK > 0;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Module Intelligence</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Strategic signals from each ATO module — click to drill into any module.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ModuleBlock
          href="/readiness"
          title="AI Readiness Diagnostic"
          status={readinessAttention ? "attention" : "active"}
          rows={[
            { label: "Maturity Score", value: `${m.overall_score.toFixed(1)}/5` },
            { label: "Readiness Stage", value: m.level },
            { label: "Risk / value (portfolio)", value: riskCat },
          ]}
        />
        <ModuleBlock
          href="/portfolio"
          title="UseCaseX Portfolio"
          status={portfolioAttention ? "attention" : "active"}
          rows={[
            { label: "Total Initiatives", value: String(uc.length) },
            { label: "Production / Scaling", value: String(scaled) },
            { label: "Pilot / Intake (pipeline)", value: `${pilot} / ${intake}` },
          ]}
        />
        <ModuleBlock
          href="/governance-stack"
          title="AI Governance Stack"
          status={govAttention ? "attention" : "active"}
          rows={[
            {
              label: "Guardrail coverage",
              value: coverage != null ? `${coverage}%` : "—",
            },
            {
              label: "Active guardrails",
              value: gr.length ? `${activeGr} / ${gr.length}` : "—",
            },
            { label: "Open alerts", value: String(alerts.length) },
            ...(uc.length
              ? [{ label: "Risk tier spread (L/M/H)", value: riskTierCounts(uc) }]
              : []),
          ]}
        />
        <ModuleBlock
          href="/value-forecast"
          title="Value Forecast"
          status={valueAttention ? "attention" : "active"}
          rows={[
            { label: "Total Invested", value: `$${investedK.toLocaleString()}K` },
            { label: "Projected value", value: formatProjectedFromK(projectedK) },
            { label: "ROI Multiple", value: `${roiMultiple}x` },
          ]}
        />
      </div>
    </section>
  );
}
