export interface RiskInventoryRead {
  id: string;
  label: string;
  criteria: string;
  requirements: string[];
}

export interface GuardrailRead {
  id: string;
  name: string;
  is_active: string | boolean; // DB might return True/False or boolean
  config: Record<string, any>;
}

export interface GovernanceAlertRead {
  id: string;
  model_id: string;
  severity: string; // Low, Medium, High, Critical
  message: string;
  is_addressed: boolean;
  created_at: string;
}
