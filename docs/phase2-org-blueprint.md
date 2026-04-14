# GenEye — Phase 2: Route Specification — `/org-blueprint`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `Rke` (page) · `Mke` (PARC Framework) · `Tke` (HI-FACTS) · `Ske` (Model Stats)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/org-blueprint`
**Page Title:** "AI Org Blueprint"
**Subtitle:** "Strategic Design, Operating Model & Governance Charter"

This is the **Organizational Governance and Strategic Planning hub**. It defines how the enterprise is structured to execute AI (The Operating Model), the principles guiding development (HI-FACTS), and the formal charter for the AI Council. It transitions the organization from "Ad-hoc AI" to an "Institutionalized AI Enterprise".

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `Pke[]` — Operating Model Quick Stats

| Label | Value |
|---|---|
| Operating Model | Federated Center of Excellence (CoE) |
| Decision Authority | Centralized Governance / Decentralized Execution |
| Reporting Line | Chief AI Officer → CTO → Board AI Committee |
| Primary Mandate | Scale AI capabilities across all Business Units |
| Engagement Model | BU Embedded + CoE Advisory |
| Review Cadence | Monthly BU sync / Quarterly Board review |

---

### 1.2 `Ike[]` — PARC Framework

The **PARC Framework** define the quadrants of the Operating Model.

| Quadrant | Label | Description / Focus |
|---|---|---|
| **#01** | **People** | Transitioning workforce from "Task Masters" to Agent Supervisors. |
| **#02** | **Architecture** | Utilizing the 6-Layered Framework (SOO → SOR → DL → PL → AA). |
| **#03** | **Responsibility** | Ethical AI, Bias Mitigation, and Accountability. |
| **#04** | **Capability** | Infrastructure, Tooling, and Talent retention. |

---

### 1.3 `Oke[]` — HI-FACTS Guiding Principles

Universal principles for all AI systems in the GenEye ecosystem.

| Letter | Principle | Description |
|---|---|---|
| **H** | Human-Centric | Design for human agency and machine teaming. |
| **I** | Impact-Driven | Every model must have a measurable business outcome. |
| **F** | Federated | Data remains local; governance is global. |
| **A** | Agile | Rapid 2-week iterations on agentic workflows. |
| **C** | Custom | Proprietary data is a differentiator; use it. |
| **T** | Transparent | Explainable AI (XAI) as a deployment requirement. |
| **S** | Secure | Zero-trust AI architecture. |

---

### 1.4 `z0` — AI Council Charter

**Mission Statement:** *"The AI Council is the governing body responsible for strategic alignment, risk oversight, and prioritization of all enterprise AI initiatives."*

**Council Membership (Partial):**
* Chief AI Officer (Chair)
* VP Data & Analytics
* Head of AI Engineering
* Chief Risk Officer (CRO)
* Legal / Compliance Lead

---

### 1.5 `_ke[]` — Org Readiness Tasks (Checklist)

| Task | ID | Description |
|---|---|---|
| Define AI North Star | `t1` | Align AI goals with corporate strategy |
| Establish AI Council | `t2` | Select members and define meeting cadence |
| Design CoE Structure | `t3` | Map centralized vs decentralized roles |
| Roll out HI-FACTS | `t4` | Train engineering teams on principles |
| Talent Audit | `t5` | Identify skills gaps across BUs |

---

## 2. Data Models (SQLModel / PostgreSQL)

### 2.1 Org Structure & Frameworks

```python
class OrgBlueprint(SQLModel, table=True):
    __tablename__ = "org_blueprints"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    vision_statement: str
    strategy_summary: str
    operating_model_type: str # e.g. "Federated CoE"
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlueprintPrinciple(SQLModel, table=True):
    __tablename__ = "blueprint_principles"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    blueprint_id: uuid.UUID = Field(foreign_key="org_blueprints.id")
    
    letter: str # H, I, F, A, C, T, S
    name: str # Human-Centric, etc.
    description: str
    is_highlighted: bool = False

class CouncilMember(SQLModel, table=True):
    __tablename__ = "council_members"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    role_title: str
    reports_to: str
    headcount: int = 1
    tags: List[dict] = Field(default=[], sa_column=Column(JSON)) # e.g. [{"label": "Voting", "color": "..."}]
```

### 2.2 Tasks & Checklists

```python
class BlueprintTask(SQLModel, table=True):
    __tablename__ = "blueprint_tasks"
    
    id: str = Field(primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    label: str
    description: Optional[str] = None
    is_done: bool = False
    due_date: Optional[datetime] = None
```

---

## 3. API Contracts (FastAPI)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/org/blueprint` | Get the current org blueprint (Vision, Stats, PARC, HI-FACTS) |
| `PATCH` | `/api/org/blueprint` | Update the strategic vision or operating model |
| `GET` | `/api/org/council` | Get council mission and permanent members |
| `POST` | `/api/org/council/members` | Add a member to the AI Council |
| `GET` | `/api/org/tasks` | Get the readiness checklist |
| `PATCH` | `/api/org/tasks/{id}` | Toggle task completion |

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── org-blueprint/
    └── page.tsx                              ← Main Strategy & Vision
        ├── <OperatingModelSection />         ← Hierarchy diagram + Stats
        ├── <ParcFrameworkGrid />             ← 4-quadrant interactive grid
        ├── <HiFactsPrincipleList />          ← HI-FACTS table with hover details
        ├── <CouncilCharterSection />         ← Mission + Member Table
        └── <ReadinessChecklistSidePanel />   ← _ke tasks
```

---

## 5. Key Design Decisions

1.  **Editable Vision**: The `Rke` component uses `contentEditable` in the original static bundle. In the rebuild, these will be proper **Supabase/FastAPI-backed form fields** allowing the CAIO to live-edit the organization's AI thesis.
2.  **PARC & HI-FACTS as Seed Data**: These frameworks are static GenEye IP but might be customized per organization. They will be stored in PostgreSQL to allow for such overrides.
3.  **Dotted Line Reporting**: The UI emphasizes that BU-Embedded AI Leads report to the CAIO via a dotted line. The database schema assumes a `reports_to` text field for simplicity in the charter table.

**Running Total: 66 Tables (reconciled)**
