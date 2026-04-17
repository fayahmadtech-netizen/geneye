import type { DiagnosticFull } from "../types/readiness";

/** Safe file stem + ISO date prefix for all export formats. */
export function readinessExportBaseName(diagnostic: DiagnosticFull): { stem: string; stamp: string } {
  const stem = (diagnostic.company_name || "diagnostic")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);
  const stamp = new Date().toISOString().slice(0, 10);
  return { stem: stem || "export", stamp };
}
import {
  averageScore,
  computeValueRisk,
  normalizeScores,
  quadrantCategory,
  quadrantDescription,
  SCORE_KEYS,
} from "./readinessLogic";
import { ATO_ROADMAP_PHASES, RECOMMENDED_NEXT_STEPS } from "./roadmapData";

export function buildReadinessExportPayload(diagnostic: DiagnosticFull) {
  const scores = normalizeScores(diagnostic.scores as Record<string, unknown>);
  const { valueScore, riskScore } = computeValueRisk(scores);
  const category = quadrantCategory(valueScore, riskScore);
  const avg = diagnostic.avg_score ?? averageScore(scores);

  const heatmap = SCORE_KEYS.map((key) => ({
    dimension: key === "integration" ? "AI & Data Platform" : key,
    score: scores[key],
  }));

  return {
    exported_at: new Date().toISOString(),
    report: "GenEye — AI Readiness Diagnostic — Executive Review",
    diagnostic_id: diagnostic.id,
    organization_id: diagnostic.organization_id,
    summary: {
      company_name: diagnostic.company_name,
      industry: diagnostic.industry,
      num_business_units: diagnostic.num_bus,
      current_maturity: diagnostic.current_maturity,
      ai_org_structure: diagnostic.ai_org_structure,
      stakeholders: diagnostic.stakeholders,
      strategic_ai_goals: diagnostic.strategic_ai_goals,
      avg_score: avg,
      roadmap_label: diagnostic.timeline_label,
      roadmap_months: diagnostic.timeline_months,
      current_step: diagnostic.current_step,
    },
    maturity_scores: scores,
    heatmap,
    enterprise_position: {
      value_score: valueScore,
      risk_score: riskScore,
      quadrant: category,
      description: quadrantDescription(category),
    },
    prioritization: diagnostic.prioritization,
    blueprint_summary: diagnostic.blueprint,
    roadmap_phases: ATO_ROADMAP_PHASES.map((p) => ({
      weeks: p.weekRange,
      engine: p.engine,
      title: p.title,
      deliverable_count: p.deliverableCount,
    })),
    recommended_next_steps: RECOMMENDED_NEXT_STEPS.map((s) => s.text),
  };
}

export function downloadReadinessExport(diagnostic: DiagnosticFull): void {
  const payload = buildReadinessExportPayload(diagnostic);
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const { stem, stamp } = readinessExportBaseName(diagnostic);
  a.href = url;
  a.download = `GenEye-Readiness-${stem}-${stamp}.json`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
