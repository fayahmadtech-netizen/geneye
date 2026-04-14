import { apiClient } from "./apiLayer";
import { MaturityDomain, AssessmentCreate } from "../types/maturity";
import { MaturitySummary } from "../types/dashboard";

export const maturityService = {
  getDomains: async (): Promise<MaturityDomain[]> => {
    const response = await apiClient.get<MaturityDomain[]>("/maturity/domains");
    return response.data;
  },

  getSummary: async (): Promise<MaturitySummary> => {
    const response = await apiClient.get<MaturitySummary>("/maturity/summary");
    return response.data;
  },

  submitAssessment: async (data: AssessmentCreate): Promise<any> => {
    const response = await apiClient.post("/maturity/assessments", data);
    return response.data;
  }
};
