export interface TrainingExperiment {
  id: string;
  experiment_name: string;
  accuracy: number;
  parameters: Record<string, any>;
  created_at: string;
}

export interface MlModel {
  id: string;
  name: string;
  type: string;
  version: string;
  status: string; // Champion, Challenger, Archive
  metrics: Record<string, any>;
  created_at: string;
  experiments: TrainingExperiment[];
}

export interface PipelineRun {
  id: string;
  pipeline_name: string;
  status: string;
  duration_sec: number;
  started_at: string;
}

export interface PipelinesResponse {
  runs: PipelineRun[];
}
