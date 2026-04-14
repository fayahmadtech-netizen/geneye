# GenEye — Master Database Schema Reference

> **Date:** 2026-04-12
> **Framework:** SQLModel (SQLAlchemy + Pydantic)
> **Database:** PostgreSQL (with JSONB support)

This document consolidates all data models extracted during Phase 2 of the GenEye reverse-engineering project. The schema is designed for **multi-tenancy**, **auditability**, and **enterprise-grade governance**.

---

## 1. Core & Identity Layer

These tables manage the foundational platform structure, organizations, and access control.

```python
class Organization(SQLModel, table=True):
    __tablename__ = "organizations"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    subdomain: str = Field(unique=True, index=True)
    branding_config: dict = Field(default={}, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    email: str = Field(unique=True, index=True)
    full_name: str
    role_id: uuid.UUID = Field(foreign_key="roles.id")
    is_active: bool = True

class Role(SQLModel, table=True):
    __tablename__ = "roles"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str # Admin, CAIO, BU Lead, Developer
    permissions: List[str] = Field(default=[], sa_column=Column(JSON))

class PlatformModule(SQLModel, table=True):
    __tablename__ = "platform_modules"
    id: str = Field(primary_key=True) # maturity, portfolio, agentcore, etc.
    label: str
    is_enabled: bool = True
```

---

## 2. Portfolio, Strategy & Value

Management of AI use cases, financial ROI tracking, and strategic milestones.

```python
class UseCase(SQLModel, table=True):
    __tablename__ = "use_cases"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    name: str
    business_unit: str
    status: str = Field(default="Intake") # Intake, Pilot, Production
    estimated_roi: Optional[str] = None
    priority_score: int = 0

class UseCaseFinancialSnapshot(SQLModel, table=True):
    __tablename__ = "use_case_financial_snapshots"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    use_case_id: uuid.UUID = Field(foreign_key="use_cases.id", index=True)
    quarter: str # Q1 2025
    realized_value_k: float
    projected_value_k: float

class StrategicObjective(SQLModel, table=True):
    __tablename__ = "strategic_objectives"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    objective: str
    status: str # On Track, At Risk
```

---

## 3. Governance, Risk & ATO

Enterprise guardrails, risk scoring, and Authority-to-Operate (ATO) diagnostics.

```python
class ModelInventory(SQLModel, table=True):
    __tablename__ = "model_inventory"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    use_case_id: uuid.UUID = Field(foreign_key="use_cases.id")
    model_name: str
    risk_level: str # P1, P2, P3
    compliance_status: str # Compliant, Needs Review

class GovernanceAuditLog(SQLModel, table=True):
    __tablename__ = "governance_audit_logs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id")
    event_type: str
    details: str
    performed_by: uuid.UUID = Field(foreign_key="users.id")

class AtoDiagnostic(SQLModel, table=True):
    __tablename__ = "ato_diagnostics"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    company_name: str
    avg_score: float
    prioritization: str
    scores: dict = Field(default={}, sa_column=Column(JSON))
```

---

## 4. Operational Intelligence (Command Center)

Real-time monitoring, incident management, and system health.

```python
class Incident(SQLModel, table=True):
    __tablename__ = "incidents"
    id: str = Field(primary_key=True) # INC-4821
    organization_id: uuid.UUID = Field(foreign_key="organizations.id")
    title: str
    severity: str # P1, P2, P3
    status: str # Investigating, Resolved
    team: str
    created_at: datetime

class SystemHealthMetric(SQLModel, table=True):
    __tablename__ = "system_health_metrics"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    system_name: str
    metric_type: str # Latency, CPU, ErrorRate
    value: float
    timestamp: datetime
```

---

## 5. AgentCore & Engineering Canvas

Managing AI agents, digital workers, and the node-based architecture canvas.

```python
class Agent(SQLModel, table=True):
    __tablename__ = "agents"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    type: str # Autonomous, Human-in-the-loop
    status: str
    api_endpoint: Optional[str] = None

class EngineeringSystem(SQLModel, table=True):
    __tablename__ = "engineering_systems"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    # Canvas Graph stored as JSON
    nodes: List[dict] = Field(default=[], sa_column=Column(JSON))
    edges: List[dict] = Field(default=[], sa_column=Column(JSON))

class AdlcPipelineRun(SQLModel, table=True):
    __tablename__ = "adlc_pipeline_runs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    system_id: uuid.UUID = Field(foreign_key="engineering_systems.id")
    current_stage: str # design, build, test
    progress_pct: int
```

---

## 6. Physical AI & Manufacturing

Industrial metrics for Fab sites and Silicon IP management.

```python
class FabSite(SQLModel, table=True):
    __tablename__ = "fab_sites"
    id: str = Field(primary_key=True) # dresden, malta, singapore
    location_flag: str
    status: str

class FabMetricDaily(SQLModel, table=True):
    __tablename__ = "fab_metrics_daily"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    site_id: str = Field(foreign_key="fab_sites.id")
    metric_type: str # yield, uptime
    value: float
    timestamp: datetime

class SiliconIpBlock(SQLModel, table=True):
    __tablename__ = "silicon_ip_blocks"
    id: str = Field(primary_key=True) # b1-b7
    title: str
    metrics: List[dict] = Field(default=[], sa_column=Column(JSON))
```

---

## 7. GenEye Chat

Multi-modal chat sessions and message history.

```python
class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    title: str
    mode: str # internal, web

class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    session_id: uuid.UUID = Field(foreign_key="chat_sessions.id")
    role: str # user, assistant
    content: str
    created_at: datetime

class ChatAttachment(SQLModel, table=True):
    __tablename__ = "chat_attachments"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    message_id: uuid.UUID = Field(foreign_key="chat_messages.id")
    file_name: str
    storage_path: str
```

---

## 8. Summary of Relationships

1. **Organization** is the root of all multi-tenant data. 
2. **UseCase** is the central link between Strategy (Portfolio), Compliance (Governance), and Deployment (ML Studio / Engineering).
3. **User** actions are audited via **GovernanceAuditLog**.
4. **ChatSession** and **EngineeringSystem** provide the workspace environments for interactively building and querying the platform.

**Total Tables in Blueprint: 69**
