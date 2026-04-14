export interface MaturityCriterion {
  id: string;
  label: string;
  description: string;
  weight: number;
}

export interface MaturityDomain {
  id: string;
  label: string;
  description: string;
  criteria: MaturityCriterion[];
}

export interface ScoreInput {
  criterion_id: string;
  score: number; // 1-5
}

export interface AssessmentCreate {
  scores: ScoreInput[];
}
