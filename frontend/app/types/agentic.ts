export interface LlmModel {
  id: string;
  provider: string;
}

export interface DigitalWorker {
  id: string;
  persona_id: string;
  role_label: string;
  efficiency_score: number;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  is_enabled: boolean;
}
