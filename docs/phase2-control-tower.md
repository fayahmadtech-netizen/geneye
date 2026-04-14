# GenEye — Phase 2: Route Specification — `/control-tower` Family

> **Analysis Date:** 2026-04-12
> **Routes:** `/control-tower` (dashboard) · `/control-tower/governance` · `/control-tower/portfolio` · `/control-tower/maturity`
> **Mangled Components:** `e$e` · `m$e` · `y$e` · `b$e`
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

The Control Tower is the **executive command layer** — an aggregated, read-only view across all four core modules already documented in Phases 2.1–2.4. It introduces **very little new data** of its own; the primary complexity is in how it composes and computes from existing tables, plus a handful of genuinely new datasets (guardrails, audit log, compliance frameworks).

| Route | Component | Title | Description |
|---|---|---|---|
| `/control-tower` | `e$e` | AI Control Tower | Executive dashboard — 4 KPI cards + maturity trend chart + heatmap + roadmap |
| `/control-tower/governance` | `m$e` | Governance & Risk Oversight | 3-tab: Overview · Red Team · Compliance |
| `/control-tower/portfolio` | `y$e` | AI Portfolio & Capital Allocation | 3-tab: Overview · Adoption & FinOps · Executive Dashboard |
| `/control-tower/maturity` | `b$e` | Maturity Progress Engine | Dimension-level progress bars + quarterly trend + milestones timeline |

---

## 1. Data Sources — Cross-Route Consumption Map

The Control Tower reuses **all previously documented data** plus introduces 6 new datasets:

| Symbol | Route(s) | Source | New? |
|---|---|---|---|
| `kD` | `/control-tower`, `/control-tower/maturity` | `organizations` table | No (Phase 2.1) |
| `Le[]` | `/control-tower`, `/control-tower/governance`, `/control-tower/portfolio` | `use_cases` table | No (Phase 2.2) |
| `qo[]` | `/control-tower`, `/control-tower/maturity` | `maturity_assessments` / `maturity_scores` | No (Phase 2.1) |
| `qw` | `/control-tower`, `/control-tower/maturity` | `maturity_dimension_scores` | No (Phase 2.1) |
| `gf[]` | `/control-tower`, `/control-tower/maturity` | `maturity_history` | **New** |
| `fJ[]` | `/control-tower/maturity` | `maturity_milestones` | **New** |
| `u0[]` | `/control-tower` | `platform_modules` | **New** |
| `Xp[]` | `/control-tower/governance` (Red Team tab) | `ai_guardrails` | **New** |
| `K3[]` | `/control-tower/governance` (Red Team tab) | `red_team_findings` | **New** |
| `Qp[]` | `/control-tower/governance` (Compliance tab) | `compliance_frameworks` | **New** |
| `q3[]` | `/control-tower/governance` (Compliance tab) | `audit_logs` | **New** |
| `hJ[]` | `/control-tower` sidebar / overview | `compliance_coverage` | Derived from `Qp[]` |
| `So[]` | `/control-tower/portfolio` (FinOps tab) | `bu_adoption_snapshots` | No (Phase 2.4) |
| `uJ` | `/control-tower/portfolio` (Exec tab) | `strategic_objectives` + `ai_health_indicators` + `quarterly_milestones` | No (Phase 2.4) |

---

## 2. Hardcoded Data — Full Extraction (New Data Only)

### 2.1 `gf[]` — Quarterly Maturity History by Dimension (4 quarters)

```json
[
  { "quarter": "Q1 2024", "governance": 1.5, "capital": 1.8, "org": 1.4, "portfolio": 2.0, "adoption": 1.2, "integration": 1.7, "overall": 1.6 },
  { "quarter": "Q2 2024", "governance": 1.9, "capital": 2.0, "org": 1.6, "portfolio": 2.2, "adoption": 1.4, "integration": 1.8, "overall": 1.8 },
  { "quarter": "Q3 2024", "governance": 2.3, "capital": 2.3, "org": 1.9, "portfolio": 2.4, "adoption": 1.6, "integration": 2.0, "overall": 2.1 },
  { "quarter": "Q4 2024", "governance": 2.8, "capital": 2.6, "org": 2.2, "portfolio": 2.7, "adoption": 1.9, "integration": 2.3, "overall": 2.4 }
]
```

**Dimensions (6):** `governance` · `capital` · `org` · `portfolio` · `adoption` · `integration`

---

### 2.2 `qw` — Current / Baseline / Target per Dimension

```json
{
  "governance":  { "current": 2.8, "baseline": 1.5, "target": 4.2 },
  "capital":     { "current": 2.6, "baseline": 1.8, "target": 4.0 },
  "org":         { "current": 2.2, "baseline": 1.4, "target": 3.8 },
  "portfolio":   { "current": 2.7, "baseline": 2.0, "target": 4.0 },
  "adoption":    { "current": 1.9, "baseline": 1.2, "target": 3.5 },
  "integration": { "current": 2.3, "baseline": 1.7, "target": 4.0 }
}
```

---

### 2.3 `fJ[]` — Maturity Milestone Timeline (10 items)

```json
[
  { "date": "2024-03", "label": "AI Governance Charter Approved",         "dimension": "Governance",   "status": "done" },
  { "date": "2024-05", "label": "AI CoE Launched",                        "dimension": "Org",          "status": "done" },
  { "date": "2024-07", "label": "Risk Classification Framework Deployed", "dimension": "Governance",   "status": "done" },
  { "date": "2024-09", "label": "Investment Tracking System Live",        "dimension": "Capital",      "status": "done" },
  { "date": "2024-11", "label": "Use Case Inventory Centralized",         "dimension": "Portfolio",    "status": "done" },
  { "date": "2025-01", "label": "MLOps Pipeline v1 Deployed",             "dimension": "Integration",  "status": "done" },
  { "date": "2025-03", "label": "AI Training Rollout Begins",             "dimension": "Adoption",     "status": "in_progress" },
  { "date": "2025-06", "label": "Tier 3 Approval Workflow Live",          "dimension": "Governance",   "status": "planned" },
  { "date": "2025-09", "label": "AI Champions in All BUs",                "dimension": "Org",          "status": "planned" },
  { "date": "2025-12", "label": "Full Maturity Target Achieved",          "dimension": "All",          "status": "planned" }
]
```

**Status enum:** `"done"` | `"in_progress"` | `"planned"`

---

### 2.4 `u0[]` — Platform Modules (5 items)

```json
[
  { "module": "Governance & Risk Engine",  "status": "Active",      "installed": true  },
  { "module": "Capital Allocation Engine", "status": "Active",      "installed": true  },
  { "module": "Portfolio Intelligence",    "status": "Active",      "installed": true  },
  { "module": "Adoption & Change Engine",  "status": "In Progress", "installed": false },
  { "module": "Integration & MLOps",       "status": "In Progress", "installed": false }
]
```

---

### 2.5 `Xp[]` — AI Guardrails (8 checks)

```json
[
  { "id": "g1", "category": "Output Safety",  "name": "Hallucination Rate Monitor",    "status": "Active",     "threshold": "< 2% hallucination on eval set",          "lastRun": "2025-02-10", "result": "Pass" },
  { "id": "g2", "category": "Output Safety",  "name": "Toxicity & Bias Filter",        "status": "Active",     "threshold": "Perspective API score < 0.3",              "lastRun": "2025-02-10", "result": "Pass" },
  { "id": "g3", "category": "Data Privacy",   "name": "PII Leakage Check",             "status": "Active",     "threshold": "Zero PII in model outputs",                "lastRun": "2025-02-08", "result": "Pass" },
  { "id": "g4", "category": "Data Privacy",   "name": "Data Minimization Audit",       "status": "Active",     "threshold": "Only necessary features used",             "lastRun": "2025-01-30", "result": "Warning" },
  { "id": "g5", "category": "Operational",    "name": "Model Drift Detector",          "status": "Active",     "threshold": "PSI < 0.2 per feature",                   "lastRun": "2025-02-12", "result": "Pass" },
  { "id": "g6", "category": "Operational",    "name": "Kill Switch Verification",      "status": "Active",     "threshold": "< 500ms fallback activation",              "lastRun": "2025-01-15", "result": "Pass" },
  { "id": "g7", "category": "Adversarial",    "name": "Prompt Injection Resistance",   "status": "Active",     "threshold": "Zero successful injections in red team",   "lastRun": "2025-01-20", "result": "Fail" },
  { "id": "g8", "category": "Adversarial",    "name": "Model Inversion Attack Defense","status": "Scheduled",  "threshold": "No training data reconstruction",          "lastRun": "2024-Q4",    "result": "Pending" }
]
```

**Result enum:** `"Pass"` | `"Fail"` | `"Warning"` | `"Pending"`
**Status enum:** `"Active"` | `"Scheduled"` | `"Disabled"`

---

### 2.6 `K3[]` — Red Team Findings (4 items)

```json
[
  { "id": "rt1", "model": "Fraud Detection Suite",     "date": "2024-Q4", "type": "Adversarial Input",         "finding": "5 edge cases causing FP spike",                   "severity": "Medium", "status": "Remediated" },
  { "id": "rt2", "model": "AI Pricing Engine",         "date": "2024-Q3", "type": "Data Poisoning Simulation", "finding": "No exploitable vectors found",                    "severity": "None",   "status": "Passed" },
  { "id": "rt3", "model": "Claims Processing",         "date": "2025-Q1", "type": "Prompt Injection",          "finding": "2 injection vectors via OCR path",                "severity": "High",   "status": "In Remediation" },
  { "id": "rt4", "model": "Customer Churn Predictor",  "date": "2025-Q1", "type": "Fairness & Bias Audit",     "finding": "Slight age-group disparity in churn flag",        "severity": "Medium", "status": "Under Review" }
]
```

---

### 2.7 `Qp[]` — Compliance Frameworks (6 frameworks)

```json
[
  { "id": "c1", "framework": "EU AI Act",                      "scope": "All Tier 2 & 3 systems",     "status": "In Progress", "coverage": 68,  "dueDate": "2025-08-01",   "owner": "Legal & Compliance" },
  { "id": "c2", "framework": "GDPR Art. 22 (Automated Decisions)","scope": "Fraud, Claims, Pricing", "status": "Compliant",   "coverage": 100, "dueDate": "Ongoing",      "owner": "DPO Office" },
  { "id": "c3", "framework": "ISO/IEC 42001 AI Management",    "scope": "Enterprise-wide",            "status": "In Progress", "coverage": 52,  "dueDate": "2025-12-31",   "owner": "AI CoE" },
  { "id": "c4", "framework": "NIST AI RMF",                    "scope": "All AI initiatives",         "status": "Compliant",   "coverage": 88,  "dueDate": "Annual review", "owner": "CRO Office" },
  { "id": "c5", "framework": "SOC 2 Type II (AI Controls)",    "scope": "Cloud-hosted models",        "status": "Compliant",   "coverage": 100, "dueDate": "2025-09-30",   "owner": "IT Security" },
  { "id": "c6", "framework": "FCRA (Fair Credit)",             "scope": "Churn Predictor, Fraud Suite","status": "Compliant",  "coverage": 95,  "dueDate": "Annual",        "owner": "Legal" }
]
```

---

### 2.8 `q3[]` — Audit Log (5 entries)

```json
[
  { "id": "a1", "date": "2025-01-15", "type": "Internal Audit",    "scope": "Fraud Detection Suite v3.2",       "auditor": "AI Risk Team",           "finding": "No material findings",          "outcome": "Passed" },
  { "id": "a2", "date": "2025-01-10", "type": "Governance Review", "scope": "Contract Intelligence Engine",     "auditor": "AI Ethics Board",        "finding": "Missing model card section",    "outcome": "Action Required" },
  { "id": "a3", "date": "2024-12-20", "type": "External Audit",    "scope": "Claims Processing v2.1",           "auditor": "Deloitte AI Assurance",  "finding": "2 minor observations",          "outcome": "Passed with Notes" },
  { "id": "a4", "date": "2024-12-10", "type": "Bias Audit",        "scope": "Customer Churn Predictor",         "auditor": "Fairness Lab (3rd Party)","finding": "Age-group disparity flagged",   "outcome": "Action Required" },
  { "id": "a5", "date": "2024-11-28", "type": "Internal Audit",    "scope": "AI Pricing Engine v4.0",           "auditor": "AI Risk Team",           "finding": "No material findings",          "outcome": "Passed" }
]
```

**Outcome enum:** `"Passed"` | `"Passed with Notes"` | `"Action Required"`

---

### 2.9 Dashboard KPI Computation Logic (extracted from `e$e`)

```typescript
// Maturity Index — average of all 6 dimensions' current scores
const maturityIndex = Object.values(qw).reduce((s, d) => s + d.current, 0) / W3.length;

// Risk Exposure
const riskAssessed    = Le.filter(uc => uc.riskAssessed).length;
const riskAssessedPct = Math.round(riskAssessed / Le.length * 100);
const highRiskCount   = Le.filter(uc => uc.riskScore >= 70).length;

// Capital at Risk
const totalCapital    = Le.reduce((s, uc) => s + parseAmount(uc.fundingAmount), 0);
const unassessedCapital = Le.filter(uc => !uc.riskAssessed)
                            .reduce((s, uc) => s + parseAmount(uc.fundingAmount), 0);
const underperforming = Le.filter(uc => uc.valueScore < 60).length;

// Roadmap Progress
const completedDeliverables = qo.filter(d => d.completionStatus === 100).length;
const overallCompletion     = Math.round(qo.reduce((s, d) => s + d.completionStatus, 0) / (qo.length * 100) * 100);
const installedModules      = u0.filter(m => m.installed).length;

// Forecast velocity (maturity points per quarter from gf)
const quarterCount   = gf.length;
const velocity       = quarterCount > 1
  ? (gf[quarterCount - 1].overall - gf[0].overall) / (quarterCount - 1) : 0;
const quartersToTarget = velocity > 0 ? Math.ceil((kD.targetMaturity - kD.currentMaturity) / velocity) : 0;
```

---

## 3. Data Models (SQLModel / PostgreSQL)

### 3.1 New Tables

```python
import uuid
from datetime import date, datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

# ── Maturity History (by dimension, quarterly) ────────────────
class MaturityDimensionHistory(SQLModel, table=True):
    __tablename__ = "maturity_dimension_history"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    quarter: str                          # "Q1 2024"
    year: int
    quarter_num: int                      # 1–4

    governance:  float
    capital:     float
    org:         float
    portfolio:   float
    adoption:    float
    integration: float
    overall:     float                    # avg of all 6

    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Maturity Milestones Timeline ──────────────────────────────
class MaturityMilestone(SQLModel, table=True):
    __tablename__ = "maturity_milestones"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    milestone_date: str               # "2024-03" (YYYY-MM)
    label: str
    dimension: str                    # "Governance" | "Org" | "Capital" | etc | "All"
    status: str                       # "done" | "in_progress" | "planned"
    display_order: int = Field(default=0)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Platform Modules ──────────────────────────────────────────
class PlatformModule(SQLModel, table=True):
    __tablename__ = "platform_modules"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    module_name: str
    status: str                       # "Active" | "In Progress" | "Inactive"
    installed: bool = Field(default=False)
    display_order: int = Field(default=0)


# ── AI Guardrails ─────────────────────────────────────────────
class AiGuardrail(SQLModel, table=True):
    __tablename__ = "ai_guardrails"

    id: str = Field(primary_key=True)     # "g1", "g2" etc.
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    category: str                         # "Output Safety"|"Data Privacy"|"Operational"|"Adversarial"
    name: str
    status: str                           # "Active" | "Scheduled" | "Disabled"
    threshold: str
    last_run: Optional[str] = None        # date or quarter string
    result: str                           # "Pass"|"Fail"|"Warning"|"Pending"

    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Red Team Findings ─────────────────────────────────────────
class RedTeamFinding(SQLModel, table=True):
    __tablename__ = "red_team_findings"

    id: str = Field(primary_key=True)     # "rt1" etc.
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    use_case_id: Optional[uuid.UUID] = Field(default=None, foreign_key="use_cases.id")

    model_name: str
    exercise_date: str                    # "2024-Q4" quarter string
    exercise_type: str                    # "Adversarial Input"|"Prompt Injection"|etc.
    finding: str
    severity: str                         # "None"|"Medium"|"High"
    status: str                           # "Passed"|"Remediated"|"In Remediation"|"Under Review"

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Compliance Frameworks ─────────────────────────────────────
class ComplianceFramework(SQLModel, table=True):
    __tablename__ = "compliance_frameworks"

    id: str = Field(primary_key=True)     # "c1" etc.
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    framework: str                        # "EU AI Act", "GDPR Art. 22", etc.
    scope: str
    status: str                           # "Compliant" | "In Progress" | "Non-Compliant"
    coverage: int                         # 0–100 (%)
    due_date: Optional[str] = None        # "2025-08-01" or "Ongoing" / "Annual"
    owner: str

    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Audit Log ─────────────────────────────────────────────────
class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    use_case_id: Optional[uuid.UUID] = Field(default=None, foreign_key="use_cases.id")

    audit_date: date
    audit_type: str                       # "Internal Audit"|"External Audit"|"Governance Review"|"Bias Audit"
    scope: str
    auditor: str
    finding: str
    outcome: str                          # "Passed"|"Passed with Notes"|"Action Required"

    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 3.2 `organizations` Table — Additional Columns

```python
# Add to organizations table (from kD data):
company: str = Field(default="")
industry: str = Field(default="")
baseline_maturity: float = Field(default=1.0)
current_maturity: float = Field(default=1.0)
target_maturity: float = Field(default=5.0)
```

### 3.3 Entity Relationship Diagram

```
organizations
    │
    ├──< maturity_dimension_history   (org_id — quarterly time-series)
    ├──< maturity_milestones          (org_id — timeline events)
    ├──< platform_modules             (org_id — module status)
    ├──< ai_guardrails               (org_id — safety checks)
    ├──< compliance_frameworks        (org_id — regulatory tracking)
    └──< audit_logs                   (org_id + use_case_id)

use_cases
    └──< red_team_findings            (use_case_id)
```

---

## 4. API Contracts (FastAPI)

### 4.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional, Dict
import uuid

# ── Control Tower Dashboard ───────────────────────────────────
class ControlTowerKpis(BaseModel):
    maturity_index: float             # computed avg of all 6 dimensions
    risk_assessed_pct: int
    high_risk_count: int
    total_capital_k: float
    unassessed_capital_k: float
    underperforming_count: int
    roadmap_progress_pct: int
    deliverables_complete: int
    deliverables_total: int
    installed_modules: int
    total_modules: int
    velocity_per_quarter: float
    quarters_to_target: int

class DimensionScore(BaseModel):
    dimension: str
    label: str
    current: float
    baseline: float
    target: float

class ControlTowerDashboardResponse(BaseModel):
    kpis: ControlTowerKpis
    dimension_scores: List[DimensionScore]
    maturity_trend: List[dict]            # gf[] quarterly history
    compliance_coverage: List[dict]       # hJ[] quick summary
    platform_modules: List[dict]

# ── Maturity Progress (CT/maturity) ──────────────────────────
class MaturityProgressResponse(BaseModel):
    baseline: float
    current: float
    target: float
    improvement_pct: float
    velocity_per_quarter: float
    quarters_to_target: int
    deliverables_complete: int
    deliverables_total: int
    overall_completion_pct: int
    dimension_scores: List[DimensionScore]
    deliverables_by_dimension: List[dict]
    quarterly_history: List[dict]         # gf[]
    milestones: List[dict]               # fJ[]

# ── Governance Overview (CT/governance) ──────────────────────
class GuardrailRead(BaseModel):
    id: str
    category: str
    name: str
    status: str
    threshold: str
    last_run: Optional[str]
    result: str

class RedTeamFindingRead(BaseModel):
    id: str
    model_name: str
    exercise_date: str
    exercise_type: str
    finding: str
    severity: str
    status: str

class ComplianceFrameworkRead(BaseModel):
    id: str
    framework: str
    scope: str
    status: str
    coverage: int
    due_date: Optional[str]
    owner: str

class AuditLogRead(BaseModel):
    id: uuid.UUID
    audit_date: str
    audit_type: str
    scope: str
    auditor: str
    finding: str
    outcome: str

class CTGovernanceOverview(BaseModel):
    # Overview tab
    ai_policy_coverage_pct: int
    risk_assessed_count: int
    high_risk_count: int
    governance_approved_pct: int
    use_cases: List[dict]
    # Red Team tab
    guardrails: List[GuardrailRead]
    red_team_findings: List[RedTeamFindingRead]
    # Compliance tab
    compliance_frameworks: List[ComplianceFrameworkRead]
    audit_logs: List[AuditLogRead]
```

### 4.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/control-tower/dashboard` | Main KPIs, maturity trend, dimension heatmap, modules |
| `GET` | `/api/control-tower/maturity` | Full maturity progress: dimensions, history, milestones |
| `GET` | `/api/control-tower/governance/overview` | Use case risk table with filters |
| `GET` | `/api/control-tower/governance/redteam` | Guardrails + red team findings |
| `GET` | `/api/control-tower/governance/compliance` | Frameworks + audit log |
| `GET` | `/api/control-tower/portfolio/overview` | Portfolio investment stats from `Le[]` |
| `GET` | `/api/control-tower/portfolio/finops` | BU adoption & FinOps scorecard (`So[]`) |
| `GET` | `/api/control-tower/portfolio/executive` | Strategic objectives + health indicators + milestones |

---

## 5. Frontend Component Tree (Next.js)

```
app/
└── control-tower/
    ├── page.tsx                                    ← Server: fetch dashboard data
    │   └── <ControlTowerDashboard>                 ← Client
    │         ├── <KpiRow>                          ← 4 metric cards (computed)
    │         ├── <MaturityTrendChart />             ← Recharts: gf[] overall line
    │         ├── <DimensionHeatmap />               ← Grid: 6 dimensions × score color
    │         ├── <ComplianceCoverageStrip />        ← hJ[] quick bar
    │         └── <PlatformModulesStatus />          ← u0[] module badges
    │
    ├── governance/
    │   └── page.tsx                                ← Server: fetch CT governance data
    │       └── <CTGovernancePage>
    │             ├── <TabBar />                    ← Client: overview/redteam/compliance
    │             ├── <CTGovOverviewTab>             ← Client: BU/risk filters on Le[]
    │             │     ├── <KpiRow />               ← 4 computed stats
    │             │     ├── <UseCaseRiskTable />     ← Filterable Le[] table
    │             │     └── <RiskScatterChart />
    │             ├── <RedTeamTab>                  ← Client: static display
    │             │     ├── <GuardrailsTable />      ← Xp[] — Pass/Fail/Warning rows
    │             │     └── <RedTeamFindingsTable /> ← K3[]
    │             └── <ComplianceTab>               ← Client: static display
    │                   ├── <KpiRow />               ← frameworks count, audits this Q
    │                   ├── <ComplianceTable />      ← Qp[] with coverage bar
    │                   └── <AuditLogTable />        ← q3[] sorted by date
    │
    ├── portfolio/
    │   └── page.tsx                                ← Server: fetch CT portfolio data
    │       └── <CTPortfolioPage>
    │             ├── <TabBar />                    ← Client: overview/finops/exec
    │             ├── <CTPortfolioOverviewTab>       ← Client (g$e)
    │             │     ├── <InvestmentKpiRow />     ← 5 computed KPIs from Le[]
    │             │     ├── <PortfolioAllocationChart /> ← Recharts: funding by BU
    │             │     └── <InitiativeTable />      ← Le[] full table
    │             ├── <FinOpsTab>                   ← Client (x$e): So[] adoption grid
    │             │     ├── <AdoptionSummaryCards /> ← total spend, avg adoption, avg utilization
    │             │     └── <BuAdoptionTable />      ← So[] with trend arrows
    │             └── <ExecutiveDashboardTab>        ← Client (v$e)
    │                   ├── <HealthIndicatorBars />  ← uJ.aiHealthIndicators
    │                   ├── <StrategicObjectives />  ← uJ.strategicObjectives
    │                   └── <QuarterlyMilestones />  ← uJ.quarterlyMilestones
    │
    └── maturity/
        └── page.tsx                                ← Server: fetch CT maturity data
            └── <CTMaturityPage>                    ← Client (b$e)
                  ├── <KpiRow>                      ← 5 cards: baseline/current/target/deliverables/velocity
                  ├── <DimensionProgressBars />      ← qw — baseline/current/target triple bars
                  ├── <QuarterlyMaturityChart />     ← Recharts: gf[] multi-line (6 dims)
                  ├── <DeliverablesAccordion />      ← qo[] grouped by dimension (W3 order)
                  └── <MilestonesTimeline />         ← fJ[] horizontal timeline
```

---

## 6. State & Interactivity

### Dashboard (`/control-tower`)

Primarily **static** — all values computed server-side. No significant local state.

### Control Tower Governance (`/control-tower/governance`)

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<TabBar>` | `"overview"` \| `"redteam"` \| `"compliance"` |
| `buFilter` | `string` | `<CTGovOverviewTab>` | `"All"` or specific BU |
| `riskFilter` | `string` | `<CTGovOverviewTab>` | `"All"` \| `"High"` \| `"Medium"` \| `"Low"` |

### Control Tower Portfolio (`/control-tower/portfolio`)

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<TabBar>` | `"overview"` \| `"finops"` \| `"exec"` |

### Control Tower Maturity (`/control-tower/maturity`)

| State | Type | Scope | Purpose |
|---|---|---|---|
| `expandedDimension` | `string\|null` | `<DeliverablesAccordion>` | Which dimension's deliverables are shown |

---

## 7. Seed Data (DB Migration)

```python
MATURITY_DIMENSION_HISTORY_SEED = [
    {"quarter": "Q1 2024", "year": 2024, "quarter_num": 1,
     "governance": 1.5, "capital": 1.8, "org": 1.4, "portfolio": 2.0,
     "adoption": 1.2, "integration": 1.7, "overall": 1.6},
    {"quarter": "Q2 2024", "year": 2024, "quarter_num": 2,
     "governance": 1.9, "capital": 2.0, "org": 1.6, "portfolio": 2.2,
     "adoption": 1.4, "integration": 1.8, "overall": 1.8},
    {"quarter": "Q3 2024", "year": 2024, "quarter_num": 3,
     "governance": 2.3, "capital": 2.3, "org": 1.9, "portfolio": 2.4,
     "adoption": 1.6, "integration": 2.0, "overall": 2.1},
    {"quarter": "Q4 2024", "year": 2024, "quarter_num": 4,
     "governance": 2.8, "capital": 2.6, "org": 2.2, "portfolio": 2.7,
     "adoption": 1.9, "integration": 2.3, "overall": 2.4},
]

MATURITY_MILESTONES_SEED = [
    {"milestone_date": "2024-03", "label": "AI Governance Charter Approved",         "dimension": "Governance",  "status": "done",        "display_order": 0},
    {"milestone_date": "2024-05", "label": "AI CoE Launched",                        "dimension": "Org",         "status": "done",        "display_order": 1},
    {"milestone_date": "2024-07", "label": "Risk Classification Framework Deployed", "dimension": "Governance",  "status": "done",        "display_order": 2},
    {"milestone_date": "2024-09", "label": "Investment Tracking System Live",        "dimension": "Capital",     "status": "done",        "display_order": 3},
    {"milestone_date": "2024-11", "label": "Use Case Inventory Centralized",         "dimension": "Portfolio",   "status": "done",        "display_order": 4},
    {"milestone_date": "2025-01", "label": "MLOps Pipeline v1 Deployed",             "dimension": "Integration", "status": "done",        "display_order": 5},
    {"milestone_date": "2025-03", "label": "AI Training Rollout Begins",             "dimension": "Adoption",    "status": "in_progress", "display_order": 6},
    {"milestone_date": "2025-06", "label": "Tier 3 Approval Workflow Live",          "dimension": "Governance",  "status": "planned",     "display_order": 7},
    {"milestone_date": "2025-09", "label": "AI Champions in All BUs",                "dimension": "Org",         "status": "planned",     "display_order": 8},
    {"milestone_date": "2025-12", "label": "Full Maturity Target Achieved",          "dimension": "All",         "status": "planned",     "display_order": 9},
]

PLATFORM_MODULES_SEED = [
    {"module_name": "Governance & Risk Engine",  "status": "Active",      "installed": True,  "display_order": 0},
    {"module_name": "Capital Allocation Engine", "status": "Active",      "installed": True,  "display_order": 1},
    {"module_name": "Portfolio Intelligence",    "status": "Active",      "installed": True,  "display_order": 2},
    {"module_name": "Adoption & Change Engine",  "status": "In Progress", "installed": False, "display_order": 3},
    {"module_name": "Integration & MLOps",       "status": "In Progress", "installed": False, "display_order": 4},
]

ORGANIZATIONS_SEED = [
    {
        "company": "Apex Financial Group",
        "industry": "Financial Services",
        "baseline_maturity": 1.8,
        "current_maturity": 2.4,
        "target_maturity": 4.2,
    }
]
```

---

## 8. Key Design Decisions

1. **Control Tower is purely a read/aggregation layer** — it adds zero new business entities. All KPIs are computed from `use_cases`, `maturity_scores`, `maturity_dimension_history`, `strategic_objectives`, and `ai_health_indicators` already specified previously.

2. **`maturity_dimension_history` supplements `maturity_assessments`** — the existing maturity tables track per-criterion scores; this new table tracks the quarterly rolled-up dimension-level scores. Both are needed.

3. **`organizations` table is now fully defined** — `kD` reveals the last missing fields: `company`, `industry`, `baseline_maturity`, `current_maturity`, `target_maturity`.

4. **`ai_guardrails` and `red_team_findings` are new, non-trivial features** — they represent an automated safety testing pipeline. In the rebuild, `result` will be updated by background jobs (FastAPI Background Tasks or Celery).

5. **8 dedicated API endpoints** — each CT sub-page gets its own endpoint returning only the data it needs, avoiding over-fetching.

---

## 9. Complete Database Schema Summary (All Routes)

At this point, all 6 specced routes yield the following table inventory:

| Table | Primary Route | Type |
|---|---|---|
| `organizations` | Global | Core |
| `users` | `/admin` (TBD) | Core |
| `maturity_domains` | `/maturity` | Seed |
| `maturity_criteria` | `/maturity` | Seed |
| `maturity_assessments` | `/maturity` | Business |
| `maturity_scores` | `/maturity` | Business |
| `maturity_dimension_history` | `/control-tower/maturity` | Time-series |
| `maturity_milestones` | `/control-tower/maturity` | Seed/Business |
| `use_cases` | `/portfolio` | **Core (most-joined)** |
| `model_deployments` | `/portfolio` | Business |
| `risk_tier_definitions` | `/governance` | Seed |
| `approval_step_configs` | `/governance` | Seed |
| `governance_alerts` | `/governance` | Business |
| `approval_workflows` | `/governance` | Business |
| `model_cards` | `/governance` | Business (JSONB) |
| `portfolio_financial_history` | `/value` | Time-series |
| `use_case_financial_snapshots` | `/value` | Time-series |
| `bu_adoption_snapshots` | `/value` | Time-series |
| `strategic_objectives` | `/value` | Business |
| `ai_health_indicators` | `/value` | Business |
| `quarterly_milestones` | `/value` | Business |
| `platform_modules` | `/control-tower` | Seed/Business |
| `ai_guardrails` | `/control-tower/governance` | Business |
| `red_team_findings` | `/control-tower/governance` | Business |
| `compliance_frameworks` | `/control-tower/governance` | Business |
| `audit_logs` | `/control-tower/governance` | Business |

**Total: 26 tables** across 6 routes.
