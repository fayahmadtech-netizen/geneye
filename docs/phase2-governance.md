# GenEye — Phase 2: Route Specification — `/governance`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `lke` (page), `nke` (Overview tab), `ske` (Risk Classification tab), `ike` (Model Card tab), `oke` (Approval Workflow tab)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/governance`
**Page Title:** "Executive AI Governance Stack"
**Subtitle:** "Risk classification, model governance, approval workflows, and compliance oversight"

This route is the principal governance control plane. It has **4 tabs** covering the full governance lifecycle — from risk tier definitions and model documentation, through to live approval queues and compliance alerts.

### Tabs

| Tab ID | Label | Component | Primary Data |
|---|---|---|---|
| `overview` | Governance Overview | `nke` | `mg` (tier counts) + `iJ[]` (approval queue) + `SD[]` (alerts) + `Le[]` (use cases) |
| `risk` | AI Risk Classification | `ske` | `ake[]` (tier framework definitions) |
| `modelcard` | AI Model Card | `ike` | `vs` (single model card struct) |
| `workflow` | Approval Workflow | `oke` | `ac[]` (workflow items) + `B0` (approval step config per tier) |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `mg` — Tier Counts (Summary Stats)

```json
{ "tier1Count": 8, "tier2Count": 10, "tier3Count": 6 }
```
> **DB Design:** These are **computed aggregates** over `use_cases` — no separate table needed. Computed via `COUNT(*) WHERE tier = N`.

---

### 1.2 `SD[]` — Governance Alerts (3 items)

```json
[
  {
    "id": "1", "severity": "High",
    "message": "Tier 3 initiative 'Contract Intelligence Engine' missing executive approval sign-off",
    "initiative": "Contract Intelligence Engine"
  },
  {
    "id": "2", "severity": "Medium",
    "message": "'HR Resume Screening' initiative has no assigned reviewer after 4 days",
    "initiative": "HR Resume Screening"
  },
  {
    "id": "3", "severity": "High",
    "message": "3 active Tier 3 initiatives have not completed quarterly governance review",
    "initiative": "Multiple"
  }
]
```

**Enum values:** `severity`: `"High"` | `"Medium"` | `"Low"`

---

### 1.3 `iJ[]` — Approval Queue Overview (5 items)

```json
[
  { "id": "1", "initiative": "Contract Intelligence Engine", "tier": 2, "status": "Under Review", "reviewer": "David Kim",      "date": "2025-01-14" },
  { "id": "2", "initiative": "HR Resume Screening",         "tier": 1, "status": "Submitted",    "reviewer": "Unassigned",     "date": "2025-01-18" },
  { "id": "3", "initiative": "Autonomous Claims Processing","tier": 3, "status": "Approved",     "reviewer": "Patricia Lewis", "date": "2024-12-20" },
  { "id": "4", "initiative": "Fraud Detection Suite",       "tier": 3, "status": "Approved",     "reviewer": "CEO Office",     "date": "2024-11-05" },
  { "id": "5", "initiative": "AI-Driven Pricing Engine",    "tier": 3, "status": "Approved",     "reviewer": "CFO Office",     "date": "2024-10-12" }
]
```

> **DB Design:** This is a **view** over `use_cases` (governance_status + reviewer assignment). No separate table — add a `reviewer` column and `review_date` to `use_cases`.

---

### 1.4 `ake[]` — Risk Tier Framework Definitions (3 tiers)

This is **reference/seed data** — the enterprise risk classification framework.

```json
[
  {
    "tier": 1,
    "label": "Tier 1 — Low Risk",
    "autonomy": "Assistive",
    "humanOversight": "Full",
    "examples": ["HR screening assist", "Document summarization", "Demand forecasting assist"],
    "criteria": [
      "Output is advisory only",
      "Human reviews all decisions",
      "No regulated personal data",
      "Low financial exposure (<$100K)"
    ],
    "approvalPath": "BU AI Lead sign-off",
    "controls": [
      "Standard model testing",
      "Monthly drift check",
      "BU owner accountability"
    ]
  },
  {
    "tier": 2,
    "label": "Tier 2 — Medium Risk",
    "autonomy": "Decision Support",
    "humanOversight": "Partial",
    "examples": ["Customer churn prediction", "Contract risk review", "Credit scoring assist"],
    "criteria": [
      "AI recommends, human approves",
      "Uses sensitive PII / financial data",
      "Exposure $100K–$1M",
      "Regulated industry use"
    ],
    "approvalPath": "AI Risk Committee + BU Head",
    "controls": [
      "Bias audit (quarterly)",
      "Explainability report",
      "Escalation playbook",
      "Human override documented"
    ]
  },
  {
    "tier": 3,
    "label": "Tier 3 — High Risk",
    "autonomy": "Autonomous",
    "humanOversight": "Exception-based",
    "examples": ["Autonomous claims processing", "AI fraud decisioning", "Dynamic pricing engine"],
    "criteria": [
      "AI makes final decisions",
      "Exposure >$1M",
      "Regulatory/legal liability",
      "Real-time mission-critical ops"
    ],
    "approvalPath": "CEO/CFO + AI Ethics Board + Legal",
    "controls": [
      "Red team before deploy",
      "Real-time monitoring",
      "Kill-switch required",
      "External audit annually",
      "Executive sign-off"
    ]
  }
]
```

---

### 1.5 `B0` — Approval Step Config (by tier)

Defines the sequential approval steps required per risk tier — this drives the visual progress stepper in the Workflow tab.

```json
{
  "1": ["Submission", "BU Lead Review", "Approved"],
  "2": ["Submission", "BU Lead Review", "AI Risk Committee", "BU Head Approval", "Approved"],
  "3": ["Submission", "BU Lead Review", "AI Risk Committee", "Legal & Compliance", "AI Ethics Board", "CEO/CFO Sign-off", "Approved"]
}
```

---

### 1.6 `ac[]` — Active Workflow Items (4 items)

```json
[
  { "id": "w1", "name": "Contract Intelligence Engine", "tier": 2, "currentStep": 2,
    "submitter": "Tom Walsh",    "submittedDate": "2025-01-10", "daysOpen": 18, "urgency": "Medium" },
  { "id": "w2", "name": "HR Resume Screening",         "tier": 1, "currentStep": 1,
    "submitter": "Aisha Johnson","submittedDate": "2025-01-18", "daysOpen": 10, "urgency": "Low" },
  { "id": "w3", "name": "Autonomous Claims Processing","tier": 3, "currentStep": 6,
    "submitter": "Sarah Chen",   "submittedDate": "2024-11-15", "daysOpen": 65, "urgency": "Approved" },
  { "id": "w4", "name": "Invoice Reconciliation AI",   "tier": 1, "currentStep": 0,
    "submitter": "Finance Ops",  "submittedDate": "2025-02-01", "daysOpen": 4,  "urgency": "Low" }
]
```

**Urgency enum:** `"Low"` | `"Medium"` | `"High"` | `"Approved"`

---

### 1.7 `vs` — AI Model Card Struct (1 model, multiple sections)

A rich structured document for the **"Fraud Detection Suite"** model card, with 5 sections of key-value pairs.

```json
{
  "name": "Fraud Detection Suite",
  "version": "v3.2",
  "owner": "Lisa Monroe",
  "bu": "Finance & Risk",
  "lastUpdated": "2025-01-15",
  "governanceStatus": "Approved",
  "tier": 3,
  "sections": [
    {
      "id": "overview", "label": "Model Overview",
      "fields": [
        { "key": "Model Type",         "value": "Ensemble ML (XGBoost + Isolation Forest + Neural Net)" },
        { "key": "Primary Task",       "value": "Binary classification — Fraud / Not Fraud" },
        { "key": "Autonomy Level",     "value": "Autonomous — real-time decisioning" },
        { "key": "Data Sensitivity",   "value": "High — PII, financial transactions" },
        { "key": "Deploy Environment", "value": "AWS SageMaker (us-east-1)" },
        { "key": "Inference Latency",  "value": "< 120ms p99" }
      ]
    },
    {
      "id": "training", "label": "Training & Data",
      "fields": [
        { "key": "Training Dataset",  "value": "36M transactions (Jan 2022 – Dec 2024)" },
        { "key": "Positive Class Rate","value": "0.8% fraud rate in training set" },
        { "key": "Feature Count",     "value": "142 engineered features" },
        { "key": "Refresh Cycle",     "value": "Weekly incremental retraining" },
        { "key": "Data Lineage",      "value": "Core Banking DB → Feature Store → SageMaker" },
        { "key": "PII Handling",      "value": "Tokenized at ingestion, never stored raw" }
      ]
    },
    {
      "id": "performance", "label": "Performance Metrics",
      "fields": [
        { "key": "Precision",              "value": "94.2%" },
        { "key": "Recall",                 "value": "91.7%" },
        { "key": "F1 Score",               "value": "92.9%" },
        { "key": "False Positive Rate",    "value": "1.3% (monitored weekly)" },
        { "key": "AUC-ROC",                "value": "0.987" },
        { "key": "Model Drift Threshold",  "value": "PSI > 0.2 triggers retraining alert" }
      ]
    },
    {
      "id": "risk", "label": "Risk & Bias Assessment",
      "fields": [
        { "key": "Identified Bias Risks",  "value": "Slight over-flagging in <$500 micro-transactions" },
        { "key": "Bias Mitigation",        "value": "Stratified sampling + fairness constraints applied" },
        { "key": "Explainability Method",  "value": "SHAP values surfaced in review dashboard" },
        { "key": "Last Bias Audit",        "value": "2024-12-10 — Passed" },
        { "key": "Adversarial Testing",    "value": "Quarterly red-team exercise completed 2024-Q4" },
        { "key": "Kill Switch",            "value": "Available — routes to rule-based fallback" }
      ]
    },
    {
      "id": "governance", "label": "Governance & Approvals",
      "fields": [
        { "key": "Risk Tier",        "value": "Tier 3 — Autonomous / High Risk" },
        { "key": "Approved By",      "value": "CEO Office + AI Ethics Board" },
        { "key": "Approval Date",    "value": "2024-11-05" },
        { "key": "Next Review",      "value": "2025-05-05" },
        { "key": "Regulatory Scope", "value": "GDPR Art. 22, FCRA, PCI-DSS" },
        { "key": "External Audit",   "value": "Deloitte AI Assurance — Scheduled Q2 2025" }
      ]
    }
  ]
}
```

### 1.8 `dJ[]` — Users / Reviewers (5 users)

```json
[
  { "id": "1", "name": "Patricia Lewis", "email": "p.lewis@geneye.com", "role": "Admin",      "status": "Active" },
  { "id": "2", "name": "David Kim",      "email": "d.kim@geneye.com",   "role": "Executive",  "status": "Active" },
  { "id": "3", "name": "Sarah Chen",     "email": "s.chen@geneye.com",  "role": "Reviewer",   "status": "Active" },
  { "id": "4", "name": "Marcus Reid",    "email": "m.reid@geneye.com",  "role": "Reviewer",   "status": "Active" },
  { "id": "5", "name": "James Park",     "email": "j.park@geneye.com",  "role": "Executive",  "status": "Inactive" }
]
```

> **Note:** `dJ[]` is the **Users table** — confirmed also used in `/admin` route.

---

## 2. Data Models (SQLModel / PostgreSQL)

### 2.1 New Tables for This Route

```python
import uuid
from datetime import date, datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

# ── Governance Alert ──────────────────────────────────────────
class GovernanceAlert(SQLModel, table=True):
    __tablename__ = "governance_alerts"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    use_case_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="use_cases.id"
    )
    severity: str                          # "Low" | "Medium" | "High"
    message: str
    initiative_label: str                  # display name e.g. "Multiple" or use case name
    is_resolved: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None


# ── Approval Workflow Item ────────────────────────────────────
class ApprovalWorkflow(SQLModel, table=True):
    __tablename__ = "approval_workflows"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    use_case_id: uuid.UUID = Field(foreign_key="use_cases.id", index=True)

    current_step: int = Field(default=0)          # 0-based index into steps array
    urgency: str = Field(default="Low")           # "Low"|"Medium"|"High"|"Approved"
    submitter: str
    submitted_date: date
    days_open: int = Field(default=0)             # updated daily via cron

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Model Card ────────────────────────────────────────────────
class ModelCard(SQLModel, table=True):
    """
    One model card per deployed use case.
    Sections stored as JSONB for flexibility.
    """
    __tablename__ = "model_cards"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    use_case_id: uuid.UUID = Field(
        foreign_key="use_cases.id", unique=True, index=True
    )
    version: str
    last_updated: date
    sections: List[dict] = Field(
        default=[], sa_column=Column(JSON)
    )
    # Nested inside sections but denormalized for fast querying:
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    auc_roc: Optional[float] = None
    last_bias_audit: Optional[date] = None
    next_review_date: Optional[date] = None
    regulatory_scope: Optional[str] = None       # e.g. "GDPR Art. 22, FCRA, PCI-DSS"
    external_auditor: Optional[str] = None
    kill_switch_available: bool = Field(default=False)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Risk Tier Framework (Seed Only) ──────────────────────────
class RiskTierDefinition(SQLModel, table=True):
    """
    Reference data table — seeded once, rarely changed.
    """
    __tablename__ = "risk_tier_definitions"

    tier: int = Field(primary_key=True)           # 1, 2, 3
    label: str
    autonomy_level: str
    human_oversight: str                          # "Full" | "Partial" | "Exception-based"
    approval_path: str
    examples: List[str] = Field(default=[], sa_column=Column(JSON))
    criteria: List[str] = Field(default=[], sa_column=Column(JSON))
    controls: List[str] = Field(default=[], sa_column=Column(JSON))


# ── Approval Steps Config (Seed Only) ────────────────────────
class ApprovalStepConfig(SQLModel, table=True):
    """
    Maps tier → ordered list of approval step labels.
    e.g. tier=3 → ["Submission", "BU Lead Review", ..., "CEO/CFO Sign-off", "Approved"]
    """
    __tablename__ = "approval_step_configs"

    id: int = Field(default=None, primary_key=True)
    tier: int = Field(index=True)
    step_index: int
    step_label: str
```

### 2.2 `use_cases` Table Additions

Add these columns to the existing `use_cases` table from Phase 2 (Portfolio):

```python
# Additional columns needed for governance route:
reviewer: Optional[str] = None               # e.g. "David Kim", "CEO Office"
review_date: Optional[date] = None
funding_amount: Optional[str] = None         # e.g. "$620K"
roi_projection: Optional[str] = None         # e.g. "$3.2M"
```

### 2.3 Entity Relationship Diagram

```
organizations
    │
    └──< use_cases
              │
              ├──< governance_alerts (use_case_id)
              ├──── approval_workflows (use_case_id)   ← 1:1
              └──── model_cards (use_case_id)          ← 1:1
                         │
                         └── (sections stored as JSONB)

risk_tier_definitions         ← seed table, no FK
approval_step_configs         ← seed table, referenced by tier
```

---

## 3. API Contracts (FastAPI)

### 3.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
from datetime import date, datetime

# ── Overview ─────────────────────────────────────────────────
class GovernanceOverview(BaseModel):
    tier1_count: int
    tier2_count: int
    tier3_count: int
    risk_assessed_count: int
    risk_assessed_pct: int
    high_risk_flagged: int          # use_cases where riskScore >= 70
    alerts: List["AlertRead"]
    approval_queue: List["ApprovalQueueItem"]

class AlertRead(BaseModel):
    id: uuid.UUID
    severity: str
    message: str
    initiative_label: str
    is_resolved: bool
    created_at: datetime

class ApprovalQueueItem(BaseModel):
    id: uuid.UUID
    initiative: str
    tier: int
    status: str
    reviewer: Optional[str]
    date: Optional[date]

# ── Risk Tier Framework ───────────────────────────────────────
class RiskTierRead(BaseModel):
    tier: int
    label: str
    autonomy_level: str
    human_oversight: str
    approval_path: str
    examples: List[str]
    criteria: List[str]
    controls: List[str]

# ── Approval Workflow ─────────────────────────────────────────
class WorkflowItem(BaseModel):
    id: uuid.UUID
    name: str
    tier: int
    current_step: int
    urgency: str
    submitter: str
    submitted_date: date
    days_open: int
    steps: List[str]               # resolved from approval_step_configs
    is_complete: bool              # current_step >= len(steps) - 1

class WorkflowStats(BaseModel):
    in_queue: int
    avg_days_open: float
    tier3_pending: int
    approved_ytd: int

class WorkflowResponse(BaseModel):
    stats: WorkflowStats
    items: List[WorkflowItem]

# ── Model Card ────────────────────────────────────────────────
class ModelCardSection(BaseModel):
    id: str
    label: str
    fields: List[Dict[str, str]]   # [{key, value}, ...]

class ModelCardRead(BaseModel):
    id: uuid.UUID
    use_case_id: uuid.UUID
    name: str
    version: str
    owner: str
    business_unit: str
    last_updated: date
    governance_status: str
    tier: int
    sections: List[ModelCardSection]
    precision: Optional[float]
    recall: Optional[float]
    f1_score: Optional[float]
    auc_roc: Optional[float]
    last_bias_audit: Optional[date]
    next_review_date: Optional[date]
    regulatory_scope: Optional[str]
    kill_switch_available: bool
```

### 3.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/governance/overview` | Aggregated stats, alerts, approval queue |
| `GET` | `/api/governance/alerts` | All active alerts (filterable by severity) |
| `POST` | `/api/governance/alerts` | Create a new alert |
| `PATCH` | `/api/governance/alerts/{id}/resolve` | Mark alert as resolved |
| `GET` | `/api/governance/risk-tiers` | Risk tier framework definitions (seed data) |
| `GET` | `/api/governance/workflow` | Full workflow queue with stats |
| `PATCH` | `/api/governance/workflow/{id}/advance` | Advance use case to next approval step |
| `GET` | `/api/governance/model-cards` | List all model cards (brief) |
| `GET` | `/api/governance/model-cards/{use_case_id}` | Full model card for a use case |
| `PUT` | `/api/governance/model-cards/{use_case_id}` | Create or update a model card |
| `GET` | `/api/governance/use-cases` | Use cases list with governance fields (=`Le[]`) |

#### Example: `GET /api/governance/overview`

```json
{
  "tier1_count": 8,
  "tier2_count": 10,
  "tier3_count": 6,
  "risk_assessed_count": 9,
  "risk_assessed_pct": 75,
  "high_risk_flagged": 4,
  "alerts": [
    {
      "id": "...", "severity": "High",
      "message": "Tier 3 initiative 'Contract Intelligence Engine' missing executive approval sign-off",
      "initiative_label": "Contract Intelligence Engine",
      "is_resolved": false,
      "created_at": "2025-01-20T00:00:00Z"
    }
  ],
  "approval_queue": [
    { "id": "...", "initiative": "Contract Intelligence Engine", "tier": 2,
      "status": "Under Review", "reviewer": "David Kim", "date": "2025-01-14" }
  ]
}
```

#### Example: `PATCH /api/governance/workflow/{id}/advance`

**Request body:** `{ "reviewer": "AI Risk Committee", "notes": "Approved at committee meeting" }`

**Response:** Updated `WorkflowItem` with `current_step` incremented, `urgency` recalculated.

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── governance/
    └── page.tsx                              ← Server Component (initial data)
        └── <GovernancePage>
              ├── <PageHeader />
              ├── <TabBar tabs={TABS} />      ← Client Component
              └── {
                    overview:    <GovernanceOverviewTab />,
                    risk:        <RiskClassificationTab />,
                    modelcard:   <ModelCardTab />,
                    workflow:    <ApprovalWorkflowTab />
                  }[activeTab]

    components/
    ├── GovernanceOverviewTab.tsx             ← Client
    │     ├── <TierSummaryCards />            ← Tier 1/2/3 counts
    │     ├── <AlertsBanner />                ← SD[] — High/Medium severity banners
    │     ├── <ApprovalQueueTable />          ← iJ[] — initiative, tier, status, reviewer
    │     └── <UseCaseRiskTable />            ← Le[] — full portfolio risk view
    │
    ├── RiskClassificationTab.tsx             ← Client (expandedTier state)
    │     └── <RiskTierAccordion>            ← ake[] — expandable tier cards
    │           └── <TierDetail>
    │                 ├── criteria[]
    │                 ├── approvalPath
    │                 └── controls[]
    │
    ├── ModelCardTab.tsx                      ← Client (selectedModel, activeSection state)
    │     ├── <ModelSelector />               ← dropdown of available models
    │     ├── <ModelCardHeader />             ← name, version, tier badge, governance status
    │     ├── <SectionTabBar />               ← Overview/Training/Performance/Risk/Governance
    │     └── <ModelCardSection />            ← renders key-value pairs for active section
    │
    └── ApprovalWorkflowTab.tsx              ← Client (selectedWorkflowId state)
          ├── <WorkflowStatCards />           ← In Queue, Avg Days Open, Tier 3 Pending, Approved YTD
          ├── <WorkflowQueueList />           ← ac[] selectable list on left
          │     └── <WorkflowQueueItem />     ← progress stepper bar + urgency badge
          └── <WorkflowDetail />             ← right panel for selected item
                ├── <ApprovalStepper />       ← full step-by-step visual (B0 config)
                └── <WorkflowMetadata />      ← submitter, dates, days open
```

### Server vs. Client Split

| Component | Type | Reason |
|---|---|---|
| `app/governance/page.tsx` | **Server** | Load overview data, alerts, use cases server-side |
| `<TabBar>` | **Client** | `activeTab` state |
| `<GovernanceOverviewTab>` | **Client** | Filter/sort interactivity on use case table |
| `<RiskClassificationTab>` | **Client** | Accordion expand/collapse (`expandedTier` state) |
| `<ModelCardTab>` | **Client** | `selectedModel` + `activeSection` state |
| `<ApprovalWorkflowTab>` | **Client** | `selectedWorkflowId` state + advance action |

---

## 5. State & Interactivity

### `/governance` Page State

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<TabBar>` | Active tab |
| **Overview Tab** | | | |
| `searchQuery` | `string` | `<UseCaseRiskTable>` | Filter use cases by name |
| **Risk Tab** | | | |
| `expandedTier` | `number\|null` | `<RiskClassificationTab>` | Which tier card is expanded |
| **Model Card Tab** | | | |
| `selectedModel` | `string` | `<ModelCardTab>` | Which model's card is shown |
| `activeSection` | `string` | `<ModelCardTab>` | Active section tab (overview/training/etc.) |
| **Workflow Tab** | | | |
| `selectedWorkflowId` | `string\|null` | `<ApprovalWorkflowTab>` | Selected item in queue |

### Approval Workflow Step Logic (extracted from `B0` + `oke`)

```typescript
const APPROVAL_STEPS: Record<number, string[]> = {
  1: ["Submission", "BU Lead Review", "Approved"],
  2: ["Submission", "BU Lead Review", "AI Risk Committee", "BU Head Approval", "Approved"],
  3: ["Submission", "BU Lead Review", "AI Risk Committee", "Legal & Compliance", "AI Ethics Board", "CEO/CFO Sign-off", "Approved"]
};

const isComplete = (item: WorkflowItem) =>
  item.currentStep >= APPROVAL_STEPS[item.tier].length - 1;

// Computed workflow stats:
const inQueue   = items.filter(i => !isComplete(i)).length;
const avgDaysOpen = Math.round(
  items.filter(i => i.urgency !== "Approved")
       .reduce((s, i) => s + i.daysOpen, 0) /
  items.filter(i => i.urgency !== "Approved").length
);
const tier3Pending = items.filter(i => i.tier === 3 && i.urgency !== "Approved").length;
```

---

## 6. Seed Data (DB Migration)

### Risk Tier Definitions

```python
RISK_TIER_SEED = [
    {
        "tier": 1, "label": "Tier 1 — Low Risk",
        "autonomy_level": "Assistive", "human_oversight": "Full",
        "approval_path": "BU AI Lead sign-off",
        "examples": ["HR screening assist", "Document summarization", "Demand forecasting assist"],
        "criteria": [
            "Output is advisory only", "Human reviews all decisions",
            "No regulated personal data", "Low financial exposure (<$100K)"
        ],
        "controls": ["Standard model testing", "Monthly drift check", "BU owner accountability"]
    },
    {
        "tier": 2, "label": "Tier 2 — Medium Risk",
        "autonomy_level": "Decision Support", "human_oversight": "Partial",
        "approval_path": "AI Risk Committee + BU Head",
        "examples": ["Customer churn prediction", "Contract risk review", "Credit scoring assist"],
        "criteria": [
            "AI recommends, human approves", "Uses sensitive PII / financial data",
            "Exposure $100K–$1M", "Regulated industry use"
        ],
        "controls": ["Bias audit (quarterly)", "Explainability report", "Escalation playbook", "Human override documented"]
    },
    {
        "tier": 3, "label": "Tier 3 — High Risk",
        "autonomy_level": "Autonomous", "human_oversight": "Exception-based",
        "approval_path": "CEO/CFO + AI Ethics Board + Legal",
        "examples": ["Autonomous claims processing", "AI fraud decisioning", "Dynamic pricing engine"],
        "criteria": [
            "AI makes final decisions", "Exposure >$1M",
            "Regulatory/legal liability", "Real-time mission-critical ops"
        ],
        "controls": ["Red team before deploy", "Real-time monitoring", "Kill-switch required", "External audit annually", "Executive sign-off"]
    }
]

APPROVAL_STEPS_SEED = [
    # Tier 1
    {"tier": 1, "step_index": 0, "step_label": "Submission"},
    {"tier": 1, "step_index": 1, "step_label": "BU Lead Review"},
    {"tier": 1, "step_index": 2, "step_label": "Approved"},
    # Tier 2
    {"tier": 2, "step_index": 0, "step_label": "Submission"},
    {"tier": 2, "step_index": 1, "step_label": "BU Lead Review"},
    {"tier": 2, "step_index": 2, "step_label": "AI Risk Committee"},
    {"tier": 2, "step_index": 3, "step_label": "BU Head Approval"},
    {"tier": 2, "step_index": 4, "step_label": "Approved"},
    # Tier 3
    {"tier": 3, "step_index": 0, "step_label": "Submission"},
    {"tier": 3, "step_index": 1, "step_label": "BU Lead Review"},
    {"tier": 3, "step_index": 2, "step_label": "AI Risk Committee"},
    {"tier": 3, "step_index": 3, "step_label": "Legal & Compliance"},
    {"tier": 3, "step_index": 4, "step_label": "AI Ethics Board"},
    {"tier": 3, "step_index": 5, "step_label": "CEO/CFO Sign-off"},
    {"tier": 3, "step_index": 6, "step_label": "Approved"},
]
```

---

## 7. Key Design Decisions

1. **`GovernanceAlert` is a separate table** — alerts are system-generated events that need history, resolution tracking, and potentially rule-based auto-creation (e.g., cron job flags any Tier 3 use case without a review within 90 days).

2. **`ApprovalWorkflow` is 1:1 with `use_case`** — each use case has at most one active workflow. `current_step` is an integer index into the `approval_step_configs` table for that tier.

3. **`ModelCard.sections` is JSONB** — the sections are structured but variable-depth. Storing as JSONB with denormalized performance metrics (precision, recall, etc.) gives query flexibility without sacrificing structured reporting.

4. **`dJ[]` (users) → `users` table** — confirmed as the global users/reviewers table, shared with `/admin` route spec.

5. **Governance overview is fully computed** — tier counts, `risk_assessed_pct`, and `high_risk_flagged` are all SQL aggregates over `use_cases`. No materialized view needed at current scale.

---

## 8. Notes for Next Phase

- **`/value`** route uses `GP` (aggregate KPIs), `oJ[]` (ROI by initiative), `lJ[]` (quarterly time-series), `So[]` (BU adoption data), and `cJ` (ROI calculator defaults). Most of `lJ[]` and `oJ[]` will map to a `financial_snapshots` time-series table.
- The `users` table (`dJ[]`) is also needed by `/admin` — will be fully specified there.
- **`Le[]`** in the overview tab overlaps with `Kw[]` from portfolio — same `use_cases` table, different field projection.
