import type { DiagnosticFull } from "../../types/readiness";
import {
  computeValueRisk,
  quadrantCategory,
  quadrantDescription,
  normalizeScores,
  type ScoreKey,
} from "../readinessLogic";
import { scoreHeatClass } from "../readinessLogic";

interface Props {
  diagnostic: DiagnosticFull;
}

export function PrioritizationStep({ diagnostic }: Props) {
  const scores = normalizeScores(diagnostic.scores as Record<string, unknown>);
  const { valueScore, riskScore } = computeValueRisk(scores);
  const category = quadrantCategory(valueScore, riskScore);
  const description = quadrantDescription(category);

  const leftPct = Math.min(100, Math.max(0, (valueScore / 5) * 100));
  const topPct = Math.min(100, Math.max(0, (1 - riskScore / 5) * 100));

  const qTL = category === "Low Value / High Risk";
  const qTR = category === "High Value / High Risk";
  const qBL = category === "Low Value / Low Risk";
  const qBR = category === "High Value / Low Risk";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Risk &amp; Value Prioritization — Enterprise Level
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Organizational risk vs. value positioning based on your maturity scores.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 text-center text-[10px] font-medium leading-tight text-gray-600 sm:text-xs dark:text-gray-400">
            <div
              className={`flex items-start justify-start border-b border-r border-gray-200 p-2 pt-3 dark:border-gray-700 ${
                qTL ? "bg-red-50 ring-2 ring-inset ring-red-500 dark:bg-red-950/30" : ""
              }`}
            >
              Low Value / High Risk
            </div>
            <div
              className={`flex items-start justify-end border-b border-gray-200 p-2 pt-3 dark:border-gray-700 ${
                qTR ? "bg-amber-50 ring-2 ring-inset ring-amber-500 dark:bg-amber-950/30" : ""
              }`}
            >
              High Value / High Risk
            </div>
            <div
              className={`flex items-end justify-start border-r border-gray-200 p-2 pb-3 dark:border-gray-700 ${
                qBL ? "bg-sky-50 ring-2 ring-inset ring-sky-500 dark:bg-sky-950/30" : ""
              }`}
            >
              Low Value / Low Risk
            </div>
            <div
              className={`flex items-end justify-end p-2 pb-3 ${
                qBR ? "bg-emerald-50 ring-2 ring-inset ring-emerald-500 dark:bg-emerald-950/30" : ""
              }`}
            >
              High Value / Low Risk
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-red-600 shadow-md ring-2 ring-red-300"
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              aria-label="Your position"
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 rounded bg-white/90 px-1 text-[9px] font-semibold text-red-600 shadow dark:bg-gray-900/90">
              YOUR POSITION
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Enterprise Position</h3>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{category}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
            <dl className="mt-4 flex flex-wrap gap-6 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Value Score</dt>
                <dd className="font-semibold text-amber-600 dark:text-amber-400">{valueScore}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Risk Score</dt>
                <dd className="font-semibold text-orange-600 dark:text-orange-400">{riskScore}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Score breakdown</h3>
            <p className="mt-2 font-mono text-xs text-gray-500 dark:text-gray-400">
              Value = avg(Adoption, Capital, Portfolio)
            </p>
            <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
              Risk = avg(Governance, Integration, Org Model)
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(
                [
                  ["governance", scores.governance],
                  ["capital", scores.capital],
                  ["org", scores.org],
                  ["portfolio", scores.portfolio],
                  ["adoption", scores.adoption],
                  ["integration", scores.integration],
                ] as [ScoreKey, number][]
              ).map(([key, v]) => (
                <span
                  key={key}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${scoreHeatClass(v)}`}
                >
                  {key === "integration" ? "AI & Data Platform" : key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                  {v.toFixed(1)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
