import uuid
from datetime import datetime
from typing import List, Optional, Dict
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship

class Agent(SQLModel, table=True):
    __tablename__ = "agents"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str
    role: str # e.g., "Digital SRE", "Risk Compliance Specialist"
    avatar_url: Optional[str] = None
    status: str = Field(default="Active") # Active, Paused, Training
    
    capabilities: List[str] = Field(default=[], sa_column=Column(JSON))
    config: Dict = Field(default={}, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    deployments: List["AgentDeployment"] = Relationship(back_populates="agent")

class AgentDeployment(SQLModel, table=True):
    __tablename__ = "agent_deployments"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    agent_id: uuid.UUID = Field(foreign_key="agents.id", index=True)
    
    environment: str # Production, Sandbox
    status: str
    last_active: datetime = Field(default_factory=datetime.utcnow)
    
    agent: Agent = Relationship(back_populates="deployments")

class AgentTool(SQLModel, table=True):
    __tablename__ = "agent_tools"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str # e.g., "Google Search", "Python Interpreter"
    description: str
    is_enabled: bool = Field(default=True)
    
    auth_config: Optional[str] = None # Encrypted token or secret ref

class DigitalWorker(SQLModel, table=True):
    __tablename__ = "digital_workers"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    persona_id: str # match J5e worker labels
    role_label: str # "Autonomous SRE", "Compliance Architect"
    efficiency_score: float = 0.0
    
    audit_entries: List["DigitalWorkerAuditEntry"] = Relationship(back_populates="worker")

class DigitalWorkerAuditEntry(SQLModel, table=True):
    __tablename__ = "digital_worker_audit_entries"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    worker_id: uuid.UUID = Field(foreign_key="digital_workers.id", index=True)
    
    action_taken: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    worker: DigitalWorker = Relationship(back_populates="audit_entries")

class MarketplaceAgent(SQLModel, table=True):
    __tablename__ = "marketplace_agents"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    
    name: str
    provider: str
    price_rating: str # $, $$, $$$
    description: str
    icon_url: Optional[str] = None

class LlmModel(SQLModel, table=True):
    __tablename__ = "llm_models"
    id: str = Field(primary_key=True) # e.g., "google/gemini-3"
    provider: str # Google, OpenAI, Anthropic
    capabilities: List[str] = Field(default=[], sa_column=Column(JSON))

# --- Schemas ---

class LlmModelRead(SQLModel):
    id: str
    provider: str

class DigitalWorkerRead(SQLModel):
    id: uuid.UUID
    persona_id: str
    role_label: str
    efficiency_score: float

class AgentToolRead(SQLModel):
    id: uuid.UUID
    name: str
    description: str
    is_enabled: bool
