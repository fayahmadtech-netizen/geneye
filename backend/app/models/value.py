import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class PortfolioFinancialHistory(SQLModel, table=True):
    __tablename__ = "portfolio_financial_history"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    quarter: str # Q1 2024
    year: int
    quarter_num: int
    
    investment_m: float
    realized_m: Optional[float] = None
    projected_m: float
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BuAdoptionSnapshot(SQLModel, table=True):
    __tablename__ = "bu_adoption_snapshots"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    snapshot_quarter: str
    business_unit: str
    
    adoption_rate: int # 0-100
    ai_spend_k: float
    utilization: int # 0-100
    efficiency: str # High, Medium, Low
    trend: str # up, stable, down
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class StrategicObjective(SQLModel, table=True):
    __tablename__ = "strategic_objectives"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    objective: str
    ai_contribution: int # 0-100
    status: str # On Track, At Risk, Ahead
    owner: str
    display_order: int = 0
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AiHealthIndicator(SQLModel, table=True):
    __tablename__ = "ai_health_indicators"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    label: str # Portfolio Health, Compliance, etc.
    value: int # 0-100
    status: str # good, warn, critical
    display_order: int = 0
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class QuarterlyMilestone(SQLModel, table=True):
    __tablename__ = "quarterly_milestones"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    quarter: str
    target_m: float
    forecast_m: Optional[float] = None
    gap: Optional[str] = None
    status: str # On Track, At Risk, Ahead
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
