/** Score keys persisted on `AtoDiagnostic.scores` (API / DB). */
export const SCORE_KEYS = [
  "governance",
  "capital",
  "org",
  "portfolio",
  "adoption",
  "integration",
] as const;

export type ScoreKey = (typeof SCORE_KEYS)[number];

export const MATURITY_SLIDER_LABELS: Record<ScoreKey, { title: string; hint: string }> = {
  governance: {
    title: "Governance & Risk Control",
    hint: "Policies, oversight, and risk classification.",
  },
  capital: {
    title: "Capital & Investment Discipline",
    hint: "ROI rigor, funding gates, and portfolio economics.",
  },
  org: {
    title: "Org & Operating Model",
    hint: "Roles, decision rights, and AI operating model.",
  },
  portfolio: {
    title: "Portfolio Visibility",
    hint: "Use-case inventory, prioritization, and tracking.",
  },
  adoption: {
    title: "Adoption & Change Management",
    hint: "Training, champions, and business uptake.",
  },
  integration: {
    title: "AI and Data Platform",
    hint: "Data, MLOps, integration, and production readiness.",
  },
};

export function defaultScores(): Record<ScoreKey, number> {
  return {
    governance: 0,
    capital: 0,
    org: 0,
    portfolio: 0,
    adoption: 0,
    integration: 0,
  };
}

export function normalizeScores(raw: Record<string, unknown> | undefined): Record<ScoreKey, number> {
  const d = defaultScores();
  if (!raw) return d;
  for (const k of SCORE_KEYS) {
    const v = raw[k];
    if (typeof v === "number" && !Number.isNaN(v)) d[k] = Math.min(5, Math.max(0, v));
  }
  return d;
}

export function averageScore(scores: Record<ScoreKey, number>): number {
  const vals = SCORE_KEYS.map((k) => scores[k]);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** Reference formulas: Value = avg(Adoption, Capital, Portfolio); Risk = avg(Governance, Integration, Org). */
export function computeValueRisk(scores: Record<ScoreKey, number>) {
  const valueScore =
    (scores.adoption + scores.capital + scores.portfolio) / 3;
  const riskScore =
    (scores.governance + scores.integration + scores.org) / 3;
  return {
    valueScore: Math.round(valueScore * 100) / 100,
    riskScore: Math.round(riskScore * 100) / 100,
  };
}

const MID = 2.5;

export function quadrantCategory(valueScore: number, riskScore: number): string {
  const hiV = valueScore >= MID;
  const hiR = riskScore >= MID;
  if (hiV && hiR) return "High Value / High Risk";
  if (hiV && !hiR) return "High Value / Low Risk";
  if (!hiV && hiR) return "Low Value / High Risk";
  return "Low Value / Low Risk";
}

export function quadrantDescription(category: string): string {
  switch (category) {
    case "Low Value / High Risk":
      return "Significant gaps across value and risk dimensions. Focus on foundational governance and capability building.";
    case "High Value / High Risk":
      return "Strong upside with elevated risk — tighten controls while scaling proven use cases.";
    case "High Value / Low Risk":
      return "Healthy posture for scaling — double down on portfolio execution and capital efficiency.";
    default:
      return "Continue strengthening adoption and platform depth while monitoring portfolio risk.";
  }
}

export function maturityRoadmapHint(level: string | null): string {
  if (!level) return "Select a maturity level to preview the ATO roadmap horizon.";
  const l = level.toLowerCase();
  if (l.includes("ad-hoc") || l === "ad-hoc")
    return "Based on 'Ad-hoc' maturity, a 12-Month stabilization roadmap will be generated.";
  if (l.includes("emerging"))
    return "Based on 'Emerging' maturity, a 6-Month ATO roadmap will be generated.";
  if (l.includes("defined"))
    return "Based on 'Defined' maturity, a 6-Month acceleration roadmap will be generated.";
  if (l.includes("managed"))
    return "Based on 'Managed' maturity, a 90-Day optimization wave will be generated.";
  if (l.includes("optimized"))
    return "Based on 'Optimized' maturity, focus on continuous improvement and innovation loops.";
  return `Based on '${level}' maturity, your roadmap timeline will align to diagnostic scoring.`;
}

export function timelineFromMaturity(level: string | null): {
  timeline_label: string;
  timeline_months: number;
} {
  if (!level) return { timeline_label: "6-Month ATO Install", timeline_months: 6 };
  const l = level.toLowerCase();
  if (l.includes("ad-hoc") || l === "ad-hoc")
    return { timeline_label: "12-Month Stabilization", timeline_months: 12 };
  if (l.includes("emerging"))
    return { timeline_label: "6-Month ATO Install", timeline_months: 6 };
  if (l.includes("defined"))
    return { timeline_label: "6-Month ATO Install", timeline_months: 6 };
  if (l.includes("managed"))
    return { timeline_label: "90-Day Optimization", timeline_months: 3 };
  if (l.includes("optimized"))
    return { timeline_label: "Continuous Improvement", timeline_months: 6 };
  return { timeline_label: "6-Month ATO Install", timeline_months: 6 };
}

export function scoreHeatClass(score: number): string {
  if (score < 1.5) return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200";
  if (score < 2.5) return "bg-orange-100 text-orange-900 dark:bg-orange-950/40 dark:text-orange-100";
  if (score < 3.5) return "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100";
  if (score < 4.5) return "bg-lime-100 text-lime-900 dark:bg-lime-950/30 dark:text-lime-100";
  return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100";
}
