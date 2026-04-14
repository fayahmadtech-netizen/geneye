import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field


class AtoDiagnostic(SQLModel, table=True):
    """Persisted AI Readiness / ATO diagnostic wizard (multi-step)."""

    __tablename__ = "ato_diagnostics"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    created_by: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")

    # Step 0 — Executive Intake
    company_name: str = ""
    industry: Optional[str] = None
    num_bus: Optional[str] = None
    stakeholders: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    strategic_ai_goals: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    current_maturity: Optional[str] = None
    ai_org_structure: Optional[str] = None

    current_step: int = 0  # 0..4

    # Later steps — maturity scoring, computed outputs
    scores: Dict[str, Any] = Field(
        default_factory=lambda: {
            "governance": 0.0,
            "capital": 0.0,
            "org": 0.0,
            "portfolio": 0.0,
            "adoption": 0.0,
            "integration": 0.0,
        },
        sa_column=Column(JSON),
    )
    prioritization: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    blueprint: List[dict] = Field(default_factory=list, sa_column=Column(JSON))
    timeline_label: Optional[str] = None
    timeline_months: Optional[int] = None
    avg_score: float = 0.0  # draft until scoring step; DB may be NOT NULL

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class AtoPhaseTemplate(SQLModel, table=True):
    __tablename__ = "ato_phase_templates"
    id: str = Field(primary_key=True)  # intake, assessment, audit, complete
    name: str
    description: Optional[str] = None
    default_duration_days: int = 7


class AtoDimensionConfig(SQLModel, table=True):
    __tablename__ = "ato_dimension_configs"
    id: str = Field(primary_key=True)  # security, privacy, robustness, ethics
    label: str
    weight: float = 1.0


class AtoTimelineConfig(SQLModel, table=True):
    __tablename__ = "ato_timeline_configs"
    id: str = Field(primary_key=True)  # pilot-phase, scaled-deployment
    label: str
    duration_weeks: int = 12
    milestones: List[str] = Field(default_factory=list, sa_column=Column(JSON))
