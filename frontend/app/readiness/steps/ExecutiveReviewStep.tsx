import { Activity, DollarSign, Eye, Shield, Users } from "lucide-react";
import type { DiagnosticFull } from "../../types/readiness";
import {
  averageScore,
  computeValueRisk,
  normalizeScores,
  quadrantCategory,
  quadrantDescription,
  SCORE_KEYS,
} from "../readinessLogic";
import { scoreHeatClass } from "../readinessLogic";
import { ATO_ROADMAP_PHASES, RECOMMENDED_NEXT_STEPS } from "../roadmapData";

const iconMap = {
  shield: Shield,
  dollar: DollarSign,
  eye: Eye,
  users: Users,
} as const;

interface Props {
  diagnostic: DiagnosticFull;
  saving: boolean;
  onSave: () => void;
}

export function ExecutiveReviewStep({ diagnostic, saving, onSave }: Props) {
  const scores = normalizeScores(diagnostic.scores as Record<string, unknown>);
  const { valueScore, riskScore } = computeValueRisk(scores);
  const category = quadrantCategory(valueScore, riskScore);
  const description = quadrantDescription(category);
  const avg = diagnostic.avg_score ?? averageScore(scores);
  const maturityShort = diagnostic.current_maturity?.split("—")[0]?.trim() ?? diagnostic.current_maturity ?? "—";

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Executive Review &amp; Deliverables
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Board-ready snapshot with key insights &amp; roadmap.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          { label: "Company", value: diagnostic.company_name || "—" },
          { label: "Industry", value: diagnostic.industry ?? "—" },
          { label: "Maturity Level", value: maturityShort },
          { label: "Avg Score", value: `${avg.toFixed(1)} / 5` },
          { label: "Roadmap", value: diagnostic.timeline_label ?? "6-Month" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center dark:border-gray-800 dark:bg-gray-950/50"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {s.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company Maturity Heatmap</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {SCORE_KEYS.map((key) => (
            <div
              key={key}
              className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${scoreHeatClass(scores[key])}`}
            >
              {key === "integration" ? "AI & Data Platform" : key.charAt(0).toUpperCase() + key.slice(1)}
              <div className="mt-1 text-base tabular-nums">{scores[key].toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Enterprise Risk-Value Position</h3>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
          <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden />
          {category}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Value: {valueScore} · Risk: {riskScore}
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          6-Month ATO Roadmap
        </h3>
        <ul className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
          {ATO_ROADMAP_PHASES.map((p) => (
            <li
              key={p.weekRange}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                  {p.weekRange}
                </span>
                <span className="font-medium text-violet-700 dark:text-violet-300">{p.engine}</span>
                <span className="text-gray-900 dark:text-white">{p.title}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {p.deliverableCount} deliverables →
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-900 dark:text-blue-200">
          Recommended Next Steps
        </h3>
        <ul className="mt-4 space-y-3">
          {RECOMMENDED_NEXT_STEPS.map((row) => {
            const Icon = iconMap[row.icon];
            return (
              <li key={row.text} className="flex gap-3 text-sm text-gray-800 dark:text-gray-200">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
                {row.text}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <Activity className="h-4 w-4 text-emerald-600" aria-hidden />
          Execution Tracking
        </h3>
        <ul className="mt-4 space-y-4">
          {ATO_ROADMAP_PHASES.map((p) => (
            <li key={p.engine}>
              <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                <span>
                  {p.engine} ({p.weekRange})
                </span>
                <span>0%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div className="h-full w-0 rounded-full bg-blue-600" />
              </div>
              <p className="mt-0.5 text-[11px] text-gray-500">{p.deliverableCount} items</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
