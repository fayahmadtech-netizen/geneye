import { apiClient } from "./apiLayer";
import {
  ReadinessConfig,
  DiagnosticFull,
  DiagnosticListItem,
  DiagnosticPatchBody,
} from "../types/readiness";

export const readinessService = {
  getConfig: async (): Promise<ReadinessConfig> => {
    const res = await apiClient.get<ReadinessConfig>("/readiness/config");
    return res.data;
  },

  listDiagnostics: async (): Promise<DiagnosticListItem[]> => {
    const res = await apiClient.get<DiagnosticListItem[]>("/readiness/diagnostics");
    return res.data;
  },

  createDiagnostic: async (body: { company_name?: string }): Promise<DiagnosticFull> => {
    const res = await apiClient.post<DiagnosticFull>("/readiness/diagnostics", body);
    return res.data;
  },

  getDiagnostic: async (id: string): Promise<DiagnosticFull> => {
    const res = await apiClient.get<DiagnosticFull>(`/readiness/diagnostics/${id}`);
    return res.data;
  },

  patchDiagnostic: async (id: string, body: DiagnosticPatchBody): Promise<DiagnosticFull> => {
    const res = await apiClient.patch<DiagnosticFull>(`/readiness/diagnostics/${id}`, body);
    return res.data;
  },

  deleteDiagnostic: async (id: string): Promise<void> => {
    await apiClient.delete(`/readiness/diagnostics/${id}`);
  },
};
