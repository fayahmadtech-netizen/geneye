import { apiClient } from "./apiLayer";
import {
  UseCase,
  UseCaseApiRow,
  UseCaseCreate,
  UseCaseDetail,
} from "../types/portfolio";

function mapRow(row: UseCaseApiRow): UseCase {
  return {
    id: String(row.id),
    name: row.name,
    domain: row.business_unit,
    description: row.business_objective ?? undefined,
    status: row.status,
    risk_score: row.risk_score,
    value_score: row.value_score,
    created_at: row.created_at,
    updated_at: row.created_at,
  };
}

export const portfolioService = {
  getUseCases: async (): Promise<UseCase[]> => {
    const response = await apiClient.get<UseCaseApiRow[]>("/portfolio/use-cases");
    return response.data.map(mapRow);
  },

  getUseCaseById: async (id: string): Promise<UseCaseDetail> => {
    const response = await apiClient.get<UseCaseDetail>(`/portfolio/${id}`);
    return response.data;
  },

  createUseCase: async (data: UseCaseCreate): Promise<UseCase> => {
    const payload = {
      name: data.name,
      business_unit: data.domain,
      owner: "Platform User",
      status: data.status ?? "Intake",
      business_objective: data.description ?? undefined,
      risk_score: data.risk_score,
      value_score: data.value_score,
    };
    const response = await apiClient.post<UseCaseApiRow>(
      "/portfolio/use-cases",
      payload
    );
    return mapRow(response.data);
  },
};
