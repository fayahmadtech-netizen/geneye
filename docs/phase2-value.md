# GenEye — Phase 2: Route Specification — `/value`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `pke` (page), `mke` (Overview tab), `hke` (ROI Calculator tab)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/value`
**Page Title:** "Value Forecast"
**Subtitle:** "Track AI investment returns, adoption efficiency, and realized business impact"

This is the **CFO/executive financial intelligence dashboard**. It visualises AI portfolio ROI, tracks investment vs. realized vs. projected value over time, shows BU-level adoption efficiency, maps AI contribution to strategic objectives, and provides an interactive ROI calculator.

### Top-of-Page KPI Strip (always visible)
| Label | Value | Source |
|---|---|---|
| Total AI Investment | `$1.69M` | `GP.totalInvestment` |
| Total Available Budget | `$8.5M` | hardcoded |
| Projected Value | `$7.8M` | `GP.projectedValue` |

### Tabs

| Tab ID | Label | Component | Primary Data |
|---|---|---|---|
| `overview` | Overview | `mke` | `Le[]` · `oJ[]` · `lJ[]` · `So[]` · `uJ` |
| `roi` | ROI Calculator | `hke` | `cJ` (calculator default inputs, all editable) |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `GP` — Portfolio KPI Summary

```json
{
  "totalInvestment": "$1.69M",
  "realizedValue":  "$4.2M",
  "projectedValue": "$7.8M",
  "netImpact":      "$2.51M"
}
```

> **DB Design:** Computed aggregate over `use_cases` (sum of `estimated_cost`) and `financial_snapshots` (realized/projected). Store as a **materialized view** or computed on-demand.

---

### 1.2 `oJ[]` — ROI by Initiative (5 items — Top Performers)

```json
[
  { "name": "Fraud Detection Suite",       "unit": "Finance & Risk",       "realized": "$3.2M", "projected": "$3.8M", "roi": "416%" },
  { "name": "AI-Driven Pricing Engine",    "unit": "Revenue Management",   "realized": "$2.1M", "projected": "$2.5M", "roi": "367%" },
  { "name": "Autonomous Claims Processing","unit": "Insurance Ops",         "realized": "$1.4M", "projected": "$1.7M", "roi": "400%" },
  { "name": "Customer Churn Predictor",    "unit": "CX & Retention",       "realized": "$890K", "projected": "$1.0M", "roi": "642%" },
  { "name": "Demand Forecasting AI",       "unit": "Supply Chain",         "realized": "$720K", "projected": "$810K", "roi": "747%" }
]
```

> **DB Design:** `realized` and `projected` values are stored per use case in a `financial_snapshots` table. `roi` is **computed server-side**.

---

### 1.3 `lJ[]` — Quarterly Time-Series (6 quarters)

```json
[
  { "quarter": "Q1 2024", "investment": 0.4,  "realized": 0.9,  "projected": 1.2 },
  { "quarter": "Q2 2024", "investment": 0.7,  "realized": 1.8,  "projected": 2.1 },
  { "quarter": "Q3 2024", "investment": 1.1,  "realized": 3.0,  "projected": 3.4 },
  { "quarter": "Q4 2024", "investment": 1.69, "realized": 4.2,  "projected": 4.8 },
  { "quarter": "Q1 2025", "investment": 1.69, "realized": null, "projected": 6.2 },
  { "quarter": "Q2 2025", "investment": 1.69, "realized": null, "projected": 7.8 }
]
```

**All values in $M.** `realized: null` means future quarters.

> **DB Design:** New `portfolio_financial_history` table — one row per quarter per org.

---

### 1.4 `So[]` — BU Adoption & Efficiency Metrics (7 business units)

```json
[
  { "bu": "Insurance Ops",      "adoptionRate": 82, "aiSpend": "$420K", "costPerUser": "$1,820", "utilization": 78, "efficiency": "High",   "trend": "up" },
  { "bu": "Revenue Management", "adoptionRate": 91, "aiSpend": "$380K", "costPerUser": "$1,540", "utilization": 89, "efficiency": "High",   "trend": "up" },
  { "bu": "Finance & Risk",     "adoptionRate": 74, "aiSpend": "$310K", "costPerUser": "$2,100", "utilization": 71, "efficiency": "Medium", "trend": "stable" },
  { "bu": "CX & Retention",     "adoptionRate": 67, "aiSpend": "$190K", "costPerUser": "$980",   "utilization": 65, "efficiency": "Medium", "trend": "up" },
  { "bu": "Legal & Procurement","adoptionRate": 45, "aiSpend": "$95K",  "costPerUser": "$1,320", "utilization": 42, "efficiency": "Low",    "trend": "down" },
  { "bu": "Supply Chain",       "adoptionRate": 88, "aiSpend": "$145K", "costPerUser": "$720",   "utilization": 84, "efficiency": "High",   "trend": "up" },
  { "bu": "Human Resources",    "adoptionRate": 38, "aiSpend": "$55K",  "costPerUser": "$640",   "utilization": 35, "efficiency": "Low",    "trend": "stable" }
]
```

**Enum values:**
- `efficiency`: `"High"` | `"Medium"` | `"Low"`
- `trend`: `"up"` | `"stable"` | `"down"`

> **DB Design:** New `bu_adoption_snapshots` table — periodic (quarterly) per-BU measurements.

---

### 1.5 `uJ` — Strategic Objectives & Health Indicators

```json
{
  "strategicObjectives": [
    { "objective": "Reduce Operational Costs by 20%", "aiContribution": 68, "status": "On Track", "owner": "CFO Office" },
    { "objective": "Increase Revenue by $10M",        "aiContribution": 42, "status": "At Risk",  "owner": "CEO Office" },
    { "objective": "Improve Customer NPS by 15pts",   "aiContribution": 55, "status": "On Track", "owner": "CCO Office" },
    { "objective": "Reduce Risk Exposure by 30%",     "aiContribution": 81, "status": "Ahead",    "owner": "CRO Office" }
  ],
  "aiHealthIndicators": [
    { "label": "Portfolio Health",        "value": 76, "status": "good" },
    { "label": "Governance Compliance",   "value": 91, "status": "good" },
    { "label": "Talent Readiness",        "value": 58, "status": "warn" },
    { "label": "Technology Enablement",   "value": 70, "status": "good" },
    { "label": "Value Delivery",          "value": 84, "status": "good" },
    { "label": "Risk Posture",            "value": 47, "status": "warn" }
  ],
  "quarterlyMilestones": [
    { "quarter": "Q1 2025", "target": "$6.2M",  "forecast": "$5.9M",  "gap": "-$0.3M", "status": "At Risk" },
    { "quarter": "Q2 2025", "target": "$7.8M",  "forecast": "$8.1M",  "gap": "+$0.3M", "status": "Ahead" },
    { "quarter": "Q3 2025", "target": "$10.2M", "forecast": "$10.2M", "gap": "$0",     "status": "On Track" },
    { "quarter": "Q4 2025", "target": "$13.5M", "forecast": null,     "gap": "—",      "status": "Forecast Pending" }
  ]
}
```

**Enum values:**
- `status` (objectives): `"On Track"` | `"At Risk"` | `"Ahead"`
- `status` (health): `"good"` | `"warn"` | `"critical"`
- `status` (milestones): `"On Track"` | `"At Risk"` | `"Ahead"` | `"Forecast Pending"`

> **DB Design:** `strategic_objectives` table + `ai_health_indicators` table + `quarterly_milestones` table — all org-scoped.

---

### 1.6 `cJ` — ROI Calculator Default Inputs

```json
{
  "projectName":        "AI Initiative",
  "implementationCost": 250000,
  "annualLicenseCost":  60000,
  "teamHours":          2400,
  "hourlyRate":         120,
  "productivityGain":   30,
  "revenueUplift":      500000,
  "costAvoidance":      180000,
  "riskReductionValue": 80000,
  "timeToValue":        6
}
```

**ROI Formulas extracted from `hke`:**

```typescript
const totalCost    = implementationCost + annualLicenseCost + (teamHours * hourlyRate);
const productivityBenefit = (teamHours * hourlyRate) * (productivityGain / 100);
const totalBenefit = productivityBenefit + revenueUplift + costAvoidance + riskReductionValue;
const netImpact    = totalBenefit - totalCost;
const roiPct       = totalCost > 0 ? (netImpact / totalCost) * 100 : 0;
const paybackMonths = totalCost / (totalBenefit / 12);  // months to break-even
```

> **DB Design:** Calculator defaults stored in `organizations` table as JSON, or as per-use-case overrides in `use_cases`. The calculator runs **entirely client-side** — no API call needed for calculation.

---

## 2. Data Models (SQLModel / PostgreSQL)

### 2.1 `PortfolioFinancialHistory` — Quarterly Time-Series

```python
import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class PortfolioFinancialHistory(SQLModel, table=True):
    __tablename__ = "portfolio_financial_history"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    quarter: str               # e.g. "Q1 2024"  (YYYY-Qn format)
    year: int
    quarter_num: int           # 1–4

    # All values in $M
    investment_m: float        # cumulative investment
    realized_m: Optional[float] = None     # null = future quarter
    projected_m: float

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.2 `UseCaseFinancialSnapshot` — Per-Initiative Financials

```python
class UseCaseFinancialSnapshot(SQLModel, table=True):
    """
    Updated quarterly per use case.
    Separate from the string fields on use_cases for proper numerics.
    """
    __tablename__ = "use_case_financial_snapshots"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    use_case_id: uuid.UUID = Field(foreign_key="use_cases.id", index=True)

    snapshot_quarter: str                    # e.g. "Q4 2024"
    realized_value_k: Optional[float] = None # in $K
    projected_value_k: Optional[float] = None
    roi_pct: Optional[float] = None          # computed: (realized - cost) / cost * 100

    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.3 `BuAdoptionSnapshot` — BU-Level Adoption Metrics

```python
class BuAdoptionSnapshot(SQLModel, table=True):
    __tablename__ = "bu_adoption_snapshots"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    snapshot_quarter: str
    business_unit: str

    adoption_rate: int             # 0–100 (%)
    ai_spend: str                  # display string e.g. "$420K"
    ai_spend_k: Optional[float]    # numeric for sorting/filtering
    cost_per_user: str             # display string e.g. "$1,820"
    cost_per_user_numeric: Optional[float]
    utilization: int               # 0–100 (%)
    efficiency: str                # "High" | "Medium" | "Low"
    trend: str                     # "up" | "stable" | "down"

    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.4 `StrategicObjective`

```python
class StrategicObjective(SQLModel, table=True):
    __tablename__ = "strategic_objectives"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    objective: str
    ai_contribution: int           # 0–100 (%)
    status: str                    # "On Track" | "At Risk" | "Ahead"
    owner: str
    display_order: int = Field(default=0)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.5 `AiHealthIndicator`

```python
class AiHealthIndicator(SQLModel, table=True):
    __tablename__ = "ai_health_indicators"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    label: str                     # e.g. "Portfolio Health"
    value: int                     # 0–100
    status: str                    # "good" | "warn" | "critical"
    display_order: int = Field(default=0)

    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.6 `QuarterlyMilestone`

```python
class QuarterlyMilestone(SQLModel, table=True):
    __tablename__ = "quarterly_milestones"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    quarter: str                         # "Q1 2025"
    target_m: float                      # $M
    forecast_m: Optional[float] = None   # null = pending
    gap: Optional[str] = None            # display string e.g. "-$0.3M"
    status: str                          # "On Track"|"At Risk"|"Ahead"|"Forecast Pending"

    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.7 `Organizations` Table (additions)

Add ROI calculator defaults as a JSON field:

```python
# Add to organizations table:
roi_calculator_defaults: dict = Field(
    default={
        "implementationCost": 250000, "annualLicenseCost": 60000,
        "teamHours": 2400, "hourlyRate": 120, "productivityGain": 30,
        "revenueUplift": 500000, "costAvoidance": 180000,
        "riskReductionValue": 80000, "timeToValue": 6
    },
    sa_column=Column(JSON)
)
total_budget_m: Optional[float] = Field(default=8.5)  # FY budget
```

### 2.8 Entity Relationship Diagram

```
organizations
    │
    ├──< portfolio_financial_history    (org_id, quarterly time-series)
    ├──< bu_adoption_snapshots          (org_id, per-BU quarterly)
    ├──< strategic_objectives           (org_id)
    ├──< ai_health_indicators           (org_id)
    └──< quarterly_milestones           (org_id)

use_cases
    └──< use_case_financial_snapshots   (use_case_id, quarterly)
```

---

## 3. API Contracts (FastAPI)

### 3.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional
import uuid

# ── KPI Summary ───────────────────────────────────────────────
class PortfolioKpis(BaseModel):
    total_investment: str
    realized_value: str
    projected_value: str
    net_impact: str
    total_budget: str

# ── Initiative ROI ────────────────────────────────────────────
class InitiativeRoi(BaseModel):
    use_case_id: uuid.UUID
    name: str
    business_unit: str
    realized: str
    projected: str
    roi_pct: str        # e.g. "416%"

# ── Time-Series ───────────────────────────────────────────────
class QuarterlyFinancial(BaseModel):
    quarter: str
    investment_m: float
    realized_m: Optional[float]
    projected_m: float

# ── BU Adoption ───────────────────────────────────────────────
class BuAdoptionRow(BaseModel):
    business_unit: str
    adoption_rate: int
    ai_spend: str
    cost_per_user: str
    utilization: int
    efficiency: str
    trend: str

# ── Strategic Objectives ──────────────────────────────────────
class StrategicObjectiveRead(BaseModel):
    id: uuid.UUID
    objective: str
    ai_contribution: int
    status: str
    owner: str

# ── Health Indicators ─────────────────────────────────────────
class HealthIndicatorRead(BaseModel):
    label: str
    value: int
    status: str

# ── Quarterly Milestones ──────────────────────────────────────
class QuarterlyMilestoneRead(BaseModel):
    quarter: str
    target_m: float
    forecast_m: Optional[float]
    gap: Optional[str]
    status: str

# ── Full Value Overview Response ──────────────────────────────
class ValueOverviewResponse(BaseModel):
    kpis: PortfolioKpis
    roi_by_initiative: List[InitiativeRoi]
    quarterly_history: List[QuarterlyFinancial]
    bu_adoption: List[BuAdoptionRow]
    strategic_objectives: List[StrategicObjectiveRead]
    health_indicators: List[HealthIndicatorRead]
    quarterly_milestones: List[QuarterlyMilestoneRead]

# ── ROI Calculator ────────────────────────────────────────────
class RoiCalculatorInputs(BaseModel):
    project_name: str = "AI Initiative"
    implementation_cost: float = 250000
    annual_license_cost: float = 60000
    team_hours: int = 2400
    hourly_rate: float = 120
    productivity_gain: float = 30       # %
    revenue_uplift: float = 500000
    cost_avoidance: float = 180000
    risk_reduction_value: float = 80000
    time_to_value: int = 6              # months

class RoiCalculatorResult(BaseModel):
    total_cost: float
    total_benefit: float
    net_impact: float
    roi_pct: float
    payback_months: float
    # formatted display versions:
    total_cost_fmt: str
    total_benefit_fmt: str
    net_impact_fmt: str
    roi_pct_fmt: str
    payback_fmt: str
```

### 3.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/value/overview` | Full dashboard data in one call |
| `GET` | `/api/value/kpis` | Top-strip KPI summary |
| `GET` | `/api/value/roi-by-initiative` | ROI ranked list (top performers) |
| `GET` | `/api/value/quarterly-history` | Time-series investment/realized/projected |
| `GET` | `/api/value/bu-adoption` | Per-BU adoption metrics (current quarter) |
| `GET` | `/api/value/strategic-objectives` | Strategic objective alignment |
| `GET` | `/api/value/health-indicators` | AI portfolio health scorecard |
| `GET` | `/api/value/quarterly-milestones` | Forecast vs. target tracking |
| `POST` | `/api/value/roi-calculator` | Server-side ROI calculation |
| `GET` | `/api/value/roi-calculator/defaults` | Get org's saved calculator defaults |
| `PUT` | `/api/value/roi-calculator/defaults` | Save updated calculator defaults for org |

> **Note:** The ROI calculator can run **entirely client-side** (pure math, no DB). The `POST /api/value/roi-calculator` endpoint is optional — useful for saving scenarios. Start with client-side only.

#### Example: `GET /api/value/overview` Response

```json
{
  "kpis": {
    "total_investment": "$1.69M",
    "realized_value": "$4.2M",
    "projected_value": "$7.8M",
    "net_impact": "$2.51M",
    "total_budget": "$8.5M"
  },
  "roi_by_initiative": [
    { "name": "Fraud Detection Suite", "business_unit": "Finance & Risk",
      "realized": "$3.2M", "projected": "$3.8M", "roi_pct": "416%" }
  ],
  "quarterly_history": [
    { "quarter": "Q1 2024", "investment_m": 0.4, "realized_m": 0.9,  "projected_m": 1.2 },
    { "quarter": "Q1 2025", "investment_m": 1.69, "realized_m": null, "projected_m": 6.2 }
  ],
  "bu_adoption": [
    { "business_unit": "Revenue Management", "adoption_rate": 91,
      "ai_spend": "$380K", "cost_per_user": "$1,540",
      "utilization": 89, "efficiency": "High", "trend": "up" }
  ],
  "strategic_objectives": [
    { "objective": "Reduce Operational Costs by 20%",
      "ai_contribution": 68, "status": "On Track", "owner": "CFO Office" }
  ],
  "health_indicators": [
    { "label": "Portfolio Health",       "value": 76, "status": "good" },
    { "label": "Governance Compliance",  "value": 91, "status": "good" },
    { "label": "Talent Readiness",       "value": 58, "status": "warn" },
    { "label": "Technology Enablement",  "value": 70, "status": "good" },
    { "label": "Value Delivery",         "value": 84, "status": "good" },
    { "label": "Risk Posture",           "value": 47, "status": "warn" }
  ],
  "quarterly_milestones": [
    { "quarter": "Q1 2025", "target_m": 6.2, "forecast_m": 5.9, "gap": "-$0.3M", "status": "At Risk" },
    { "quarter": "Q4 2025", "target_m": 13.5, "forecast_m": null, "gap": "—", "status": "Forecast Pending" }
  ]
}
```

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── value/
    └── page.tsx                                 ← Server Component (fetches overview)
        └── <ValuePage>
              ├── <PageHeader />
              ├── <KpiStrip>                      ← always visible: 3 top KPI cards
              │     ├── Total Investment
              │     ├── Total Available Budget
              │     └── Projected Value
              ├── <TabBar tabs={TABS} />          ← Client: activeTab state
              └── {
                    overview: <ValueOverviewTab />,
                    roi:      <RoiCalculatorTab />
                  }[activeTab]

    components/
    ├── ValueOverviewTab.tsx                      ← Client (filter/sort + selectedUseCase state)
    │     ├── <RiskVsValueScatterChart />         ← Recharts ScatterChart (Le[])
    │     │     └── uses: riskScore (x), valueScore (y), stage (color)
    │     ├── <InitiativeRoiTable />              ← sortable — oJ[] ranked list
    │     ├── <QuarterlyTrendChart />             ← Recharts LineChart — lJ[] time-series
    │     │     └── 3 lines: investment / realized / projected
    │     ├── <BuAdoptionTable />                 ← So[] with trend arrows
    │     ├── <StrategicObjectivesCard />         ← uJ.strategicObjectives
    │     ├── <AiHealthScorecard />               ← uJ.aiHealthIndicators (gauge bars)
    │     └── <QuarterlyMilestonesTable />        ← uJ.quarterlyMilestones
    │
    └── RoiCalculatorTab.tsx                      ← Client (all inputs as useState)
          ├── <CostInputsCard />                  ← Implementation, License, Team costs
          ├── <BenefitInputsCard />               ← Productivity, Revenue, Cost Avoidance, Risk
          └── <RoiResultsPanel />                 ← Live-computed: Total Cost, Net Impact, ROI%, Payback
```

### Server vs. Client Split

| Component | Type | Reason |
|---|---|---|
| `app/value/page.tsx` | **Server** | Fetches full overview data SSR |
| `<KpiStrip>` | **Server** (static) | Pure display, no interactivity |
| `<TabBar>` | **Client** | `activeTab` state |
| `<ValueOverviewTab>` | **Client** | Filter/sort/select state on scatter chart |
| `<RiskVsValueScatterChart>` | **Client** | Chart interactions, hover tooltips |
| `<QuarterlyTrendChart>` | **Client** | Recharts (requires browser DOM) |
| `<RoiCalculatorTab>` | **Client** | 9 `useState` inputs + live computed outputs |

---

## 5. State & Interactivity

### Tab-Level State

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<TabBar>` | `"overview"` or `"roi"` |

### Overview Tab State

| State | Type | Scope | Purpose |
|---|---|---|---|
| `searchQuery` | `string` | `<ValueOverviewTab>` | Filter initiative table |
| `stageFilter` | `string` | `<ValueOverviewTab>` | `"All"` or stage value |
| `sortBy` | `string` | `<ValueOverviewTab>` | `"valueScore"` \| `"name"` \| `"stage"` |
| `sortOrder` | `"asc"\|"desc"` | `<ValueOverviewTab>` | Sort direction |
| `selectedUseCaseId` | `string\|null` | `<ValueOverviewTab>` | Highlighted dot on scatter chart + row |

### ROI Calculator State (extracted from `hke`)

| State Variable | Default | Unit | Input |
|---|---|---|---|
| `implementationCost` | `250,000` | $ | Number input |
| `annualLicenseCost` | `60,000` | $ | Number input |
| `teamHours` | `2,400` | hrs | Number input |
| `hourlyRate` | `120` | $/hr | Number input |
| `productivityGain` | `30` | % | Number input |
| `revenueUplift` | `500,000` | $ | Number input |
| `costAvoidance` | `180,000` | $ | Number input |
| `riskReductionValue` | `80,000` | $ | Number input |
| `timeToValue` | `6` | months | Number input |

### ROI Formula (client-side, no API needed)

```typescript
const totalCost     = implementationCost + annualLicenseCost + (teamHours * hourlyRate);
const prodBenefit   = (teamHours * hourlyRate) * (productivityGain / 100);
const totalBenefit  = prodBenefit + revenueUplift + costAvoidance + riskReductionValue;
const netImpact     = totalBenefit - totalCost;
const roiPct        = totalCost > 0 ? (netImpact / totalCost) * 100 : 0;
const paybackMonths = totalCost / (totalBenefit / 12);

// Display formatter (extracted from `tf` helper):
const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` :
  n >= 1_000     ? `$${(n / 1_000).toFixed(0)}K` :
                   `$${n.toLocaleString()}`;
```

---

## 6. Seed Data (DB Migration)

```python
PORTFOLIO_FINANCIAL_HISTORY_SEED = [
    {"quarter": "Q1 2024", "year": 2024, "quarter_num": 1,
     "investment_m": 0.4,  "realized_m": 0.9,  "projected_m": 1.2},
    {"quarter": "Q2 2024", "year": 2024, "quarter_num": 2,
     "investment_m": 0.7,  "realized_m": 1.8,  "projected_m": 2.1},
    {"quarter": "Q3 2024", "year": 2024, "quarter_num": 3,
     "investment_m": 1.1,  "realized_m": 3.0,  "projected_m": 3.4},
    {"quarter": "Q4 2024", "year": 2024, "quarter_num": 4,
     "investment_m": 1.69, "realized_m": 4.2,  "projected_m": 4.8},
    {"quarter": "Q1 2025", "year": 2025, "quarter_num": 1,
     "investment_m": 1.69, "realized_m": None, "projected_m": 6.2},
    {"quarter": "Q2 2025", "year": 2025, "quarter_num": 2,
     "investment_m": 1.69, "realized_m": None, "projected_m": 7.8},
]

BU_ADOPTION_SEED = [
    {"business_unit": "Insurance Ops",      "snapshot_quarter": "Q4 2024",
     "adoption_rate": 82, "ai_spend": "$420K", "ai_spend_k": 420, "cost_per_user": "$1,820",
     "cost_per_user_numeric": 1820, "utilization": 78, "efficiency": "High", "trend": "up"},
    {"business_unit": "Revenue Management", "snapshot_quarter": "Q4 2024",
     "adoption_rate": 91, "ai_spend": "$380K", "ai_spend_k": 380, "cost_per_user": "$1,540",
     "cost_per_user_numeric": 1540, "utilization": 89, "efficiency": "High", "trend": "up"},
    {"business_unit": "Finance & Risk",     "snapshot_quarter": "Q4 2024",
     "adoption_rate": 74, "ai_spend": "$310K", "ai_spend_k": 310, "cost_per_user": "$2,100",
     "cost_per_user_numeric": 2100, "utilization": 71, "efficiency": "Medium", "trend": "stable"},
    {"business_unit": "CX & Retention",     "snapshot_quarter": "Q4 2024",
     "adoption_rate": 67, "ai_spend": "$190K", "ai_spend_k": 190, "cost_per_user": "$980",
     "cost_per_user_numeric": 980, "utilization": 65, "efficiency": "Medium", "trend": "up"},
    {"business_unit": "Legal & Procurement","snapshot_quarter": "Q4 2024",
     "adoption_rate": 45, "ai_spend": "$95K",  "ai_spend_k": 95,  "cost_per_user": "$1,320",
     "cost_per_user_numeric": 1320, "utilization": 42, "efficiency": "Low", "trend": "down"},
    {"business_unit": "Supply Chain",       "snapshot_quarter": "Q4 2024",
     "adoption_rate": 88, "ai_spend": "$145K", "ai_spend_k": 145, "cost_per_user": "$720",
     "cost_per_user_numeric": 720, "utilization": 84, "efficiency": "High", "trend": "up"},
    {"business_unit": "Human Resources",    "snapshot_quarter": "Q4 2024",
     "adoption_rate": 38, "ai_spend": "$55K",  "ai_spend_k": 55,  "cost_per_user": "$640",
     "cost_per_user_numeric": 640, "utilization": 35, "efficiency": "Low", "trend": "stable"},
]

STRATEGIC_OBJECTIVES_SEED = [
    {"objective": "Reduce Operational Costs by 20%", "ai_contribution": 68, "status": "On Track", "owner": "CFO Office", "display_order": 0},
    {"objective": "Increase Revenue by $10M",        "ai_contribution": 42, "status": "At Risk",  "owner": "CEO Office", "display_order": 1},
    {"objective": "Improve Customer NPS by 15pts",   "ai_contribution": 55, "status": "On Track", "owner": "CCO Office", "display_order": 2},
    {"objective": "Reduce Risk Exposure by 30%",     "ai_contribution": 81, "status": "Ahead",    "owner": "CRO Office", "display_order": 3},
]

HEALTH_INDICATORS_SEED = [
    {"label": "Portfolio Health",       "value": 76, "status": "good", "display_order": 0},
    {"label": "Governance Compliance",  "value": 91, "status": "good", "display_order": 1},
    {"label": "Talent Readiness",       "value": 58, "status": "warn", "display_order": 2},
    {"label": "Technology Enablement",  "value": 70, "status": "good", "display_order": 3},
    {"label": "Value Delivery",         "value": 84, "status": "good", "display_order": 4},
    {"label": "Risk Posture",           "value": 47, "status": "warn", "display_order": 5},
]

QUARTERLY_MILESTONES_SEED = [
    {"quarter": "Q1 2025", "target_m": 6.2,  "forecast_m": 5.9,  "gap": "-$0.3M", "status": "At Risk"},
    {"quarter": "Q2 2025", "target_m": 7.8,  "forecast_m": 8.1,  "gap": "+$0.3M", "status": "Ahead"},
    {"quarter": "Q3 2025", "target_m": 10.2, "forecast_m": 10.2, "gap": "$0",     "status": "On Track"},
    {"quarter": "Q4 2025", "target_m": 13.5, "forecast_m": None, "gap": None,     "status": "Forecast Pending"},
]
```

---

## 7. Key Design Decisions

1. **`GET /api/value/overview` is a single compound endpoint** — the entire overview tab is loaded in one round-trip. This avoids the waterfall of 7 separate requests and matches performance expectations for a live dashboard.

2. **ROI Calculator runs client-side** — the `hke` component has 9 `useState` hooks and derives all outputs via pure math formulas. No server round-trip needed. The `POST /api/value/roi-calculator` endpoint is optional and only needed for saving scenarios.

3. **`display_fmt` fields alongside numerics** — both `bu_adoption_snapshots` and `use_case_financial_snapshots` store the original display strings (e.g. `"$420K"`) alongside numeric versions for proper sorting and charting.

4. **Scatter chart uses `Le[]`** — same `use_cases` data as governance, filtered to `riskScore` + `valueScore`. No new API endpoint needed; the overview endpoint should include enriched use-case data.

---

## 8. Notes for Next Phase

- **`/control-tower`** aggregates data from maturity (`kD`, `qo`, `gf`), governance (`Le[]`), and value (`uJ`) — all already documented. The Control Tower spec will be mostly an **aggregation/composition** exercise.
- **`/command-center`** introduces new data: real-time incident data, operational KPIs, and system status indicators — these will require new tables.
- **`/admin`** finalises the `users` / `organizations` tables already referenced throughout. This should be specced early to lock down the auth model.
