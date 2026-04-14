import { Info } from "lucide-react";
import type { DiagnosticFull } from "../../types/readiness";
import {
  SCORE_KEYS,
  MATURITY_SLIDER_LABELS,
  normalizeScores,
  averageScore,
  type ScoreKey,
} from "../readinessLogic";

interface Props {
  diagnostic: DiagnosticFull;
  onScoresChange: (scores: Record<ScoreKey, number>) => void;
}

export function MaturityScoringStep({ diagnostic, onScoresChange }: Props) {
  const scores = normalizeScores(diagnostic.scores as Record<string, unknown>);
  const overall = averageScore(scores);

  const setOne = (key: ScoreKey, v: number) => {
    onScoresChange({ ...scores, [key]: v });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Maturity Scoring — Company Level
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Rate your organization&apos;s readiness across 6 core dimensions (0–5). Lower → riskier, less
            institutionalized.
          </p>
        </div>

        <div className="space-y-8">
          {SCORE_KEYS.map((key) => {
            const meta = MATURITY_SLIDER_LABELS[key];
            const val = scores[key];
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{meta.title}</span>
                    <button
                      type="button"
                      className="rounded p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title={meta.hint}
                      aria-label={meta.hint}
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      val < 2.5 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {val.toFixed(1)} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.1}
                  value={val}
                  onChange={(e) => setOne(key, parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-600 dark:bg-gray-700 dark:accent-blue-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      <aside className="rounded-xl border border-gray-200 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/60">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Enterprise Score Summary
        </h3>
        <p className="mt-3 text-3xl font-bold tabular-nums text-gray-900 dark:text-white">
          {overall.toFixed(1)}
          <span className="text-lg font-medium text-gray-500"> / 5.0</span>
        </p>
        <ul className="mt-6 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
          {SCORE_KEYS.map((key) => (
            <li key={key} className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">{MATURITY_SLIDER_LABELS[key].title}</span>
              <span
                className={`font-semibold tabular-nums ${
                  scores[key] < 2.5 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"
                }`}
              >
                {scores[key].toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Roadmap Timeline
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
            {diagnostic.timeline_label ?? "6-Month ATO Install"}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Based on &apos;{diagnostic.current_maturity ?? "Emerging"}&apos; maturity.
          </p>
        </div>
      </aside>
    </div>
  );
}
