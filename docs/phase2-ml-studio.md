# GenEye — Phase 2: Route Specification — `/ml-studio`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `yAe` (page) · `hAe` (Data Plane) · `mAe` (ML Pipeline & MLOps) · `pAe` (Model Training & Deployment) · `gAe` (Monitoring & Feedback Loop) · `xAe` (Governance & Business Metrics)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/ml-studio`
**Page Title:** "ML Studio"
**Subtitle:** "Enterprise ML Deployment Platform — Data to Model to Business Outcome"

This is the **ML engineering and operations hub**. It tracks the full ML lifecycle: raw data sources → pipeline orchestration → model training & deployment → drift monitoring → governance & business outcomes. It shares the `i5` (model registry) entity with `/agentcore` and feeds business KPIs used in `/value`.

### Tabs (5)

| Tab ID | Label | Component | Description |
|---|---|---|---|
| `data` | Data Plane | `hAe` | Data sources, storage layers, feature pipelines |
| `pipeline` | ML Pipeline & MLOps | `mAe` | Pipeline runs, experiments, CI/CD |
| `models` | Model Training & Deployment | `pAe` | Model registry + training runs + deployment |
| `monitoring` | Monitoring & Feedback Loop | `gAe` | Drift detection, retraining triggers |
| `governance` | Governance & Business Metrics | `xAe` | ML governance policies + business KPIs |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `sAe[]` — Data Sources (8 sources)

```json
[
  { "id": "ds1", "name": "Claims Transaction DB",      "type": "Structured",   "subtype": "Internal",     "tech": "PostgreSQL",            "status": "Connected", "records": "42.3M",      "refreshRate": "Real-time",  "owner": "Finance Ops" },
  { "id": "ds2", "name": "Contract Document Store",    "type": "Unstructured", "subtype": "Internal",     "tech": "S3 / SharePoint",       "status": "Connected", "records": "1.2M docs",  "refreshRate": "Daily",      "owner": "Legal" },
  { "id": "ds3", "name": "Market Intelligence Feed",   "type": "Structured",   "subtype": "External API", "tech": "REST API",               "status": "Connected", "records": "Live stream", "refreshRate": "Real-time", "owner": "Strategy" },
  { "id": "ds4", "name": "Sensor & IoT Telemetry",     "type": "Unstructured", "subtype": "External",     "tech": "Kafka",                  "status": "Connected", "records": "850K/hr",    "refreshRate": "Streaming",  "owner": "Engineering" },
  { "id": "ds5", "name": "Customer Behavioural Events","type": "Structured",   "subtype": "Internal",     "tech": "Snowflake",              "status": "Connected", "records": "210M",       "refreshRate": "Hourly",     "owner": "CX Analytics" },
  { "id": "ds6", "name": "Regulatory Reference Data",  "type": "Structured",   "subtype": "External",     "tech": "SFTP / API",             "status": "Syncing",   "records": "4.1M",       "refreshRate": "Weekly",     "owner": "Compliance" },
  { "id": "ds7", "name": "Document OCR Pipeline",      "type": "Unstructured", "subtype": "Internal",     "tech": "Azure Form Recognizer",  "status": "Connected", "records": "220K docs",  "refreshRate": "On-demand",  "owner": "Operations" },
  { "id": "ds8", "name": "Third-Party Credit Bureau",  "type": "Structured",   "subtype": "External API", "tech": "SOAP / REST",            "status": "Error",     "records": "N/A",        "refreshRate": "On-demand",  "owner": "Risk" }
]
```

**Type enum:** `"Structured"` | `"Unstructured"`
**Status enum:** `"Connected"` | `"Syncing"` | `"Error"`

---

### 1.2 `iAe[]` — Storage / Data Architecture Layers (5 layers)

```json
[
  { "name": "Claims Data Lake",        "layer": "SOO → SOR",      "type": "Data Lake",       "engine": "AWS S3 + Glue",  "size": "18.4 TB", "tables": 47, "status": "Healthy" },
  { "name": "Feature Store — Risk",    "layer": "SOR",            "type": "Feature Store",   "engine": "Feast / Redis",  "size": "2.1 TB",  "tables": 12, "status": "Healthy" },
  { "name": "ML Training Warehouse",   "layer": "SOR → Storage",  "type": "Data Warehouse",  "engine": "Snowflake",      "size": "8.7 TB",  "tables": 31, "status": "Healthy" },
  { "name": "Model Artefact Registry", "layer": "Storage",        "type": "Object Store",    "engine": "MLflow / S3",    "size": "340 GB",  "tables": "-", "status": "Healthy" },
  { "name": "Streaming Buffer",        "layer": "SOO",            "type": "Message Queue",   "engine": "Kafka",          "size": "Live",    "tables":  9, "status": "Healthy" }
]
```

**Data Architecture Layers (from `fAe` component — inline definitions):**

| Abbr | Label | Description |
|---|---|---|
| `SOO` | Source of Origin | End Node Layer — Enterprise systems, IoT, external APIs |
| `SOR` | System of Record | Sourcing Layer — Master data, canonical models, data contracts |
| `DL` | Storage / Data Lake | Raw Zone, Curated Zone, Feature Store, Model Artefacts |
| `PL` | Processing Layer | Data Engineering + ML, Model Training, Visualization |
| `AA` | API & Automation | Action Layer |

---

### 1.3 `oAe[]` — ML Pipelines (5 pipelines)

```json
[
  { "id": "p1", "name": "Claims Feature Engineering", "status": "Running",   "lastRun": "09:45",    "duration": "4m 12s", "records": "2.1M",  "stage": "Transform", "health": "Good" },
  { "id": "p2", "name": "Fraud Signal Aggregation",   "status": "Running",   "lastRun": "09:50",    "duration": "1m 58s", "records": "980K",   "stage": "Aggregate", "health": "Good" },
  { "id": "p3", "name": "Customer 360 Join",          "status": "Completed", "lastRun": "08:00",    "duration": "6m 44s", "records": "12.4M",  "stage": "Done",      "health": "Good" },
  { "id": "p4", "name": "Pricing Feature Refresh",    "status": "Scheduled", "lastRun": "Yesterday","duration": "-",      "records": "-",      "stage": "Queued",    "health": "Idle" },
  { "id": "p5", "name": "Regulatory Data Validation", "status": "Failed",    "lastRun": "07:30",    "duration": "0m 44s", "records": "0",      "stage": "Validate",  "health": "Error" }
]
```

**Status enum:** `"Running"` | `"Completed"` | `"Scheduled"` | `"Failed"`
**Health enum:** `"Good"` | `"Idle"` | `"Error"`

---

### 1.4 `i5[]` — Model Registry (6 models — shared with `/agentcore`)

```json
[
  { "id": "m1", "name": "Claims Severity Predictor", "bu": "Insurance Ops",  "framework": "XGBoost",       "version": "v3.2",    "status": "Production",  "accuracy": 94.2, "drift": "None",     "lastRetrain": "2025-01-28", "env": "Prod" },
  { "id": "m2", "name": "Fraud Ensemble Classifier", "bu": "Finance & Risk", "framework": "PyTorch",       "version": "v5.0",    "status": "Production",  "accuracy": 97.8, "drift": "Low",      "lastRetrain": "2025-02-01", "env": "Prod" },
  { "id": "m3", "name": "Customer Churn Propensity", "bu": "CX & Retention", "framework": "LightGBM",      "version": "v2.1",    "status": "Production",  "accuracy": 88.5, "drift": "Moderate", "lastRetrain": "2024-12-15", "env": "Prod" },
  { "id": "m4", "name": "Dynamic Pricing Model",     "bu": "Revenue Mgmt",   "framework": "TensorFlow",    "version": "v4.1-rc", "status": "Staging",     "accuracy": 91.0, "drift": "None",     "lastRetrain": "2025-02-10", "env": "Staging" },
  { "id": "m5", "name": "Contract Risk Scorer",      "bu": "Legal",          "framework": "BERT Fine-tune","version": "v1.4",    "status": "Development", "accuracy": 82.3, "drift": "-",        "lastRetrain": "2025-02-12", "env": "Dev" },
  { "id": "m6", "name": "Demand Forecast Engine",    "bu": "Supply Chain",   "framework": "Prophet + LSTM","version": "v2.8",    "status": "Production",  "accuracy": 90.1, "drift": "Low",      "lastRetrain": "2025-01-20", "env": "Prod" }
]
```

**Status enum:** `"Production"` | `"Staging"` | `"Development"` | `"Archived"`
**Drift enum:** `"None"` | `"Low"` | `"Moderate"` | `"High"` | `"-"`
**Env enum:** `"Prod"` | `"Staging"` | `"Dev"`

---

### 1.5 `lAe[]` — Training Experiments (4 experiments)

```json
[
  { "id": "e1", "name": "Fraud v5.1 — SMOTE Rebalance",   "model": "Fraud Ensemble",  "status": "Running",   "accuracy": "In progress", "started": "Today 08:00", "owner": "Lisa Monroe" },
  { "id": "e2", "name": "Churn v2.2 — New Feature Set",   "model": "Customer Churn",  "status": "Completed", "accuracy": "89.4%",       "started": "Yesterday",   "owner": "Priya Nair" },
  { "id": "e3", "name": "Claims v3.3 — Retrain on Q4 Data","model": "Claims Severity","status": "Queued",    "accuracy": "-",           "started": "-",           "owner": "Sarah Chen" },
  { "id": "e4", "name": "Pricing v4.2 — Gradient Boost",  "model": "Dynamic Pricing", "status": "Completed", "accuracy": "92.1%",       "started": "Feb 15",      "owner": "Marcus Reid" }
]
```

**Status enum:** `"Running"` | `"Completed"` | `"Queued"` | `"Failed"`

---

### 1.6 `cAe[]` — Drift Detection Alerts (3 entries)

```json
[
  { "model": "Customer Churn Propensity", "type": "Data Drift",    "metric": "Feature: purchase_frequency", "severity": "Moderate", "detected": "Feb 16", "action": "Retrain queued" },
  { "model": "Fraud Ensemble Classifier", "type": "Concept Drift", "metric": "PSI Score: 0.18",             "severity": "Low",      "detected": "Feb 17", "action": "Monitoring" },
  { "model": "Claims Severity Predictor", "type": "None",          "metric": "All clear",                   "severity": "None",     "detected": "-",      "action": "-" }
]
```

**Drift Type enum:** `"Data Drift"` | `"Concept Drift"` | `"None"`
**Severity enum:** `"None"` | `"Low"` | `"Moderate"` | `"High"`

---

### 1.7 `uAe[]` — ML Governance Policy Areas (12 areas)

```json
[
  { "area": "Model Access & Management",         "bu": "All BUs",                   "owner": "ML Ops Team",   "status": "Active",  "lastAudit": "Feb 10", "policies": 6 },
  { "area": "Data Quality & Metadata Mgmt",      "bu": "Finance, Insurance",        "owner": "Data Governance","status": "Active",  "lastAudit": "Feb 12", "policies": 8 },
  { "area": "Experiment Tracking",               "bu": "All BUs",                   "owner": "ML Ops Team",   "status": "Active",  "lastAudit": "Feb 14", "policies": 4 },
  { "area": "Hyperparameter Tuning Controls",    "bu": "Risk, Revenue",             "owner": "Model Risk",    "status": "Active",  "lastAudit": "Feb 08", "policies": 3 },
  { "area": "Explainability AI (XAI)",           "bu": "All regulated BUs",         "owner": "Compliance",    "status": "Active",  "lastAudit": "Feb 05", "policies": 5 },
  { "area": "Reproducibility Standards",         "bu": "All BUs",                   "owner": "ML Ops Team",   "status": "Review",  "lastAudit": "Jan 28", "policies": 4 },
  { "area": "Data Stewardship",                  "bu": "All BUs",                   "owner": "CDO Office",    "status": "Active",  "lastAudit": "Feb 11", "policies": 7 },
  { "area": "Data Access Control",               "bu": "All BUs",                   "owner": "IT Security",   "status": "Active",  "lastAudit": "Feb 09", "policies": 9 },
  { "area": "Model Evaluation & Performance Tuning","bu": "Finance, Insurance, Risk","owner": "Model Risk",   "status": "Active",  "lastAudit": "Feb 13", "policies": 6 },
  { "area": "Policies & Standards",              "bu": "Enterprise-wide",           "owner": "CDO + CLO",     "status": "Active",  "lastAudit": "Feb 15", "policies": 12 },
  { "area": "Model Monitoring & Maintenance",    "bu": "All BUs",                   "owner": "ML Ops Team",   "status": "Active",  "lastAudit": "Feb 17", "policies": 5 },
  { "area": "Data Drift Monitoring",             "bu": "All production models",     "owner": "ML Ops Team",   "status": "Alert",   "lastAudit": "Feb 18", "policies": 3 }
]
```

**Status enum:** `"Active"` | `"Review"` | `"Alert"` | `"Inactive"`

---

### 1.8 `dAe[]` — Business Outcome Metrics (6 KPIs)

```json
[
  { "metric": "Fraud Loss Prevention",   "model": "Fraud Ensemble",  "bu": "Finance & Risk",  "value": "$4.2M / month", "trend": "+12%", "status": "On Track" },
  { "metric": "Claims Processing Time",  "model": "Claims Severity", "bu": "Insurance Ops",   "value": "2.1 days avg",  "trend": "-67%", "status": "On Track" },
  { "metric": "Churn Rate (High Value)", "model": "Churn Propensity","bu": "CX & Retention",  "value": "4.8%",          "trend": "-8%",  "status": "Watch" },
  { "metric": "Pricing Margin Uplift",   "model": "Dynamic Pricing", "bu": "Revenue Mgmt",    "value": "6.2%",          "trend": "+6.2%","status": "On Track" },
  { "metric": "Demand Forecast Accuracy","model": "Demand Forecast", "bu": "Supply Chain",    "value": "90.1% MAPE",    "trend": "+3%",  "status": "On Track" },
  { "metric": "Contract Review Cycle",   "model": "Contract Risk",   "bu": "Legal",           "value": "3.2 hrs avg",   "trend": "-55%", "status": "On Track" }
]
```

**Status enum:** `"On Track"` | `"Watch"` | `"At Risk"`

---

## 2. Data Models (SQLModel / PostgreSQL)

### 2.1 Overlap with Existing Tables

> **Note:** `i5[]` (model registry) overlaps with `model_deployments` defined in `/portfolio` (`phase2-portfolio.md`). In the rebuild, these are **merged** into a single `models` table that serves both routes.

```python
import uuid
from datetime import datetime, date
from typing import Optional, List, Dict
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

# ── Data Source ───────────────────────────────────────────────
class DataSource(SQLModel, table=True):
    __tablename__ = "data_sources"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    name: str
    data_type: str                          # "Structured" | "Unstructured"
    subtype: str                            # "Internal" | "External API" | "External"
    tech: str                               # "PostgreSQL" | "Kafka" | etc.
    status: str                             # "Connected" | "Syncing" | "Error"
    record_count: Optional[str] = None      # display string: "42.3M" | "Live stream"
    refresh_rate: Optional[str] = None      # "Real-time" | "Daily" | "Streaming"
    owner: Optional[str] = None

    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Storage Layer (Data Architecture) ────────────────────────
class StorageLayer(SQLModel, table=True):
    __tablename__ = "storage_layers"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    name: str
    layer_label: str                        # "SOO → SOR" | "SOR" | etc.
    layer_type: str                         # "Data Lake" | "Feature Store" | "Data Warehouse" | etc.
    engine: str                             # "AWS S3 + Glue" | "Feast / Redis" | etc.
    size_display: str                       # "18.4 TB" | "Live"
    table_count: Optional[int] = None
    status: str = Field(default="Healthy")  # "Healthy" | "Degraded" | "Error"

    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── ML Pipeline Run ───────────────────────────────────────────
class PipelineRun(SQLModel, table=True):
    __tablename__ = "pipeline_runs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    pipeline_name: str
    status: str                             # "Running" | "Completed" | "Scheduled" | "Failed"
    stage: str                              # "Transform" | "Aggregate" | "Done" | "Queued" | "Validate"
    health: str                             # "Good" | "Idle" | "Error"
    records_processed: Optional[str] = None # display string "2.1M"
    duration_display: Optional[str] = None  # "4m 12s"
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── ML Model (merged with model_deployments from portfolio) ──
class MlModel(SQLModel, table=True):
    __tablename__ = "ml_models"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    use_case_id: Optional[uuid.UUID] = Field(default=None, foreign_key="use_cases.id")

    name: str
    business_unit: str
    framework: str                          # "XGBoost" | "PyTorch" | "LightGBM" | etc.
    version: str                            # "v3.2"
    status: str                             # "Production" | "Staging" | "Development" | "Archived"
    env: str                                # "Prod" | "Staging" | "Dev"
    accuracy: Optional[float] = None        # percentage 0–100
    drift_status: str = Field(default="None") # "None" | "Low" | "Moderate" | "High"
    last_retrain: Optional[date] = None

    # Metadata
    description: Optional[str] = None
    owner: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Training Experiment ────────────────────────────────────────
class TrainingExperiment(SQLModel, table=True):
    __tablename__ = "training_experiments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    model_id: Optional[uuid.UUID] = Field(default=None, foreign_key="ml_models.id")

    name: str
    status: str                             # "Running" | "Completed" | "Queued" | "Failed"
    accuracy_display: Optional[str] = None  # "89.4%" | "In progress" | "-"
    accuracy_value: Optional[float] = None  # parsed float when available
    owner: str
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Hyperparameters and config stored as JSONB
    config: Dict = Field(default={}, sa_column=Column(JSON))
    metrics: Dict = Field(default={}, sa_column=Column(JSON))

    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Drift Detection Event ─────────────────────────────────────
class DriftEvent(SQLModel, table=True):
    __tablename__ = "drift_events"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    model_id: uuid.UUID = Field(foreign_key="ml_models.id", index=True)

    drift_type: str                         # "Data Drift" | "Concept Drift" | "None"
    metric_label: str                       # "Feature: purchase_frequency" | "PSI Score: 0.18"
    severity: str                           # "None" | "Low" | "Moderate" | "High"
    action_taken: Optional[str] = None      # "Retrain queued" | "Monitoring"
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None


# ── ML Governance Policy Area ─────────────────────────────────
class MlGovernanceArea(SQLModel, table=True):
    __tablename__ = "ml_governance_areas"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    area: str
    business_unit: str
    owner: str
    status: str                             # "Active" | "Review" | "Alert" | "Inactive"
    policy_count: int = Field(default=0)
    last_audit: Optional[date] = None

    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Business Outcome Metric ────────────────────────────────────
class BusinessOutcomeMetric(SQLModel, table=True):
    __tablename__ = "business_outcome_metrics"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    model_id: Optional[uuid.UUID] = Field(default=None, foreign_key="ml_models.id")

    metric_name: str
    business_unit: str
    value_display: str                      # "$4.2M / month" | "2.1 days avg"
    trend_display: str                      # "+12%" | "-67%"
    trend_positive: bool = Field(default=True)
    status: str                             # "On Track" | "Watch" | "At Risk"

    snapshot_at: datetime = Field(default_factory=datetime.utcnow)
```

### Entity Relationship Diagram

```
organizations
    │
    ├──< data_sources               (org_id)
    ├──< storage_layers             (org_id)
    ├──< pipeline_runs              (org_id)
    ├──< ml_governance_areas        (org_id)
    └──< ml_models                  (org_id + use_case_id)
              ├──< training_experiments   (model_id)
              ├──< drift_events           (model_id)
              └──< business_outcome_metrics (model_id)
```

---

## 3. API Contracts (FastAPI)

### 3.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional, Dict
import uuid
from datetime import datetime, date

class DataSourceRead(BaseModel):
    id: uuid.UUID
    name: str
    data_type: str
    subtype: str
    tech: str
    status: str
    record_count: Optional[str]
    refresh_rate: Optional[str]
    owner: Optional[str]

class StorageLayerRead(BaseModel):
    id: uuid.UUID
    name: str
    layer_label: str
    layer_type: str
    engine: str
    size_display: str
    table_count: Optional[int]
    status: str

class PipelineRunRead(BaseModel):
    id: uuid.UUID
    pipeline_name: str
    status: str
    stage: str
    health: str
    records_processed: Optional[str]
    duration_display: Optional[str]
    started_at: Optional[datetime]

class MlModelRead(BaseModel):
    id: uuid.UUID
    name: str
    business_unit: str
    framework: str
    version: str
    status: str
    env: str
    accuracy: Optional[float]
    drift_status: str
    last_retrain: Optional[date]
    owner: Optional[str]

class TrainingExperimentRead(BaseModel):
    id: uuid.UUID
    name: str
    model_name: str               # joined from ml_models
    status: str
    accuracy_display: Optional[str]
    owner: str
    started_at: Optional[datetime]

class DriftEventRead(BaseModel):
    id: uuid.UUID
    model_name: str
    drift_type: str
    metric_label: str
    severity: str
    action_taken: Optional[str]
    detected_at: datetime

class MlStudioDashboard(BaseModel):
    # Data Plane tab
    data_sources: List[DataSourceRead]
    storage_layers: List[StorageLayerRead]
    # Pipeline tab
    pipeline_runs: List[PipelineRunRead]
    experiments: List[TrainingExperimentRead]
    # Models tab
    models: List[MlModelRead]
    # Monitoring tab
    drift_events: List[DriftEventRead]
    # Governance tab
    governance_areas: List[dict]
    business_metrics: List[dict]

class ModelDeploy(BaseModel):
    model_id: uuid.UUID
    env: str                      # "Prod" | "Staging" | "Dev"
    notes: Optional[str]

class RetrainTrigger(BaseModel):
    model_id: uuid.UUID
    reason: Optional[str]
    config_overrides: Optional[Dict]
```

### 3.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/ml-studio/dashboard` | Full studio data — all 5 tabs |
| `GET` | `/api/ml-studio/data-sources` | Data source list + health |
| `POST` | `/api/ml-studio/data-sources` | Register new data source |
| `GET` | `/api/ml-studio/storage-layers` | Storage architecture overview |
| `GET` | `/api/ml-studio/pipelines` | Pipeline runs (filterable by status) |
| `POST` | `/api/ml-studio/pipelines/{id}/trigger` | Manually trigger a pipeline |
| `GET` | `/api/ml-studio/models` | Full model registry |
| `GET` | `/api/ml-studio/models/{id}` | Model detail + experiments + drift history |
| `POST` | `/api/ml-studio/models` | Register new model version |
| `POST` | `/api/ml-studio/models/{id}/deploy` | Promote model to env |
| `GET` | `/api/ml-studio/experiments` | Training experiment list |
| `POST` | `/api/ml-studio/experiments` | Start new training run |
| `GET` | `/api/ml-studio/experiments/{id}` | Experiment detail + metrics |
| `GET` | `/api/ml-studio/drift-events` | Drift alerts (active only by default) |
| `POST` | `/api/ml-studio/models/{id}/retrain` | Trigger retraining |
| `GET` | `/api/ml-studio/governance-areas` | ML governance policy areas |
| `GET` | `/api/ml-studio/business-metrics` | Business outcome KPIs |

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── ml-studio/
    └── page.tsx                                        ← Server: initial data fetch
        └── <MlStudioPage>                              ← Client (activeTab state)
              ├── <TabBar tabs={vAe} />
              │
              ├── <DataPlaneTab>                        ← Client (hAe)
              │     ├── <DataArchitectureDiagram />     ← fAe: 5-layer SOO→SOR→DL→PL→AA
              │     ├── <DataSourceTable />             ← sAe[] with type/tech/status cols
              │     └── <StorageLayerTable />           ← iAe[] with engine/size/tables
              │
              ├── <MlPipelineTab>                       ← Client (mAe)
              │     ├── <PipelineKpis />                ← Running/Failed/Success counts
              │     ├── <PipelineTable />               ← oAe[] with stage/health badges
              │     └── <ExperimentTable />             ← lAe[] with status/accuracy
              │
              ├── <ModelRegistryTab>                    ← Client (selectedModel, pAe)
              │     ├── <ModelKpis />                   ← Production/Staging/Dev counts
              │     ├── <ModelTable />                  ← i5[] with framework/accuracy/drift
              │     └── <ModelDetailPanel />            ← right drawer: experiments, drift, deploy
              │
              ├── <MonitoringTab>                       ← Client (gAe)
              │     ├── <DriftSummaryCards />           ← Active alerts + severity breakdown
              │     ├── <DriftAlertTable />             ← cAe[] with severity colour coding
              │     └── <ModelHealthGrid />             ← i5[] drift status heatmap
              │
              └── <GovernanceMetricsTab>                ← Client (xAe)
                    ├── <GovernancePolicyTable />       ← uAe[] with status/policies count
                    └── <BusinessOutcomeTable />        ← dAe[] with trend indicators
```

---

## 5. State & Interactivity

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<MlStudioPage>` | Active tab |
| **Data Plane** | | | |
| `selectedDataSource` | `string\|null` | `<DataPlaneTab>` | Detail side panel |
| **Pipeline** | | | |
| `pipelineFilter` | `string` | `<MlPipelineTab>` | Status filter |
| **Model Registry** | | | |
| `selectedModelId` | `string\|null` | `<ModelRegistryTab>` | Detail panel |
| `envFilter` | `string` | `<ModelRegistryTab>` | `"All"` \| `"Prod"` \| `"Staging"` \| `"Dev"` |
| **Monitoring** | | | |
| `showResolvedDrift` | `boolean` | `<MonitoringTab>` | Toggle resolved events |

---

## 6. Seed Data

```python
ML_MODELS_SEED = [
    {"name": "Claims Severity Predictor", "business_unit": "Insurance Ops",  "framework": "XGBoost",        "version": "v3.2",    "status": "Production",  "env": "Prod",    "accuracy": 94.2, "drift_status": "None",     "last_retrain": "2025-01-28"},
    {"name": "Fraud Ensemble Classifier", "business_unit": "Finance & Risk", "framework": "PyTorch",        "version": "v5.0",    "status": "Production",  "env": "Prod",    "accuracy": 97.8, "drift_status": "Low",      "last_retrain": "2025-02-01"},
    {"name": "Customer Churn Propensity", "business_unit": "CX & Retention", "framework": "LightGBM",       "version": "v2.1",    "status": "Production",  "env": "Prod",    "accuracy": 88.5, "drift_status": "Moderate", "last_retrain": "2024-12-15"},
    {"name": "Dynamic Pricing Model",     "business_unit": "Revenue Mgmt",   "framework": "TensorFlow",     "version": "v4.1-rc", "status": "Staging",     "env": "Staging", "accuracy": 91.0, "drift_status": "None",     "last_retrain": "2025-02-10"},
    {"name": "Contract Risk Scorer",      "business_unit": "Legal",          "framework": "BERT Fine-tune", "version": "v1.4",    "status": "Development", "env": "Dev",     "accuracy": 82.3, "drift_status": None,       "last_retrain": "2025-02-12"},
    {"name": "Demand Forecast Engine",    "business_unit": "Supply Chain",   "framework": "Prophet + LSTM", "version": "v2.8",    "status": "Production",  "env": "Prod",    "accuracy": 90.1, "drift_status": "Low",      "last_retrain": "2025-01-20"},
]

DATA_SOURCES_SEED = [
    {"name": "Claims Transaction DB",      "data_type": "Structured",   "subtype": "Internal",     "tech": "PostgreSQL",           "status": "Connected", "record_count": "42.3M",     "refresh_rate": "Real-time",  "owner": "Finance Ops"},
    {"name": "Contract Document Store",    "data_type": "Unstructured", "subtype": "Internal",     "tech": "S3 / SharePoint",      "status": "Connected", "record_count": "1.2M docs", "refresh_rate": "Daily",      "owner": "Legal"},
    {"name": "Customer Behavioural Events","data_type": "Structured",   "subtype": "Internal",     "tech": "Snowflake",            "status": "Connected", "record_count": "210M",      "refresh_rate": "Hourly",     "owner": "CX Analytics"},
    {"name": "Sensor & IoT Telemetry",     "data_type": "Unstructured", "subtype": "External",     "tech": "Kafka",                "status": "Connected", "record_count": "850K/hr",   "refresh_rate": "Streaming",  "owner": "Engineering"},
    {"name": "Third-Party Credit Bureau",  "data_type": "Structured",   "subtype": "External API", "tech": "SOAP / REST",          "status": "Error",     "record_count": "N/A",       "refresh_rate": "On-demand",  "owner": "Risk"},
]
```

---

## 7. Key Design Decisions

1. **`ml_models` merges `model_deployments` (portfolio spec)** — `i5[]` in ML Studio and `model_deployments` in portfolio both describe the same entity. The unified `ml_models` table adds a `use_case_id` FK to bridge portfolio and ML Studio. The portfolio detail view reads from `ml_models` filtered by `use_case_id`.

2. **`drift_events` is time-series / append-only** — each monitoring check emits a new row. The monitoring tab shows only `resolved_at IS NULL` events. Historical drift data enables trend charting.

3. **`business_outcome_metrics` links to `ml_models`** — the `dAe[]` business KPIs are model-specific outcomes, not just org-level metrics. The FK to `ml_models` enables per-model performance accountability in the governance view and value dashboard.

4. **`training_experiments.config` and `.metrics` as JSONB** — hyperparameters and training metrics are highly variable by framework. JSONB is the right choice. MLflow-compatible schema can be imposed as a validation layer.

5. **`pipeline_runs.records_processed` is a display string** — mirrors the legacy format ("2.1M", "980K"). The rebuild should also store a numeric `records_count: bigint` for sorting/filtering, with `records_display` computed.

---

## 8. Updated Schema Total — 47 Tables

| New Tables (This Route) | Count |
|---|---|
| `data_sources` | 1 |
| `storage_layers` | 1 |
| `pipeline_runs` | 1 |
| `ml_models` | 1 (replaces `model_deployments` from portfolio) |
| `training_experiments` | 1 |
| `drift_events` | 1 |
| `ml_governance_areas` | 1 |
| `business_outcome_metrics` | 1 |

**Running Total: 39 (previous) + 8 (ml-studio) − 1 (merge) = 46 tables**
