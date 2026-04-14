# GenEye — Phase 2: Route Specification — `/portfolio` & `/portfolio/:id`

> **Analysis Date:** 2026-04-12
> **Mangled Components:** `JSe` (list), `tke` (detail), `GSe` (Portfolio tab), `YSe` (Intake tab), `XSe` (Inventory tab), `QSe` (Prioritization tab)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

| Route | Component | Description |
|---|---|---|
| `/portfolio` | `JSe` | 4-tab container page: Portfolio · Intake · Inventory · Prioritization |
| `/portfolio/:id` | `tke` | Detail view for a single use case (uses `useParams`) |

**Page Title:** "UseCaseX Prioritization Engine & Portfolio"
**Subtitle:** "AI use case intake, inventory management, and value-based prioritization"

### Tabs

| Tab ID | Label | Component | Data Source |
|---|---|---|---|
| `portfolio` | Portfolio | `GSe` | `Kw[]` — scored use cases with sorting/filtering |
| `intake` | AI Use Case Intake & Life Cycle | `YSe` | `nc[]` — intake pipeline items |
| `inventory` | Use Case Inventory | `XSe` | `Po[]` — deployed model inventory |
| `prioritization` | Risk & Value Prioritization | `QSe` | `F0[]` — value/risk matrix items |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `Kw[]` — Portfolio Use Cases (7 items)

Core business entity used by the Portfolio tab and the `/portfolio/:id` detail page.

```json
[
  {
    "id": "1", "name": "Autonomous Claims Processing",
    "businessUnit": "Insurance Ops", "owner": "Sarah Chen",
    "stage": "Production", "tier": 3,
    "estimatedROI": "$1.4M", "priorityScore": 94,
    "businessObjective": "Automate end-to-end insurance claims processing to reduce cycle time from 12 days to under 2 days.",
    "estimatedCost": "$280,000", "estimatedRevenueImpact": "$1,680,000",
    "riskTier": 3, "dataSensitivity": "High",
    "autonomyLevel": "Autonomous", "governanceStatus": "Approved"
  },
  {
    "id": "2", "name": "AI-Driven Pricing Engine",
    "businessUnit": "Revenue Management", "owner": "Marcus Reid",
    "stage": "Scaling", "tier": 3,
    "estimatedROI": "$2.1M", "priorityScore": 91,
    "businessObjective": "Deploy dynamic AI pricing to capture real-time market opportunities and improve margin by 8%.",
    "estimatedCost": "$450,000", "estimatedRevenueImpact": "$2,550,000",
    "riskTier": 3, "dataSensitivity": "High",
    "autonomyLevel": "Autonomous", "governanceStatus": "Approved"
  },
  {
    "id": "3", "name": "Customer Churn Predictor",
    "businessUnit": "CX & Retention", "owner": "Priya Nair",
    "stage": "Production", "tier": 2,
    "estimatedROI": "$890K", "priorityScore": 83,
    "businessObjective": "Predict and preempt customer churn using behavioral signals to enable proactive outreach.",
    "estimatedCost": "$120,000", "estimatedRevenueImpact": "$1,010,000",
    "riskTier": 2, "dataSensitivity": "Medium",
    "autonomyLevel": "Decision Support", "governanceStatus": "Approved"
  },
  {
    "id": "4", "name": "Contract Intelligence Engine",
    "businessUnit": "Legal & Procurement", "owner": "Tom Walsh",
    "stage": "Pilot", "tier": 2,
    "estimatedROI": "$540K", "priorityScore": 77,
    "businessObjective": "Automate contract review and risk identification to reduce legal review time by 60%.",
    "estimatedCost": "$95,000", "estimatedRevenueImpact": "$635,000",
    "riskTier": 2, "dataSensitivity": "High",
    "autonomyLevel": "Decision Support", "governanceStatus": "Under Review"
  },
  {
    "id": "5", "name": "Fraud Detection Suite",
    "businessUnit": "Finance & Risk", "owner": "Lisa Monroe",
    "stage": "Production", "tier": 3,
    "estimatedROI": "$3.2M", "priorityScore": 97,
    "businessObjective": "Real-time fraud detection across all transaction channels using ensemble ML models.",
    "estimatedCost": "$620,000", "estimatedRevenueImpact": "$3,820,000",
    "riskTier": 3, "dataSensitivity": "High",
    "autonomyLevel": "Autonomous", "governanceStatus": "Approved"
  },
  {
    "id": "6", "name": "Demand Forecasting AI",
    "businessUnit": "Supply Chain", "owner": "James Park",
    "stage": "Scaling", "tier": 1,
    "estimatedROI": "$720K", "priorityScore": 72,
    "businessObjective": "Improve demand forecast accuracy from 78% to 94% using ML-driven signals.",
    "estimatedCost": "$85,000", "estimatedRevenueImpact": "$805,000",
    "riskTier": 1, "dataSensitivity": "Low",
    "autonomyLevel": "Assistive", "governanceStatus": "Approved"
  },
  {
    "id": "7", "name": "HR Resume Screening",
    "businessUnit": "Human Resources", "owner": "Aisha Johnson",
    "stage": "Pilot", "tier": 1,
    "estimatedROI": "$210K", "priorityScore": 58,
    "businessObjective": "Reduce time-to-hire by 40% through AI-assisted candidate screening and ranking.",
    "estimatedCost": "$40,000", "estimatedRevenueImpact": "$250,000",
    "riskTier": 1, "dataSensitivity": "Medium",
    "autonomyLevel": "Assistive", "governanceStatus": "Submitted"
  }
]
```

**Enum Values extracted:**
- `stage`: `"Production"` | `"Scaling"` | `"Pilot"`
- `tier` / `riskTier`: `1` | `2` | `3`
- `dataSensitivity`: `"Low"` | `"Medium"` | `"High"`
- `autonomyLevel`: `"Assistive"` | `"Decision Support"` | `"Autonomous"`
- `governanceStatus`: `"Approved"` | `"Under Review"` | `"Submitted"` | `"Not Started"`

---

### 1.2 `nc[]` — Intake Pipeline (4 items)

Use cases in early lifecycle stages, before production deployment.

```json
[
  {
    "id": "i1", "name": "AI-Powered Invoice Reconciliation",
    "submittedBy": "Finance Ops", "bu": "Finance & Risk",
    "submittedDate": "2025-01-20", "stage": "Intake",
    "objective": "Automate 3-way PO/invoice matching to reduce reconciliation cycle from 5 days to same-day.",
    "complexity": "Medium", "strategicFit": "High", "dataReadiness": "High",
    "lifecycleSteps": ["Intake","Feasibility","Business Case","Approved","Build","Pilot","Production"],
    "currentStep": 1
  },
  {
    "id": "i2", "name": "Predictive Maintenance for Data Centers",
    "submittedBy": "IT Infra", "bu": "Technology",
    "submittedDate": "2025-01-28", "stage": "Feasibility",
    "objective": "Use sensor telemetry to predict hardware failures 72h in advance, reducing unplanned downtime by 80%.",
    "complexity": "High", "strategicFit": "Medium", "dataReadiness": "Medium",
    "lifecycleSteps": ["Intake","Feasibility","Business Case","Approved","Build","Pilot","Production"],
    "currentStep": 2
  },
  {
    "id": "i3", "name": "Real-Time Sentiment Analysis for Support",
    "submittedBy": "CX Ops", "bu": "CX & Retention",
    "submittedDate": "2025-02-03", "stage": "Business Case",
    "objective": "Monitor live customer sentiment during support interactions to trigger supervisor escalations proactively.",
    "complexity": "Low", "strategicFit": "High", "dataReadiness": "High",
    "lifecycleSteps": ["Intake","Feasibility","Business Case","Approved","Build","Pilot","Production"],
    "currentStep": 3
  },
  {
    "id": "i4", "name": "Regulatory Change Monitoring AI",
    "submittedBy": "Legal", "bu": "Legal & Procurement",
    "submittedDate": "2025-02-10", "stage": "Intake",
    "objective": "Continuously monitor global regulatory publications and auto-flag policy changes requiring compliance action.",
    "complexity": "High", "strategicFit": "High", "dataReadiness": "Low",
    "lifecycleSteps": ["Intake","Feasibility","Business Case","Approved","Build","Pilot","Production"],
    "currentStep": 0
  }
]
```

**Enum Values:**
- `complexity`: `"Low"` | `"Medium"` | `"High"`
- `strategicFit`: `"Low"` | `"Medium"` | `"High"`
- `dataReadiness`: `"Low"` | `"Medium"` | `"High"`

---

### 1.3 `Po[]` — Model Inventory (7 items)

Deployed AI models tracked in the inventory tab.

```json
[
  { "id": "v1", "name": "Fraud Detection Suite", "bu": "Finance & Risk",
    "category": "Risk & Compliance", "model": "Ensemble ML",
    "dataSource": "Transaction DB", "deployedEnv": "AWS SageMaker",
    "version": "v3.2", "refreshCycle": "Weekly", "owner": "Lisa Monroe",
    "status": "Active", "lastAudit": "2025-01-10" },
  { "id": "v2", "name": "Autonomous Claims Processing", "bu": "Insurance Ops",
    "category": "Process Automation", "model": "Fine-tuned LLM + Rules Engine",
    "dataSource": "Claims DB, DocStore", "deployedEnv": "Azure ML",
    "version": "v2.1", "refreshCycle": "Monthly", "owner": "Sarah Chen",
    "status": "Active", "lastAudit": "2024-12-20" },
  { "id": "v3", "name": "AI-Driven Pricing Engine", "bu": "Revenue Management",
    "category": "Revenue Optimization", "model": "Gradient Boosting",
    "dataSource": "Market Data API, ERP", "deployedEnv": "GCP Vertex AI",
    "version": "v4.0", "refreshCycle": "Daily", "owner": "Marcus Reid",
    "status": "Active", "lastAudit": "2025-01-15" },
  { "id": "v4", "name": "Customer Churn Predictor", "bu": "CX & Retention",
    "category": "Customer Intelligence", "model": "XGBoost + Feature Store",
    "dataSource": "CRM, Web Analytics", "deployedEnv": "AWS SageMaker",
    "version": "v1.8", "refreshCycle": "Weekly", "owner": "Priya Nair",
    "status": "Active", "lastAudit": "2025-01-05" },
  { "id": "v5", "name": "Contract Intelligence Engine", "bu": "Legal & Procurement",
    "category": "NLP / Document AI", "model": "GPT-4 Fine-tune",
    "dataSource": "Contract Repository", "deployedEnv": "Azure OpenAI",
    "version": "v0.9 (Beta)", "refreshCycle": "On Demand", "owner": "Tom Walsh",
    "status": "Pilot", "lastAudit": "2025-01-18" },
  { "id": "v6", "name": "Demand Forecasting AI", "bu": "Supply Chain",
    "category": "Forecasting", "model": "Prophet + LSTM",
    "dataSource": "ERP, POS Systems", "deployedEnv": "On-Prem",
    "version": "v2.3", "refreshCycle": "Daily", "owner": "James Park",
    "status": "Active", "lastAudit": "2024-12-28" },
  { "id": "v7", "name": "HR Resume Screening", "bu": "Human Resources",
    "category": "Talent & HR", "model": "Embedding + Classifier",
    "dataSource": "ATS, LinkedIn API", "deployedEnv": "AWS Lambda",
    "version": "v0.6 (Pilot)", "refreshCycle": "On Demand", "owner": "Aisha Johnson",
    "status": "Pilot", "lastAudit": null }
]
```

---

### 1.4 `F0[]` — Value/Risk Matrix (10 items)

Used by the Prioritization tab for the 2×2 risk-vs-value scatter/quadrant chart.

```json
[
  { "name": "Fraud Detection Suite",  "value": 88, "risk": 82, "roi": "$3.2M", "tier": 3, "bu": "Finance & Risk" },
  { "name": "AI Pricing Engine",      "value": 91, "risk": 78, "roi": "$2.1M", "tier": 3, "bu": "Revenue Mgmt" },
  { "name": "Claims Processing",      "value": 84, "risk": 71, "roi": "$1.4M", "tier": 3, "bu": "Insurance Ops" },
  { "name": "Churn Predictor",        "value": 76, "risk": 45, "roi": "$890K", "tier": 2, "bu": "CX & Retention" },
  { "name": "Contract Intelligence",  "value": 65, "risk": 52, "roi": "$540K", "tier": 2, "bu": "Legal" },
  { "name": "Demand Forecasting",     "value": 72, "risk": 28, "roi": "$720K", "tier": 1, "bu": "Supply Chain" },
  { "name": "HR Screening",           "value": 48, "risk": 22, "roi": "$210K", "tier": 1, "bu": "HR" },
  { "name": "Invoice Reconciliation", "value": 70, "risk": 35, "roi": "$480K", "tier": 1, "bu": "Finance" },
  { "name": "Predictive Maintenance", "value": 78, "risk": 58, "roi": "$1.1M", "tier": 2, "bu": "Technology" },
  { "name": "Sentiment Analysis",     "value": 68, "risk": 30, "roi": "$340K", "tier": 1, "bu": "CX" }
]
```

**Quadrant Logic (extracted):**
- `value >= 75 && risk >= 55` → "High Value · High Risk"
- `value >= 75 && risk <  55` → "High Value · Low Risk"
- `value <  75 && risk >= 55` → "Low Value · High Risk"
- `value <  75 && risk <  55` → "Low Value · Low Risk"

---

## 2. Data Models (SQLModel / PostgreSQL)

> **Design Note:** `Kw[]`, `nc[]`, `Po[]`, and `F0[]` all represent different lifecycle views of the **same core entity: a Use Case**. We normalize this into a single `use_cases` table with lifecycle-specific fields and a separate `model_deployments` table for the inventory view.

### 2.1 Supporting Enums

```python
from enum import Enum

class UseCaseStage(str, Enum):
    idea       = "Idea"
    intake     = "Intake"
    feasibility = "Feasibility"
    business_case = "Business Case"
    approved   = "Approved"
    build      = "Build"
    pilot      = "Pilot"
    scaling    = "Scaling"
    production = "Production"

class TierLevel(int, Enum):
    low    = 1
    medium = 2
    high   = 3

class DataSensitivity(str, Enum):
    low    = "Low"
    medium = "Medium"
    high   = "High"

class AutonomyLevel(str, Enum):
    assistive        = "Assistive"
    decision_support = "Decision Support"
    autonomous       = "Autonomous"

class GovernanceStatus(str, Enum):
    not_started = "Not Started"
    submitted   = "Submitted"
    under_review = "Under Review"
    approved    = "Approved"
    rejected    = "Rejected"

class FitLevel(str, Enum):
    low    = "Low"
    medium = "Medium"
    high   = "High"

class ModelStatus(str, Enum):
    pilot  = "Pilot"
    active = "Active"
    deprecated = "Deprecated"
```

### 2.2 `UseCase` Table

The central entity powering all 4 tabs.

```python
import uuid
from datetime import date, datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class UseCase(SQLModel, table=True):
    __tablename__ = "use_cases"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    # Identity
    name: str
    business_unit: str
    owner: str
    submitted_by: Optional[str] = None
    submitted_date: Optional[date] = None

    # Strategic context
    business_objective: Optional[str] = None
    category: Optional[str] = None            # e.g. "Risk & Compliance"

    # Financial
    estimated_cost: Optional[str] = None       # stored as string (e.g. "$280,000")
    estimated_revenue_impact: Optional[str] = None
    estimated_roi: Optional[str] = None

    # Lifecycle
    stage: UseCaseStage = Field(default=UseCaseStage.intake)
    current_lifecycle_step: int = Field(default=0)

    # Scoring
    priority_score: Optional[int] = None       # 0–100
    value_score: Optional[int] = None          # 0–100
    risk_score: Optional[int] = None           # 0–100

    # Classification
    tier: TierLevel = Field(default=TierLevel.low)
    risk_tier: TierLevel = Field(default=TierLevel.low)
    data_sensitivity: DataSensitivity = Field(default=DataSensitivity.low)
    autonomy_level: AutonomyLevel = Field(default=AutonomyLevel.assistive)
    governance_status: GovernanceStatus = Field(default=GovernanceStatus.not_started)

    # Intake assessment
    complexity: Optional[FitLevel] = None
    strategic_fit: Optional[FitLevel] = None
    data_readiness: Optional[FitLevel] = None

    # Risk governance link
    risk_assessed: bool = Field(default=False)
    evidence_link: Optional[str] = None

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.3 `ModelDeployment` Table

Tracks the deployed AI model for a use case (inventory tab).

```python
class ModelDeployment(SQLModel, table=True):
    __tablename__ = "model_deployments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    use_case_id: uuid.UUID = Field(foreign_key="use_cases.id", index=True)

    model_type: str                            # e.g. "Ensemble ML", "GPT-4 Fine-tune"
    data_source: str                           # e.g. "Transaction DB, ERP"
    deployed_env: str                          # e.g. "AWS SageMaker"
    version: str                               # e.g. "v3.2"
    refresh_cycle: str                         # e.g. "Weekly", "Daily", "On Demand"
    status: ModelStatus = Field(default=ModelStatus.pilot)
    last_audit: Optional[date] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.4 Entity Relationship Diagram

```
organizations
    │
    └──< use_cases (organization_id)
              │
              └──< model_deployments (use_case_id)
```

---

## 3. API Contracts (FastAPI)

### 3.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import date, datetime

# ── Use Case ─────────────────────────────────────────────────
class UseCaseSummary(BaseModel):
    """Used in list views (Portfolio tab, Prioritization tab)"""
    id: uuid.UUID
    name: str
    business_unit: str
    owner: str
    stage: str
    tier: int
    risk_tier: int
    estimated_roi: Optional[str]
    priority_score: Optional[int]
    value_score: Optional[int]
    risk_score: Optional[int]
    governance_status: str
    data_sensitivity: str
    autonomy_level: str

class UseCaseDetail(UseCaseSummary):
    """Used in /portfolio/:id detail view"""
    business_objective: Optional[str]
    estimated_cost: Optional[str]
    estimated_revenue_impact: Optional[str]
    submitted_by: Optional[str]
    submitted_date: Optional[date]
    risk_assessed: bool
    evidence_link: Optional[str]
    deployment: Optional["ModelDeploymentRead"]
    created_at: datetime
    updated_at: datetime

class UseCaseCreate(BaseModel):
    name: str
    business_unit: str
    owner: str
    business_objective: Optional[str]
    stage: str = "Intake"
    tier: int = 1
    risk_tier: int = 1
    data_sensitivity: str = "Low"
    autonomy_level: str = "Assistive"
    governance_status: str = "Not Started"
    estimated_cost: Optional[str]
    estimated_revenue_impact: Optional[str]
    estimated_roi: Optional[str]
    complexity: Optional[str]
    strategic_fit: Optional[str]
    data_readiness: Optional[str]

class UseCaseUpdate(BaseModel):
    stage: Optional[str]
    governance_status: Optional[str]
    priority_score: Optional[int]
    value_score: Optional[int]
    risk_score: Optional[int]
    risk_assessed: Optional[bool]

# ── Model Deployment ─────────────────────────────────────────
class ModelDeploymentRead(BaseModel):
    id: uuid.UUID
    model_type: str
    data_source: str
    deployed_env: str
    version: str
    refresh_cycle: str
    status: str
    last_audit: Optional[date]

# ── Intake Pipeline ──────────────────────────────────────────
class IntakeItem(BaseModel):
    """Shaped response for the Intake tab"""
    id: uuid.UUID
    name: str
    submitted_by: Optional[str]
    business_unit: str
    submitted_date: Optional[date]
    stage: str
    objective: Optional[str]
    complexity: Optional[str]
    strategic_fit: Optional[str]
    data_readiness: Optional[str]
    lifecycle_steps: List[str]
    current_step: int

# ── Prioritization Matrix ─────────────────────────────────────
class PrioritizationItem(BaseModel):
    """Shaped response for the Risk & Value matrix"""
    id: uuid.UUID
    name: str
    value_score: int
    risk_score: int
    estimated_roi: Optional[str]
    tier: int
    business_unit: str
    quadrant: str  # computed server-side
```

### 3.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/portfolio/use-cases` | List all use cases (sortable, filterable) |
| `POST` | `/api/portfolio/use-cases` | Submit a new use case |
| `GET` | `/api/portfolio/use-cases/{id}` | Get full use case detail |
| `PATCH` | `/api/portfolio/use-cases/{id}` | Update stage / governance / scores |
| `DELETE` | `/api/portfolio/use-cases/{id}` | Archive a use case |
| `GET` | `/api/portfolio/intake` | Get intake pipeline items (shaped) |
| `GET` | `/api/portfolio/inventory` | Get model inventory items |
| `GET` | `/api/portfolio/prioritization` | Get risk/value matrix data |

#### Query Params for `GET /api/portfolio/use-cases`

| Param | Type | Example | Description |
|---|---|---|---|
| `search` | string | `"fraud"` | Filter by name or business unit |
| `stage` | string | `"Production"` | Filter by lifecycle stage |
| `tier` | int | `2` | Filter by tier (1–3) |
| `sort_by` | string | `"priorityScore"` | Sort field: `name`, `tier`, `priorityScore` |
| `order` | string | `"desc"` | Sort direction: `asc` \| `desc` |

#### Example: `GET /api/portfolio/use-cases/{id}`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "name": "Fraud Detection Suite",
  "business_unit": "Finance & Risk",
  "owner": "Lisa Monroe",
  "stage": "Production",
  "tier": 3,
  "risk_tier": 3,
  "estimated_roi": "$3.2M",
  "estimated_cost": "$620,000",
  "estimated_revenue_impact": "$3,820,000",
  "priority_score": 97,
  "value_score": 88,
  "risk_score": 82,
  "data_sensitivity": "High",
  "autonomy_level": "Autonomous",
  "governance_status": "Approved",
  "business_objective": "Real-time fraud detection across all transaction channels using ensemble ML models.",
  "risk_assessed": true,
  "evidence_link": "#",
  "deployment": {
    "model_type": "Ensemble ML",
    "data_source": "Transaction DB",
    "deployed_env": "AWS SageMaker",
    "version": "v3.2",
    "refresh_cycle": "Weekly",
    "status": "Active",
    "last_audit": "2025-01-10"
  },
  "created_at": "2024-11-01T00:00:00Z",
  "updated_at": "2025-01-10T00:00:00Z"
}
```

#### Example: `GET /api/portfolio/prioritization`

```json
[
  {
    "id": "...",
    "name": "Fraud Detection Suite",
    "value_score": 88,
    "risk_score": 82,
    "estimated_roi": "$3.2M",
    "tier": 3,
    "business_unit": "Finance & Risk",
    "quadrant": "High Value · High Risk"
  }
]
```

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── portfolio/
    ├── page.tsx                          ← Server Component (fetches use-case list)
    │   └── <PortfolioPage>
    │         ├── <PageHeader />          ← title + subtitle
    │         ├── <TabBar tabs={TABS} />  ← Client Component (tab switching state)
    │         └── {activeTab === "portfolio"    && <PortfolioTab />}
    │             {activeTab === "intake"       && <IntakeTab />}
    │             {activeTab === "inventory"    && <InventoryTab />}
    │             {activeTab === "prioritization" && <PrioritizationTab />}
    │
    ├── components/
    │   ├── TabBar.tsx                    ← Client: activeTab state
    │   ├── PortfolioTab.tsx              ← Client: search, filter, sort state
    │   │     ├── <SearchBar />
    │   │     ├── <FilterSelects />       ← Stage filter, Tier filter
    │   │     ├── <SortableTable />       ← Sortable column headers
    │   │     └── <UseCaseRow /> × N     ← Clickable → navigates to /portfolio/:id
    │   ├── IntakeTab.tsx                 ← Client: selectedItem state
    │   │     ├── <IntakeSummaryCards />  ← Total, High Fit, High Data, Avg Time
    │   │     └── <IntakePipelineItem /> × N  ← Lifecycle stepper visualization
    │   ├── InventoryTab.tsx              ← Client: search + category filter state
    │   │     ├── <InventorySearch />
    │   │     └── <ModelInventoryCard /> × N
    │   └── PrioritizationTab.tsx        ← Client: pure display
    │         ├── <RiskValueMatrix />     ← 2×2 quadrant chart (SVG or Recharts)
    │         └── <PrioritizationTable /> ← Ranked list by value score
    │
    └── [id]/
        └── page.tsx                      ← Server Component (fetch single use case)
            └── <UseCaseDetailPage>
                  ├── <BackButton />      ← navigates to /portfolio
                  ├── <StatusBadgeRow />  ← Stage, Tier, GovernanceStatus, PriorityScore
                  └── <DetailGrid>       ← 2-column layout
                        ├── <StrategicContextCard />
                        │     ├── BusinessObjective
                        │     ├── EstimatedCost / RevenueImpact
                        │     ├── EstimatedROI / BusinessUnit
                        │     └── OwnerAvatar
                        └── <RiskGovernanceCard />
                              ├── <RiskTierSelector />  ← 3-dot visual selector
                              ├── DataSensitivity badge
                              ├── AutonomyLevel badge
                              └── GovernanceStatusBadge
```

### Server vs. Client Split

| Component | Type | Reason |
|---|---|---|
| `app/portfolio/page.tsx` | **Server** | Initial data fetch; SEO title |
| `app/portfolio/[id]/page.tsx` | **Server** | Fetch single use case by ID |
| `<TabBar>` | **Client** | Controls active tab state |
| `<PortfolioTab>` | **Client** | Search/filter/sort states + row click nav |
| `<IntakeTab>` | **Client** | Selected pipeline item state |
| `<InventoryTab>` | **Client** | Search + category filter |
| `<PrioritizationTab>` | **Client** | Interactive matrix (hover/select) |
| `<UseCaseDetailPage>` | **Client** (inner) | Status badges, back navigation |

---

## 5. State & Interactivity

### `/portfolio` Page State

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<TabBar>` (Client) | Controls which tab sub-component renders |
| **Portfolio Tab** | | | |
| `searchQuery` | `string` | `<PortfolioTab>` | Text filter on name/BU |
| `stageFilter` | `string` | `<PortfolioTab>` | `"All"` or specific stage |
| `tierFilter` | `string` | `<PortfolioTab>` | `"All"` or `"1"`, `"2"`, `"3"` |
| `sortBy` | `string` | `<PortfolioTab>` | Column key for sort |
| `sortOrder` | `"asc"\|"desc"` | `<PortfolioTab>` | Sort direction |
| **Intake Tab** | | | |
| `selectedItemId` | `string\|null` | `<IntakeTab>` | Expanded intake detail panel |

### `/portfolio/:id` Page State

- **No local state** — pure server-rendered detail. Navigation back to `/portfolio` uses `useRouter().push('/portfolio')`.

### Filter Logic (extracted from `GSe`)

```typescript
const filtered = useCases
  .filter(uc =>
    (uc.name.toLowerCase().includes(search) ||
     uc.businessUnit.toLowerCase().includes(search)) &&
    (stageFilter === "All" || uc.stage === stageFilter) &&
    (tierFilter  === "All" || String(uc.tier) === tierFilter)
  )
  .sort((a, b) => {
    const va = sortBy === "name" ? a.name : sortBy === "tier" ? a.tier : a.priorityScore;
    const vb = sortBy === "name" ? b.name : sortBy === "tier" ? b.tier : b.priorityScore;
    return typeof va === "string"
      ? order === "asc" ? va.localeCompare(vb) : vb.localeCompare(va)
      : order === "asc" ? va - vb : vb - va;
  });
```

---

## 6. Seed Data (DB Migration)

```python
USE_CASES_SEED = [
    {
        "name": "Autonomous Claims Processing",
        "business_unit": "Insurance Ops",        "owner": "Sarah Chen",
        "stage": "Production",                   "tier": 3,
        "estimated_roi": "$1.4M",                "priority_score": 94,
        "business_objective": "Automate end-to-end insurance claims processing to reduce cycle time from 12 days to under 2 days.",
        "estimated_cost": "$280,000",             "estimated_revenue_impact": "$1,680,000",
        "risk_tier": 3,                           "data_sensitivity": "High",
        "autonomy_level": "Autonomous",           "governance_status": "Approved",
        "risk_assessed": True,                    "value_score": 84, "risk_score": 71,
    },
    # ... (all 7 Kw items + 4 nc intake items inserted into same table)
]
```

---

## 7. Cross-Route Data Sharing

The `use_cases` table is the central entity powering **multiple routes**:

| Route | View | Filter Applied |
|---|---|---|
| `/portfolio` → Portfolio tab | `Kw[]` subset | Stage ∈ {Pilot, Scaling, Production} |
| `/portfolio` → Intake tab | `nc[]` subset | Stage ∈ {Intake, Feasibility, Business Case} |
| `/portfolio` → Inventory tab | `Po[]` join | `model_deployments` JOIN `use_cases` |
| `/portfolio` → Prioritization tab | `F0[]` subset | value_score + risk_score NOT NULL |
| `/portfolio/:id` | Full detail | By ID |
| `/governance` | `Kw[]` + `Le[]` | All with governance fields |
| `/control-tower` | `Le[]` | Aggregated counts + risk flags |

> **Design Decision:** `Le[]` (governance) and `Kw[]` (portfolio) contain overlapping entries. In the rebuild, these map to the same `use_cases` table — the route simply queries a different field subset.

---

## 8. Notes for Next Phase

- **`/governance`** route (`lke`) uses `iJ[]` (approval queue), `SD[]` (alerts), and `mg` (tier counts). These will be **views/computed queries** over `use_cases`, not separate tables.
- **`/value`** route uses `oJ[]` (ROI by initiative), `lJ[]` (quarterly time series), `So[]` (BU adoption rates), `GP` (aggregate KPIs) and `cJ` (ROI calculator defaults) — mostly derived data and aggregates over `use_cases` + time-series tracking.
