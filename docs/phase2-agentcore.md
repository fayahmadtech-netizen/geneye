# GenEye — Phase 2: Route Specification — `/agentcore`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `aAe` (page) · `eAe` (Custom Agent Builder) · `Kke` (ADLC Automated Builder) · `tAe` (Integration) · `rAe` (Marketplace) · `Bke` (Digital Workforce)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/agentcore`
**Page Title:** "AI AgentCore Platform"
**Subtitle:** "Human–Machine Orchestration Platform"

This is the **AI agent management platform** — by far the richest data-model route in the application. It manages the full lifecycle of AI agents: creation (manual `eAe` or ADLC automated `Kke`), tool/integration wiring, deployment infrastructure, marketplace discovery, and a "Digital Workforce" layer of named AI personas with workflow graphs and audit trails.

### Tabs (5)

| Tab ID | Label | Component | Description |
|---|---|---|---|
| `control` | Custom Agent Builder | `eAe` | Full agent registry + manual create |
| `adlc` | Automated Agent Builder | `Kke` | Multi-step ADLC wizard (natural language → agent) |
| `tools` | Integration | `tAe` | Tool/API connection registry per agent |
| `marketplace` | Marketplace | `rAe` | Pre-built agent templates + deployment layer |
| `workers` | Digital Workforce Management | `Bke` | Named AI personas with workflows + audit logs |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `pg[]` — Registered Agents (6 agents)

```json
[
  {
    "id": "a1", "name": "Claims Adjudication Agent",
    "owner": "Sarah Chen", "bu": "Insurance Ops",
    "autonomy": "Autonomous", "llm": "GPT-4o", "status": "Active",
    "lastActivity": "2025-02-18 09:14",
    "description": "End-to-end autonomous processing of insurance claims — extraction, validation, decision, and payment initiation.",
    "objective": "Reduce claims cycle time from 12 days to under 2 days across all standard claim types.",
    "guardrails": [
      { "label": "Human review required for claims > $50K",        "checked": true },
      { "label": "Bias audit on demographic fields",                "checked": true },
      { "label": "Explainability log per decision",                "checked": true },
      { "label": "Monthly red team exercise",                       "checked": false }
    ],
    "connectedTools": ["Salesforce CRM","DocuSign API","Core Banking API","SAP ERP"],
    "dataSources":    ["Claims DB","Policy Repository","Fraud Scoring Engine"],
    "approvalStatus": "Approved"
  },
  {
    "id": "a2", "name": "Fraud Pattern Sentinel",
    "owner": "Lisa Monroe", "bu": "Finance & Risk",
    "autonomy": "Autonomous", "llm": "Claude 3.5 Sonnet", "status": "Active",
    "lastActivity": "2025-02-18 09:02",
    "description": "Real-time fraud detection agent monitoring all transaction channels with ensemble scoring.",
    "objective": "Detect and flag fraudulent transactions within 200ms at < 0.1% false positive rate.",
    "guardrails": [
      { "label": "Human escalation for high-value disputes", "checked": true },
      { "label": "Model drift monitoring — weekly",          "checked": true },
      { "label": "PII data masking in logs",                 "checked": true },
      { "label": "Quarterly bias assessment",                "checked": true }
    ],
    "connectedTools": ["Transaction Processing API","AML Platform","SWIFT Gateway"],
    "dataSources":    ["Transaction DB","Customer Risk Profiles","External Threat Feeds"],
    "approvalStatus": "Approved"
  },
  {
    "id": "a3", "name": "Dynamic Pricing Optimizer",
    "owner": "Marcus Reid", "bu": "Revenue Management",
    "autonomy": "Decision Support", "llm": "GPT-4o", "status": "Active",
    "lastActivity": "2025-02-18 08:50",
    "description": "AI-assisted pricing recommendations based on market signals, demand forecasts, and competitive intelligence.",
    "objective": "Improve margin by 8% through real-time price optimization across product lines.",
    "guardrails": [
      { "label": "Human approval for price changes > 15%",     "checked": true },
      { "label": "Regulatory compliance check on pricing rules","checked": true },
      { "label": "A/B test framework for all changes",          "checked": false },
      { "label": "Weekly performance review",                   "checked": true }
    ],
    "connectedTools": ["Market Data API","ERP Pricing Module","Competitor Intelligence Feed"],
    "dataSources":    ["Market Data API","ERP","Historical Pricing DB"],
    "approvalStatus": "Approved"
  },
  {
    "id": "a4", "name": "Contract Intelligence Agent",
    "owner": "Tom Walsh", "bu": "Legal & Procurement",
    "autonomy": "Decision Support", "llm": "GPT-4 Fine-tune", "status": "Active",
    "lastActivity": "2025-02-17 16:30",
    "description": "NLP-powered contract review assistant — clause extraction, risk flagging, and redline suggestions.",
    "objective": "Reduce legal review time by 60% and improve risk clause detection coverage to 95%.",
    "guardrails": [
      { "label": "Attorney sign-off required before execution",         "checked": true },
      { "label": "Jurisdiction-specific rule compliance",               "checked": false },
      { "label": "Data retention policy enforcement",                   "checked": true },
      { "label": "Bias audit on vendor selection recommendations",      "checked": false }
    ],
    "connectedTools": ["SharePoint Document Store","DocuSign API","SAP Ariba"],
    "dataSources":    ["Contract Repository","Legal Policy DB","Vendor Master"],
    "approvalStatus": "Under Review"
  },
  {
    "id": "a5", "name": "Customer Churn Predictor",
    "owner": "Priya Nair", "bu": "CX & Retention",
    "autonomy": "Assistive", "llm": "Internal XGBoost Model", "status": "Active",
    "lastActivity": "2025-02-18 07:45",
    "description": "Propensity model surfacing at-risk customers to CX agents with recommended retention actions.",
    "objective": "Preempt churn for top 20% highest-value customers — target 12% churn reduction.",
    "guardrails": [
      { "label": "Agent-in-the-loop for all retention offers", "checked": true },
      { "label": "Customer consent validation",                 "checked": true },
      { "label": "Monthly model retraining",                   "checked": true },
      { "label": "Explainability report to CX manager",        "checked": false }
    ],
    "connectedTools": ["Salesforce CRM","Email Automation Platform","CDP"],
    "dataSources":    ["CRM","Web Analytics","Call Center Logs"],
    "approvalStatus": "Approved"
  },
  {
    "id": "a6", "name": "Demand Forecasting Agent",
    "owner": "James Park", "bu": "Supply Chain",
    "autonomy": "Assistive", "llm": "Prophet + LSTM Ensemble", "status": "Active",
    "lastActivity": "2025-02-17 14:00",
    "description": "Demand signal aggregation and forecasting agent for supply chain planning.",
    "objective": "Achieve 90%+ MAPE accuracy on 30-day demand forecasts.",
    "guardrails": [],
    "connectedTools": [],
    "dataSources": [],
    "approvalStatus": "Approved"
  }
]
```

**Autonomy enum:** `"Autonomous"` | `"Decision Support"` | `"Assistive"`
**Status enum:** `"Active"` | `"Inactive"` | `"Paused"` | `"Draft"`
**ApprovalStatus enum:** `"Approved"` | `"Under Review"` | `"Submitted"` | `"Not Started"`

---

### 1.2 `rf[]` — Tool/Integration Registry (8 tools)

```json
[
  { "id": "t1", "name": "Salesforce CRM",            "type": "SaaS",            "authStatus": "Connected", "connectedAgents": 3, "health": "Healthy", "endpoint": "https://api.salesforce.com/v2",       "authMethod": "OAuth 2.0",         "dataScope": "Contacts, Opportunities, Cases, Accounts",    "lastSync": "2025-02-18 09:10" },
  { "id": "t2", "name": "SAP ERP",                   "type": "Internal System", "authStatus": "Connected", "connectedAgents": 2, "health": "Healthy", "endpoint": "https://sap-internal.corp/api",        "authMethod": "Service Account",   "dataScope": "Finance, Procurement, HR modules",            "lastSync": "2025-02-18 08:00" },
  { "id": "t3", "name": "Transaction Processing API","type": "API",             "authStatus": "Connected", "connectedAgents": 1, "health": "Healthy", "endpoint": "https://txn-gateway.corp/v3",          "authMethod": "API Key + mTLS",    "dataScope": "Real-time transaction stream, card data (masked)", "lastSync": "2025-02-18 09:14" },
  { "id": "t4", "name": "DocuSign API",              "type": "API",             "authStatus": "Connected", "connectedAgents": 2, "health": "Healthy", "endpoint": "https://api.docusign.com/v2.1",        "authMethod": "OAuth 2.0",         "dataScope": "Document creation, signature workflow, status","lastSync": "2025-02-18 07:30" },
  { "id": "t5", "name": "SharePoint Document Store", "type": "SaaS",            "authStatus": "Warning",   "connectedAgents": 1, "health": "Warning", "endpoint": "https://org.sharepoint.com/api",       "authMethod": "Service Account",   "dataScope": "Legal documents, contract templates",          "lastSync": "2025-02-17 14:00" },
  { "id": "t6", "name": "AML Platform",              "type": "Internal System", "authStatus": "Connected", "connectedAgents": 1, "health": "Healthy", "endpoint": "https://aml.internal.corp/api",        "authMethod": "Service Account",   "dataScope": "Watchlists, transaction risk scores",          "lastSync": "2025-02-18 09:00" },
  { "id": "t7", "name": "Market Data API",           "type": "API",             "authStatus": "Connected", "connectedAgents": 1, "health": "Healthy", "endpoint": "https://marketdata.external.com/v4",   "authMethod": "API Key",           "dataScope": "Real-time pricing, competitor data",           "lastSync": "2025-02-18 09:12" },
  { "id": "t8", "name": "Email Automation Platform", "type": "SaaS",            "authStatus": "Error",     "connectedAgents": 1, "health": "Error",   "endpoint": "https://api.emailplatform.com/v1",     "authMethod": "API Key",           "dataScope": "Customer communications, campaign triggers",   "lastSync": "2025-02-16 11:00" }
]
```

---

### 1.3 `nf[]` — Deployment Layer (6 running agents)

```json
[
  { "agent": "Claims Adjudication Agent",  "env": "Prod",    "compute": "AWS ECS Fargate",          "lastDeploy": "2025-02-10", "perfScore": 97, "status": "Running" },
  { "agent": "Fraud Pattern Sentinel",     "env": "Prod",    "compute": "AWS Lambda + SageMaker",   "lastDeploy": "2025-02-14", "perfScore": 99, "status": "Running" },
  { "agent": "Dynamic Pricing Optimizer",  "env": "Prod",    "compute": "GCP Cloud Run",            "lastDeploy": "2025-02-08", "perfScore": 94, "status": "Running" },
  { "agent": "Contract Intelligence Agent","env": "Staging", "compute": "Azure Container Apps",     "lastDeploy": "2025-02-17", "perfScore": 82, "status": "Running" },
  { "agent": "Customer Churn Predictor",   "env": "Prod",    "compute": "AWS SageMaker",            "lastDeploy": "2025-01-28", "perfScore": 91, "status": "Running" },
  { "agent": "Demand Forecasting Agent",   "env": "Dev",     "compute": "On-Prem K8s",              "lastDeploy": "2025-01-15", "perfScore": 74, "status": "Paused" }
]
```

---

### 1.4 `qke[]` — Marketplace Agent Templates (8 items)

```json
[
  { "id": "m1", "name": "AP Invoice Automation Agent",  "type": "Internal",    "category": "Finance", "autonomy": "Autonomous",      "description": "Automates accounts payable invoice matching and payment approval workflows.", "installed": false },
  { "id": "m2", "name": "HR Onboarding Orchestrator",   "type": "Internal",    "category": "HR",      "autonomy": "Assistive",       "description": "Coordinates cross-system new hire onboarding — IT, HR, Facilities, and Security provisioning.", "installed": true },
  { "id": "m3", "name": "Regulatory Change Monitor",    "type": "Internal",    "category": "Legal",   "autonomy": "Assistive",       "description": "Scans global regulatory publications and flags policy changes requiring compliance action.", "installed": false },
  { "id": "m4", "name": "Supply Chain Risk Agent",      "type": "Third-Party", "category": "Ops",     "autonomy": "Decision Support","description": "Monitors supplier risk signals, logistics disruptions, and geopolitical risk indicators.", "installed": false },
  { "id": "m5", "name": "Board Report Generator",       "type": "Internal",    "category": "Finance", "autonomy": "Assistive",       "description": "Compiles quarterly board-ready AI performance and governance reports from Control Tower data.", "installed": true },
  { "id": "m6", "name": "IT Security Incident Triage",  "type": "Third-Party", "category": "Ops",     "autonomy": "Decision Support","description": "AI-assisted SOC triage — classifies, prioritises, and recommends remediation for security alerts.", "installed": false },
  { "id": "m7", "name": "Employee Sentiment Analyser",  "type": "Internal",    "category": "HR",      "autonomy": "Assistive",       "description": "Analyses engagement survey data and Slack signals to surface burnout risk and retention flags.", "installed": false },
  { "id": "m8", "name": "Legal Research Assistant",     "type": "Third-Party", "category": "Legal",   "autonomy": "Decision Support","description": "Case law research, statute lookup, and memo drafting assistant for legal teams.", "installed": false }
]
```

---

### 1.5 `Dke[]` — Digital Workers (3 shown — sample)

Named AI personas with full workflow DAG and audit trail:

```json
[
  {
    "id": "dw1", "firstName": "Ava", "lastName": "Reynolds",
    "persona": "Risk Sentinel", "title": "Digital Risk Analyst", "org": "Finance",
    "status": "Active",
    "description": "Continuously monitors financial risk exposure across portfolios, flags anomalies, and generates risk mitigation recommendations with full explainability.",
    "skills": ["Risk Scoring","Anomaly Detection","Regulatory Compliance","Portfolio Analysis"],
    "dataSources": ["Financial Ledger","Market Data API","Risk Taxonomy","Regulatory Database"],
    "workflows": [
      { "id": "n1", "type": "trigger",      "label": "New Transaction Batch" },
      { "id": "n2", "type": "action",       "label": "Run Risk Scoring Model" },
      { "id": "n3", "type": "condition",    "label": "Risk Score > 75?" },
      { "id": "n4", "type": "human_review", "label": "Escalate to Risk Officer" },
      { "id": "n5", "type": "output",       "label": "Generate Risk Report" }
    ],
    "auditLog": [
      { "timestamp": "2025-02-18 09:30", "action": "Risk Alert Generated", "detail": "Portfolio XR-7 flagged — VaR exceeded 2σ threshold", "confidence": 94 },
      { "timestamp": "2025-02-18 08:15", "action": "Batch Processed",      "detail": "1,847 transactions scanned — 3 anomalies flagged",        "confidence": 97 }
    ],
    "createdAt": "2024-11-15", "lastActive": "2025-02-18 09:30",
    "tasksCompleted": 2847, "avgConfidence": 94
  },
  {
    "id": "dw2", "firstName": "Marcus", "lastName": "Chen",
    "persona": "Capital Allocator", "title": "Digital Investment Strategist", "org": "Finance",
    "status": "Active",
    "description": "Optimises capital allocation across AI initiatives, evaluates ROI projections, and provides data-driven budget recommendations aligned with strategic priorities.",
    "skills": ["Financial Modelling","ROI Analysis","Budget Optimisation","Scenario Planning"],
    "dataSources": ["ERP","Financial Ledger","Historical Pricing DB","External Market Feeds"],
    "workflows": [
      { "id": "n1", "type": "trigger",      "label": "Quarterly Review Cycle" },
      { "id": "n2", "type": "action",       "label": "Aggregate BU Financials" },
      { "id": "n3", "type": "action",       "label": "Run ROI Projection Model" },
      { "id": "n4", "type": "condition",    "label": "Variance > 10%?" },
      { "id": "n5", "type": "human_review", "label": "CFO Review Gate" },
      { "id": "n6", "type": "output",       "label": "Capital Allocation Report" }
    ],
    "auditLog": [
      { "timestamp": "2025-02-18 07:00", "action": "Report Generated", "detail": "Q1 Capital Allocation draft — $14.2M across 8 initiatives", "confidence": 91 }
    ],
    "createdAt": "2024-12-01", "lastActive": "2025-02-18 07:00",
    "tasksCompleted": 1203, "avgConfidence": 91
  },
  {
    "id": "dw3", "firstName": "Sofia", "lastName": "Patel",
    "persona": "Procurement Navigator", "title": "Digital Procurement Manager", "org": "Procurement",
    "status": "Active",
    "description": "Streamlines procurement workflows — vendor evaluation, contract comparison, spend analytics, and compliance verification with automated approval routing.",
    "skills": ["Vendor Evaluation","Spend Analytics","Contract Analysis","Supplier Risk Assessment"],
    "dataSources": ["Vendor Master","Contract Repository","ERP","External Threat Feeds"],
    "workflows": [
      { "id": "n1", "type": "trigger",      "label": "Purchase Request Filed" },
      { "id": "n2", "type": "action",       "label": "Vendor Scoring & Matching" },
      { "id": "n3", "type": "condition",    "label": "Amount > $100K?" },
      { "id": "n4", "type": "human_review", "label": "Procurement Lead Approval" },
      { "id": "n5", "type": "action",       "label": "Generate PO & Route" },
      { "id": "n6", "type": "output",       "label": "Procurement Summary" }
    ],
    "auditLog": [],
    "createdAt": "2025-01-10", "lastActive": "2025-02-18 10:00",
    "tasksCompleted": 892, "avgConfidence": 94
  }
]
```

**Workflow node types:** `"trigger"` | `"action"` | `"condition"` | `"human_review"` | `"output"`

---

### 1.6 `Gke[]` — LLM Model Catalogue (7 providers × N models)

```json
[
  { "group": "OpenAI",              "models": ["GPT-4o","GPT-4o Mini","GPT-4 Turbo","GPT-4","GPT-3.5 Turbo","o1-preview","o1-mini"] },
  { "group": "Anthropic",           "models": ["Claude 3.5 Sonnet","Claude 3.5 Haiku","Claude 3 Opus","Claude 3 Sonnet","Claude 3 Haiku"] },
  { "group": "Google",              "models": ["Gemini 1.5 Pro","Gemini 1.5 Flash","Gemini 2.0 Flash","Gemini Ultra"] },
  { "group": "Meta (Open Source)",  "models": ["Llama 3.1 405B","Llama 3.1 70B","Llama 3.1 8B","Llama 3 70B"] },
  { "group": "Mistral",             "models": ["Mistral Large","Mistral Medium","Mistral Small","Mixtral 8x22B"] },
  { "group": "Cohere",              "models": ["Command R+","Command R","Command"] },
  { "group": "Internal / Fine-tuned","models": ["Internal XGBoost Model","GPT-4 Fine-tune","Prophet + LSTM Ensemble","Custom Domain Model"] }
]
```

---

### 1.7 Reference Arrays (dropdowns for agent builder)

```python
# Yke — Tool options for agent builder
TOOL_OPTIONS = [
    "Salesforce CRM","SAP ERP","DocuSign API","SharePoint Document Store",
    "Transaction Processing API","AML Platform","Market Data API",
    "Email Automation Platform","Slack API","JIRA API","ServiceNow API",
    "AWS S3","Azure Blob Storage","Google BigQuery","Snowflake DW",
    "REST API Connector","GraphQL Gateway","SWIFT Gateway"
]

# Xke — Data source options
DATA_SOURCE_OPTIONS = [
    "Claims DB","Policy Repository","Fraud Scoring Engine","Customer Risk Profiles",
    "Transaction DB","Contract Repository","Legal Policy DB","Vendor Master",
    "CRM","Web Analytics","Call Center Logs","External Market Feeds",
    "ERP","POS Systems","HR Data Warehouse","Financial Ledger",
    "Document Repository","External Threat Feeds","Regulatory Database"
]

# Qke — Business Unit options
BUSINESS_UNIT_OPTIONS = [
    "Insurance Ops","Finance & Risk","Revenue Management","Legal & Procurement",
    "CX & Retention","Supply Chain","HR & People","IT & Security",
    "Marketing","Operations","Executive / Strategy"
]
```

---

### 1.8 `Kke` — ADLC Wizard State Machine (5 stages)

The Automated Agent Builder is a multi-step wizard driven entirely by local state, transitioning through these stages:

| Stage | ID | Entry Condition |
|---|---|---|
| 1. Create (prompt) | `"create"` | Initial |
| 2. Productionize | `"productionize"` | After NL prompt submitted + ADLC pipeline finishes |
| 3. Pipeline | `"pipeline"` | After auto-builder runs |
| 4. Live | `"live"` | After productionize completes |

> **Key insight:** `Kke` animates through steps using `setInterval` + `setTimeout`. In the rebuild, this becomes a real backend pipeline via FastAPI background tasks with SSE progress updates.

---

## 2. Data Models (SQLModel / PostgreSQL)

```python
import uuid
from datetime import datetime, date
from typing import Optional, List, Dict
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

# ── Agent ─────────────────────────────────────────────────────
class Agent(SQLModel, table=True):
    __tablename__ = "agents"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    created_by: uuid.UUID = Field(foreign_key="users.id")

    name: str
    description: Optional[str] = None
    objective: Optional[str] = None
    business_unit: str
    owner: str                              # display name

    autonomy: str                           # "Autonomous"|"Decision Support"|"Assistive"
    llm: str                                # model name e.g. "GPT-4o"
    status: str = Field(default="Draft")    # "Active"|"Inactive"|"Paused"|"Draft"
    approval_status: str = Field(default="Not Started")  # see enum above

    # JSONB fields
    guardrails: List[dict] = Field(default=[], sa_column=Column(JSON))
    connected_tools: List[str] = Field(default=[], sa_column=Column(JSON))
    data_sources: List[str] = Field(default=[], sa_column=Column(JSON))
    skills: List[str] = Field(default=[], sa_column=Column(JSON))

    # Perf
    tasks_completed: int = Field(default=0)
    avg_confidence: Optional[float] = None

    last_activity: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Agent Deployment ──────────────────────────────────────────
class AgentDeployment(SQLModel, table=True):
    __tablename__ = "agent_deployments"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    agent_id: uuid.UUID = Field(foreign_key="agents.id", index=True)

    env: str                                # "Prod"|"Staging"|"Dev"
    compute: str                            # "AWS ECS Fargate"|"GCP Cloud Run"|etc.
    perf_score: Optional[int] = None        # 0–100
    status: str                             # "Running"|"Paused"|"Failed"
    last_deploy: Optional[date] = None

    deployed_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Agent Tool Connection ─────────────────────────────────────
class AgentTool(SQLModel, table=True):
    __tablename__ = "agent_tools"

    id: str = Field(primary_key=True)       # "t1"
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)

    name: str
    tool_type: str                          # "API"|"SaaS"|"Internal System"|"Database"
    auth_status: str                        # "Connected"|"Warning"|"Error"|"Disconnected"
    connected_agents_count: int = Field(default=0)
    health: str                             # "Healthy"|"Warning"|"Error"
    endpoint: Optional[str] = None
    auth_method: Optional[str] = None
    data_scope: Optional[str] = None
    last_sync: Optional[datetime] = None

    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ── Digital Worker (AI Persona) ───────────────────────────────
class DigitalWorker(SQLModel, table=True):
    __tablename__ = "digital_workers"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    agent_id: Optional[uuid.UUID] = Field(default=None, foreign_key="agents.id")

    first_name: str
    last_name: str
    persona: str                            # "Risk Sentinel"
    title: str                              # "Digital Risk Analyst"
    org_unit: str
    status: str = Field(default="Active")

    description: str
    skills: List[str] = Field(default=[], sa_column=Column(JSON))
    data_sources: List[str] = Field(default=[], sa_column=Column(JSON))
    workflow_nodes: List[dict] = Field(default=[], sa_column=Column(JSON))

    tasks_completed: int = Field(default=0)
    avg_confidence: Optional[float] = None
    last_active: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Digital Worker Audit Log ──────────────────────────────────
class DigitalWorkerAuditEntry(SQLModel, table=True):
    __tablename__ = "digital_worker_audit_entries"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    worker_id: uuid.UUID = Field(foreign_key="digital_workers.id", index=True)

    timestamp: datetime
    action: str
    detail: str
    confidence: Optional[float] = None
    reviewed_by: Optional[str] = None      # human reviewer name

    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Marketplace Agent Template ───────────────────────────────
class MarketplaceAgent(SQLModel, table=True):
    __tablename__ = "marketplace_agents"

    id: str = Field(primary_key=True)       # "m1"
    name: str
    template_type: str                      # "Internal"|"Third-Party"
    category: str                           # "Finance"|"HR"|"Legal"|"Ops"
    autonomy: str
    description: str
    is_installed: bool = Field(default=False)


# ── LLM Model Catalogue (seed) ────────────────────────────────
class LlmModel(SQLModel, table=True):
    __tablename__ = "llm_models"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    provider_group: str                     # "OpenAI"|"Anthropic"|etc.
    model_name: str
    display_order: int = Field(default=0)
```

### Entity Relationship Diagram

```
organizations
    └──< agents                       (org_id)
              ├──── agent_deployments  (agent_id — 1:N, one per env)
              └──── digital_workers   (agent_id, optional)
                         └──< digital_worker_audit_entries

agent_tools                           (org_id — tool registry)

marketplace_agents                    (seed — no FK)
llm_models                            (seed — no FK)
```

---

## 3. API Contracts (FastAPI)

### 3.1 Pydantic Models

```python
from pydantic import BaseModel
from typing import List, Optional, Dict
import uuid
from datetime import datetime, date

class GuardrailItem(BaseModel):
    label: str
    checked: bool

class AgentRead(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    objective: Optional[str]
    business_unit: str
    owner: str
    autonomy: str
    llm: str
    status: str
    approval_status: str
    guardrails: List[GuardrailItem]
    connected_tools: List[str]
    data_sources: List[str]
    tasks_completed: int
    avg_confidence: Optional[float]
    last_activity: Optional[datetime]

class AgentCreate(BaseModel):
    name: str
    description: Optional[str]
    objective: Optional[str]
    business_unit: str
    autonomy: str
    llm: str
    guardrails: List[GuardrailItem] = []
    connected_tools: List[str] = []
    data_sources: List[str] = []

class ControlPlaneStats(BaseModel):
    total_agents: int
    autonomous_agents: int
    active_workflows: int
    agent_health_pct: int

class WorkflowNode(BaseModel):
    id: str
    type: str
    label: str

class DigitalWorkerRead(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    persona: str
    title: str
    org_unit: str
    status: str
    description: str
    skills: List[str]
    data_sources: List[str]
    workflow_nodes: List[WorkflowNode]
    tasks_completed: int
    avg_confidence: Optional[float]
    last_active: Optional[datetime]

class DigitalWorkerAuditEntry(BaseModel):
    timestamp: datetime
    action: str
    detail: str
    confidence: Optional[float]
    reviewed_by: Optional[str]

class AgentToolRead(BaseModel):
    id: str
    name: str
    tool_type: str
    auth_status: str
    connected_agents_count: int
    health: str
    endpoint: Optional[str]
    auth_method: Optional[str]
    data_scope: Optional[str]
    last_sync: Optional[datetime]

class DeploymentRead(BaseModel):
    agent_name: str
    env: str
    compute: str
    perf_score: Optional[int]
    status: str
    last_deploy: Optional[date]

class AdlcCreateRequest(BaseModel):
    prompt: str                            # natural language agent description
    title: Optional[str]

class AdlcStatusResponse(BaseModel):
    job_id: str
    stage: str                             # "create"|"pipeline"|"productionize"|"live"
    progress: int                          # 0–100
    generated_name: Optional[str]
    generated_config: Optional[dict]
```

### 3.2 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/agentcore/agents` | All agents (filterable by status/BU/autonomy) |
| `POST` | `/api/agentcore/agents` | Create new agent (manual builder) |
| `GET` | `/api/agentcore/agents/{id}` | Full agent detail |
| `PATCH` | `/api/agentcore/agents/{id}` | Update agent config/guardrails |
| `DELETE` | `/api/agentcore/agents/{id}` | Deactivate agent |
| `GET` | `/api/agentcore/agents/{id}/deployment` | Agent deployment status |
| `POST` | `/api/agentcore/agents/{id}/deploy` | Trigger deployment to env |
| `GET` | `/api/agentcore/tools` | Tool integration registry |
| `POST` | `/api/agentcore/tools` | Register new tool |
| `PATCH` | `/api/agentcore/tools/{id}/sync` | Trigger health check / re-sync |
| `GET` | `/api/agentcore/workers` | Digital workers list |
| `GET` | `/api/agentcore/workers/{id}` | Full digital worker detail + audit log |
| `POST` | `/api/agentcore/workers` | Create digital worker |
| `GET` | `/api/agentcore/marketplace` | Marketplace templates (filterable) |
| `POST` | `/api/agentcore/marketplace/{id}/install` | Install marketplace template |
| `GET` | `/api/agentcore/llm-models` | LLM model catalogue |
| `POST` | `/api/agentcore/adlc/create` | Start ADLC auto-builder job |
| `GET` | `/api/agentcore/adlc/{job_id}/status` | Poll ADLC pipeline progress |
| `GET` | `/api/agentcore/deployments` | All agent deployments (marketplace tab infra view) |
| `GET` | `/api/agentcore/stats` | Control plane KPI summary |

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── agentcore/
    └── page.tsx                                        ← Server: initial data
        └── <AgentCorePage>                             ← Client (activeTab state)
              ├── <TabBar tabs={nAe} />
              │
              ├── <CustomAgentBuilderTab>               ← Client (selectedAgent, createModal)
              │     ├── <ControlPlaneKpis />            ← 4 stat cards
              │     ├── <AgentTable />                  ← pg[] with autonomy/LLM/status cols
              │     │     └── <AgentDetailPanel />      ← right drawer: guardrails, tools, DS
              │     └── <CreateAgentModal>              ← form: name/BU/autonomy/LLM/tools/DS
              │           └── <GuardrailBuilder />
              │
              ├── <AdlcBuilderTab>                      ← Client (stage state machine)
              │     ├── Stage "create":  <PromptInput /> ← NL textarea + submit
              │     ├── Stage "pipeline": <PipelineProgress /> ← animated step tracker
              │     ├── Stage "productionize": <GeneratedConfig /> ← review + edit
              │     └── Stage "live": <LiveMonitor />   ← real-time ticker
              │
              ├── <IntegrationTab>                      ← Client (selectedTool)
              │     ├── <IntegrationKpis />             ← Total/Connected/Healthy/Alerts
              │     ├── <ToolTable />                   ← rf[] with health badge
              │     └── <ToolDetailPanel />             ← endpoint, auth, dataScope, agents
              │
              ├── <MarketplaceTab>                      ← Client (filters + installedSet)
              │     ├── <DeploymentOverview />          ← nf[] infra summary
              │     ├── <MarketplaceFilters />          ← category/autonomy/type dropdowns
              │     └── <AgentTemplateGrid />           ← qke[] cards + Install button
              │
              └── <DigitalWorkforceTab>                 ← Client (selectedWorker, filters)
                    ├── <WorkforceKpis />               ← active/total/tasks/avg-confidence
                    ├── <WorkerTable />                 ← Dke[] with org/persona/status
                    └── <WorkerDetailPanel />           ← workflow DAG + audit timeline
```

---

## 5. State & Interactivity

| State | Type | Scope | Purpose |
|---|---|---|---|
| `activeTab` | `string` | `<AgentCorePage>` | Active tab |
| **Custom Agent Builder** | | | |
| `selectedAgentId` | `string\|null` | `<CustomAgentBuilderTab>` | Detail panel |
| `createModalOpen` | `boolean` | `<CustomAgentBuilderTab>` | Show create form |
| `agentList` | `Agent[]` | `<CustomAgentBuilderTab>` | Local React state (new agents prepended) |
| **ADLC Builder** | | | |
| `adlcStage` | `string` | `<AdlcBuilderTab>` | `"create"\|"pipeline"\|"productionize"\|"live"` |
| `adlcJobId` | `string\|null` | `<AdlcBuilderTab>` | Backend job ID for polling |
| `adlcProgress` | `number` | `<AdlcBuilderTab>` | 0–100 progress |
| **Marketplace** | | | |
| `categoryFilter` | `string` | `<MarketplaceTab>` | `"All"` or category |
| `autonomyFilter` | `string` | `<MarketplaceTab>` | `"All"` or autonomy |
| `typeFilter` | `string` | `<MarketplaceTab>` | `"All"` or type |
| `installedSet` | `Set<string>` | `<MarketplaceTab>` | IDs of installed templates |
| **Digital Workforce** | | | |
| `selectedWorkerId` | `string\|null` | `<DigitalWorkforceTab>` | Worker detail panel |
| `orgFilter` | `string` | `<DigitalWorkforceTab>` | `"All"` or org unit |
| `workerSearch` | `string` | `<DigitalWorkforceTab>` | Name/persona search |

---

## 6. Seed Data (DB Migration)

```python
LLM_MODELS_SEED = [
    # OpenAI
    {"provider_group": "OpenAI", "model_name": "GPT-4o",            "display_order": 0},
    {"provider_group": "OpenAI", "model_name": "GPT-4o Mini",       "display_order": 1},
    {"provider_group": "OpenAI", "model_name": "GPT-4 Turbo",       "display_order": 2},
    {"provider_group": "OpenAI", "model_name": "GPT-3.5 Turbo",     "display_order": 4},
    {"provider_group": "OpenAI", "model_name": "o1-preview",         "display_order": 5},
    # Anthropic
    {"provider_group": "Anthropic", "model_name": "Claude 3.5 Sonnet","display_order": 0},
    {"provider_group": "Anthropic", "model_name": "Claude 3.5 Haiku", "display_order": 1},
    {"provider_group": "Anthropic", "model_name": "Claude 3 Opus",    "display_order": 2},
    # Google
    {"provider_group": "Google", "model_name": "Gemini 1.5 Pro",    "display_order": 0},
    {"provider_group": "Google", "model_name": "Gemini 2.0 Flash",  "display_order": 2},
    # ... etc.
]

MARKETPLACE_AGENTS_SEED = [
    {"id": "m1", "name": "AP Invoice Automation Agent",  "template_type": "Internal",    "category": "Finance", "autonomy": "Autonomous",      "description": "Automates accounts payable invoice matching and payment approval workflows.", "is_installed": False},
    {"id": "m2", "name": "HR Onboarding Orchestrator",   "template_type": "Internal",    "category": "HR",      "autonomy": "Assistive",       "description": "Coordinates cross-system new hire onboarding — IT, HR, Facilities, and Security provisioning.", "is_installed": True},
    {"id": "m5", "name": "Board Report Generator",       "template_type": "Internal",    "category": "Finance", "autonomy": "Assistive",       "description": "Compiles quarterly board-ready AI performance and governance reports.", "is_installed": True},
    # ... etc.
]
```

---

## 7. Key Design Decisions

1. **`agents.guardrails` and `agents.connected_tools` as JSONB arrays** — guardrails are a variable-length list of checkbox items. Tools are strings referencing `agent_tools` by name (not FK) to allow free-text additions in the builder.

2. **`digital_workers.workflow_nodes` as JSONB** — the DAG nodes are a structured but variable-length array per worker. Each node has `type`, `label`, and `id`. This maps cleanly to JSONB without the complexity of a `workflow_nodes` junction table.

3. **ADLC pipeline via FastAPI Background Tasks** — The `Kke` wizard's animated pipeline is simulated with `setInterval`. In the rebuild, `POST /api/agentcore/adlc/create` launches a `BackgroundTask` and returns a `job_id`. The frontend polls `GET /api/agentcore/adlc/{job_id}/status` every 2s.

4. **`digital_worker_audit_entries` is append-only** — each worker action emits a new row. This enables immutable audit trails for HITL accountability.

5. **`marketplace_agents` is a global seed table** — not org-scoped (same templates available to all orgs). The `is_installed` flag becomes a per-org join table in a multi-tenant future.

---

## 8. Updated Schema Total — 40 Tables

| New Tables (This Route) | Count |
|---|---|
| `agents` | 1 |
| `agent_deployments` | 1 |
| `agent_tools` | 1 |
| `digital_workers` | 1 |
| `digital_worker_audit_entries` | 1 |
| `marketplace_agents` | 1 |
| `llm_models` | 1 |

**Running Total: 32 (previous) + 7 (agentcore) = 39 tables**
