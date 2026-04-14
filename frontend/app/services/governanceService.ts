import { apiClient } from "./apiLayer";
import { RiskInventoryRead, GuardrailRead, GovernanceAlertRead } from "../types/governance";

export const governanceService = {
  getInventory: async (): Promise<RiskInventoryRead[]> => {
    const response = await apiClient.get<RiskInventoryRead[]>("/governance/inventory");
    return response.data;
  },

  getAlerts: async (): Promise<GovernanceAlertRead[]> => {
    const response = await apiClient.get<GovernanceAlertRead[]>("/governance/alerts");
    return response.data;
  },

  getGuardrails: async (): Promise<GuardrailRead[]> => {
    const response = await apiClient.get<GuardrailRead[]>("/governance/guardrails");
    return response.data;
  }
};
