import { apiClient } from "./apiLayer";
import { MlModel, PipelinesResponse } from "../types/mlops";

export const mlopsService = {
  getModels: async (): Promise<MlModel[]> => {
    const response = await apiClient.get<MlModel[]>("/mlops/models");
    return response.data;
  },

  getPipelines: async (): Promise<PipelinesResponse> => {
    const response = await apiClient.get<PipelinesResponse>("/mlops/pipelines");
    return response.data;
  }
};
