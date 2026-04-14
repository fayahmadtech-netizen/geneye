export interface SystemNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
}

export interface SystemConnection {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface EngineeringSystem {
  id: string;
  name: string;
  description?: string;
  status: string; // Active, Offline, Degraded
  nodes: SystemNode[];
  edges: SystemConnection[];
  organization_id: string;
}

export interface AdlcPipelineRun {
  id: string;
  pipeline_name: string;
  status: string; // Running, Success, Failed
  started_at: string;
  completed_at?: string;
  logs?: string;
}
