"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ClipboardList,
  FolderOpen,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { readinessService } from "../services/readinessService";
import type { DiagnosticFull, ReadinessConfig } from "../types/readiness";
import { getApiErrorMessage } from "../lib/apiError";

const TOTAL_STEPS = 5;

export function ReadinessDiagnosticClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get("id");

  const [config, setConfig] = useState<ReadinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticFull | null>(null);
  const [savedList, setSavedList] = useState<Awaited<
    ReturnType<typeof readinessService.listDiagnostics>
  > | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [saving, setSaving] = useState(false);

  const patchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const diagnosticRef = useRef<DiagnosticFull | null>(null);
  diagnosticRef.current = diagnostic;

  const flushPatch = useCallback(
    async (id: string, body: Parameters<typeof readinessService.patchDiagnostic>[1]) => {
      setSaving(true);
      try {
        const updated = await readinessService.patchDiagnostic(id, body);
        setDiagnostic(updated);
      } catch (e) {
        console.error(e);
        setError("Could not save changes. Try again.");
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const queuePatch = useCallback(
    (id: string, body: Parameters<typeof readinessService.patchDiagnostic>[1]) => {
      if (patchTimer.current) clearTimeout(patchTimer.current);
      patchTimer.current = setTimeout(() => {
        flushPatch(id, body);
      }, 450);
    },
    [flushPatch]
  );

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      setLoading(true);
      setError(null);
      try {
        const cfg = await readinessService.getConfig();
        if (cancelled) return;
        setConfig(cfg);

        if (idFromUrl) {
          if (diagnosticRef.current?.id === idFromUrl) {
            const list = await readinessService.listDiagnostics();
            if (!cancelled) setSavedList(list);
            setLoading(false);
            return;
          }
          const d = await readinessService.getDiagnostic(idFromUrl);
          if (cancelled) return;
          setDiagnostic(d);
          const list = await readinessService.listDiagnostics();
          if (!cancelled) setSavedList(list);
          setLoading(false);
          return;
        }

        const list = await readinessService.listDiagnostics();
        if (cancelled) return;
        setSavedList(list);

        if (list.length > 0) {
          router.replace(`/readiness?id=${list[0].id}`);
          return;
        }

        const created = await readinessService.createDiagnostic({ company_name: "" });
        if (cancelled) return;
        setDiagnostic(created);
        router.replace(`/readiness?id=${created.id}`);
        setLoading(false);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError(
            getApiErrorMessage(
              e,
              "Failed to load AI Readiness Diagnostic. If this persists, restart the API after database migrations."
            )
          );
          setLoading(false);
        }
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [idFromUrl, router]);

  const refreshSaved = async () => {
    const list = await readinessService.listDiagnostics();
    setSavedList(list);
  };

  const loadDiagnostic = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const d = await readinessService.getDiagnostic(id);
      setDiagnostic(d);
      router.replace(`/readiness?id=${id}`);
      setDrawerOpen(false);
    } catch (e) {
      console.error(e);
      setError("Could not load that diagnostic.");
    } finally {
      setLoading(false);
    }
  };

  const createNew = async () => {
    setLoading(true);
    try {
      const d = await readinessService.createDiagnostic({ company_name: "" });
      setDiagnostic(d);
      router.replace(`/readiness?id=${d.id}`);
      await refreshSaved();
      setDrawerOpen(false);
    } catch (e) {
      console.error(e);
      setError("Could not create a new diagnostic.");
    } finally {
      setLoading(false);
    }
  };

  const removeDiagnostic = async (id: string) => {
    if (!confirm("Delete this saved diagnostic?")) return;
    try {
      await readinessService.deleteDiagnostic(id);
      await refreshSaved();
      if (diagnostic?.id === id) {
        const list = await readinessService.listDiagnostics();
        if (list.length > 0) {
          await loadDiagnostic(list[0].id);
        } else {
          const d = await readinessService.createDiagnostic({ company_name: "" });
          setDiagnostic(d);
          router.replace(`/readiness?id=${d.id}`);
          await refreshSaved();
        }
      }
    } catch (e) {
      console.error(e);
      setError("Could not delete.");
    }
  };

  const updateField = <K extends keyof DiagnosticFull>(key: K, value: DiagnosticFull[K]) => {
    if (!diagnostic) return;
    setDiagnostic({ ...diagnostic, [key]: value });
    queuePatch(diagnostic.id, { [key]: value } as Record<string, unknown>);
  };

  const toggleStakeholder = (role: string) => {
    if (!diagnostic) return;
    const has = diagnostic.stakeholders.includes(role);
    const next = has
      ? diagnostic.stakeholders.filter((r) => r !== role)
      : [...diagnostic.stakeholders, role];
    setDiagnostic({ ...diagnostic, stakeholders: next });
    flushPatch(diagnostic.id, { stakeholders: next });
  };

  const addGoal = () => {
    if (!diagnostic || !goalInput.trim()) return;
    const next = [...diagnostic.strategic_ai_goals, goalInput.trim()];
    setGoalInput("");
    setDiagnostic({ ...diagnostic, strategic_ai_goals: next });
    flushPatch(diagnostic.id, { strategic_ai_goals: next });
  };

  const removeGoal = (idx: number) => {
    if (!diagnostic) return;
    const next = diagnostic.strategic_ai_goals.filter((_, i) => i !== idx);
    setDiagnostic({ ...diagnostic, strategic_ai_goals: next });
    flushPatch(diagnostic.id, { strategic_ai_goals: next });
  };

  const goNext = async () => {
    if (!diagnostic || !config) return;
    const step = diagnostic.current_step;
    if (step === 0) {
      const company = diagnostic.company_name.trim();
      if (!company) {
        setError("Company name is required.");
        return;
      }
      if (!diagnostic.industry) {
        setError("Industry is required.");
        return;
      }
      if (!diagnostic.current_maturity) {
        setError("Current AI maturity level is required.");
        return;
      }
      setError(null);
    }
    if (step >= TOTAL_STEPS - 1) return;
    const nextStep = step + 1;
    setDiagnostic({ ...diagnostic, current_step: nextStep });
    await flushPatch(diagnostic.id, { current_step: nextStep });
  };

  const goBack = async () => {
    if (!diagnostic) return;
    if (diagnostic.current_step <= 0) return;
    const prev = diagnostic.current_step - 1;
    setDiagnostic({ ...diagnostic, current_step: prev });
    await flushPatch(diagnostic.id, { current_step: prev });
  };

  if (loading && !diagnostic) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error && !diagnostic) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!config || !diagnostic) {
    return null;
  }

  const step = diagnostic.current_step;
  const steps = config.steps;

  return (
    <div className="relative mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Readiness Diagnostic</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enterprise AI readiness & operating model — data is saved to your organization via the API.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDrawerOpen(true);
            refreshSaved();
          }}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          <FolderOpen className="h-4 w-4" />
          Saved Diagnostics
          {savedList && savedList.length > 0 && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">{savedList.length}</span>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {error}
        </div>
      )}

      {/* Stepper */}
      <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 dark:border-gray-800">
        {steps.map((s, i) => {
          const active = i === step;
          return (
            <div
              key={s.key}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-sky-50 text-sky-800 ring-1 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-900"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <ClipboardList className="h-4 w-4 shrink-0" />
              <span>{s.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Content card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {step === 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Executive Intake</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Core enterprise context &amp; strategic priorities.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Company information</p>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={diagnostic.company_name}
                    onChange={(e) => updateField("company_name", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Number of Business Units</span>
                  <input
                    type="text"
                    value={diagnostic.num_bus ?? ""}
                    onChange={(e) => updateField("num_bus", e.target.value || null)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    placeholder="e.g. 5"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current AI Maturity Level <span className="text-red-500">*</span>
                  </span>
                  <select
                    value={diagnostic.current_maturity ?? ""}
                    onChange={(e) => updateField("current_maturity", e.target.value || null)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  >
                    <option value="">Select maturity level</option>
                    {config.maturity_levels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current AI Org Structure</span>
                  <input
                    type="text"
                    value={diagnostic.ai_org_structure ?? ""}
                    onChange={(e) => updateField("ai_org_structure", e.target.value || null)}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                    placeholder="e.g. Centralized CoE, Federated, Hybrid"
                  />
                </label>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Stakeholder roles</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">From API config — tap to toggle.</p>
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
                              ? "border-sky-400 bg-sky-50 text-sky-900 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-100"
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Strategic AI goals</p>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
                      className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                      placeholder="e.g. Reduce cycle time by 20%"
                    />
                    <button
                      type="button"
                      onClick={addGoal}
                      className="inline-flex shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
                            className="rounded p-0.5 hover:bg-white/20"
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
        )}

        {step > 0 && (
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Step {step + 1} — {steps[step]?.label ?? "Next"}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              This step will be wired to maturity scoring, prioritization, and blueprint APIs next. Your place in the
              wizard is saved (current_step = {diagnostic.current_step}).
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row dark:border-gray-800">
        <button
          type="button"
          onClick={goBack}
          disabled={step <= 0}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Step {step + 1} of {TOTAL_STEPS}
          {saving && <span className="ml-2 text-blue-600 dark:text-blue-400">Saving…</span>}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={step >= TOTAL_STEPS - 1}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-40"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 p-4" role="dialog">
          <div className="flex h-full w-full max-w-md flex-col rounded-xl bg-white shadow-xl dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">Saved Diagnostics</h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-800">
              <button
                type="button"
                onClick={createNew}
                className="w-full rounded-lg border border-dashed border-blue-400 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/40"
              >
                + New diagnostic
              </button>
            </div>
            <ul className="flex-1 overflow-y-auto p-2">
              {(savedList ?? []).map((item) => (
                <li
                  key={item.id}
                  className={`mb-2 rounded-lg border p-3 text-left text-sm ${
                    item.id === diagnostic.id
                      ? "border-blue-400 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => loadDiagnostic(item.id)}
                    className="w-full text-left font-medium text-gray-900 dark:text-white"
                  >
                    {item.company_name || "Untitled"}
                  </button>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.industry ?? "—"} · {item.current_maturity ?? "—"} · Step {item.current_step + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeDiagnostic(item.id)}
                    className="mt-2 text-xs text-red-600 hover:underline dark:text-red-400"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {savedList && savedList.length === 0 && (
                <li className="p-4 text-center text-sm text-gray-500">No saved diagnostics yet.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
