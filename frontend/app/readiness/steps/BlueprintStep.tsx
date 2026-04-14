import { Check } from "lucide-react";
import { ATO_ROADMAP_PHASES } from "../roadmapData";

const accentCard: Record<string, string> = {
  sky: "border-sky-200 bg-sky-50/60 dark:border-sky-900 dark:bg-sky-950/30",
  indigo: "border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30",
  emerald: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30",
  amber: "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30",
  violet: "border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/30",
};

const accentCheck: Record<string, string> = {
  sky: "text-sky-600 dark:text-sky-400",
  indigo: "text-indigo-600 dark:text-indigo-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  amber: "text-amber-600 dark:text-amber-400",
  violet: "text-violet-600 dark:text-violet-400",
};

export function BlueprintStep() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6-Month ATO Roadmap</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Modular install sequence derived from your diagnostic — phases align to governance, capital, and control
          engines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {ATO_ROADMAP_PHASES.map((phase) => (
          <div
            key={phase.weekRange + phase.engine}
            className={`rounded-2xl border p-5 shadow-sm ${accentCard[phase.accent]}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">
                {phase.weekRange}
              </span>
              <span className={`text-sm font-semibold ${accentCheck[phase.accent]}`}>{phase.engine}</span>
            </div>
            <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">{phase.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{phase.description}</p>
            <ul className="mt-4 space-y-2">
              {phase.tasks.map((t) => (
                <li key={t} className="flex gap-2 text-sm text-gray-800 dark:text-gray-200">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${accentCheck[phase.accent]}`} aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
