import uuid
from datetime import datetime
from typing import List, Optional, Dict
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship

class EngineeringSystem(SQLModel, table=True):
    __tablename__ = "engineering_systems"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str # e.g., "Autonomous Data Core"
    description: Optional[str] = None
    
    # Store complete React Flow graph state
    nodes: List[Dict] = Field(default=[], sa_column=Column(JSON))
    edges: List[Dict] = Field(default=[], sa_column=Column(JSON))
    viewport: Dict = Field(default={"x": 0, "y": 0, "zoom": 1}, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    runs: List["AdlcPipelineRun"] = Relationship(back_populates="system")

class SystemNode(SQLModel, table=True):
    """Normalized storage of canvas nodes for querying/analytics"""
    __tablename__ = "system_nodes"
    id: str = Field(primary_key=True) # node uuid from canvas
    system_id: uuid.UUID = Field(foreign_key="engineering_systems.id", index=True)
    
    type: str # ai-model, data-source, tool, gate
    label: str
    status: str # healthy, error, idle
    
    config: Dict = Field(default={}, sa_column=Column(JSON))

class SystemConnection(SQLModel, table=True):
    """Normalized storage of canvas edges"""
    __tablename__ = "system_connections"
    id: str = Field(primary_key=True) # edge uuid from canvas
    system_id: uuid.UUID = Field(foreign_key="engineering_systems.id", index=True)
    
    from_node: str # system_nodes.id
    to_node: str # system_nodes.id
    
    label: Optional[str] = None

class AdlcPipelineRun(SQLModel, table=True):
    __tablename__ = "adlc_pipeline_runs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    system_id: uuid.UUID = Field(foreign_key="engineering_systems.id", index=True)
    
    status: str # Running, Completed, Failed
    current_stage: str # Design, Build, Test, Release
    progress: int = 0 # 0-100
    
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    system: EngineeringSystem = Relationship(back_populates="runs")

class SystemDeployment(SQLModel, table=True):
    __tablename__ = "system_deployments"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    system_id: uuid.UUID = Field(foreign_key="engineering_systems.id", index=True)
    
    environment: str # Production, Sandbox
    version: str # e.g., "v1.4.2"
    health_score: int = 100
    
    deployed_at: datetime = Field(default_factory=datetime.utcnow)

# --- Schemas ---

class SystemNodeRead(SQLModel):
    id: str
    type: str
    label: str
    status: str
    config: Dict

class SystemConnectionRead(SQLModel):
    id: str
    from_node: str
    to_node: str
    label: Optional[str]

class AdlcPipelineRunRead(SQLModel):
    id: uuid.UUID
    status: str
    current_stage: str
    progress: int
    started_at: datetime
    completed_at: Optional[datetime]

class EngineeringSystemRead(SQLModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    nodes: List[Dict]
    edges: List[Dict]
    viewport: Dict
    created_at: datetime
    updated_at: datetime

class EngineeringSystemUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[Dict]] = None
    edges: Optional[List[Dict]] = None
    viewport: Optional[Dict] = None
