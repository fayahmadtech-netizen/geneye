import { Plus, X } from "lucide-react";
import type { DiagnosticFull, ReadinessConfig } from "../../types/readiness";
import { maturityRoadmapHint } from "../readinessLogic";

interface Props {
  diagnostic: DiagnosticFull;
  config: ReadinessConfig;
  goalInput: string;
  setGoalInput: (v: string) => void;
  updateField: <K extends keyof DiagnosticFull>(key: K, value: DiagnosticFull[K]) => void;
  toggleStakeholder: (role: string) => void;
  addGoal: () => void;
  removeGoal: (idx: number) => void;
}

export function ExecutiveIntakeStep({
  diagnostic,
  config,
  goalInput,
  setGoalInput,
  updateField,
  toggleStakeholder,
  addGoal,
  removeGoal,
}: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Executive Intake</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Core enterprise context &amp; strategic priorities.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Company information
          </p>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={diagnostic.company_name}
              onChange={(e) => updateField("company_name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              placeholder="Legal or brand name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Industry <span className="text-red-500">*</span>
            </span>
            <select
              value={diagnostic.industry ?? ""}
              onChange={(e) => updateField("industry", e.target.value || null)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="">Select industry</option>
              {config.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Business Units
            </span>
            <input
              type="text"
              value={diagnostic.num_bus ?? ""}
              onChange={(e) => updateField("num_bus", e.target.value || null)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              placeholder="e.g. 3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current AI Maturity Level <span className="text-red-500">*</span>
            </span>
            <select
              value={diagnostic.current_maturity ?? ""}
              onChange={(e) => updateField("current_maturity", e.target.value || null)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="">Select maturity level</option>
              {config.maturity_levels.map((m) => (
                <option key={m} value={m}>
                  {m === "Emerging"
                    ? "Emerging — 6-Month roadmap"
                    : m === "Ad-hoc"
                      ? "Ad-hoc — 12-Month stabilization"
                      : m === "Defined"
                        ? "Defined — 6-Month acceleration"
                        : m === "Managed"
                          ? "Managed — 90-Day optimization"
                          : m === "Optimized"
                            ? "Optimized — continuous improvement"
                            : m}
                </option>
              ))}
            </select>
          </label>
          {diagnostic.current_maturity ? (
            <p className="rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-2 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100">
              {maturityRoadmapHint(diagnostic.current_maturity)}
            </p>
          ) : null}
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current AI Org Structure
            </span>
            <input
              type="text"
              value={diagnostic.ai_org_structure ?? ""}
              onChange={(e) => updateField("ai_org_structure", e.target.value || null)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              placeholder="e.g. Centralized CoE, Federated, Hybrid"
            />
          </label>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Stakeholder roles
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Select every role engaged in this diagnostic.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {config.stakeholder_roles.map((role) => {
                const on = diagnostic.stakeholders.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleStakeholder(role)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      on
                        ? "border-blue-500 bg-blue-600 text-white shadow-sm dark:border-blue-400"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300"
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Strategic AI goals
            </p>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGoal();
                  }
                }}
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                placeholder="e.g. Reduce cycle time by 20%"
              />
              <button
                type="button"
                onClick={addGoal}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                aria-label="Add goal"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {diagnostic.strategic_ai_goals.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {diagnostic.strategic_ai_goals.map((g, idx) => (
                  <li
                    key={`${g}-${idx}`}
                    className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-100 dark:text-gray-900"
                  >
                    <span>{g}</span>
                    <button
                      type="button"
                      onClick={() => removeGoal(idx)}
                      className="rounded p-0.5 hover:bg-white/20 dark:hover:bg-black/10"
                      aria-label="Remove goal"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
