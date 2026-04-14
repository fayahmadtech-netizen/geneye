import { apiClient } from "./apiLayer";
import {
  PortfolioSummary,
  MaturitySummary,
  DashboardMetrics,
  GovernanceAlert,
  Guardrail,
  UseCaseListItem,
} from "../types/dashboard";

export const dashboardService = {
  getOverview: async (): Promise<DashboardMetrics> => {
    const [portfolioRes, maturityRes, useCasesRes, alertsRes, guardrailsRes] = await Promise.all([
      apiClient.get<PortfolioSummary>("/portfolio/analytics/summary"),
      apiClient.get<MaturitySummary>("/maturity/summary"),
      apiClient.get<UseCaseListItem[]>("/portfolio/use-cases"),
      apiClient.get<GovernanceAlert[]>("/governance/alerts"),
      apiClient.get<Guardrail[]>("/governance/guardrails"),
    ]);

    return {
      portfolio: portfolioRes.data,
      maturity: maturityRes.data,
      useCases: useCasesRes.data,
      governanceAlerts: alertsRes.data,
      guardrails: guardrailsRes.data,
    };
  },
};
