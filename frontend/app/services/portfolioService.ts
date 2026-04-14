import { apiClient } from "./apiLayer";
import { UseCase, UseCaseCreate } from "../types/portfolio";

export const portfolioService = {
  getUseCases: async (): Promise<UseCase[]> => {
    const response = await apiClient.get<UseCase[]>("/portfolio/use-cases");
    return response.data;
  },

  createUseCase: async (data: UseCaseCreate): Promise<UseCase> => {
    const response = await apiClient.post<UseCase>("/portfolio/use-cases", data);
    return response.data;
  }
};
