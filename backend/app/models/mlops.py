import uuid
from datetime import datetime
from typing import List, Optional, Dict
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship

class DataSource(SQLModel, table=True):
    __tablename__ = "data_sources"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str # e.g., "S3 Data Lake"
    type: str # S3, SQL, API
    path: str
    status: str # Connected, Error
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class StorageLayer(SQLModel, table=True):
    __tablename__ = "storage_layers"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str # e.g., "Feature Store"
    provider: str # Snowflake, Databricks, Redshift
    capacity_used_gb: float = 0.0

class PipelineRun(SQLModel, table=True):
    __tablename__ = "pipeline_runs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    pipeline_name: str
    status: str # Success, Failed, Running
    duration_sec: int = 0
    executed_by: uuid.UUID = Field(foreign_key="users.id")
    
    started_at: datetime = Field(default_factory=datetime.utcnow)

class MlModel(SQLModel, table=True):
    """Core Model Registry Table"""
    __tablename__ = "ml_models"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    name: str
    type: str # LLM, Classifier, Regression
    version: str # e.g., "v2.1"
    status: str # Champion, Challenger, Archive
    
    metrics: Dict = Field(default={}, sa_column=Column(JSON)) # accuracy, f1, etc.
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    experiments: List["TrainingExperiment"] = Relationship(back_populates="model")
    drifts: List["DriftEvent"] = Relationship(back_populates="model")

class TrainingExperiment(SQLModel, table=True):
    __tablename__ = "training_experiments"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    model_id: uuid.UUID = Field(foreign_key="ml_models.id", index=True)
    
    experiment_name: str
    accuracy: float
    parameters: Dict = Field(default={}, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    model: MlModel = Relationship(back_populates="experiments")

class DriftEvent(SQLModel, table=True):
    __tablename__ = "drift_events"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    model_id: uuid.UUID = Field(foreign_key="ml_models.id", index=True)
    
    drift_score: float
    feature_name: Optional[str] = None
    severity: str # Low, High
    
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    
    model: MlModel = Relationship(back_populates="drifts")

class MlGovernanceArea(SQLModel, table=True):
    __tablename__ = "ml_governance_areas"
    id: str = Field(primary_key=True) # Bias, Privacy, Robustness
    status: str # healthy, at-risk
    score: int = 100

class BusinessOutcomeMetric(SQLModel, table=True):
    __tablename__ = "business_outcome_metrics"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    label: str # e.g., "Uptime", "Prediction Accuracy"
    value: str # string display v5 e.g. "99.9%"
    trend: str # up, down, stable

# --- Schemas ---

class ExperimentRead(SQLModel):
    id: uuid.UUID
    experiment_name: str
    accuracy: float
    parameters: Dict
    created_at: datetime

class MlModelRead(SQLModel):
    id: uuid.UUID
    name: str
    type: str
    version: str
    status: str
    metrics: Dict
    created_at: datetime
    experiments: List[ExperimentRead] = []
