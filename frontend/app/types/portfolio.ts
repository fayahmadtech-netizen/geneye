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

export interface UseCaseCreate {
  name: string;
  domain: string;
  description?: string;
  status?: string;
  risk_score: number;
  value_score: number;
}
