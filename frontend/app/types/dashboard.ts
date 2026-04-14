/** Matches `GET /portfolio/analytics/summary` quadrant entries: x = risk_score, y = value_score. */
export interface QuadrantPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  status: string;
}

export interface PortfolioSummary {
  total_active_use_cases: number;
  total_realized_value_k: number;
  total_projected_value_k: number;
  average_roi_pct: number;
  quadrant_data: QuadrantPoint[];
}

export interface DomainScore {
  domain_id: string;
  label: string;
  score: number;
}

export interface MaturitySummary {
  organization_id: string;
  overall_score: number;
  level: string;
  domain_scores: DomainScore[];
}

export interface GovernanceAlert {
  id: string;
  model_id: string;
  severity: string;
  message: string;
  is_addressed: boolean;
  created_at: string;
}

export interface Guardrail {
  id: string;
  name: string;
  is_active: boolean;
  config: Record<string, unknown>;
}

/** Matches `GET /portfolio/use-cases` items (fields used on the dashboard). */
export interface UseCaseListItem {
  id: string;
  status: string;
  risk_score: number;
}

export interface DashboardMetrics {
  portfolio: PortfolioSummary;
  maturity: MaturitySummary;
  useCases: UseCaseListItem[];
  governanceAlerts: GovernanceAlert[];
  guardrails: Guardrail[];
}
