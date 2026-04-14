# GenEye — Phase 2: Route Specification — `/maturity`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `VSe`
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/maturity`
**Page Title:** "AI Maturity Assessment"
**Subtitle:** "Evaluate organizational AI readiness across 4 dimensions"

The maturity page allows users to evaluate and adjust an organization's AI readiness score across **4 dimensions** (Strategy, People, Process, Technology), each containing **3–4 criteria** rated on a **1–5 integer scale**. The overall score is computed as the average of all domain averages.

---

## 1. Hardcoded Data (`sJ` Array — Full Extraction)

This is the complete `sJ` data array found in the bundle, representing the full domain × criteria model:

```json
[
  {
    "id": "strategy",
    "label": "Strategy",
    "icon": "Target",
    "criteria": [
      { "id": "s1", "label": "AI Strategy Alignment",    "value": 4 },
      { "id": "s2", "label": "Executive Sponsorship",    "value": 4 },
      { "id": "s3", "label": "Roadmap Clarity",          "value": 4 },
      { "id": "s4", "label": "Investment Prioritization","value": 4 }
    ]
  },
  {
    "id": "people",
    "label": "People",
    "icon": "Users",
    "criteria": [
      { "id": "p1", "label": "AI Talent Availability", "value": 3 },
      { "id": "p2", "label": "Change Management",      "value": 3 },
      { "id": "p3", "label": "Training Programs",      "value": 3 },
      { "id": "p4", "label": "AI Culture Index",       "value": 3 }
    ]
  },
  {
    "id": "process",
    "label": "Process",
    "icon": "GitBranch",
    "criteria": [
      { "id": "pr1", "label": "MLOps Maturity",       "value": 4 },
      { "id": "pr2", "label": "Governance Framework", "value": 3 },
      { "id": "pr3", "label": "Risk Management",      "value": 4 }
    ]
  },
  {
    "id": "technology",
    "label": "Technology",
    "icon": "Cpu",
    "criteria": [
      { "id": "t1", "label": "Data Infrastructure",      "value": 3 },
      { "id": "t2", "label": "AI Platform Capability",   "value": 4 },
      { "id": "t3", "label": "Integration Maturity",     "value": 3 },
      { "id": "t4", "label": "Security & Compliance",    "value": 3 }
    ]
  }
]
```

**Score Computation Logic (extracted from bundle):**
- Domain score = average of all its criteria values
- Overall score = average of all domain scores
- Color thresholds: `≥4` → success (green), `≥3` → warning (yellow), `<3` → destructive (red)
- Scale: 1–5 integer steps

---

## 2. Data Models (SQLModel / PostgreSQL)

### 2.1 `MaturityDomain` Table

Stores the top-level assessment domains (e.g., Strategy, People, Process, Technology).

```python
from sqlmodel import SQLModel, Field
from typing import Optional
import uuid

class MaturityDomain(SQLModel, table=True):
    __tablename__ = "maturity_domains"

    id: str = Field(primary_key=True)          # e.g. "strategy", "people"
    label: str                                  # e.g. "Strategy"
    icon: str                                   # Lucide icon name e.g. "Target"
    display_order: int = Field(default=0)       # for ordering in the UI
```

### 2.2 `MaturityCriterion` Table

Stores individual criteria belonging to a domain.

```python
class MaturityCriterion(SQLModel, table=True):
    __tablename__ = "maturity_criteria"

    id: str = Field(primary_key=True)           # e.g. "s1", "p2"
    domain_id: str = Field(foreign_key="maturity_domains.id")
    label: str                                  # e.g. "AI Strategy Alignment"
    display_order: int = Field(default=0)
    default_value: int = Field(default=3)       # 1–5
```

### 2.3 `MaturityAssessment` Table

Stores a single assessment snapshot for an organization.

```python
class MaturityAssessment(SQLModel, table=True):
    __tablename__ = "maturity_assessments"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True
    )
    organization_id: uuid.UUID = Field(foreign_key="organizations.id")
    name: str = Field(default="Default Assessment")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
```

### 2.4 `MaturityScore` Table

Stores individual criterion scores per assessment (pivot table).

```python
class MaturityScore(SQLModel, table=True):
    __tablename__ = "maturity_scores"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4, primary_key=True
    )
    assessment_id: uuid.UUID = Field(
        foreign_key="maturity_assessments.id"
    )
    criterion_id: str = Field(
        foreign_key="maturity_criteria.id"
    )
    value: int = Field(ge=1, le=5)              # 1–5 integer
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        # Unique constraint: one score per criterion per assessment
        table_args = (
            UniqueConstraint("assessment_id", "criterion_id"),
        )
```

### Entity Relationship Diagram

```
organizations
    │
    └──< maturity_assessments (org_id)
              │
              └──< maturity_scores (assessment_id, criterion_id)
                        │
                        └──> maturity_criteria (id)
                                   │
                                   └──> maturity_domains (id)
```

---

## 3. API Contracts (FastAPI)

### 3.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

# ── Criterion ────────────────────────────────────────────────
class CriterionBase(BaseModel):
    id: str
    label: str
    display_order: int = 0
    default_value: int = 3

class CriterionWithScore(CriterionBase):
    value: int  # current score for this assessment

# ── Domain ───────────────────────────────────────────────────
class DomainBase(BaseModel):
    id: str
    label: str
    icon: str
    display_order: int = 0

class DomainWithCriteria(DomainBase):
    criteria: List[CriterionWithScore]
    domain_score: float  # computed: avg of criteria values

# ── Assessment ───────────────────────────────────────────────
class AssessmentResponse(BaseModel):
    id: uuid.UUID
    name: str
    organization_id: uuid.UUID
    overall_score: float    # computed: avg of domain scores
    domains: List[DomainWithCriteria]
    created_at: datetime
    updated_at: datetime

class AssessmentCreate(BaseModel):
    name: str = "Default Assessment"
    organization_id: uuid.UUID

# ── Score Update ─────────────────────────────────────────────
class ScoreUpdate(BaseModel):
    criterion_id: str
    value: int  # 1–5

class BulkScoreUpdate(BaseModel):
    scores: List[ScoreUpdate]
```

### 3.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/maturity/domains` | List all domains with their criteria (seed data) |
| `GET` | `/api/maturity/assessments` | List assessments for the current org |
| `POST` | `/api/maturity/assessments` | Create a new assessment |
| `GET` | `/api/maturity/assessments/{id}` | Get full assessment with all scores |
| `PATCH` | `/api/maturity/assessments/{id}/scores` | Bulk-update criteria scores |
| `DELETE` | `/api/maturity/assessments/{id}` | Delete an assessment |

#### Example: `GET /api/maturity/assessments/{id}`

**Response:**
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Q1 2025 Assessment",
  "organization_id": "...",
  "overall_score": 3.45,
  "domains": [
    {
      "id": "strategy",
      "label": "Strategy",
      "icon": "Target",
      "domain_score": 4.0,
      "criteria": [
        { "id": "s1", "label": "AI Strategy Alignment", "value": 4 },
        { "id": "s2", "label": "Executive Sponsorship",  "value": 4 },
        { "id": "s3", "label": "Roadmap Clarity",        "value": 4 },
        { "id": "s4", "label": "Investment Prioritization", "value": 4 }
      ]
    },
    {
      "id": "people",
      "label": "People",
      "icon": "Users",
      "domain_score": 3.0,
      "criteria": [
        { "id": "p1", "label": "AI Talent Availability", "value": 3 },
        { "id": "p2", "label": "Change Management",      "value": 3 },
        { "id": "p3", "label": "Training Programs",      "value": 3 },
        { "id": "p4", "label": "AI Culture Index",       "value": 3 }
      ]
    }
  ],
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-10T12:00:00Z"
}
```

#### Example: `PATCH /api/maturity/assessments/{id}/scores`

**Request Body:**
```json
{
  "scores": [
    { "criterion_id": "s1", "value": 5 },
    { "criterion_id": "p2", "value": 2 }
  ]
}
```

**Response:** Updated `AssessmentResponse` (same as GET above).

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── maturity/
    └── page.tsx                      ← Server Component (fetches assessment)
        └── <MaturityPage>
              ├── <PageHeader>        ← title + subtitle (from shared layout)
              ├── <MaturityOverview>  ← Client Component
              │     ├── <ScoreGauge score={overall} />   ← SVG circular gauge (HSe)
              │     └── <DomainScoreBadge /> × 4         ← per-domain avg
              └── <DomainAccordion>   ← Client Component (expandable list)
                    └── <DomainCard> × N
                          ├── <DomainHeader>             ← icon, label, avg score
                          └── <CriteriaList>             ← visible when expanded
                                └── <CriterionSlider> × N
                                      ├── <label>
                                      ├── <input type="range" min=1 max=5 step=1 />
                                      └── <ScoreBar score={value} />  ← (WSe)
```

### Server vs Client Component Split

| Component | Type | Reason |
|---|---|---|
| `app/maturity/page.tsx` | **Server** | Initial data fetch from API |
| `<MaturityOverview>` | **Client** | Displays live score as sliders update |
| `<ScoreGauge>` | **Client** | Animated SVG (needs state) |
| `<DomainAccordion>` | **Client** | Controls expand/collapse state |
| `<DomainCard>` | **Client** | Re-renders on slider change |
| `<CriterionSlider>` | **Client** | `onChange` event handler |
| `<ScoreBar>` | **Client** | Animated progress bar |

---

## 5. State & Interactivity

### Local State Required

| State Variable | Type | Purpose |
|---|---|---|
| `domains` | `DomainWithCriteria[]` | Full domain+criteria data with current scores; initialized from server fetch |
| `expandedDomains` | `string[]` | Array of domain IDs currently expanded in accordion |

### State Mutations

- **Slider change** (`onChange`): Update `domains[domainIdx].criteria[criterionIdx].value` via immutable map
- **Accordion toggle**: Add/remove domain ID from `expandedDomains`

### Score Computation (Client-side, derived — no extra state)

```typescript
const domainScore = (domain: DomainWithCriteria) =>
  domain.criteria.reduce((sum, c) => sum + c.value, 0) / domain.criteria.length;

const overallScore = domains.reduce((sum, d) => sum + domainScore(d), 0) / domains.length;
```

### Persistence Strategy

- **Debounced PATCH** to `/api/maturity/assessments/{id}/scores` on slider release (`onMouseUp` / `onTouchEnd`)
- Optimistic UI: update local state immediately, sync to server in background
- Show a **toast notification** on save success/failure (uses global Sonner toast)

### Color Threshold Logic

```typescript
const scoreColor = (score: number) =>
  score >= 4 ? "var(--success)" :
  score >= 3 ? "var(--warning)" :
               "var(--destructive)";
```

---

## 6. Seed Data (DB Migration)

The following seed data should be loaded on first migration:

```python
DOMAIN_SEED = [
    {"id": "strategy",   "label": "Strategy",   "icon": "Target",    "display_order": 0},
    {"id": "people",     "label": "People",     "icon": "Users",     "display_order": 1},
    {"id": "process",    "label": "Process",    "icon": "GitBranch", "display_order": 2},
    {"id": "technology", "label": "Technology", "icon": "Cpu",       "display_order": 3},
]

CRITERIA_SEED = [
    # Strategy
    {"id": "s1",  "domain_id": "strategy",   "label": "AI Strategy Alignment",     "display_order": 0, "default_value": 4},
    {"id": "s2",  "domain_id": "strategy",   "label": "Executive Sponsorship",     "display_order": 1, "default_value": 4},
    {"id": "s3",  "domain_id": "strategy",   "label": "Roadmap Clarity",           "display_order": 2, "default_value": 4},
    {"id": "s4",  "domain_id": "strategy",   "label": "Investment Prioritization", "display_order": 3, "default_value": 4},
    # People
    {"id": "p1",  "domain_id": "people",     "label": "AI Talent Availability",    "display_order": 0, "default_value": 3},
    {"id": "p2",  "domain_id": "people",     "label": "Change Management",         "display_order": 1, "default_value": 3},
    {"id": "p3",  "domain_id": "people",     "label": "Training Programs",         "display_order": 2, "default_value": 3},
    {"id": "p4",  "domain_id": "people",     "label": "AI Culture Index",          "display_order": 3, "default_value": 3},
    # Process
    {"id": "pr1", "domain_id": "process",    "label": "MLOps Maturity",            "display_order": 0, "default_value": 4},
    {"id": "pr2", "domain_id": "process",    "label": "Governance Framework",      "display_order": 1, "default_value": 3},
    {"id": "pr3", "domain_id": "process",    "label": "Risk Management",           "display_order": 2, "default_value": 4},
    # Technology
    {"id": "t1",  "domain_id": "technology", "label": "Data Infrastructure",       "display_order": 0, "default_value": 3},
    {"id": "t2",  "domain_id": "technology", "label": "AI Platform Capability",    "display_order": 1, "default_value": 4},
    {"id": "t3",  "domain_id": "technology", "label": "Integration Maturity",      "display_order": 2, "default_value": 3},
    {"id": "t4",  "domain_id": "technology", "label": "Security & Compliance",     "display_order": 3, "default_value": 3},
]
```

---

## 7. Notes for Next Phase

- The maturity data from this route overlaps with `/control-tower/maturity` which reads `kD` (organization baseline/target config) and `qo` (milestone completion items). The `organizations` table will need `baseline_maturity`, `current_maturity`, and `target_maturity` columns.
- The `gf` array found in the bundle (`[{quarter: "Q1 2024", governance: 1.5, ...}]`) is a **time-series trend** of historical domain scores — this will map to a `maturity_history` table in Phase 2 for the Control Tower route.
