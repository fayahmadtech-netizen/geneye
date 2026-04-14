import { DomainScore, PortfolioSummary, QuadrantPoint, UseCaseListItem } from "../types/dashboard";

/**
 * Maps backend maturity domains (5 axes) to the six strategic radar dimensions
 * shown on the AI Transformation Control Plane (Lovable reference).
 */
export function mapMaturityToSixAxisRadar(domainScores: DomainScore[]) {
  const scoreById = Object.fromEntries(domainScores.map((d) => [d.domain_id, d.score]));
  const pick = (id: string, fallback: number) =>
    typeof scoreById[id] === "number" ? scoreById[id] : fallback;

  const strategy = pick("strategy", 2.5);
  const data = pick("data", 2.5);
  const tech = pick("technology", 2.5);
  const ops = pick("operations", 2.5);
  const people = pick("people", 2.5);
  const fallback =
    domainScores.length > 0
      ? domainScores.reduce((s, d) => s + d.score, 0) / domainScores.length
      : 2.5;
  const capital = Math.min(5, (strategy + ops) / 2 || fallback);

  return [
    { subject: "Org Model", A: strategy },
    { subject: "Capital", A: capital },
    { subject: "Adoption", A: people },
    { subject: "Portfolio", A: ops },
    { subject: "Governance", A: data },
    { subject: "AI & Data Platform", A: tech },
  ];
}

export function valueMultiplier(realizedK: number, projectedK: number) {
  if (realizedK <= 0) return null;
  return projectedK / realizedK;
}

/** Values from API are in thousands of dollars (K). */
export function formatProjectedFromK(kThousands: number) {
  if (kThousands >= 1000) return `$${(kThousands / 1000).toFixed(1)}M`;
  return `$${kThousands.toLocaleString()}K`;
}

/** Counts use cases by backend status values. */
export function pipelineCounts(useCases: UseCaseListItem[]) {
  const scaled = useCases.filter(
    (u) => u.status === "Production" || u.status === "Scaling"
  ).length;
  const pilot = useCases.filter((u) => u.status === "Pilot").length;
  const idea = useCases.filter((u) => u.status === "Intake").length;
  return { scaled, pilot, idea };
}

/** x = risk, y = value (matches portfolio analytics summary). */
export function deriveStrategicPosture(portfolio: PortfolioSummary) {
  const pts = portfolio.quadrant_data;
  if (!pts.length) return null;

  const avgValueScore = Math.round(pts.reduce((s, p) => s + p.y, 0) / pts.length);
  const highRisk = pts.filter((p) => p.x >= 70).length;
  const highRiskTier3Pct = Math.round((highRisk / pts.length) * 100);
  const atScale = pts.filter((p) => p.status === "Production" || p.status === "Scaling").length;
  const scaleConversionPct = Math.round((atScale / pts.length) * 100);

  const avgRisk = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const avgVal = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  let category = "—";
  if (avgVal >= 50 && avgRisk >= 50) category = "High Value / High Risk";
  else if (avgVal >= 50 && avgRisk < 50) category = "High Value / Low Risk";
  else if (avgVal < 50 && avgRisk >= 50) category = "Lower Value / High Risk";
  else category = "Lower Value / Lower Risk";

  return {
    avgValueScore,
    highRiskTier3Pct,
    scaleConversionPct,
    category,
  };
}

export function riskValueCategoryFromQuadrant(pts: QuadrantPoint[]): string {
  if (!pts.length) return "—";
  const avgRisk = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const avgVal = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  if (avgVal >= 50 && avgRisk >= 50) return "High Value / High Risk";
  if (avgVal >= 50 && avgRisk < 50) return "High Value / Low Risk";
  if (avgVal < 50 && avgRisk >= 50) return "Lower Value / High Risk";
  return "Lower Value / Lower Risk";
}

export function guardrailCoveragePct(guardrails: { is_active: boolean }[]) {
  if (!guardrails.length) return null;
  const active = guardrails.filter((g) => g.is_active).length;
  return Math.round((active / guardrails.length) * 100);
}
