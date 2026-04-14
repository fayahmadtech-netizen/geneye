import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class MaturityDomain(SQLModel, table=True):
    __tablename__ = "maturity_domains"
    id: str = Field(primary_key=True) # strategy, technology, data, etc.
    label: str
    description: str
    
    criteria: List["MaturityCriteria"] = Relationship(back_populates="domain")

class MaturityCriteria(SQLModel, table=True):
    __tablename__ = "maturity_criteria"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    domain_id: str = Field(foreign_key="maturity_domains.id")
    label: str
    description: str
    weight: float = 1.0
    
    domain: MaturityDomain = Relationship(back_populates="criteria")
    scores: List["MaturityScore"] = Relationship(back_populates="criteria")

class MaturityAssessment(SQLModel, table=True):
    __tablename__ = "maturity_assessments"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    title: str
    conducted_by: uuid.UUID = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    scores: List["MaturityScore"] = Relationship(back_populates="assessment")

class MaturityScore(SQLModel, table=True):
    __tablename__ = "maturity_scores"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    assessment_id: uuid.UUID = Field(foreign_key="maturity_assessments.id", index=True)
    criteria_id: uuid.UUID = Field(foreign_key="maturity_criteria.id")
    score: int # 1-5
    notes: Optional[str] = None
    
    assessment: MaturityAssessment = Relationship(back_populates="scores")
    criteria: MaturityCriteria = Relationship(back_populates="scores")

# --- Schemas ---

class MaturityCriteriaRead(SQLModel):
    id: uuid.UUID
    label: str
    description: str
    weight: float

class MaturityDomainRead(SQLModel):
    id: str
    label: str
    description: str
    criteria: List[MaturityCriteriaRead] = []

class MaturityScoreCreate(SQLModel):
    criteria_id: uuid.UUID
    score: int # 1-5
    notes: Optional[str] = None

class AssessmentCreate(SQLModel):
    title: str
    scores: List[MaturityScoreCreate]

class DomainScore(SQLModel):
    domain_id: str
    label: str
    score: float

class MaturitySummary(SQLModel):
    """Aggregated maturity view aligned with the dashboard and maturity UI."""

    organization_id: uuid.UUID
    overall_score: float
    level: str
    domain_scores: List[DomainScore]
    assessment_id: Optional[uuid.UUID] = None
