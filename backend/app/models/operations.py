import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class Incident(SQLModel, table=True):
    __tablename__ = "incidents"
    id: str = Field(primary_key=True) # e.g., "INC-4821"
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    title: str
    severity: str # P1, P2, P3
    status: str # Investigating, Identified, Monitoring, Resolved
    team: str # e.g., "Model Ops", "Infra"
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class ServiceHealth(SQLModel, table=True):
    __tablename__ = "service_health"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    service_name: str # e.g., "Inference API", "Training Cluster"
    status: str # healthy, degraded, down
    latency_ms: int
    error_rate: float
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OnCallEngineer(SQLModel, table=True):
    __tablename__ = "on_call_engineers"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    
    is_primary: bool = Field(default=True)
    level: int = 1 # Escalation level

class OnCallSchedule(SQLModel, table=True):
    __tablename__ = "on_call_schedules"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    start_time: datetime
    end_time: datetime
    engineer_id: uuid.UUID = Field(foreign_key="on_call_engineers.id")

class EscalationChain(SQLModel, table=True):
    __tablename__ = "escalation_chains"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    service_name: str
    steps_json: str # List of engineer IDs and timeouts

class CommandCenterPage(SQLModel, table=True):
    __tablename__ = "pages"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    
    is_active: bool = Field(default=True)
    last_paged_at: Optional[datetime] = None
