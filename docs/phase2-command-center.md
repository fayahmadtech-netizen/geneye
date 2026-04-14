# GenEye — Phase 2: Route Specification — `/command-center`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `XDe` (page), `I3e` (Dashboard tab), `L3e` (Incident Workflow), `BDe` (Resource Mobilization) + 8 lazy-loaded tabs
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/command-center`
**Page Title:** "AI Command Center"
**Subtitle:** "Real-time Incident & Operations Intelligence"

This is the **IT/DevOps operations hub** — the most operationally complex route in the application. It manages real-time incident response via a multi-stage Kanban workflow, on-call roster management, escalation chains, infrastructure health, and integrations with external systems (ITSM, collaboration tools, AI engines).

> **Key Design Note:** The command center has **11 tabs**, 3 of which (`dashboard`, `workflow`, `resources`) are statically imported and 8 are **lazy-loaded** via `React.Suspense`. In the rebuild, the lazy-loaded tabs will use Next.js dynamic imports.

### Tabs

| Tab ID | Label | Component | Type |
|---|---|---|---|
| `dashboard` | Command Center | `I3e` | Eager |
| `workflow` | Incident Workflow | `L3e` | Eager |
| `resources` | Resource Mobilization | `BDe` | Eager |
| `infrastructure` | Infrastructure | `UDe` | Lazy |
| `itsm` | ITSM Integration | `WDe` | Lazy |
| `collaboration` | Collaboration | `HDe` | Lazy |
| `communication` | Communication | `VDe` | Lazy |
| `subscriptions` | Subscriptions | `KDe` | Lazy |
| `chat` | AI Assistant | `_De` | Eager |
| `ai-engines` | AI/ML Engines | `qDe` | Lazy |
| `admin` | Admin Console | `GDe` | Lazy |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `v3e[]` — Active Incidents Feed (Dashboard panel, 5 items)

```json
[
  { "id": "INC-4821", "title": "Production DB cluster latency spike",     "severity": "P1", "status": "Investigating",  "age": "12m",    "team": "DB-Ops" },
  { "id": "INC-4819", "title": "CDN cache invalidation failure - US-East","severity": "P1", "status": "Triaging",       "age": "28m",    "team": "Network" },
  { "id": "INC-4817", "title": "Auth service 5xx errors > 2%",            "severity": "P2", "status": "Engaged",        "age": "45m",    "team": "Platform" },
  { "id": "INC-4815", "title": "Payment gateway timeout intermittent",    "severity": "P2", "status": "Communicating",  "age": "1h 12m", "team": "Payments" },
  { "id": "INC-4812", "title": "Kubernetes pod OOMKilled - worker nodes", "severity": "P3", "status": "Investigating",  "age": "2h 5m",  "team": "SRE" }
]
```

**Severity enum:** `"P1"` | `"P2"` | `"P3"`
**Status enum:** `"Investigating"` | `"Triaging"` | `"Engaged"` | `"Communicating"` | `"Resolved"`

---

### 1.2 System Health Array — Services (8 services)

```json
[
  { "name": "API Gateway",       "health": 99.8, "status": "healthy" },
  { "name": "Auth Service",      "health": 97.2, "status": "degraded" },
  { "name": "Payment Engine",    "health": 95.1, "status": "degraded" },
  { "name": "Database Cluster",  "health": 88.4, "status": "critical" },
  { "name": "CDN / Edge",        "health": 92.3, "status": "degraded" },
  { "name": "Message Queue",     "health": 99.9, "status": "healthy" },
  { "name": "Search Index",      "health": 100,  "status": "healthy" },
  { "name": "Storage / S3",      "health": 99.7, "status": "healthy" }
]
```

**Status enum:** `"healthy"` | `"degraded"` | `"critical"`

---

### 1.3 Dashboard KPI Cards (hardcoded in `I3e`)

| Metric | Value | Sub-label |
|---|---|---|
| Active Incidents | `5` | `2 P1 · 2 P2 · 1 P3` |
| MTTR (Avg) | `34m` | `↑ 12% vs last week` |
| Resolved Today | `18` | `98.2% SLA compliance` |
| On-Call Engineers | `4` | `2 active · 1 paged` |

---

### 1.4 `R3e` — Incident Workflow Kanban (4 stages × N incidents)

The Kanban board has **4 pipeline stages**: `investigate` → `triage` → `engage` → `communicate`.

```json
{
  "investigate": [
    { "id": "INC-4821", "title": "Production DB cluster latency spike — read replicas unresponsive",
      "severity": "P1", "service": "Database", "assignee": "Sarah Chen",
      "age": "12m", "comments": 8, "attachments": 3,
      "tags": ["database","latency"],
      "aiSuggestion": "CRQ-9921 (Schema Migration) deployed 14m ago — 87% correlation" },
    { "id": "INC-4825", "title": "Memory leak detected in order-processing microservice",
      "severity": "P2", "service": "Orders", "assignee": "Unassigned",
      "age": "5m",  "comments": 1, "attachments": 0, "tags": ["memory","microservice"] },
    { "id": "INC-4826", "title": "Intermittent 503 on /api/v2/inventory endpoint",
      "severity": "P3", "service": "Inventory", "assignee": "Alex Kim",
      "age": "22m", "comments": 3, "attachments": 1, "tags": ["api","availability"] },
    { "id": "INC-4828", "title": "Elasticsearch cluster yellow status — 2 nodes unreachable",
      "severity": "P2", "service": "Search", "assignee": "Unassigned",
      "age": "3m",  "comments": 0, "attachments": 0, "tags": ["elasticsearch","cluster"] }
  ],
  "triage": [
    { "id": "INC-4819", "title": "CDN cache invalidation failure affecting US-East region",
      "severity": "P1", "service": "CDN", "assignee": "Marcus Johnson",
      "age": "28m", "comments": 12, "attachments": 5, "tags": ["cdn","us-east"],
      "aiSuggestion": "Similar incident INC-4102 resolved by purging edge nodes — recommend same playbook" },
    { "id": "INC-4822", "title": "SSL certificate expiry warning — api.payments.internal",
      "severity": "P2", "service": "Security", "assignee": "Priya Patel",
      "age": "1h 5m", "comments": 4, "attachments": 2, "tags": ["ssl","certificate"] },
    { "id": "INC-4824", "title": "Kafka consumer lag exceeding 50k messages on events topic",
      "severity": "P2", "service": "Messaging", "assignee": "Dev Sharma",
      "age": "18m", "comments": 6, "attachments": 1, "tags": ["kafka","consumer-lag"] }
  ],
  "engage": [
    { "id": "INC-4817", "title": "Auth service 5xx errors exceeding 2% error budget",
      "severity": "P2", "service": "Auth", "assignee": "Platform Team",
      "age": "45m", "comments": 15, "attachments": 4, "tags": ["auth","error-rate"],
      "aiSuggestion": "Root cause: connection pool exhaustion — auto-scaling triggered" },
    { "id": "INC-4820", "title": "DNS resolution failures for internal service mesh",
      "severity": "P1", "service": "Network", "assignee": "Network Team",
      "age": "35m", "comments": 22, "attachments": 6, "tags": ["dns","service-mesh"] }
  ],
  "communicate": [
    { "id": "INC-4815", "title": "Payment gateway timeout — customer-facing checkout impact",
      "severity": "P2", "service": "Payments", "assignee": "Payments Team",
      "age": "1h 12m", "comments": 28, "attachments": 8, "tags": ["payments","customer-impact"],
      "aiSuggestion": "Executive comms sent. ETA to resolution: 15 minutes. Customer sentiment: -18%" },
    { "id": "INC-4812", "title": "Kubernetes pod OOMKilled — worker node capacity exhausted",
      "severity": "P3", "service": "Infrastructure", "assignee": "SRE Team",
      "age": "2h 5m", "comments": 14, "attachments": 3, "tags": ["kubernetes","oom"] },
    { "id": "INC-4810", "title": "Data pipeline batch job failure — daily ETL incomplete",
      "severity": "P3", "service": "Data Eng", "assignee": "Data Team",
      "age": "3h 20m", "comments": 9, "attachments": 2, "tags": ["etl","data-pipeline"] }
  ]
}
```

---

### 1.5 `nN[]` — On-Call Roster (7 engineers)

```json
[
  { "name": "Sarah Chen",    "role": "Incident Commander",  "team": "SRE",      "phone": "+1-555-0101", "email": "sarah.chen@corp.com",  "shift": "06:00–18:00 UTC", "status": "on-call",   "responseTime": "< 2m avg" },
  { "name": "Marcus Johnson","role": "DB Primary On-Call",  "team": "DB-Ops",   "phone": "+1-555-0102", "email": "marcus.j@corp.com",    "shift": "06:00–18:00 UTC", "status": "on-call",   "responseTime": "< 3m avg" },
  { "name": "Priya Patel",   "role": "Network Primary",     "team": "Network",  "phone": "+1-555-0103", "email": "priya.p@corp.com",     "shift": "06:00–18:00 UTC", "status": "paged",     "responseTime": "< 1m avg" },
  { "name": "Alex Kim",      "role": "Security On-Call",    "team": "SecOps",   "phone": "+1-555-0104", "email": "alex.k@corp.com",      "shift": "06:00–18:00 UTC", "status": "available"  },
  { "name": "Dev Sharma",    "role": "Platform Engineer",   "team": "Platform", "phone": "+1-555-0105", "email": "dev.s@corp.com",       "shift": "06:00–18:00 UTC", "status": "on-call",   "responseTime": "< 4m avg" },
  { "name": "James Wilson",  "role": "SRE Secondary",       "team": "SRE",      "phone": "+1-555-0106", "email": "james.w@corp.com",     "shift": "18:00–06:00 UTC", "status": "off-duty"   },
  { "name": "Li Wei",        "role": "DB Secondary",        "team": "DB-Ops",   "phone": "+1-555-0107", "email": "li.w@corp.com",        "shift": "18:00–06:00 UTC", "status": "available"  }
]
```

**Status enum:** `"on-call"` | `"paged"` | `"available"` | `"off-duty"`

---

### 1.6 `ODe[]` — Escalation Chains (4 chains)

```json
[
  {
    "id": "esc-p1-infra", "name": "P1 Infrastructure Critical",
    "team": "SRE + DB-Ops", "severity": "P1",
    "levels": [
      { "level": 1, "contacts": ["Primary On-Call (SRE)"],                "waitTime": "5 min",  "method": "Phone + SMS + Slack" },
      { "level": 2, "contacts": ["Secondary On-Call (SRE)", "DB Primary"],"waitTime": "10 min", "method": "Phone + SMS" },
      { "level": 3, "contacts": ["Engineering Manager", "VP Engineering"], "waitTime": "15 min", "method": "Phone + Email" },
      { "level": 4, "contacts": ["CTO", "Incident Commander"],             "waitTime": "20 min", "method": "Phone" }
    ]
  },
  {
    "id": "esc-p1-security", "name": "P1 Security Breach",
    "team": "SecOps", "severity": "P1",
    "levels": [
      { "level": 1, "contacts": ["Security On-Call"],             "waitTime": "3 min",  "method": "Phone + SMS + PagerDuty" },
      { "level": 2, "contacts": ["Security Lead", "CISO"],        "waitTime": "5 min",  "method": "Phone + SMS" },
      { "level": 3, "contacts": ["VP Engineering", "Legal"],      "waitTime": "10 min", "method": "Phone + Email" }
    ]
  },
  {
    "id": "esc-p2-app", "name": "P2 Application Degradation",
    "team": "Platform", "severity": "P2",
    "levels": [
      { "level": 1, "contacts": ["Primary On-Call (Platform)"],          "waitTime": "10 min", "method": "Slack + SMS" },
      { "level": 2, "contacts": ["Secondary On-Call", "Team Lead"],      "waitTime": "20 min", "method": "Phone + SMS" },
      { "level": 3, "contacts": ["Engineering Manager"],                  "waitTime": "30 min", "method": "Phone" }
    ]
  },
  {
    "id": "esc-p3-general", "name": "P3 General Alert",
    "team": "All Teams", "severity": "P3",
    "levels": [
      { "level": 1, "contacts": ["Primary On-Call (Relevant Team)"], "waitTime": "30 min", "method": "Slack" },
      { "level": 2, "contacts": ["Team Lead"],                       "waitTime": "60 min", "method": "Slack + Email" }
    ]
  }
]
```

---

### 1.7 `aN[]` — Paging History (7 pages)

```json
[
  { "id": "PG-301", "incident": "INC-4821", "target": "Sarah Chen",    "method": "Phone + SMS", "sentAt": "12m ago",     "status": "acknowledged", "acknowledgedAt": "11m ago" },
  { "id": "PG-300", "incident": "INC-4819", "target": "Priya Patel",   "method": "Phone + Slack","sentAt": "28m ago",    "status": "acknowledged", "acknowledgedAt": "26m ago" },
  { "id": "PG-299", "incident": "INC-4819", "target": "Marcus Johnson","method": "SMS",          "sentAt": "28m ago",    "status": "paging" },
  { "id": "PG-298", "incident": "INC-4817", "target": "Dev Sharma",    "method": "Slack",        "sentAt": "45m ago",    "status": "acknowledged", "acknowledgedAt": "43m ago" },
  { "id": "PG-297", "incident": "INC-4815", "target": "Alex Kim",      "method": "Phone",        "sentAt": "1h 10m ago", "status": "declined" },
  { "id": "PG-296", "incident": "INC-4815", "target": "Maria Garcia",  "method": "Phone + SMS",  "sentAt": "1h 8m ago",  "status": "escalated" },
  { "id": "PG-295", "incident": "INC-4812", "target": "James Wilson",  "method": "Slack",        "sentAt": "2h ago",     "status": "acknowledged", "acknowledgedAt": "1h 58m ago" }
]
```

**Page Status enum:** `"acknowledged"` | `"paging"` | `"declined"` | `"escalated"` | `"idle"`

---

### 1.8 `EDe[]` — On-Call Schedules (2 days shown)

```json
[
  {
    "day": "Today — Mar 26",
    "teams": [
      { "team": "SRE",     "primary": "Sarah Chen",    "secondary": "James Wilson",  "shift": "06:00–18:00 UTC" },
      { "team": "DB-Ops",  "primary": "Marcus Johnson", "secondary": "Li Wei",        "shift": "06:00–18:00 UTC" },
      { "team": "Network", "primary": "Priya Patel",   "secondary": "Omar Hassan",   "shift": "06:00–18:00 UTC" },
      { "team": "SecOps",  "primary": "Alex Kim",      "secondary": "Maria Garcia",  "shift": "06:00–18:00 UTC" },
      { "team": "Platform","primary": "Dev Sharma",    "secondary": "Emily Torres",  "shift": "06:00–18:00 UTC" }
    ]
  }
]
```

---

## 2. Architectural Observation — "Live" vs "Static" Data

This is the **only route in the application designed to show live/real-time data**. The bundle hints at this with:
- `new Date().toUTCString()` rendered directly in the page header
- `animate-pulse` on the status dot and critical health indicators
- `"LIVE"` badge in the top bar
- Age strings like `"12m ago"`, `"28m ago"` (relative time — not ISO dates)

In the rebuild, the following fields should be **real-time via WebSocket or SSE** (Server-Sent Events):
- Incident status changes and new incident creation
- System health metrics (poll every 30s)
- Paging history updates
- On-call engineer status changes

---

## 3. Data Models (SQLModel / PostgreSQL)

```python
import uuid
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

# ── Incident ──────────────────────────────────────────────────
class Incident(SQLModel, table=True):
    __tablename__ = "incidents"

    id: str = Field(primary_key=True)          # "INC-4821"
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    title: str
    severity: str                              # "P1" | "P2" | "P3"
    status: str                                # "Investigating"|"Triaging"|"Engaged"|"Communicating"|"Resolved"
    workflow_stage: str                        # "investigate"|"triage"|"engage"|"communicate"|"resolved"
    service: str                               # affected service name
    assignee: Optional[str] = None
    team: Optional[str] = None
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    ai_suggestion: Optional[str] = None

    # Metrics
    comments_count: int = Field(default=0)
    attachments_count: int = Field(default=0)
    sla_breach: bool = Field(default=False)

    opened_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Service Health ─────────────────────────────────────────────
class ServiceHealth(SQLModel, table=True):
    __tablename__ = "service_health"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    service_name: str
    health_pct: float                          # 0.0–100.0
    status: str                                # "healthy" | "degraded" | "critical"
    snapshot_at: datetime = Field(default_factory=datetime.utcnow)

    # Unique: latest snapshot per service per org
    # (use SELECT DISTINCT ON in queries)


# ── On-Call Engineer ──────────────────────────────────────────
class OnCallEngineer(SQLModel, table=True):
    __tablename__ = "on_call_engineers"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    name: str
    role: str
    team: str
    phone: str
    email: str
    shift: str                                 # "06:00–18:00 UTC"
    status: str                                # "on-call"|"paged"|"available"|"off-duty"
    avg_response_time: Optional[str] = None    # "< 2m avg"

    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── On-Call Schedule ──────────────────────────────────────────
class OnCallSchedule(SQLModel, table=True):
    __tablename__ = "on_call_schedules"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    schedule_date: str                         # "2025-03-26"
    team: str
    primary_engineer: str
    secondary_engineer: str
    shift: str                                 # "06:00–18:00 UTC"

    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Escalation Chain ─────────────────────────────────────────
class EscalationChain(SQLModel, table=True):
    __tablename__ = "escalation_chains"

    id: str = Field(primary_key=True)          # "esc-p1-infra"
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    name: str
    team: str
    severity: str                              # "P1" | "P2" | "P3"
    levels: List[dict] = Field(default=[], sa_column=Column(JSON))


# ── Page (Alert notification) ────────────────────────────────
class Page(SQLModel, table=True):
    __tablename__ = "pages"

    id: str = Field(primary_key=True)          # "PG-301"
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    incident_id: str = Field(foreign_key="incidents.id", index=True)

    target_engineer: str
    method: str                                # "Phone + SMS" | "Slack" | etc.
    status: str                                # "paging"|"acknowledged"|"declined"|"escalated"
    sent_at: datetime
    acknowledged_at: Optional[datetime] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Entity Relationship Diagram

```
organizations
    │
    ├──< incidents               (org_id)
    │         └──< pages         (incident_id)
    │
    ├──< service_health          (org_id — append-only snapshots)
    ├──< on_call_engineers       (org_id)
    ├──< on_call_schedules       (org_id)
    └──< escalation_chains       (org_id — JSONB levels)
```

---

## 4. API Contracts (FastAPI)

### 4.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

class IncidentRead(BaseModel):
    id: str
    title: str
    severity: str
    status: str
    workflow_stage: str
    service: str
    assignee: Optional[str]
    team: Optional[str]
    tags: List[str]
    ai_suggestion: Optional[str]
    comments_count: int
    age: str           # computed relative time: "12m", "1h 5m" etc.
    opened_at: datetime

class DashboardKpis(BaseModel):
    active_incidents: int
    p1_count: int
    p2_count: int
    p3_count: int
    mttr_minutes: int
    resolved_today: int
    sla_compliance_pct: float
    on_call_count: int
    paged_count: int

class ServiceHealthRead(BaseModel):
    service_name: str
    health_pct: float
    status: str
    snapshot_at: datetime

class CommandCenterDashboard(BaseModel):
    kpis: DashboardKpis
    active_incidents: List[IncidentRead]
    service_health: List[ServiceHealthRead]

class WorkflowKanban(BaseModel):
    investigate: List[IncidentRead]
    triage: List[IncidentRead]
    engage: List[IncidentRead]
    communicate: List[IncidentRead]
    severity_filter: Optional[str] = None     # "P1"|"P2"|"P3"|"all"

class OnCallEngineerRead(BaseModel):
    name: str
    role: str
    team: str
    phone: str
    email: str
    shift: str
    status: str
    avg_response_time: Optional[str]

class EscalationLevel(BaseModel):
    level: int
    contacts: List[str]
    wait_time: str
    method: str

class EscalationChainRead(BaseModel):
    id: str
    name: str
    team: str
    severity: str
    levels: List[EscalationLevel]

class PageRead(BaseModel):
    id: str
    incident_id: str
    target_engineer: str
    method: str
    status: str
    sent_at: datetime
    acknowledged_at: Optional[datetime]
    age: str           # computed relative

class ResourcesResponse(BaseModel):
    roster: List[OnCallEngineerRead]
    escalation_chains: List[EscalationChainRead]
    paging_history: List[PageRead]
    schedules: List[dict]

class IncidentWorkflowUpdate(BaseModel):
    stage: str          # move to new stage
    assignee: Optional[str]
    notes: Optional[str]
```

### 4.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/command-center/dashboard` | KPIs + active incidents + service health |
| `GET` | `/api/command-center/incidents` | All active incidents (filterable + sortable) |
| `POST` | `/api/command-center/incidents` | Create new incident |
| `GET` | `/api/command-center/incidents/{id}` | Full incident detail |
| `PATCH` | `/api/command-center/incidents/{id}/stage` | Move incident to new workflow stage |
| `PATCH` | `/api/command-center/incidents/{id}/resolve` | Resolve an incident |
| `GET` | `/api/command-center/workflow` | Kanban board grouped by stage |
| `GET` | `/api/command-center/service-health` | Latest snapshot per service |
| `POST` | `/api/command-center/service-health` | Record new health snapshot |
| `GET` | `/api/command-center/resources/roster` | On-call engineer roster |
| `GET` | `/api/command-center/resources/schedules` | On-call schedules |
| `GET` | `/api/command-center/resources/escalations` | Escalation chain definitions |
| `GET` | `/api/command-center/resources/pages` | Paging history |
| `POST` | `/api/command-center/resources/pages` | Trigger a new page to an engineer |
| `GET` | `/api/command-center/stream` | **SSE endpoint** — real-time incident/health updates |

### 4.3 Real-Time SSE Stream

```python
# FastAPI SSE endpoint
from fastapi.responses import StreamingResponse
import asyncio, json

@router.get("/api/command-center/stream")
async def incident_stream(request: Request):
    async def event_generator():
        while True:
            if await request.is_disconnected():
                break
            # Fetch latest state
            incidents = await get_active_incidents()
            health    = await get_service_health()
            yield f"data: {json.dumps({'incidents': incidents, 'health': health})}\n\n"
            await asyncio.sleep(15)   # push every 15s

    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

---

## 5. Frontend Component Tree (Next.js)

```
app/
└── command-center/
    └── page.tsx                                     ← Server: minimal shell, SSE client setup
        └── <CommandCenterPage>                      ← Client (activeTab state + SSE connection)
              ├── <LiveStatusBar />                  ← "ALL SYSTEMS MONITORED" + UTC clock
              ├── <TabBar tabs={TABS} />
              └── {
                    dashboard:      <DashboardTab />,
                    workflow:       <WorkflowTab />,
                    resources:      <ResourcesTab />,
                    infrastructure: dynamic(() => import('./InfrastructureTab')),
                    itsm:           dynamic(() => import('./ItsmTab')),
                    collaboration:  dynamic(() => import('./CollaborationTab')),
                    communication:  dynamic(() => import('./CommunicationTab')),
                    subscriptions:  dynamic(() => import('./SubscriptionsTab')),
                    chat:           <AiAssistantTab />,
                    'ai-engines':   dynamic(() => import('./AiEnginesTab')),
                    admin:          dynamic(() => import('./AdminTab')),
                  }[activeTab]

    components/
    ├── DashboardTab.tsx                             ← Client (SSE subscriber)
    │     ├── <KpiCards />                           ← 4 metric cards
    │     ├── <WorkflowPipelineBar />                ← x3e: horizontal stage strip
    │     ├── <ActiveIncidentsFeed />                ← w3e: v3e[] live list
    │     ├── <AiInsightsPanel />                    ← k3e: AI suggestions
    │     ├── <OnCallPanel />                        ← P3e: on-call quick list
    │     └── <SystemHealthPanel />                  ← T3e: 8 service health bars
    │
    ├── WorkflowTab.tsx                              ← Client (severityFilter state)
    │     ├── <WorkflowHeader />                     ← total count + severity filter
    │     └── <KanbanBoard>                          ← 4 column Kanban
    │           └── <KanbanColumn> × 4              ← investigate/triage/engage/communicate
    │                 └── <IncidentCard> × N         ← severity badge, AI suggestion, tags
    │
    └── ResourcesTab.tsx                             ← Client (subTab state)
          ├── <SubTabBar />                          ← roster/schedules/escalation/pages
          ├── <OnCallRoster />                       ← nN[] table with status, actions
          ├── <SchedulesView />                      ← EDe[] 2-day schedule grid
          ├── <EscalationChains />                   ← ODe[] expandable chain cards
          └── <PagingHistory />                      ← aN[] with status badges
```

---

## 6. State & Interactivity

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<CommandCenterPage>` | Active tab from 11 tabs |
| `sseData` | `object` | `<CommandCenterPage>` | Latest push from SSE stream |
| **Workflow Tab** | | | |
| `severityFilter` | `"all"\|"P1"\|"P2"\|"P3"` | `<WorkflowTab>` | Filter by severity across all columns |
| **Resources Tab** | | | |
| `resourceSubTab` | `string` | `<ResourcesTab>` | `"roster"` \| `"schedules"` \| `"escalation"` \| `"pages"` |

### SSE Connection (client-side)

```typescript
// In CommandCenterPage (Client Component)
useEffect(() => {
  const es = new EventSource('/api/command-center/stream');
  es.onmessage = (e) => setSseData(JSON.parse(e.data));
  return () => es.close();
}, []);
```

### Relative Time Computation

```typescript
// age is computed server-side from opened_at:
const age = (openedAt: Date): string => {
  const mins = Math.floor((Date.now() - openedAt.getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
};
```

---

## 7. Seed Data (DB Migration)

```python
INCIDENTS_SEED = [
    { "id": "INC-4821", "title": "Production DB cluster latency spike — read replicas unresponsive",
      "severity": "P1", "status": "Investigating", "workflow_stage": "investigate",
      "service": "Database", "assignee": "Sarah Chen", "team": "DB-Ops",
      "tags": ["database","latency"],
      "ai_suggestion": "CRQ-9921 (Schema Migration) deployed 14m ago — 87% correlation",
      "comments_count": 8, "attachments_count": 3 },
    { "id": "INC-4819", "title": "CDN cache invalidation failure affecting US-East region",
      "severity": "P1", "status": "Triaging", "workflow_stage": "triage",
      "service": "CDN", "assignee": "Marcus Johnson", "team": "Network",
      "tags": ["cdn","us-east"],
      "ai_suggestion": "Similar incident INC-4102 resolved by purging edge nodes — recommend same playbook",
      "comments_count": 12, "attachments_count": 5 },
    # ... all 9 incidents from R3e
]

SERVICE_HEALTH_SEED = [
    { "service_name": "API Gateway",      "health_pct": 99.8, "status": "healthy" },
    { "service_name": "Auth Service",     "health_pct": 97.2, "status": "degraded" },
    { "service_name": "Payment Engine",   "health_pct": 95.1, "status": "degraded" },
    { "service_name": "Database Cluster", "health_pct": 88.4, "status": "critical" },
    { "service_name": "CDN / Edge",       "health_pct": 92.3, "status": "degraded" },
    { "service_name": "Message Queue",    "health_pct": 99.9, "status": "healthy" },
    { "service_name": "Search Index",     "health_pct": 100,  "status": "healthy" },
    { "service_name": "Storage / S3",     "health_pct": 99.7, "status": "healthy" },
]
```

---

## 8. Key Design Decisions

1. **SSE over WebSockets** — for incident/health real-time updates. SSE is simpler to implement in FastAPI (`StreamingResponse`), unidirectional (server → client), works through proxies, and is sufficient for 15s interval refreshes. WebSockets only needed if we add live incident chat.

2. **`age` is server-computed** — returned as a formatted string (`"12m"`, `"1h 5m"`) computed from `opened_at`. Avoids client-side clock drift issues and keeps the UI clean.

3. **`escalation_chains.levels` is JSONB** — the levels array has variable depth (2–4 levels) per chain. JSONB is the right choice vs. a normalized `escalation_levels` junction table given it's rarely queried independently.

4. **`service_health` is append-only** — each health check writes a new row (time-series pattern). Latest state is via `SELECT DISTINCT ON (service_name) ORDER BY snapshot_at DESC`. This preserves history for trend charts.

5. **8 lazy-loaded tabs** — `infrastructure`, `itsm`, `collaboration`, `communication`, `subscriptions`, `ai-engines`, and `admin` are loaded via `React.Suspense` in the bundle. In Next.js, these become `dynamic(() => import('./Tab'), { loading: () => <Spinner /> })`. Their data models will be specced in a future phase if needed.

---

## 9. Notes for Next Phase

- **`/admin`** will define the final `users` and `organizations` tables — needed before any auth implementation. Should be specced next.
- The lazy tabs (`infrastructure`, `itsm`, `collaboration`, etc.) represent **external integration frameworks** (likely connecting to PagerDuty, Jira, Slack, etc.) — these are integration surfaces, not new DB tables.
- The `chat` tab (`_De`) inside Command Center is a **local AI assistant** distinct from `/geneye-chat` — it appears to be a context-aware ops chat (incident-scoped).
