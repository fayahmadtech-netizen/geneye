import { apiClient } from "./apiLayer";
import { FabSite, SiliconIpBlock, PhysicalAiOutcome } from "../types/industrial";

export const industrialService = {
  getSites: async (): Promise<FabSite[]> => {
    const response = await apiClient.get<FabSite[]>("/industrial/sites");
    return response.data;
  },

  getIpBlocks: async (): Promise<SiliconIpBlock[]> => {
    const response = await apiClient.get<SiliconIpBlock[]>("/industrial/ip-blocks");
    return response.data;
  },

  getOutcomes: async (): Promise<PhysicalAiOutcome[]> => {
    const response = await apiClient.get<PhysicalAiOutcome[]>("/industrial/outcomes");
    return response.data;
  }
};
