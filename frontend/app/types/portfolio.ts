/** API row shape from FastAPI `UseCaseRead` (snake_case). */
export interface UseCaseApiRow {
  id: string;
  name: string;
  business_unit: string;
  owner: string;
  status: string;
  priority_score: number;
  risk_score: number;
  value_score: number;
  business_objective?: string | null;
  estimated_roi?: string | null;
  created_at: string;
  financial_snapshots?: UseCaseFinancialSnapshot[];
}

export interface UseCaseFinancialSnapshot {
  snapshot_quarter: string;
  realized_value_k: number;
  projected_value_k: number;
  roi_pct?: number | null;
}

/** List / table shape used by the portfolio UI (domain = business_unit). */
export interface UseCase {
  id: string;
  name: string;
  domain: string; // e.g., Supply Chain, HR, R&D
  description?: string;
  status: string; // Intake, Pilot, Production, Deprecated
  risk_score: number;
  value_score: number;
  created_at: string;
  updated_at: string;
}

/** Detail page — mirrors `GET /portfolio/{id}` response. */
export type UseCaseDetail = UseCaseApiRow;

export interface UseCaseCreate {
  name: string;
  domain: string;
  description?: string;
  status?: string;
  risk_score: number;
  value_score: number;
}
