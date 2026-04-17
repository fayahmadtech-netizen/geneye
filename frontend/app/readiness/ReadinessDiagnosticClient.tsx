"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ClipboardList,
  FileText,
  FolderOpen,
  Loader2,
  Target,
  X,
} from "lucide-react";
import { readinessService } from "../services/readinessService";
import type { DiagnosticFull, ReadinessConfig } from "../types/readiness";
import { getApiErrorMessage } from "../lib/apiError";
import {
  averageScore,
  computeValueRisk,
  defaultScores,
  normalizeScores,
  quadrantCategory,
  timelineFromMaturity,
  type ScoreKey,
} from "./readinessLogic";
import { ATO_ROADMAP_PHASES } from "./roadmapData";
import { downloadReadinessExport } from "./buildExportPayload";
import { downloadReadinessExportExcel, downloadReadinessExportPdf } from "./exportReadinessFiles";
import { registerReadinessExport, type ReadinessExportFormat } from "./readinessExportBus";
import { ExecutiveIntakeStep } from "./steps/ExecutiveIntakeStep";
import { MaturityScoringStep } from "./steps/MaturityScoringStep";
import { PrioritizationStep } from "./steps/PrioritizationStep";
import { BlueprintStep } from "./steps/BlueprintStep";
import { ExecutiveReviewStep } from "./steps/ExecutiveReviewStep";

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

  const patchScores = useCallback(
    (newScores: Record<ScoreKey, number>) => {
      if (!diagnostic) return;
      const avg = averageScore(newScores);
      setDiagnostic({
        ...diagnostic,
        scores: newScores as unknown as DiagnosticFull["scores"],
        avg_score: avg,
      });
      queuePatch(diagnostic.id, { scores: newScores as Record<string, number>, avg_score: avg });
    },
    [diagnostic, queuePatch]
  );

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
      const tl = timelineFromMaturity(diagnostic.current_maturity);
      const scores = normalizeScores(diagnostic.scores as Record<string, unknown>);
      const avg = averageScore(scores);
      const nextStep = 1;
      setDiagnostic({
        ...diagnostic,
        current_step: nextStep,
        timeline_label: tl.timeline_label,
        timeline_months: tl.timeline_months,
        avg_score: avg,
      });
      await flushPatch(diagnostic.id, {
        current_step: nextStep,
        timeline_label: tl.timeline_label,
        timeline_months: tl.timeline_months,
        avg_score: avg,
      });
      return;
    }
    if (step === 1) {
      const scores = normalizeScores(diagnostic.scores as Record<string, unknown>);
      const { valueScore, riskScore } = computeValueRisk(scores);
      const cat = quadrantCategory(valueScore, riskScore);
      const nextStep = 2;
      const prio = { value_score: valueScore, risk_score: riskScore, quadrant: cat };
      setDiagnostic({
        ...diagnostic,
        current_step: nextStep,
        avg_score: averageScore(scores),
        prioritization: prio as DiagnosticFull["prioritization"],
      });
      await flushPatch(diagnostic.id, {
        current_step: nextStep,
        avg_score: averageScore(scores),
        prioritization: prio,
      });
      return;
    }
    if (step === 2) {
      const nextStep = 3;
      const blueprintDefault =
        diagnostic.blueprint && diagnostic.blueprint.length > 0
          ? null
          : ATO_ROADMAP_PHASES.map((p) => ({
              week_range: p.weekRange,
              engine: p.engine,
              title: p.title,
              deliverable_count: p.deliverableCount,
            }));
      if (blueprintDefault) {
        setDiagnostic({
          ...diagnostic,
          current_step: nextStep,
          blueprint: blueprintDefault as DiagnosticFull["blueprint"],
        });
        await flushPatch(diagnostic.id, {
          current_step: nextStep,
          blueprint: blueprintDefault,
        });
      } else {
        setDiagnostic({ ...diagnostic, current_step: nextStep });
        await flushPatch(diagnostic.id, { current_step: nextStep });
      }
      return;
    }
    if (step === 3) {
      const nextStep = 4;
      setDiagnostic({ ...diagnostic, current_step: nextStep });
      await flushPatch(diagnostic.id, { current_step: nextStep });
      return;
    }
  };

  const startOver = async () => {
    if (!diagnostic) return;
    if (!confirm("Reset this diagnostic to step 1? Intake fields are kept; scores and roadmap data reset.")) return;
    const empty = defaultScores();
    const next = {
      ...diagnostic,
      current_step: 0,
      scores: empty as unknown as DiagnosticFull["scores"],
      prioritization: {} as DiagnosticFull["prioritization"],
      blueprint: [] as DiagnosticFull["blueprint"],
      avg_score: 0,
    };
    setDiagnostic(next);
    await flushPatch(diagnostic.id, {
      current_step: 0,
      scores: empty,
      prioritization: {},
      blueprint: [],
      avg_score: 0,
    });
  };

  const goBack = async () => {
    if (!diagnostic) return;
    if (diagnostic.current_step <= 0) return;
    const prev = diagnostic.current_step - 1;
    setDiagnostic({ ...diagnostic, current_step: prev });
    await flushPatch(diagnostic.id, { current_step: prev });
  };

  const saveReview = async () => {
    if (!diagnostic) return;
    setError(null);
    await flushPatch(diagnostic.id, {
      company_name: diagnostic.company_name,
      industry: diagnostic.industry ?? undefined,
      num_bus: diagnostic.num_bus ?? undefined,
      stakeholders: diagnostic.stakeholders,
      strategic_ai_goals: diagnostic.strategic_ai_goals,
      current_maturity: diagnostic.current_maturity ?? undefined,
      ai_org_structure: diagnostic.ai_org_structure ?? undefined,
      current_step: diagnostic.current_step,
      scores: diagnostic.scores as Record<string, number>,
      prioritization: diagnostic.prioritization as Record<string, unknown>,
      blueprint: diagnostic.blueprint as Record<string, unknown>[],
      timeline_label: diagnostic.timeline_label ?? undefined,
      timeline_months: diagnostic.timeline_months ?? undefined,
      avg_score: diagnostic.avg_score ?? undefined,
    });
  };

  const exportReview = (format: ReadinessExportFormat) => {
    if (!diagnostic) return;
    void (async () => {
      setError(null);
      try {
        if (format === "pdf") await downloadReadinessExportPdf(diagnostic);
        else if (format === "xlsx") await downloadReadinessExportExcel(diagnostic);
        else downloadReadinessExport(diagnostic);
      } catch (e) {
        console.error(e);
        setError("Could not export. Try again.");
      }
    })();
  };

  const diagnosticExportRef = useRef(diagnostic);
  diagnosticExportRef.current = diagnostic;

  useEffect(() => {
    return registerReadinessExport((format) => {
      const d = diagnosticExportRef.current;
      if (!d) return;
      void (async () => {
        setError(null);
        try {
          if (format === "pdf") await downloadReadinessExportPdf(d);
          else if (format === "xlsx") await downloadReadinessExportExcel(d);
          else downloadReadinessExport(d);
        } catch (e) {
          console.error(e);
          setError("Could not export. Try again.");
        }
      })();
    });
  }, []);

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

  const stepIcons = [ClipboardList, ClipboardList, Target, BookOpen, FileText] as const;

  return (
    <div className="relative mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            AI Readiness Diagnostic
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Progress auto-saves to your organization. Use the stepper to see where you are in the ATO journey.
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

      <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 dark:border-gray-800">
        {steps.map((s, i) => {
          const active = i === step;
          const done = i < step;
          const StepIcon = stepIcons[i] ?? ClipboardList;
          return (
            <div
              key={s.key}
              className={`flex min-w-[10rem] flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors sm:min-w-0 ${
                active
                  ? "bg-blue-50 text-blue-900 ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-100 dark:ring-blue-900"
                  : done
                    ? "bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100"
                    : "bg-gray-50 text-gray-500 dark:bg-gray-900/60 dark:text-gray-400"
              }`}
            >
              {done ? (
                <Check className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
              ) : (
                <StepIcon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              )}
              <span className="leading-snug">{s.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {step === 0 && (
          <ExecutiveIntakeStep
            diagnostic={diagnostic}
            config={config}
            goalInput={goalInput}
            setGoalInput={setGoalInput}
            updateField={updateField}
            toggleStakeholder={toggleStakeholder}
            addGoal={addGoal}
            removeGoal={removeGoal}
          />
        )}
        {step === 1 && (
          <MaturityScoringStep diagnostic={diagnostic} onScoresChange={patchScores} />
        )}
        {step === 2 && <PrioritizationStep diagnostic={diagnostic} />}
        {step === 3 && <BlueprintStep />}
        {step === 4 && (
          <ExecutiveReviewStep
            diagnostic={diagnostic}
            saving={saving}
            onSave={saveReview}
            onExport={exportReview}
            exportDisabled={saving}
          />
        )}
      </div>

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
        {step >= TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={startOver}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            Start Over
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
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
