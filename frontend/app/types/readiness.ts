export interface WizardStep {
  key: string;
  label: string;
  order: number;
}

export interface ReadinessConfig {
  steps: WizardStep[];
  industries: string[];
  maturity_levels: string[];
  stakeholder_roles: string[];
}

export interface DiagnosticListItem {
  id: string;
  company_name: string;
  industry: string | null;
  current_maturity: string | null;
  avg_score: number | null;
  current_step: number;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticFull {
  id: string;
  organization_id: string;
  created_by: string | null;
  company_name: string;
  industry: string | null;
  num_bus: string | null;
  stakeholders: string[];
  strategic_ai_goals: string[];
  current_maturity: string | null;
  ai_org_structure: string | null;
  current_step: number;
  scores: Record<string, number>;
  prioritization: Record<string, unknown>;
  blueprint: Record<string, unknown>[];
  timeline_label: string | null;
  timeline_months: number | null;
  avg_score: number | null;
  created_at: string;
  updated_at: string;
}

export type DiagnosticPatchBody = {
  company_name?: string;
  industry?: string;
  num_bus?: string;
  stakeholders?: string[];
  strategic_ai_goals?: string[];
  current_maturity?: string;
  ai_org_structure?: string;
  current_step?: number;
  scores?: Record<string, number>;
  prioritization?: Record<string, unknown>;
  blueprint?: Record<string, unknown>[];
  timeline_label?: string;
  timeline_months?: number;
  avg_score?: number;
};
