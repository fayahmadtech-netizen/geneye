import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship

class GovernanceAlert(SQLModel, table=True):
    __tablename__ = "governance_alerts"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    model_id: uuid.UUID = Field(foreign_key="ml_models.id", index=True)
    severity: str # Low, Medium, High, Critical
    message: str
    is_addressed: bool = Field(default=False)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ApprovalWorkflow(SQLModel, table=True):
    __tablename__ = "approval_workflows"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str # e.g., "P1 Risk Deployment"
    target_type: str # "model", "use_case"
    
    steps: List["ApprovalStepConfig"] = Relationship(back_populates="workflow")

class ApprovalStepConfig(SQLModel, table=True):
    __tablename__ = "approval_step_configs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    workflow_id: uuid.UUID = Field(foreign_key="approval_workflows.id")
    
    step_name: str
    required_role_id: uuid.UUID = Field(foreign_key="roles.id")
    order: int
    
    workflow: ApprovalWorkflow = Relationship(back_populates="steps")

class ModelCard(SQLModel, table=True):
    __tablename__ = "model_cards"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    model_id: uuid.UUID = Field(foreign_key="ml_models.id", index=True)
    
    limitations: Optional[str] = None
    bias_mitigation: Optional[str] = None
    intended_use: Optional[str] = None
    training_data_summary: Optional[str] = None
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class RiskTierDefinition(SQLModel, table=True):
    __tablename__ = "risk_tier_definitions"
    id: str = Field(primary_key=True) # P1, P2, P3
    label: str
    criteria: str
    requirements: List[str] = Field(default=[], sa_column=Column(JSON))

class AiGuardrail(SQLModel, table=True):
    __tablename__ = "ai_guardrails"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str # e.g., "PII Filter", "Toxicity Blocker"
    is_active: bool = Field(default=True)
    config: dict = Field(default={}, sa_column=Column(JSON))

class RedTeamFinding(SQLModel, table=True):
    __tablename__ = "red_team_findings"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    title: str
    severity: str # Low, Med, High
    status: str # Open, Patched, Risk Accepted
    details: str
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ComplianceFramework(SQLModel, table=True):
    __tablename__ = "compliance_frameworks"
    id: str = Field(primary_key=True) # ISO42001, EUAIAct
    name: str
    version: str
    controls_count: int = 0

# --- Schemas ---

class ModelCardRead(SQLModel):
    id: uuid.UUID
    model_id: uuid.UUID
    limitations: Optional[str]
    bias_mitigation: Optional[str]
    intended_use: Optional[str]
    training_data_summary: Optional[str]
    updated_at: datetime

class RiskInventoryRead(SQLModel):
    id: str
    label: str
    criteria: str
    requirements: List[str]

class GuardrailRead(SQLModel):
    id: uuid.UUID
    name: str
    is_active: bool
    config: dict

class GovernanceAlertRead(SQLModel):
    id: uuid.UUID
    model_id: uuid.UUID
    severity: str
    message: str
    is_addressed: bool
    created_at: datetime
