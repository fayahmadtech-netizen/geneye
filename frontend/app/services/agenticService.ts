import { apiClient } from "./apiLayer";
import { LlmModel, DigitalWorker, AgentTool } from "../types/agentic";

export const agenticService = {
  getModels: async (): Promise<LlmModel[]> => {
    const response = await apiClient.get<LlmModel[]>("/agentic/models");
    return response.data;
  },

  getWorkers: async (): Promise<DigitalWorker[]> => {
    const response = await apiClient.get<DigitalWorker[]>("/agentic/workers");
    return response.data;
  },

  getTools: async (): Promise<AgentTool[]> => {
    const response = await apiClient.get<AgentTool[]>("/agentic/tools");
    return response.data;
  }
};
