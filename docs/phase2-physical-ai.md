# GenEye — Phase 2: Route Specification — `/physical-ai`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `LTe` (page) · `RTe` (Platform Overview) · `DTe` (Business Value)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/physical-ai`
**Page Title:** "Physical AI Platform"
**Subtitle:** "Silicon IP, Fab Execution & Enterprise AI — Closed-Loop System"

This is the **Industrial AI and Semiconductor Operations hub**. It monitors the "Closed-Loop" system where Enterprise AI provides insights back to the physical layer (Fab execution, Silicon Design) which in turn powers the AI systems. It tracks global Fab performance, Silicon IP block health, and the business ROI of AI in physical manufacturing.

### Tabs (2)

| Tab ID | Label | Component | Description |
|---|---|---|---|
| `overview` | Physical AI Platform | `RTe` | Silicon IP blocks and global Fab site status |
| `business` | Business Value & Outcomes | `DTe` | ROI metrics (Yield, Uptime) and AI-driven growth |

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `$5[]` — Global Fab Sites (3 sites)

| Site | ID | Flag | Color |
|---|---|---|---|
| **Dresden** | `dresden` | 🇩🇪 | `hsl(221 83% 53%)` |
| **Malta** | `malta` | 🇲🇹 | `hsl(142 71% 40%)` |
| **Singapore** | `singapore`| 🇸🇬 | `hsl(28 90% 52%)` |

---

### 1.2 `b1`–`b7` — Silicon IP Blocks (7 blocks)

These form the core architecture of the Physical AI platform.

| ID | Title | Core Metrics | Key Items |
|---|---|---|---|
| `b1` | **Enterprise Connectivity** | Latency: < 5ms | Identity Mgmt, Edge Messaging, Secure Tunneling |
| `b2` | **Compute IP Platform** | Process Nodes: 7nm-180nm | RISC-V ISA, NPU Accelerators, DSP Cores |
| `b3` | **Design-Process Co-Opt** | Yield: +18% | Power/Thermal Modeling, DFM Score: 94/100 |
| `b4` | **Fab Physical Layer** | Sensors: 2,400+ | Plasma Etch, CMP, CVD, Metrology Integration |
| `b5` | **Edge Physical AI** | Latency: < 1ms | Real-Time Inference, On-Device Learning |
| `b6` | **Supply Chain Maturity** | Forecast Acc: 92% | Inventory Optimization, Logistics AI, Lead-Time Predict |
| `b7` | **Enterprise Governance** | Policies: 42 Active | Model Lifecycle, Regulatory Compliance, RAIF |

---

### 1.3 `cc` — Site Performance Metrics (Before/After AI)

| Metric | Site | Before | After | Unit |
|---|---|---|---|---|
| **Wafer Yield** | Dresden | 74.1 | 88.4 | % |
| | Malta | 71.8 | 85.9 | % |
| | Singapore | 76.3 | 87.3 | % |
| **Tool Uptime** | Dresden | 89.2 | 97.8 | % |
| | Malta | 91.4 | 98.4 | % |
| | Singapore | 88.7 | 96.9 | % |
| **Cycle Time** | Dresden | 14.2 | 9.8 | days |
| (Inverted) | Malta | 13.6 | 9.2 | days |
| | Singapore | 14.8 | 10.1| days |

---

### 1.4 `kTe` — 6-Month Historical Trends (Aug – Jan)

Captured for Yield, Uptime, and Cycle Time for all 3 sites.
*Example (Yield):*
- Aug: Dresden (80.2), Malta (78.1), Singapore (81.4)
- Jan: Dresden (88.4), Malta (85.9), Singapore (87.3)

---

### 1.5 `E5` — Business Outcomes & AI Drivers

| Metric | Outcome | Baseline → Current | AI Drivers |
|---|---|---|---|
| **Yield** | +18% | 74% → 87.3% | Closed-Loop Recipe, Predictive Defect Detection |
| **Uptime** | +22% | 91% → 98.4% | Predictive Maintenance, Edge Anomaly Detection |
| **Cycle Time** | -31% | 14d → 9.6d | DFM Early Capture, Real-time SPC |
| **Customer Trust**| +41pts | NPS 52 → 93 | Quality consistency, XAI Transparency |

---

## 2. Data Models (SQLModel / PostgreSQL)

### 2.1 Fab & IP Infrastructure

```python
class FabSite(SQLModel, table=True):
    __tablename__ = "fab_sites"
    
    id: str = Field(primary_key=True) # dresden, malta, singapore
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    name: str
    location_flag: str
    color_code: str
    status: str = Field(default="Active") # Active, Maintenance, Offline

class SiliconIpBlock(SQLModel, table=True):
    __tablename__ = "silicon_ip_blocks"
    
    id: str = Field(primary_key=True) # b1-b7
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    title: str
    label: str # e.g. "Block 1"
    description: Optional[str] = None
    color: str
    icon_name: str
    
class IpBlockItem(SQLModel, table=True):
    __tablename__ = "ip_block_items"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    block_id: str = Field(foreign_key="silicon_ip_blocks.id")
    group_name: str # e.g. "Connectivity Modules"
    point: str # e.g. "Identity Management"

class IpBlockMetric(SQLModel, table=True):
    __tablename__ = "ip_block_metrics"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    block_id: str = Field(foreign_key="silicon_ip_blocks.id")
    label: str # e.g. "Latency"
    value: str # e.g. "< 5ms"
```

### 2.2 Manufacturing Intelligence (Metrics)

```python
class FabMetricDaily(SQLModel, table=True):
    __tablename__ = "fab_metrics_daily"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    site_id: str = Field(foreign_key="fab_sites.id", index=True)
    metric_type: str # yield, uptime, cycle_time
    value: float
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)

class BusinessValueOutcome(SQLModel, table=True):
    __tablename__ = "physical_ai_outcomes"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    metric_name: str # Yield, Uptime, Cycle Time
    current_value: str # "+18%"
    baseline: str # "74% → 87.3%"
    summary: str # detail text
    driver_tags: List[str] = Field(default=[], sa_column=Column(JSON))
```

---

## 3. API Contracts (FastAPI)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/physical/sites` | List global fab sites and current status |
| `GET` | `/api/physical/ip-blocks` | Get all 7 IP blocks with nested items/metrics |
| `GET` | `/api/physical/metrics/summary` | Yield/Uptime before-and-after summary |
| `GET` | `/api/physical/metrics/history` | 6-month historical data for charts |
| `GET` | `/api/physical/outcomes` | Business value metrics and AI drivers |

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── physical-ai/
    └── page.tsx                              ← Tabs: Platform vs Business
        ├── <IpBlockGrid />                   ← Silicon IP 7-block layout
        │     └── <IpBlockCard />             ← Detailed items + micro-metrics
        ├── <FabOperationalView />            ← Map + Site KPI cards
        └── <PerformanceBusinessView />       ← Before/After Yield charts + ROI Drivers
```

---

## 5. Key Design Decisions

1.  **Block-Level Detail**: The IP blocks (`b1-b7`) are highly structured. We use a parent-child relationship (`IpBlockItem`, `IpBlockMetric`) to allow for flexible scaling of technical specifications per block.
2.  **Before/After Comparison**: The `cc` data structure is critical for showcasing AI impact. The API will serve this as a comparison object to drive the "Delta" UI components.
3.  **Historical Trends**: Chart data (`kTe`) is normalized into `fab_metrics_daily` in the rebuild to allow for arbitrary time-range queries (last 7d, 30d, 90d) instead of hardcoded monthly buckets.

**Running Total: 62 Tables (reconciled)**
