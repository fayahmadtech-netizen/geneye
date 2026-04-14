import uuid
from datetime import datetime, date
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class UseCase(SQLModel, table=True):
    __tablename__ = "use_cases"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str
    business_unit: str
    owner: str
    status: str = Field(default="Intake") # Intake, Pilot, Production, Scaling
    
    # Strategic Metrics
    priority_score: int = Field(default=0)
    risk_score: int = Field(default=0)
    value_score: int = Field(default=0)
    
    # Textual Meta
    business_objective: Optional[str] = None
    estimated_roi: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    deployments: List["ModelDeployment"] = Relationship(back_populates="use_case")
    financial_snapshots: List["UseCaseFinancialSnapshot"] = Relationship(back_populates="use_case")

class ModelDeployment(SQLModel, table=True):
    __tablename__ = "model_deployments"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    use_case_id: uuid.UUID = Field(foreign_key="use_cases.id", index=True)
    
    model_name: str
    version: str
    environment: str # Prod, Staging, Pilot
    status: str = Field(default="Healthy")
    last_audit: Optional[date] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    use_case: UseCase = Relationship(back_populates="deployments")

class UseCaseFinancialSnapshot(SQLModel, table=True):
    __tablename__ = "use_case_financial_snapshots"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    use_case_id: uuid.UUID = Field(foreign_key="use_cases.id", index=True)
    
    snapshot_quarter: str # e.g., "Q1 2025"
    realized_value_k: float = 0.0
    projected_value_k: float = 0.0
    roi_pct: Optional[float] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    use_case: UseCase = Relationship(back_populates="financial_snapshots")

# --- Schemas ---

class UseCaseFinancialRead(SQLModel):
    snapshot_quarter: str
    realized_value_k: float
    projected_value_k: float
    roi_pct: Optional[float]

class UseCaseRead(SQLModel):
    id: uuid.UUID
    name: str
    business_unit: str
    owner: str
    status: str
    priority_score: int
    risk_score: int
    value_score: int
    business_objective: Optional[str]
    estimated_roi: Optional[str]
    created_at: datetime
    financial_snapshots: List[UseCaseFinancialRead] = []

class UseCaseCreate(SQLModel):
    name: str
    business_unit: str
    owner: str
    status: str = "Intake"
    business_objective: Optional[str] = None
    estimated_roi: Optional[str] = None
    value_score: int = 0
    risk_score: int = 0

class QuadrantPoint(SQLModel):
    id: str
    name: str
    x: int
    y: int
    status: str

class PortfolioSummary(SQLModel):
    total_active_use_cases: int
    total_realized_value_k: float
    total_projected_value_k: float
    average_roi_pct: float
    quadrant_data: List[QuadrantPoint]
