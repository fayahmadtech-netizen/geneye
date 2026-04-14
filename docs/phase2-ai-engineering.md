# GenEye — Phase 2: Route Specification — `/ai-engineering`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `u3e` (page) · `Q5e` (Builder) · `Z5e` (Pipelines) · `r3e` (Deployments) · `l3e` (Observability)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/ai-engineering`
**Page Title:** "AI Engineering Platform"
**Subtitle:** "Powered by ADLC — Autonomous Development Lifecycle"

This is the **AI development and systems engineering hub**. It enables building AI systems using a node-based canvas, orchestrating autonomous development pipelines (ADLC), managing multi-environment deployments, and monitoring production observability with AI insights.

### Tabs (4)

| Tab ID | Label | Component | Description |
|---|---|---|---|
| `builder` | AI System Builder | `Q5e` | Drag-and-drop canvas for architecture design |
| `pipelines` | ADLC Pipelines | `Z5e` | Autonomous Dev Lifecycle (PM → SRE) |
| `deployments` | Deployments | `r3e` | Version control and environment management |
| `observability` | Observability | `l3e` | Live metrics, log streams, and AI-powered anomalies |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `G5[]` — Deployments (6 items)

```json
[
  { "id": "1", "system": "Support Triage Agent", "version": "v1.3.2", "env": "Production", "status": "Live", "deployTime": "42s", "successRate": "100%", "timestamp": "12 min ago" },
  { "id": "2", "system": "Invoice Processor", "version": "v2.1.0", "env": "Production", "status": "Live", "deployTime": "38s", "successRate": "100%", "timestamp": "2h ago" },
  { "id": "3", "system": "Contract Analyzer", "version": "v1.0.4", "env": "Staging", "status": "Deploying", "deployTime": "—", "successRate": "—", "timestamp": "Just now" },
  { "id": "4", "system": "Compliance Monitor", "version": "v3.2.1", "env": "Production", "status": "Live", "deployTime": "51s", "successRate": "99.8%", "timestamp": "1d ago" },
  { "id": "5", "system": "HR Onboarding Bot", "version": "v1.1.0", "env": "Dev", "status": "Pending", "deployTime": "—", "successRate": "—", "timestamp": "3h ago" },
  { "id": "6", "system": "Procurement Agent", "version": "v2.0.0-rc1", "env": "Staging", "status": "Rolled Back", "deployTime": "45s", "successRate": "94%", "timestamp": "5h ago" }
]
```

**Env enum:** `"Production"` | `"Staging"` | `"Dev"`
**Status enum:** `"Live"` | `"Deploying"` | `"Rolled Back"` | `"Pending"`

---

### 1.2 `J5e` — Digital Worker definitions (ADLC)

The ADLC pipeline uses specific digital personas for each phase.

| Phase | Role | Initials | Actions | Outputs |
|---|---|---|---|---|
| `requirements` | Digital Product Manager | PM | Analyzing intent, Generating stories | PRD, Story Map |
| `design` | Digital Architect | AR | Architecture design, Pattern evaluation | Blueprint, API Contracts |
| `build` | Digital Developer | DV | Code Generation, Refactoring | Source Code, Unit Tests |
| `test` | Digital QA Engineer | QA | Execution, Benchmarking | Test Report, Coverage Map |
| `release` | Digital DevOps Engineer | DO | CI/CD config, Deployment | Release Notes, Manifest |
| `operate` | Digital SRE | SR | Monitoring, Auto-scaling | SLA Dashboard, Runbook |

---

### 1.3 `Y5e[]` & `X5e[]` — Builder initial state (System Graph)

**Nodes (`Y5e`):**
* `n1`: Agent (Claims Adjudication)
* `n2`: Agent (Fraud Pattern Sentinel)
* `n3`: Worker (Priya - Finance Analyst)
* `n4`: Integration (Salesforce CRM)
* `n5`: Data Source (Claims DB)

**Edges (`X5e`):**
* `c1`: n4 (Salesforce) → n1 (Claims Agent)
* `c2`: n5 (Claims DB) → n1 (Claims Agent)
* `c3`: n1 → n2 (Fraud Sentinel)
* `c4`: n2 → n3 (Priya - Finance Worker)

---

### 1.4 `Y5[]` — Log Stream (Observability)

```json
[
  { "time": "14:32:01", "level": "info", "msg": "Request processed — Ticket #4821 classified as P2", "system": "support-agent" },
  { "time": "14:31:45", "level": "warn", "msg": "Latency spike detected — P95 at 285ms", "system": "api-gateway" },
  { "time": "14:31:12", "level": "error", "msg": "Timeout on external API call — retrying (attempt 2/3)", "system": "invoice-processor" }
]
```

---

## 2. Data Models (SQLModel / PostgreSQL)

### 2.1 Engineering Systems & Canvas

```python
class EngineeringSystem(SQLModel, table=True):
    __tablename__ = "engineering_systems"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SystemNode(SQLModel, table=True):
    __tablename__ = "system_nodes"
    
    id: str = Field(primary_key=True) # node-xxxx
    system_id: uuid.UUID = Field(foreign_key="engineering_systems.id")
    type: str # 'agent' | 'worker' | 'api' | 'datasource'
    name: str
    sub: str # e.g. 'Insurance Ops'
    x_pos: float
    y_pos: float

class SystemConnection(SQLModel, table=True):
    __tablename__ = "system_connections"
    
    id: str = Field(primary_key=True) # conn-xxxx
    system_id: uuid.UUID = Field(foreign_key="engineering_systems.id")
    from_node: str = Field(index=True)
    to_node: str = Field(index=True)
```

### 2.2 ADLC & Deployments

```python
class AdlcPipelineRun(SQLModel, table=True):
    __tablename__ = "adlc_pipeline_runs"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    system_id: uuid.UUID = Field(foreign_key="engineering_systems.id")
    mode: str # 'assisted' | 'semi-autonomous' | 'autonomous'
    current_stage: str # requirements, design, etc.
    progress_pct: int = 0
    status: str # 'running', 'completed', 'failed'
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SystemDeployment(SQLModel, table=True):
    __tablename__ = "system_deployments"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    system_name: str
    version: str
    environment: str # Prod, Staging, Dev
    status: str # Live, Deploying, Rolled Back
    deploy_time_seconds: Optional[int] = None
    success_rate: float # 0-100
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

---

## 3. API Contracts (FastAPI)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/engineering/systems` | List all designed systems |
| `POST` | `/api/engineering/systems` | Create/Save a system architecture |
| `GET` | `/api/engineering/systems/{id}/architecture` | Get nodes and edges for canvas |
| `POST` | `/api/engineering/pipelines/trigger` | Start an ADLC run for a system |
| `GET` | `/api/engineering/deployments` | List global deployment history |
| `GET` | `/api/engineering/observability/metrics` | Time-series for Latency, RPM, Errors |
| `GET` | `/api/engineering/observability/logs` | Live log stream |

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── ai-engineering/
    └── page.tsx                              ← Tabs management (c3e)
        ├── <BuilderCanvas />                 ← React Flow style implementation
        │     ├── <DraggableCatalog />        ← K5e categories
        │     └── <NodeDetailPanel />         ← Selected node metadata
        ├── <AdlcPipelineView />              ← Pipeline state visualization
        ├── <DeploymentTable />               ← G5 list with environment filters
        └── <ObservabilityDashboard />         ← Latency/RPM charts + log tail
```

---

## 5. Key Design Decisions

1.  **Canvas Logic**: The `Q5e` component implements a customized node-dragging system with SVG connections. For the rebuild, **React Flow** is recommended for robustness, though the extracted positions (`x`, `y`) and types must be preserved.
2.  **ADLC Simulation**: The `Z5e` component uses `setTimeout` to simulate an 18-second pipeline run. The rebuild will replace this with real FastAPI `BackgroundTasks` tracking actual code generation/deployment logs.
3.  **Observability Time-Series**: `n3e`, `a3e`, `s3e` are static arrays representing 24 hours. The backend should provide real time-series data, likely using **PostgreSQL/TimescaleDB** or simplified aggregation tables.
4.  **Builder Catalogs**: `U5e`, `W5e`, `H5e`, `V5e` are the "Parts Catalog". These should be dynamic and fetched from the `registry` schema (agents, tools, digital workers).

**Running Total: 56 Tables (reconciled)**
