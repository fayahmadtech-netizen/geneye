import { apiClient } from "./apiLayer";
import { EngineeringSystem, AdlcPipelineRun } from "../types/engineering";

export const engineeringService = {
  getSystems: async (): Promise<EngineeringSystem[]> => {
    const response = await apiClient.get<EngineeringSystem[]>("/engineering/systems");
    return response.data;
  },

  getSystem: async (id: string): Promise<EngineeringSystem> => {
    const response = await apiClient.get<EngineeringSystem>(`/engineering/systems/${id}`);
    return response.data;
  },

  updateSystem: async (id: string, updateData: Partial<EngineeringSystem>): Promise<EngineeringSystem> => {
    const response = await apiClient.put<EngineeringSystem>(`/engineering/systems/${id}`, updateData);
    return response.data;
  },

  getPipelineRuns: async (systemId: string): Promise<AdlcPipelineRun[]> => {
    const response = await apiClient.get<AdlcPipelineRun[]>(`/engineering/systems/${systemId}/runs`);
    return response.data;
  }
};
