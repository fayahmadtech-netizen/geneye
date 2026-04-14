# GenEye — Phase 2: Route Specification — `/admin`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `jke` (page)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/admin`
**Page Title:** "Administration"
**Subtitle:** "Organization settings, user management, and platform access control"

This is the **platform configuration hub** — the route that defines and finalises the core entities used across the entire application: the `organizations` and `users` tables, plus role-based access control (RBAC), platform module registry, integration connections, and the cross-system activity audit log.

> **⚠️ Critical Route:** This spec locks in the `organizations`, `users`, and `roles` tables referenced throughout all previous phase specs.

### Tabs

| Tab Key | Label | Data |
|---|---|---|
| `org` | Org Profile | `kD` + org stats |
| `users` | User Management | `dJ[]` (users table — now fully defined) |
| `access` | Role Access Control | `n5[]` (RBAC roles + module permissions) |
| `modules` | Platform Modules | `r5[]` (full platform module registry) |
| `integrations` | Integrations | `vke[]` (external system connections) |
| `audit` | Audit Log | `yke[]` (cross-module activity log) |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 Organization Profile (inline in `jke` — `e === "org"`)

```json
{
  "organizationName": "Acme Corporation",
  "industry": "Financial Services",
  "region": "North America",
  "fiscalYear": "January – December",
  "aiProgramOwner": "Patricia Lewis",
  "subscriptionTier": "Enterprise"
}
```

**Platform Stats (computed from other tables):**

| Metric | Value | Source |
|---|---|---|
| Total Modules | 15 | Count of `r5[]` |
| Active Users | 7 | `dJ[]` where `status = "Active"` |
| Active Agents | 12 | AgentCore |
| Production Models | 4 | ML Studio |
| AI Maturity | 2.4 | `kD.currentMaturity` |

---

### 1.2 `dJ[]` — Users Table — **FULLY DEFINED** (5 users)

```json
[
  { "id": "1", "name": "Patricia Lewis", "email": "p.lewis@geneye.com", "role": "Admin",     "status": "Active" },
  { "id": "2", "name": "David Kim",      "email": "d.kim@geneye.com",   "role": "Executive", "status": "Active" },
  { "id": "3", "name": "Sarah Chen",     "email": "s.chen@geneye.com",  "role": "Reviewer",  "status": "Active" },
  { "id": "4", "name": "Marcus Reid",    "email": "m.reid@geneye.com",  "role": "Reviewer",  "status": "Active" },
  { "id": "5", "name": "James Park",     "email": "j.park@geneye.com",  "role": "Executive", "status": "Inactive" }
]
```

**Role enum:** `"Admin"` | `"Executive"` | `"ML Engineer"` | `"Data Scientist"` | `"Reviewer"`
**Status enum:** `"Active"` | `"Inactive"` | `"Invited"`

---

### 1.3 `n5[]` — RBAC Role Definitions (5 roles)

Complete role-to-permission matrix extracted from the access control tab:

```json
[
  {
    "role": "Admin",
    "modules": [
      "dashboard","ato-diagnostic","org-blueprint","portfolio","governance","value",
      "control-tower","ct-governance","ct-portfolio","ct-maturity",
      "agentcore","ml-studio","physical-ai"
    ],
    "capabilities": [
      "Full platform access", "User & role management", "Module configuration",
      "API key management", "Approve all initiative tiers", "Export all data",
      "Audit log access", "Control Tower full access", "ATO diagnostic admin"
    ]
  },
  {
    "role": "Executive",
    "modules": [
      "dashboard","ato-diagnostic","org-blueprint","portfolio","governance","value",
      "control-tower","ct-governance","ct-portfolio","ct-maturity"
    ],
    "capabilities": [
      "View Dashboard & Portfolio", "Approve Tier 2 & 3 initiatives",
      "Export reports", "Run ATO diagnostics", "Control Tower oversight",
      "Capital allocation review", "Maturity progress tracking"
    ]
  },
  {
    "role": "ML Engineer",
    "modules": ["ml-studio","agentcore","physical-ai","portfolio"],
    "capabilities": [
      "Full ML Studio access", "Create & deploy models", "Manage data pipelines",
      "Agent creation in AgentCore", "Monitor model drift", "Retrain models",
      "Physical AI edge deployment"
    ]
  },
  {
    "role": "Data Scientist",
    "modules": ["ml-studio","portfolio","physical-ai"],
    "capabilities": [
      "ML Studio (read/write)", "Experiment tracking", "Dataset management",
      "Model training runs", "View Portfolio use cases", "Physical AI sensor analytics"
    ]
  },
  {
    "role": "Reviewer",
    "modules": ["dashboard","governance","portfolio","ct-governance"],
    "capabilities": [
      "View Dashboard", "Submit review decisions", "View Portfolio",
      "View Governance approvals", "Risk oversight review"
    ]
  }
]
```

---

### 1.4 `r5[]` — Platform Module Registry (13 modules — COMPLETE)

This is the **authoritative list of all application modules** — critical for RBAC and navigation.

```json
[
  { "key": "dashboard",       "label": "AI Transformation Control Plane", "section": "Strategy and Readiness",  "description": "Executive KPIs, AI health overview & transformation metrics",           "status": "Live", "version": "v2.1" },
  { "key": "ato-diagnostic",  "label": "AI Readiness Diagnostic",        "section": "AI Transformation Office","description": "5-step enterprise AI readiness & operating model diagnostic",          "status": "Live", "version": "v1.5" },
  { "key": "org-blueprint",   "label": "AI Org Blueprint",               "section": "AI Transformation Office","description": "Org structure, CoE design, PARC framework & AI Academy",              "status": "Live", "version": "v1.3" },
  { "key": "portfolio",       "label": "UseCaseX Portfolio",             "section": "AI Transformation Office","description": "AI use case intake, lifecycle, inventory & prioritization",           "status": "Live", "version": "v3.0" },
  { "key": "governance",      "label": "AI Governance Stack",            "section": "AI Transformation Office","description": "Tier-based risk classification, model cards, approval workflows",     "status": "Live", "version": "v2.4" },
  { "key": "value",           "label": "Value Forecast",                 "section": "AI Transformation Office","description": "FinOps scorecard, ROI calculator, executive dashboard model",         "status": "Live", "version": "v1.6" },
  { "key": "control-tower",   "label": "Control Tower",                  "section": "AI Control Tower",        "description": "Executive control plane — enterprise AI command layer",              "status": "Live", "version": "v1.0" },
  { "key": "ct-governance",   "label": "Governance & Risk Oversight",    "section": "AI Control Tower",        "description": "Policy coverage, risk assessment, regulatory alignment",              "status": "Live", "version": "v1.0" },
  { "key": "ct-portfolio",    "label": "Portfolio & Capital",            "section": "AI Control Tower",        "description": "AI investment portfolio, capital efficiency, 2A-2 risk-value",        "status": "Live", "version": "v1.0" },
  { "key": "ct-maturity",     "label": "Maturity Progress Engine",       "section": "AI Control Tower",        "description": "Deliverable tracking, dimension scores, milestone timeline",          "status": "Live", "version": "v1.0" },
  { "key": "agentcore",       "label": "AI AgentCore Platform",          "section": "GenEye Platforms",        "description": "Unified control plane, 5-step agent creation, context graph",         "status": "Live", "version": "v1.0" },
  { "key": "ml-studio",       "label": "ML Studio",                      "section": "GenEye Platforms",        "description": "Data plane, MLOps pipelines, model training & monitoring",           "status": "Live", "version": "v1.0" },
  { "key": "physical-ai",     "label": "Physical AI Platform",           "section": "GenEye Platforms",        "description": "Edge AI, IoT integration, predictive maintenance & HITL",           "status": "Live", "version": "v1.0" }
]
```

**Sections:** `"Strategy and Readiness"` | `"AI Transformation Office"` | `"AI Control Tower"` | `"GenEye Platforms"`

---

### 1.5 `vke[]` — Integrations (10 connections)

```json
[
  { "name": "Snowflake",                "category": "Data Warehouse", "status": "Connected", "lastSync": "10m ago" },
  { "name": "AWS S3 + Glue",            "category": "Data Lake",      "status": "Connected", "lastSync": "Real-time" },
  { "name": "MLflow",                   "category": "Model Registry", "status": "Connected", "lastSync": "5m ago" },
  { "name": "Kafka",                    "category": "Streaming",      "status": "Connected", "lastSync": "Live" },
  { "name": "OpenAI API",               "category": "LLM Provider",   "status": "Connected", "lastSync": "On-demand" },
  { "name": "Anthropic API",            "category": "LLM Provider",   "status": "Connected", "lastSync": "On-demand" },
  { "name": "Feast Feature Store",      "category": "Feature Store",  "status": "Connected", "lastSync": "Hourly" },
  { "name": "Azure Form Recognizer",    "category": "OCR / Vision",   "status": "Connected", "lastSync": "On-demand" },
  { "name": "Salesforce CRM",           "category": "Enterprise App", "status": "Syncing",   "lastSync": "30m ago" },
  { "name": "Third-Party Credit Bureau","category": "External API",   "status": "Error",     "lastSync": "6h ago" }
]
```

**Status enum:** `"Connected"` | `"Syncing"` | `"Error"` | `"Disconnected"`

---

### 1.6 `yke[]` — Activity Audit Log (15 entries — cross-module)

```json
[
  { "id": "a1",  "user": "Patricia Lewis", "action": "Created new agent 'Claims Triage Bot' in AgentCore",                    "module": "AgentCore",     "timestamp": "Today 10:22 AM",      "level": "info" },
  { "id": "a2",  "user": "Priya Nair",     "action": "Deployed 'Fraud Ensemble Classifier v5.0' to Production",              "module": "ML Studio",     "timestamp": "Today 09:48 AM",      "level": "info" },
  { "id": "a3",  "user": "David Kim",      "action": "Approved 'Contract Intelligence Engine' — Tier 2 governance",          "module": "Governance",    "timestamp": "Today 09:15 AM",      "level": "success" },
  { "id": "a4",  "user": "System",         "action": "Model drift alert triggered for 'Customer Churn Propensity v2.1'",     "module": "ML Studio",     "timestamp": "Today 08:31 AM",      "level": "warn" },
  { "id": "a9",  "user": "David Kim",      "action": "Completed ATO Diagnostic V.3 — maturity score 2.4",                   "module": "ATO Diagnostic","timestamp": "Today 08:10 AM",      "level": "success" },
  { "id": "a10", "user": "System",         "action": "Control Tower maturity index updated to 2.4 from diagnostic data",     "module": "Control Tower", "timestamp": "Today 08:10 AM",      "level": "info" },
  { "id": "a11", "user": "Patricia Lewis", "action": "Marked 'AI governance charter finalized' deliverable as 100% complete","module": "Control Tower", "timestamp": "Today 07:45 AM",      "level": "success" },
  { "id": "a12", "user": "System",         "action": "Regulatory alignment check: EU AI Act coverage at 72%",                "module": "CT Governance", "timestamp": "Today 07:30 AM",      "level": "warn" },
  { "id": "a5",  "user": "Tom Walsh",      "action": "Submitted 'HR Resume Screening' for Tier 1 review",                   "module": "Governance",    "timestamp": "Yesterday 04:52 PM",  "level": "info" },
  { "id": "a13", "user": "Kevin Torres",   "action": "Deployed edge model 'Vibration Anomaly Detector' to Node-7",          "module": "Physical AI",   "timestamp": "Yesterday 03:40 PM",  "level": "info" },
  { "id": "a6",  "user": "Lisa Monroe",    "action": "Connected 'Third-Party Credit Bureau' API — error on sync",           "module": "ML Studio",     "timestamp": "Yesterday 03:10 PM",  "level": "error" },
  { "id": "a14", "user": "Marcus Reid",    "action": "Updated AI Org Blueprint — PARC Framework for Revenue Mgmt BU",       "module": "Org Blueprint", "timestamp": "Yesterday 02:30 PM",  "level": "info" },
  { "id": "a7",  "user": "Aisha Johnson",  "action": "Invited new user 'r.patel@geneye.com' as Data Scientist",             "module": "Admin",         "timestamp": "Yesterday 02:04 PM",  "level": "info" },
  { "id": "a15", "user": "System",         "action": "Portfolio capital efficiency ratio updated to 5.5x",                   "module": "CT Portfolio",  "timestamp": "Yesterday 01:15 PM",  "level": "info" },
  { "id": "a8",  "user": "System",         "action": "Scheduled retrain triggered for 'Claims Severity Predictor v3.2'",   "module": "ML Studio",     "timestamp": "Yesterday 01:00 AM",  "level": "info" }
]
```

**Level enum:** `"info"` | `"success"` | `"warn"` | `"error"`
**Modules seen:** `"AgentCore"`, `"ML Studio"`, `"Governance"`, `"ATO Diagnostic"`, `"Control Tower"`, `"CT Governance"`, `"CT Portfolio"`, `"Physical AI"`, `"Org Blueprint"`, `"Admin"`

---

## 2. Data Models (SQLModel / PostgreSQL) — CORE TABLES FINALISED

### 2.1 `Organization` — **COMPLETE**

```python
import uuid
from datetime import datetime
from typing import Optional, List, Dict
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

class Organization(SQLModel, table=True):
    __tablename__ = "organizations"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    # Profile
    company: str
    industry: str
    region: Optional[str] = None
    fiscal_year: Optional[str] = None          # "January – December"
    ai_program_owner: Optional[str] = None
    subscription_tier: str = Field(default="Enterprise")

    # Maturity (from kD)
    baseline_maturity: float = Field(default=1.0)
    current_maturity: float = Field(default=1.0)
    target_maturity: float = Field(default=5.0)

    # Budget
    total_budget_m: Optional[float] = Field(default=8.5)  # FY budget in $M

    # ROI Calculator Defaults (from cJ)
    roi_calculator_defaults: Dict = Field(
        default={
            "implementationCost": 250000, "annualLicenseCost": 60000,
            "teamHours": 2400, "hourlyRate": 120, "productivityGain": 30,
            "revenueUplift": 500000, "costAvoidance": 180000,
            "riskReductionValue": 80000, "timeToValue": 6
        },
        sa_column=Column(JSON)
    )

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.2 `User` — **COMPLETE**

```python
from passlib.context import CryptContext

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: Optional[str] = None      # null for SSO users
    role: str                                   # "Admin"|"Executive"|"ML Engineer"|"Data Scientist"|"Reviewer"
    status: str = Field(default="Invited")      # "Active"|"Inactive"|"Invited"

    # Auth
    last_login: Optional[datetime] = None
    email_verified: bool = Field(default=False)
    invite_token: Optional[str] = None          # one-time token for email invite

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.3 `Role` — **COMPLETE** (seed table)

```python
class Role(SQLModel, table=True):
    __tablename__ = "roles"

    name: str = Field(primary_key=True)         # "Admin"|"Executive"|"ML Engineer"|"Data Scientist"|"Reviewer"
    allowed_modules: List[str] = Field(
        default=[], sa_column=Column(JSON)
    )
    capabilities: List[str] = Field(
        default=[], sa_column=Column(JSON)
    )
    display_order: int = Field(default=0)
```

### 2.4 `PlatformModule` — **COMPLETE** (seed table)

```python
class PlatformModule(SQLModel, table=True):
    __tablename__ = "platform_modules"

    key: str = Field(primary_key=True)          # "dashboard","portfolio","governance" etc.
    label: str
    section: str                                 # grouping label
    description: str
    status: str = Field(default="Live")         # "Live"|"Beta"|"Planned"
    version: str = Field(default="v1.0")
    display_order: int = Field(default=0)
```

### 2.5 `Integration` — **COMPLETE**

```python
class Integration(SQLModel, table=True):
    __tablename__ = "integrations"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    name: str
    category: str                               # "Data Warehouse"|"LLM Provider"|"Model Registry"|etc.
    status: str                                 # "Connected"|"Syncing"|"Error"|"Disconnected"
    last_sync: Optional[str] = None             # display string or timestamp
    last_sync_at: Optional[datetime] = None     # sortable datetime
    config: Dict = Field(
        default={}, sa_column=Column(JSON)
    )                                           # connection config (encrypted at rest)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### 2.6 `ActivityLog` — **COMPLETE** (cross-module audit trail)

```python
class ActivityLog(SQLModel, table=True):
    __tablename__ = "activity_logs"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    user_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="users.id"
    )                                           # null for "System" entries
    user_display: str                           # "Patricia Lewis" or "System"
    action: str                                 # full action description
    module: str                                 # which module the action occurred in
    level: str                                  # "info"|"success"|"warn"|"error"

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        indexes = [["organization_id", "created_at"]]  # primary query pattern
```

### 2.7 Full Entity Map — Core Tables

```
organizations (1)
    │
    ├──< users                      (org_id)  — 1:N
    ├──< integrations               (org_id)  — 1:N
    └──< activity_logs              (org_id)  — 1:N (append-only)

roles                               (seed — no FK)
platform_modules                    (seed — no FK)
```

---

## 3. RBAC Module-Permission Matrix

Derived from `n5[]` and `r5[]`:

| Module Key | Admin | Executive | ML Engineer | Data Scientist | Reviewer |
|---|:---:|:---:|:---:|:---:|:---:|
| `dashboard` | ✅ | ✅ | — | — | ✅ |
| `ato-diagnostic` | ✅ | ✅ | — | — | — |
| `org-blueprint` | ✅ | ✅ | — | — | — |
| `portfolio` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `governance` | ✅ | ✅ | — | — | ✅ |
| `value` | ✅ | ✅ | — | — | — |
| `control-tower` | ✅ | ✅ | — | — | — |
| `ct-governance` | ✅ | ✅ | — | — | ✅ |
| `ct-portfolio` | ✅ | ✅ | — | — | — |
| `ct-maturity` | ✅ | ✅ | — | — | — |
| `agentcore` | ✅ | — | ✅ | — | — |
| `ml-studio` | ✅ | — | ✅ | ✅ | — |
| `physical-ai` | ✅ | — | ✅ | ✅ | — |

---

## 4. API Contracts (FastAPI)

### 4.1 Pydantic Models

```python
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime

class OrganizationRead(BaseModel):
    id: uuid.UUID
    company: str
    industry: str
    region: Optional[str]
    fiscal_year: Optional[str]
    ai_program_owner: Optional[str]
    subscription_tier: str
    baseline_maturity: float
    current_maturity: float
    target_maturity: float
    total_budget_m: Optional[float]

class OrganizationUpdate(BaseModel):
    company: Optional[str]
    industry: Optional[str]
    region: Optional[str]
    fiscal_year: Optional[str]
    ai_program_owner: Optional[str]
    roi_calculator_defaults: Optional[Dict]

class UserRead(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    role: str
    status: str
    last_login: Optional[datetime]
    created_at: datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: str                              # must be in roles table

class UserUpdate(BaseModel):
    name: Optional[str]
    role: Optional[str]
    status: Optional[str]

class RoleRead(BaseModel):
    name: str
    allowed_modules: List[str]
    capabilities: List[str]

class IntegrationRead(BaseModel):
    id: uuid.UUID
    name: str
    category: str
    status: str
    last_sync: Optional[str]
    last_sync_at: Optional[datetime]

class ActivityLogRead(BaseModel):
    id: uuid.UUID
    user_display: str
    action: str
    module: str
    level: str
    created_at: datetime

class AdminOverview(BaseModel):
    organization: OrganizationRead
    stats: Dict                            # total_modules, active_users, etc.
    users: List[UserRead]
    roles: List[RoleRead]
    modules: List[dict]
    integrations: List[IntegrationRead]
    recent_activity: List[ActivityLogRead]
```

### 4.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/overview` | Full admin page data in one call |
| `GET` | `/api/admin/organization` | Organization profile |
| `PUT` | `/api/admin/organization` | Update org profile |
| `GET` | `/api/admin/users` | List all users |
| `POST` | `/api/admin/users/invite` | Invite a new user (email + role) |
| `PATCH` | `/api/admin/users/{id}` | Update user role or status |
| `DELETE` | `/api/admin/users/{id}` | Deactivate user |
| `GET` | `/api/admin/roles` | List all roles with permissions |
| `GET` | `/api/admin/modules` | Full platform module registry |
| `GET` | `/api/admin/integrations` | Integration connections + status |
| `POST` | `/api/admin/integrations` | Add a new integration |
| `PATCH` | `/api/admin/integrations/{id}` | Update integration config/status |
| `GET` | `/api/admin/activity-log` | Paginated activity log |
| `POST` | `/api/admin/activity-log` | Write an activity log entry (internal use) |

### 4.3 Auth Middleware Pattern

```python
# FastAPI dependency — used on every protected route
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)) -> User:
    payload = verify_jwt(token.credentials)
    user = await get_user_by_id(payload["user_id"])
    if not user or user.status != "Active":
        raise HTTPException(status_code=401)
    return user

def require_role(*roles: str):
    async def dependency(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return dependency

# Usage:
# @router.post("/api/admin/users/invite")
# async def invite_user(user: User = Depends(require_role("Admin"))):
```

### 4.4 Module RBAC Guard Pattern

```python
def require_module_access(module_key: str):
    async def dependency(user: User = Depends(get_current_user)):
        role = await get_role(user.role)
        if module_key not in role.allowed_modules:
            raise HTTPException(status_code=403, detail=f"No access to module: {module_key}")
        return user
    return dependency

# Usage per route group:
# @router.get("/api/governance/overview")
# async def governance_overview(user = Depends(require_module_access("governance"))):
```

---

## 5. Frontend Component Tree (Next.js)

```
app/
└── admin/
    └── page.tsx                                 ← Server: initial data load
        └── <AdminPage>                          ← Client (activeTab state)
              ├── <TabBar tabs={bke} />
              ├── <OrgProfileTab>                ← Client (e === "org")
              │     ├── <OrgProfileCard />       ← 6 editable fields (Organization Name etc.)
              │     └── <PlatformStatsGrid />    ← 5 KPI cards (modules, users, agents etc.)
              ├── <UserManagementTab>            ← Client (e === "users")
              │     ├── "+ Invite User" button   ← opens modal
              │     └── <UserTable />            ← dJ[] with role badge + status + actions
              ├── <AccessControlTab>             ← Client (e === "access")
              │     └── <RoleCard> × 5          ← n5[] — one card per role
              │           ├── <RoleBadge />
              │           ├── <ModuleAccessGrid /> ← r5 keys × checkmark/x per role
              │           └── <CapabilityList />
              ├── <ModulesTab>                   ← Client (e === "modules")
              │     └── <ModuleTable />          ← r5[] grouped by section
              ├── <IntegrationsTab>              ← Client (e === "integrations")
              │     └── <IntegrationCard> × 10  ← vke[] with status badge + last sync
              └── <AuditLogTab>                  ← Client (filter state)
                    ├── <LevelFilter />          ← All | info | success | warn | error
                    ├── <ModuleFilter />
                    └── <AuditLogTable />        ← yke[] sortable by timestamp + level icon
```

---

## 6. State & Interactivity

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<AdminPage>` | Active tab |
| **Org Tab** | | | |
| `editingField` | `string\|null` | `<OrgProfileCard>` | Inline edit field |
| **Users Tab** | | | |
| `inviteModalOpen` | `boolean` | `<UserManagementTab>` | Show invite modal |
| `inviteFormData` | `{name,email,role}` | `<InviteModal>` | New user form |
| **Audit Tab** | | | |
| `levelFilter` | `string` | `<AuditLogTab>` | `"all"` or level enum |
| `moduleFilter` | `string` | `<AuditLogTab>` | `"all"` or module name |

---

## 7. Seed Data (DB Migration)

```python
ROLES_SEED = [
    {
        "name": "Admin",
        "allowed_modules": [
            "dashboard","ato-diagnostic","org-blueprint","portfolio","governance","value",
            "control-tower","ct-governance","ct-portfolio","ct-maturity",
            "agentcore","ml-studio","physical-ai"
        ],
        "capabilities": [
            "Full platform access","User & role management","Module configuration",
            "API key management","Approve all initiative tiers","Export all data",
            "Audit log access","Control Tower full access","ATO diagnostic admin"
        ],
        "display_order": 0
    },
    {
        "name": "Executive",
        "allowed_modules": [
            "dashboard","ato-diagnostic","org-blueprint","portfolio","governance","value",
            "control-tower","ct-governance","ct-portfolio","ct-maturity"
        ],
        "capabilities": [
            "View Dashboard & Portfolio","Approve Tier 2 & 3 initiatives",
            "Export reports","Run ATO diagnostics","Control Tower oversight",
            "Capital allocation review","Maturity progress tracking"
        ],
        "display_order": 1
    },
    {
        "name": "ML Engineer",
        "allowed_modules": ["ml-studio","agentcore","physical-ai","portfolio"],
        "capabilities": [
            "Full ML Studio access","Create & deploy models","Manage data pipelines",
            "Agent creation in AgentCore","Monitor model drift","Retrain models",
            "Physical AI edge deployment"
        ],
        "display_order": 2
    },
    {
        "name": "Data Scientist",
        "allowed_modules": ["ml-studio","portfolio","physical-ai"],
        "capabilities": [
            "ML Studio (read/write)","Experiment tracking","Dataset management",
            "Model training runs","View Portfolio use cases","Physical AI sensor analytics"
        ],
        "display_order": 3
    },
    {
        "name": "Reviewer",
        "allowed_modules": ["dashboard","governance","portfolio","ct-governance"],
        "capabilities": [
            "View Dashboard","Submit review decisions","View Portfolio",
            "View Governance approvals","Risk oversight review"
        ],
        "display_order": 4
    }
]

PLATFORM_MODULES_SEED = [
    {"key": "dashboard",     "label": "AI Transformation Control Plane", "section": "Strategy and Readiness",  "description": "Executive KPIs, AI health overview & transformation metrics",           "status": "Live", "version": "v2.1",  "display_order": 0},
    {"key": "ato-diagnostic","label": "AI Readiness Diagnostic",        "section": "AI Transformation Office","description": "5-step enterprise AI readiness & operating model diagnostic",          "status": "Live", "version": "v1.5",  "display_order": 1},
    {"key": "org-blueprint", "label": "AI Org Blueprint",               "section": "AI Transformation Office","description": "Org structure, CoE design, PARC framework & AI Academy",              "status": "Live", "version": "v1.3",  "display_order": 2},
    {"key": "portfolio",     "label": "UseCaseX Portfolio",             "section": "AI Transformation Office","description": "AI use case intake, lifecycle, inventory & prioritization",           "status": "Live", "version": "v3.0",  "display_order": 3},
    {"key": "governance",    "label": "AI Governance Stack",            "section": "AI Transformation Office","description": "Tier-based risk classification, model cards, approval workflows",     "status": "Live", "version": "v2.4",  "display_order": 4},
    {"key": "value",         "label": "Value Forecast",                 "section": "AI Transformation Office","description": "FinOps scorecard, ROI calculator, executive dashboard model",         "status": "Live", "version": "v1.6",  "display_order": 5},
    {"key": "control-tower", "label": "Control Tower",                  "section": "AI Control Tower",        "description": "Executive control plane — enterprise AI command layer",              "status": "Live", "version": "v1.0",  "display_order": 6},
    {"key": "ct-governance", "label": "Governance & Risk Oversight",    "section": "AI Control Tower",        "description": "Policy coverage, risk assessment, regulatory alignment",              "status": "Live", "version": "v1.0",  "display_order": 7},
    {"key": "ct-portfolio",  "label": "Portfolio & Capital",            "section": "AI Control Tower",        "description": "AI investment portfolio, capital efficiency, 2A-2 risk-value",        "status": "Live", "version": "v1.0",  "display_order": 8},
    {"key": "ct-maturity",   "label": "Maturity Progress Engine",       "section": "AI Control Tower",        "description": "Deliverable tracking, dimension scores, milestone timeline",          "status": "Live", "version": "v1.0",  "display_order": 9},
    {"key": "agentcore",     "label": "AI AgentCore Platform",          "section": "GenEye Platforms",        "description": "Unified control plane, 5-step agent creation, context graph",         "status": "Live", "version": "v1.0",  "display_order": 10},
    {"key": "ml-studio",     "label": "ML Studio",                      "section": "GenEye Platforms",        "description": "Data plane, MLOps pipelines, model training & monitoring",           "status": "Live", "version": "v1.0",  "display_order": 11},
    {"key": "physical-ai",   "label": "Physical AI Platform",           "section": "GenEye Platforms",        "description": "Edge AI, IoT integration, predictive maintenance & HITL",           "status": "Live", "version": "v1.0",  "display_order": 12},
]

ORGANIZATIONS_SEED = [{
    "company": "Acme Corporation",
    "industry": "Financial Services",
    "region": "North America",
    "fiscal_year": "January – December",
    "ai_program_owner": "Patricia Lewis",
    "subscription_tier": "Enterprise",
    "baseline_maturity": 1.8,
    "current_maturity": 2.4,
    "target_maturity": 4.2,
    "total_budget_m": 8.5,
}]

USERS_SEED = [
    {"name": "Patricia Lewis", "email": "p.lewis@geneye.com", "role": "Admin",         "status": "Active" },
    {"name": "David Kim",      "email": "d.kim@geneye.com",   "role": "Executive",     "status": "Active" },
    {"name": "Sarah Chen",     "email": "s.chen@geneye.com",  "role": "Reviewer",      "status": "Active" },
    {"name": "Marcus Reid",    "email": "m.reid@geneye.com",  "role": "Reviewer",      "status": "Active" },
    {"name": "James Park",     "email": "j.park@geneye.com",  "role": "Executive",     "status": "Inactive" },
]
```

---

## 8. Key Design Decisions

1. **`roles` is a seed table, not FK-enforced** — roles are stored as string keys on `users.role`. This allows admins to create custom roles later without schema migrations. The `roles` table provides the canonical capability list.

2. **`activity_logs` is append-only** — no `UPDATE` or `DELETE` ever happens on this table. It's an immutable audit trail. Index on `(organization_id, created_at DESC)` for efficient pagination.

3. **`integrations.config` is JSONB** — connection config varies wildly between integrations (API keys, URLs, auth types). Storing as JSONB with application-level encryption for sensitive fields is correct.

4. **`hashed_password` nullable** — leaves room for SSO/OAuth (Google Workspace, Okta, etc.) where the password is managed externally. Initial implementation uses email/password with JWT.

5. **`ActivityLog` replaces `audit_logs`** — the admin route calls this `yke[]` and uses it for cross-module activity. The governance route's `audit_logs` (`q3[]`) is distinct: it's specifically for AI model audits. Both tables exist.

6. **`platform_modules` supersedes the earlier `PlatformModule` from control-tower** — the `r5[]` data here is the definitive, complete module registry. Merge the two previous stubs.

---

## 9. Updated Total Database Schema — 31 Tables

With `/admin` complete, the full schema is:

| Layer | Tables |
|---|---|
| **Auth/Core** (3) | `organizations`, `users`, `roles` |
| **Platform Config** (2) | `platform_modules`, `integrations` |
| **Logging** (2) | `activity_logs`, `audit_logs` |
| **Maturity** (5) | `maturity_domains`, `maturity_criteria`, `maturity_assessments`, `maturity_scores`, `maturity_dimension_history` |
| **Maturity Timeline** (2) | `maturity_milestones`, `risk_tier_definitions` |
| **Portfolio** (2) | `use_cases`, `model_deployments` |
| **Governance** (4) | `governance_alerts`, `approval_workflows`, `model_cards`, `approval_step_configs` |
| **Value/FinOps** (6) | `portfolio_financial_history`, `use_case_financial_snapshots`, `bu_adoption_snapshots`, `strategic_objectives`, `ai_health_indicators`, `quarterly_milestones` |
| **CT Security** (3) | `ai_guardrails`, `red_team_findings`, `compliance_frameworks` |
| **Ops/Command Center** (5) | `incidents`, `service_health`, `on_call_engineers`, `on_call_schedules`, `escalation_chains`, `pages` |

**Total: 32 tables** (including `pages` from command center).
