# GenEye Modular Model Registry
# This file imports all modules so SQLModel can discover them for table creation and migrations.

from .identity import Organization, User, Role, PlatformModule, Integration, ActivityLog
from .maturity import MaturityDomain, MaturityCriteria, MaturityAssessment, MaturityScore
from .portfolio import UseCase, ModelDeployment, UseCaseFinancialSnapshot
from .value import PortfolioFinancialHistory, BuAdoptionSnapshot, StrategicObjective, AiHealthIndicator, QuarterlyMilestone
from .governance import GovernanceAlert, ApprovalWorkflow, ApprovalStepConfig, ModelCard, RiskTierDefinition, AiGuardrail, RedTeamFinding, ComplianceFramework
from .operations import Incident, ServiceHealth, OnCallEngineer, OnCallSchedule, EscalationChain, CommandCenterPage
from .agentic import Agent, AgentDeployment, AgentTool, DigitalWorker, DigitalWorkerAuditEntry, MarketplaceAgent, LlmModel
from .engineering import EngineeringSystem, SystemNode, SystemConnection, AdlcPipelineRun, SystemDeployment
from .mlops import DataSource, StorageLayer, PipelineRun, MlModel, TrainingExperiment, DriftEvent, MlGovernanceArea, BusinessOutcomeMetric
from .ato import AtoDiagnostic, AtoPhaseTemplate, AtoDimensionConfig, AtoTimelineConfig
from .industrial import FabSite, SiliconIpBlock, IpBlockItem, IpBlockMetric, FabMetricDaily, PhysicalAiOutcome
from .strategy import OrgBlueprint, BlueprintPrinciple, CouncilMember, BlueprintTask
from .chat import ChatSession, ChatMessage, ChatAttachment

# List for explicit export
__all__ = [
    "Organization", "User", "Role", "PlatformModule", "Integration", "ActivityLog",
    "MaturityDomain", "MaturityCriteria", "MaturityAssessment", "MaturityScore",
    "UseCase", "ModelDeployment", "UseCaseFinancialSnapshot",
    "PortfolioFinancialHistory", "BuAdoptionSnapshot", "StrategicObjective", "AiHealthIndicator", "QuarterlyMilestone",
    "GovernanceAlert", "ApprovalWorkflow", "ApprovalStepConfig", "ModelCard", "RiskTierDefinition", "AiGuardrail", "RedTeamFinding", "ComplianceFramework",
    "Incident", "ServiceHealth", "OnCallEngineer", "OnCallSchedule", "EscalationChain", "CommandCenterPage",
    "Agent", "AgentDeployment", "AgentTool", "DigitalWorker", "DigitalWorkerAuditEntry", "MarketplaceAgent", "LlmModel",
    "EngineeringSystem", "SystemNode", "SystemConnection", "AdlcPipelineRun", "SystemDeployment",
    "DataSource", "StorageLayer", "PipelineRun", "MlModel", "TrainingExperiment", "DriftEvent", "MlGovernanceArea", "BusinessOutcomeMetric",
    "AtoDiagnostic", "AtoPhaseTemplate", "AtoDimensionConfig", "AtoTimelineConfig",
    "FabSite", "SiliconIpBlock", "IpBlockItem", "IpBlockMetric", "FabMetricDaily", "PhysicalAiOutcome",
    "OrgBlueprint", "BlueprintPrinciple", "CouncilMember", "BlueprintTask",
    "ChatSession", "ChatMessage", "ChatAttachment"
]
