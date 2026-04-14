# GenEye — Phase 2: Route Specification — `/ato`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `z5e` (full page — all 5 steps rendered inline, no sub-components)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/ato`
**Page Title:** "AI Transformation Office"
**Subtitle:** "Enterprise AI Readiness & Operating Model Diagnostic"

This is the **AI Transformation Office (ATO) Diagnostic** — a stateful, 5-step wizard that collects executive context, scores the organisation across 6 maturity dimensions, generates risk/value positioning, drafts a personalised OS blueprint roadmap, and produces a board-ready executive review.

> **⚠️ Critical Discovery:** This is the **only route in the entire application with an actual backend integration**. It calls Supabase directly via `ba.from("ato_diagnostics")` to persist and retrieve saved diagnostics. All database schema decisions are therefore **informed by the existing Supabase table schema** visible in the code.

---

## 1. The 5-Step Wizard Structure

### `D5e[]` — Steps Definition

```json
[
  { "key": "intake",          "label": "Executive Intake",          "order": 0 },
  { "key": "scoring",         "label": "AI Maturity Scoring",        "order": 1 },
  { "key": "prioritization",  "label": "Risk & Value Prioritization","order": 2 },
  { "key": "blueprint",       "label": "OS Blueprint Draft",         "order": 3 },
  { "key": "review",          "label": "Executive Review",           "order": 4 }
]
```

---

## 2. Hardcoded Config Data — Full Extraction

### 2.1 `of` — Maturity Dimension Config (6 dimensions)

This is the **canonical maturity dimension registry** — shared with `/maturity`, `/control-tower/maturity`, and the dimension history tables.

```json
{
  "governance": {
    "label": "Governance",
    "fullLabel": "Governance & Risk Control",
    "tip": "Policies, AI council, compliance frameworks, and Responsible AI enforcement across the enterprise."
  },
  "capital": {
    "label": "Capital",
    "fullLabel": "Capital & Investment Discipline",
    "tip": "AI investment prioritization framework, ROI tracking methodology, and funding processes."
  },
  "org": {
    "label": "Org Model",
    "fullLabel": "Org & Operating Model",
    "tip": "CAIO function, AI champion network, defined roles, and enterprise adoption model."
  },
  "portfolio": {
    "label": "Portfolio",
    "fullLabel": "Portfolio Visibility",
    "tip": "Enterprise-wide AI project visibility, shadow AI mapping, and initiative tracking."
  },
  "adoption": {
    "label": "Adoption",
    "fullLabel": "Adoption & Change Management",
    "tip": "Training programs, cultural readiness, BU adoption metrics, and change management maturity."
  },
  "integration": {
    "label": "AI & Data Platform",
    "fullLabel": "AI and Data Platform",
    "tip": "Identity management, workflow integration, model lifecycle, and enterprise system readiness."
  }
}
```

---

### 2.2 `Vp` — Maturity-to-Timeline Mapping

Current maturity level → recommended roadmap duration:

```json
{
  "Ad-hoc":   { "months": 12, "label": "12-Month" },
  "Emerging": { "months": 6,  "label": "6-Month" },
  "Defined":  { "months": 12, "label": "12-Month" },
  "Managed":  { "months": 6,  "label": "6-Month" },
  "Optimized":{ "months": 3,  "label": "3-Month" }
}
```

---

### 2.3 `$5e` — Industry Dropdown Options

```json
["Semiconductors","Automotive","Healthcare","Financial Services","Manufacturing","Energy","Telecom","Retail","Technology","Other"]
```

### 2.4 `L5e` — Maturity Level Options (for current maturity selector)

```json
["Ad-hoc","Emerging","Defined","Managed","Optimized"]
```

### 2.5 `F5e` — Stakeholder Title Options (multi-select checkboxes)

```json
["CEO","CIO","CAIO","CFO","COO","CTO","CHRO","BU Head","VP Engineering","VP Data"]
```

---

### 2.6 Scoring & Classification Functions

#### `B5e(valueScore, riskScore)` → quadrant category

```python
def classify_quadrant(value_score: float, risk_score: float) -> str:
    if value_score >= 2.5 and risk_score < 2.5:
        return "High Value / Low Risk"
    elif value_score >= 2.5 and risk_score >= 2.5:
        return "High Value / High Risk"
    elif value_score < 2.5 and risk_score < 2.5:
        return "Low Value / Low Risk"
    else:
        return "Low Value / High Risk"
```

#### Score Computation

```python
# Value Score = average of adoption + capital + portfolio
value_score = (scores["adoption"] + scores["capital"] + scores["portfolio"]) / 3

# Risk Score = average of governance + integration + org
risk_score = (scores["governance"] + scores["integration"] + scores["org"]) / 3

# Overall Maturity = average of all 6 dimensions
avg_score = sum(scores.values()) / 6
```

#### Quadrant Descriptions (`U5`)

| Quadrant | Description |
|---|---|
| High Value / Low Risk | Strong strategic alignment with low organizational risk. Ideal for accelerated AI adoption with modular ATO install. |
| High Value / High Risk | High strategic value but significant governance and integration gaps. Prioritize risk mitigation before scaling. |
| Low Value / Low Risk | Stable but underinvested. Opportunity to increase AI ambition and strategic alignment. |
| Low Value / High Risk | Significant gaps across value and risk dimensions. Focus on foundational governance and capability building. |

---

### 2.7 Roadmap Phases — Computed `h[]` (5 phases, score-adaptive summaries)

The roadmap is **computed dynamically** from `avgScore` and per-dimension scores. Deliverables are fixed but summaries are score-conditional (`dim < 3` vs `dim >= 3`):

```json
[
  {
    "phaseIndex": 0,
    "module": "Vision Engine",
    "milestone": "Vision, Strategy & Org Design",
    "summaryIfLow": "Enterprise AI vision undefined — establish strategic north star, use-case taxonomy, and executive alignment on AI ambition.",
    "summaryIfHigh": "AI vision articulated — refine strategic roadmap, align BU priorities, and formalize enterprise AI thesis.",
    "deliverables": [
      "Define Business Aligned Vision — Align AI vision to platform, product and tooling ecosystem",
      "Build Strategy Document",
      "Define operating model and AI guiding principles",
      "Complete org design",
      "Define criteria for build vs buy model for data and AI platform",
      "Establish unified data and AI platform with governance and monitoring capability",
      "Establish AI Helpdesk for production support",
      "Draft Board Level Material"
    ]
  },
  {
    "phaseIndex": 1,
    "module": "Governance Engine",
    "milestone": "Policies, Council, Compliance & RAI Enforcement",
    "summaryIfLow": "Critical governance gaps detected — prioritize policy & oversight setup, AI council charter, and RAI framework.",
    "summaryIfHigh": "Governance foundation solid — refine documentation and establish continuous compliance monitoring.",
    "deliverables": [
      "Set up lightweight governance process",
      "Set up AI Council or Enterprise AI Board with key members, mandate and decision rights",
      "Define and implement risk and value based AI use case prioritization",
      "Define Enterprise AI Risk Classification Framework",
      "Introduce AI Model Card",
      "Implement RAI review and approval workflow",
      "Implement automated controls (Guardrails and Red Teaming) applied across all Tier 2 and Tier 3 AI models",
      "Implement Regulatory & Framework Compliance Tracker"
    ]
  },
  {
    "phaseIndex": 2,
    "module": "Capital Engine",
    "milestone": "Activate Capital & Investment Pipeline",
    "summaryIfLow": "Capital discipline weak — establish ROI tracking, funding governance, and investment prioritization.",
    "summaryIfHigh": "Financial governance in place — optimize allocation model and implement portfolio-level ROI tracking.",
    "deliverables": [
      "Establish Use Case Prioritization framework and Intake portal",
      "ROI tracking",
      "Funding processes (review, approvals and executive sign-off)"
    ]
  },
  {
    "phaseIndex": 3,
    "module": "Control Engine",
    "milestone": "Control — Portfolio Visibility & Scale",
    "summaryIfLow": "Portfolio visibility limited — build enterprise AI registry, shadow AI mapping, and KPI dashboards.",
    "summaryIfHigh": "Control plane operational — enhance real-time monitoring and cross-BU portfolio visibility.",
    "deliverables": [
      "Establish enterprise-wide AI project visibility and Executive Dashboard",
      "Establish routines — AI Council / EAI Board for executive alignment and funding",
      "Establish cadence of meetings — from Daily Syncs to MBRs and QBRs",
      "Track shadow AI mapping",
      "Track AI Maturity Score"
    ]
  },
  {
    "phaseIndex": 4,
    "module": "Adoption and Value Measurement Engine",
    "milestone": "Scale & Enterprise Adoption",
    "summaryIfLow": "Adoption readiness low — focus on AI Academy, change management playbook, and BU enablement.",
    "summaryIfHigh": "Strong adoption posture — scale winning patterns, embed champions, and measure BU adoption metrics.",
    "deliverables": [
      "Establish L&D partnership, Talent roadmap and launch AI Academy",
      "Build BU Adoption Model",
      "Design and Implement AI Champion Network",
      "Track Adoption insights and usage across platforms, Agents and toolings",
      "Track AI investment returns and realized business impact"
    ]
  }
]
```

---

### 2.8 Phase Timing Formula

```python
def compute_phase_range(phase_index: int, timeline_months: int) -> str:
    """Compute week range for a given phase."""
    weeks_per_phase = round(timeline_months * 4 / 5)   # distribute total weeks across 5 phases
    start_week = phase_index * weeks_per_phase + 1
    end_week   = (phase_index + 1) * weeks_per_phase
    return f"Week {start_week}–{end_week}"
```

---

## 3. Existing Supabase Schema — `ato_diagnostics`

The code directly calls `ba.from("ato_diagnostics")` with the following field mapping — **this defines the existing DB schema we must mirror exactly**:

```python
# INSERT payload (from V save function):
{
    "company_name":       r.company,
    "industry":           r.industry,
    "num_bus":            r.numBUs,
    "stakeholders":       r.stakeholders,          # JSON array
    "strategic_ai_goals": r.strategicAIgoals,      # JSON array
    "current_maturity":   r.currentMaturity,       # "Ad-hoc"|"Emerging"|etc.
    "ai_org_structure":   r.aiOrgStructure,
    "scores":             o,                        # {governance,capital,org,portfolio,adoption,integration}
    "prioritization":     c,                        # {valueScore, riskScore, category}
    "blueprint":          h,                        # computed phase objects array
    "timeline_label":     u.label,                 # "12-Month" | "6-Month" | "3-Month"
    "timeline_months":    u.months,                # 3 | 6 | 12
    "avg_score":          +d.toFixed(1)            # 0.0-5.0
}

# SELECT for listing (O function):
# columns: "id, company_name, industry, current_maturity, avg_score, created_at"

# SELECT full (U load function):
# columns: "*" filtered by id
```

---

## 4. Data Models (SQLModel / PostgreSQL)

```python
import uuid
from datetime import datetime
from typing import Optional, List, Dict
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

class AtoDiagnostic(SQLModel, table=True):
    __tablename__ = "ato_diagnostics"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="organizations.id", index=True
    )
    created_by: Optional[uuid.UUID] = Field(
        default=None, foreign_key="users.id"
    )

    # Step 0 — Executive Intake
    company_name: str
    industry: str
    num_bus: Optional[str] = None             # "5-10 BUs"
    stakeholders: List[str] = Field(
        default=[], sa_column=Column(JSON)
    )                                          # ["CEO","CIO","CAIO"]
    strategic_ai_goals: List[str] = Field(
        default=[], sa_column=Column(JSON)
    )                                          # free-form goals added by user
    current_maturity: str                      # "Ad-hoc"|"Emerging"|"Defined"|"Managed"|"Optimized"
    ai_org_structure: Optional[str] = None     # free-text description

    # Step 1 — AI Maturity Scoring (6 dimensions × 0-5)
    scores: Dict = Field(
        default={
            "governance": 0, "capital": 0, "org": 0,
            "portfolio": 0, "adoption": 0, "integration": 0
        },
        sa_column=Column(JSON)
    )

    # Step 2 — Risk/Value Prioritization (computed)
    prioritization: Dict = Field(
        default={},
        sa_column=Column(JSON)
    )                                          # {valueScore, riskScore, category}

    # Step 3 — Blueprint (computed roadmap)
    blueprint: List[dict] = Field(
        default=[], sa_column=Column(JSON)
    )                                          # 5 phase objects

    # Computed summaries
    timeline_label: Optional[str] = None       # "12-Month" | "6-Month" | "3-Month"
    timeline_months: Optional[int] = None
    avg_score: Optional[float] = None          # 0.0–5.0

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Derived / Seed Tables

```python
# ── ATO Roadmap Phase Template (seed — drives blueprint generation) ──
class AtoPhaseTemplate(SQLModel, table=True):
    __tablename__ = "ato_phase_templates"

    id: int = Field(primary_key=True)              # 0–4
    module: str
    milestone: str
    dimension_key: Optional[str] = None            # which dimension's score drives summary
    summary_if_low: str                             # score < 3
    summary_if_high: str                            # score >= 3
    deliverables: List[str] = Field(
        default=[], sa_column=Column(JSON)
    )

# ── ATO Dimension Config (seed) ──────────────────────────────────
class AtoDimensionConfig(SQLModel, table=True):
    __tablename__ = "ato_dimension_configs"

    key: str = Field(primary_key=True)             # "governance"|"capital"|etc.
    label: str
    full_label: str
    tip: str
    display_order: int = Field(default=0)

# ── ATO Maturity Timeline Config (seed) ──────────────────────────
class AtoTimelineConfig(SQLModel, table=True):
    __tablename__ = "ato_timeline_configs"

    maturity_level: str = Field(primary_key=True)  # "Ad-hoc"|"Emerging"|etc.
    months: int
    label: str                                     # "12-Month"
    display_order: int = Field(default=0)
```

---

## 5. Step-by-Step UI Form Fields

### Step 0 — Executive Intake

| Field | Type | Validation |
|---|---|---|
| `company` | Text input | Required, non-empty (blocks Next button) |
| `industry` | Select (`$5e` options) | Required |
| `numBUs` | Text input | Optional |
| `stakeholders` | Multi-select toggle (`F5e` options) | Optional |
| `strategicAIgoals` | Tag input (add → array) | Optional |
| `currentMaturity` | Select (`L5e` options) | Required (controls roadmap timeline) |
| `aiOrgStructure` | Textarea | Optional |

### Step 1 — AI Maturity Scoring

6 dimension sliders (0–5) for each key in `of`:

```
governance, capital, org, portfolio, adoption, integration
```

Each rendered with label, fullLabel, tooltip text.

Live-computed sidebar panel shows:
- Spider/radar chart of dimension scores
- Per-dimension colour (Green ≥3.5 / Amber ≥2 / Red <2)
- Overall average score

### Step 2 — Risk & Value Prioritization

- **2×2 scatter plot**: X=value score, Y=risk score — plotted from computed `c`
- Quadrant labels: High Value/Low Risk · High Value/High Risk · Low Value/Low Risk · Low Value/High Risk
- Description text computed from `U5(c.category)`
- Radar chart of all 6 dimension scores

### Step 3 — OS Blueprint Draft

- 5 phase cards, each showing:
  - Phase range (weeks computed by `H(i)`)
  - Module name
  - Milestone title
  - Score-adaptive summary
  - Collapsible deliverables list

### Step 4 — Executive Review & Deliverables

- Board-ready summary: company + industry + maturity + avg score + quadrant
- Full dimension breakdown table
- Roadmap timeline
- **Save button** → calls `POST /api/ato/diagnostics`
- **Saved Diagnostics drawer** → lists previous saves, load/delete actions

---

## 6. API Contracts (FastAPI)

### 6.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional, Dict
import uuid
from datetime import datetime

class DimensionScores(BaseModel):
    governance:  float     # 0–5
    capital:     float
    org:         float
    portfolio:   float
    adoption:    float
    integration: float

class Prioritization(BaseModel):
    value_score: float
    risk_score:  float
    category:    str      # quadrant label

class BlueprintPhase(BaseModel):
    phase_range: str
    module:      str
    milestone:   str
    summary:     str
    deliverables: List[str]

class AtoDiagnosticCreate(BaseModel):
    company_name:       str
    industry:           str
    num_bus:            Optional[str]
    stakeholders:       List[str] = []
    strategic_ai_goals: List[str] = []
    current_maturity:   str
    ai_org_structure:   Optional[str]
    scores:             DimensionScores
    prioritization:     Prioritization
    blueprint:          List[BlueprintPhase]
    timeline_label:     str
    timeline_months:    int
    avg_score:          float

class AtoDiagnosticListItem(BaseModel):
    id:               uuid.UUID
    company_name:     str
    industry:         str
    current_maturity: str
    avg_score:        Optional[float]
    created_at:       datetime

class AtoDiagnosticFull(AtoDiagnosticCreate):
    id:         uuid.UUID
    created_at: datetime
    updated_at: datetime

class AtoComputeRequest(BaseModel):
    """Request to server-side compute scores — optional, client can compute too."""
    scores: DimensionScores
    current_maturity: str

class AtoComputeResponse(BaseModel):
    value_score:      float
    risk_score:       float
    category:         str
    avg_score:        float
    timeline_months:  int
    timeline_label:   str
    blueprint:        List[BlueprintPhase]
```

### 6.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/ato/diagnostics` | List saved diagnostics (id, company, industry, maturity, score, date) |
| `POST` | `/api/ato/diagnostics` | Save a completed diagnostic |
| `GET` | `/api/ato/diagnostics/{id}` | Load a specific full diagnostic |
| `DELETE` | `/api/ato/diagnostics/{id}` | Delete a saved diagnostic |
| `POST` | `/api/ato/compute` | Server-side compute scores + blueprint + quadrant |
| `GET` | `/api/ato/config` | Return dimension configs, timelines, industries, stakeholders |

### 6.3 Server-Side Compute Endpoint

```python
@router.post("/api/ato/compute")
async def compute_ato(req: AtoComputeRequest) -> AtoComputeResponse:
    """Compute derived fields server-side — mirrors client B5e and roadmap logic."""
    s = req.scores
    value_score = round((s.adoption + s.capital + s.portfolio) / 3, 2)
    risk_score  = round((s.governance + s.integration + s.org) / 3, 2)
    avg_score   = round(sum([s.governance, s.capital, s.org,
                              s.portfolio, s.adoption, s.integration]) / 6, 2)
    category    = classify_quadrant(value_score, risk_score)

    timeline = get_timeline_config(req.current_maturity)  # lookup from DB
    blueprint = generate_blueprint(s, avg_score, timeline["months"])

    return AtoComputeResponse(
        value_score=value_score, risk_score=risk_score,
        category=category, avg_score=avg_score,
        timeline_months=timeline["months"], timeline_label=timeline["label"],
        blueprint=blueprint
    )
```

---

## 7. Frontend Component Tree (Next.js)

```
app/
└── ato/
    └── page.tsx                                 ← Server: load config data
        └── <AtoPage>                            ← Client (all state — complex)
              ├── <SavedDiagnosticsDrawer />     ← collapsible list of past saves
              ├── <StepProgressBar />            ← D5e[] steps with active indicator
              │
              ├── Step 0: <ExecutiveIntakeStep>
              │     ├── <CompanyInfoForm />      ← company/industry/numBUs inputs
              │     ├── <StakeholderSelect />    ← F5e toggle chips
              │     ├── <GoalsTagInput />        ← dynamic tag array
              │     ├── <MaturitySelect />       ← L5e dropdown
              │     └── <OrgStructureTextarea />
              │
              ├── Step 1: <MaturityScoringStep>
              │     ├── <DimensionSliders />     ← 6 × 0–5 sliders (of config)
              │     └── <LiveScoreSidebar />     ← radar chart + per-dim score cards
              │
              ├── Step 2: <PrioritizationStep>
              │     ├── <QuadrantScatterPlot />  ← 2×2 Recharts scatter
              │     ├── <QuadrantLabel />        ← computed category + description
              │     └── <DimensionRadarChart />
              │
              ├── Step 3: <BlueprintStep>
              │     └── <PhaseCard> × 5         ← h[] phases with deliverable lists
              │
              └── Step 4: <ExecutiveReviewStep>
                    ├── <ExecutiveSummary />     ← company/maturity/quadrant board card
                    ├── <DimensionBreakdown />   ← table + colour coding
                    ├── <TimelineStrip />        ← h[] compact timeline
                    ├── <SaveButton />           ← POST /api/ato/diagnostics
                    └── <LoadButton />           ← toggle saved diagnostics list
```

---

## 8. State Model

This is the most complex local state in the application — all managed in a single `<AtoPage>` client component:

```typescript
// Step 0 intake form
const [intakeData, setIntakeData] = useState<IntakeData>({
  company: "", industry: "", numBUs: "",
  stakeholders: [], strategicAIgoals: [],
  currentMaturity: "", aiOrgStructure: ""
});

// Step 1 scores
const [scores, setScores] = useState<DimensionScores>({
  governance: 0, capital: 0, org: 0,
  portfolio: 0, adoption: 0, integration: 0
});

// Derived (useMemo — recomputed whenever scores change)
const prioritization = useMemo(() => computePrioritization(scores), [scores]);
const timelineConfig  = useMemo(() => Vp[intakeData.currentMaturity] || Vp.Defined, [intakeData]);
const avgScore        = useMemo(() => computeAvg(scores), [scores]);
const blueprint       = useMemo(() => computeBlueprint(scores, avgScore, timelineConfig), [scores, avgScore, timelineConfig]);

// Wizard navigation
const [currentStep, setCurrentStep] = useState(0);  // 0–4

// Persistence
const [savedDiagnostics, setSavedDiagnostics] = useState<DiagnosticListItem[]>([]);
const [showSaved, setShowSaved] = useState(false);
const [isSaving, setIsSaving] = useState(false);
```

---

## 9. Seed Data (DB Migration)

```python
ATO_DIMENSION_CONFIGS_SEED = [
    {"key": "governance",  "label": "Governance",          "full_label": "Governance & Risk Control",         "tip": "Policies, AI council, compliance frameworks, and Responsible AI enforcement.", "display_order": 0},
    {"key": "capital",     "label": "Capital",             "full_label": "Capital & Investment Discipline",   "tip": "AI investment prioritization framework, ROI tracking methodology, and funding.", "display_order": 1},
    {"key": "org",         "label": "Org Model",           "full_label": "Org & Operating Model",            "tip": "CAIO function, AI champion network, defined roles, and enterprise adoption model.","display_order": 2},
    {"key": "portfolio",   "label": "Portfolio",           "full_label": "Portfolio Visibility",             "tip": "Enterprise-wide AI project visibility, shadow AI mapping, initiative tracking.",  "display_order": 3},
    {"key": "adoption",    "label": "Adoption",            "full_label": "Adoption & Change Management",     "tip": "Training programs, cultural readiness, BU adoption metrics, change management.",  "display_order": 4},
    {"key": "integration", "label": "AI & Data Platform",  "full_label": "AI and Data Platform",             "tip": "Identity management, workflow integration, model lifecycle, enterprise readiness.","display_order": 5},
]

ATO_TIMELINE_CONFIGS_SEED = [
    {"maturity_level": "Ad-hoc",    "months": 12, "label": "12-Month", "display_order": 0},
    {"maturity_level": "Emerging",  "months": 6,  "label": "6-Month",  "display_order": 1},
    {"maturity_level": "Defined",   "months": 12, "label": "12-Month", "display_order": 2},
    {"maturity_level": "Managed",   "months": 6,  "label": "6-Month",  "display_order": 3},
    {"maturity_level": "Optimized", "months": 3,  "label": "3-Month",  "display_order": 4},
]

ATO_PHASE_TEMPLATES_SEED = [
    {"id": 0, "module": "Vision Engine",    "milestone": "Vision, Strategy & Org Design",          "dimension_key": None,
     "summary_if_low": "Enterprise AI vision undefined — establish strategic north star, use-case taxonomy, and executive alignment on AI ambition.",
     "summary_if_high": "AI vision articulated — refine strategic roadmap, align BU priorities, and formalize enterprise AI thesis.",
     "deliverables": ["Define Business Aligned Vision", "Build Strategy Document", "Define operating model and AI guiding principles",
                       "Complete org design", "Define criteria for build vs buy model for data and AI platform",
                       "Establish unified data and AI platform with governance and monitoring capability",
                       "Establish AI Helpdesk for production support", "Draft Board Level Material"]},
    {"id": 1, "module": "Governance Engine","milestone": "Policies, Council, Compliance & RAI Enforcement","dimension_key": "governance",
     "summary_if_low": "Critical governance gaps detected — prioritize policy & oversight setup, AI council charter, and RAI framework.",
     "summary_if_high": "Governance foundation solid — refine documentation and establish continuous compliance monitoring.",
     "deliverables": ["Set up lightweight governance process",
                       "Set up AI Council or Enterprise AI Board with key members, mandate and decision rights",
                       "Define and implement risk and value based AI use case prioritization",
                       "Define Enterprise AI Risk Classification Framework","Introduce AI Model Card",
                       "Implement RAI review and approval workflow",
                       "Implement automated controls (Guardrails and Red Teaming) across all Tier 2 and Tier 3 AI models",
                       "Implement Regulatory & Framework Compliance Tracker"]},
    {"id": 2, "module": "Capital Engine",   "milestone": "Activate Capital & Investment Pipeline",  "dimension_key": "capital",
     "summary_if_low": "Capital discipline weak — establish ROI tracking, funding governance, and investment prioritization.",
     "summary_if_high": "Financial governance in place — optimize allocation model and implement portfolio-level ROI tracking.",
     "deliverables": ["Establish Use Case Prioritization framework and Intake portal", "ROI tracking",
                       "Funding processes (review, approvals and executive sign-off)"]},
    {"id": 3, "module": "Control Engine",   "milestone": "Control — Portfolio Visibility & Scale",   "dimension_key": "portfolio",
     "summary_if_low": "Portfolio visibility limited — build enterprise AI registry, shadow AI mapping, and KPI dashboards.",
     "summary_if_high": "Control plane operational — enhance real-time monitoring and cross-BU portfolio visibility.",
     "deliverables": ["Establish enterprise-wide AI project visibility and Executive Dashboard",
                       "Establish routines — AI Council / EAI Board for executive alignment and funding",
                       "Establish cadence of meetings — from Daily Syncs to MBRs and QBRs",
                       "Track shadow AI mapping","Track AI Maturity Score"]},
    {"id": 4, "module": "Adoption and Value Measurement Engine","milestone": "Scale & Enterprise Adoption","dimension_key": "adoption",
     "summary_if_low": "Adoption readiness low — focus on AI Academy, change management playbook, and BU enablement.",
     "summary_if_high": "Strong adoption posture — scale winning patterns, embed champions, and measure BU adoption metrics.",
     "deliverables": ["Establish L&D partnership, Talent roadmap and launch AI Academy", "Build BU Adoption Model",
                       "Design and Implement AI Champion Network",
                       "Track Adoption insights and usage across platforms, Agents and toolings",
                       "Track AI investment returns and realized business impact"]},
]
```

---

## 10. Key Design Decisions

1. **`ato_diagnostics` already exists in Supabase** — the app calls it directly via `ba.from("ato_diagnostics")`. The SQLModel schema mirrors the Supabase columns exactly. However, the existing table lacks `organization_id` and `created_by` — these are added in the rebuild for proper multi-tenant scoping.

2. **Blueprint is computed server-side AND stored** — the raw `blueprint` JSON is stored in the `ato_diagnostics` row so a saved diagnostic can be loaded and displayed instantly without re-computing. But `POST /api/ato/compute` also exposes the computation separately for live preview.

3. **Score-adaptive blueprint summaries** — the `summaryIfLow`/`summaryIfHigh` split (threshold: score < 3) transforms what would be a static content array into personalised guidance. This lives in `ato_phase_templates` as seed data.

4. **Three new seed tables** (`ato_dimension_configs`, `ato_timeline_configs`, `ato_phase_templates`) make the wizard fully configuration-driven — industries, maturity levels, stakeholder titles, dimension definitions, and roadmap templates can all be updated without code changes.

5. **`currentMaturity` field** — note the distinction: `currentMaturity` in `ato_diagnostics` is the organisation's **self-declared** maturity (dropdown selection), whereas `maturity_assessments.overall_score` from the `/maturity` route is the **system-calculated** score. Both coexist.

---

## 11. Updated Schema Total — 51 Tables

| New Tables (This Route) | Count |
|---|---|
| `ato_diagnostics` | 1 |
| `ato_phase_templates` | 1 (seed) |
| `ato_dimension_configs` | 1 (seed) |
| `ato_timeline_configs` | 1 (seed) |

**Running Total: 46 (previous) + 4 (ATO) = 50 tables**
