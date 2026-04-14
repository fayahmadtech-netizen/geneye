# GenEye — Phase 1: Global Architecture & Routing Findings

> **Source Bundle:** `index-B9prsZ3M.js` (React 18.3.1, ~1.88 MB minified)
> **Analysis Date:** 2026-04-12
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI · PostgreSQL · SQLModel

---

## 1. Technology Stack Identified in Bundle

| Layer | Library | Version |
|---|---|---|
| UI Framework | React | 18.3.1 |
| Router | React Router | v6 (`BrowserRouter`, `Routes`, `Route`) |
| Server State | TanStack Query | v5 (`QueryClient`, `QueryClientProvider`) |
| Notification | Sonner | (Toaster component) |
| Toast Logic | Shadcn/UI pattern | Custom `useToast` hook |
| Theming | next-themes | `ThemeContext`, `useTheme` hook |
| Build Tool | Vite / Lovable | (inferred from bundle fingerprint) |
| Styling | Tailwind CSS | (class names throughout bundle) |

---

## 2. Global App Provider Tree (Reconstructed)

```
<App>  (N$e — Root Component)
  └── <QueryClientProvider client={new QueryClient()}>     [gG wrapping mG]
        └── <BrowserRouter>                                [Wq alias]
              ├── <ToastProvider />                        [SV — useToast context]
              ├── <Toaster />                              [nK — Sonner, reads theme]
              └── <BrowserRouter>                          [hY — actual router]
                    └── <Routes>                           [sY]
                          └── {all <Route> declarations}   [Ot]
```

### Global Providers Summary

| Provider | Mangled Symbol | Library | Purpose |
|---|---|---|---|
| `QueryClientProvider` | `gG` / `mG` (client) | TanStack Query v5 | Server state, async data fetching |
| `BrowserRouter` | `hY` / `sY` | React Router v6 | Client-side routing |
| `Toaster` | `nK` | Sonner | Global toast notification rendering |
| `Toast Context` | `SV` (`useToast`) | Custom (Shadcn pattern) | Programmatic toast dispatch |
| `ThemeContext` | `AV` / `PV` (hook) | next-themes | Light/dark/system theme control |

> **Important:** All pages render inside a shared `<Wt>` layout shell component that accepts `title` and `subtitle` props. This is the common sidebar + header wrapper — the equivalent of a Next.js Layout.

---

## 3. Complete Route Map (20 Routes)

### 3.1 Top-Level Routes

| Route Path | Mangled Component | Page Title | Notes |
|---|---|---|---|
| `/` | `zSe` | Dashboard / Home | Has Supabase `ba.from()` stub — data layer partially wired |
| `/maturity` | `VSe` | AI Maturity Assessment | Multi-domain maturity scoring with criteria sliders; `sJ` data array |
| `/portfolio` | `JSe` | UseCaseX Prioritization Engine & Portfolio | AI use case intake, inventory & value-based prioritization |
| `/portfolio/:id` | `tke` | `[use case name]` | Detail view for a single portfolio use case; uses `useParams` + `useNavigate` |
| `/governance` | `lke` | Executive AI Governance Stack | Risk classification, model governance, approval workflows, compliance |
| `/value` | `pke` | Value Forecast | AI investment returns, adoption efficiency, realized business impact |
| `/admin` | `jke` | Administration | Org settings, user management, platform access control |
| `/org-blueprint` | `Rke` | Org Blueprint | AI org design; maps to Physical AI Strategy (`_ke` data array) |
| `/agentcore` | `aAe` | AI AgentCore Platform | Human–Machine Orchestration Platform |
| `/ml-studio` | `yAe` | ML Studio | Enterprise ML Deployment Platform (Data → Model → Outcome) |
| `/geneye-chat` | `zPe` | GenEye Chat | Multi-modal AI chat; 9+ `useState` hooks, agent/model switching, streaming |
| `/physical-ai` | `LTe` | Physical AI Platform | Silicon IP, Fab Execution & Enterprise AI |
| `/ato` | `z5e` | ATO Wizard | Multi-step Authority-to-Operate onboarding form (7+ form fields) |
| `/ai-engineering` | `u3e` | AI Engineering Platform | ADLC (Autonomous Development Lifecycle) platform |
| `/command-center` | `XDe` | AI Command Center | Real-time Incident & Operations Intelligence |
| `*` | `w$e` | 404 Not Found | Catch-all route |

### 3.2 Nested `/control-tower` Routes

| Route Path | Mangled Component | Page Title | Notes |
|---|---|---|---|
| `/control-tower` | `e$e` | Control Tower (Dashboard) | Aggregated executive view; reads `kD` + `Le` hardcoded arrays |
| `/control-tower/governance` | `m$e` | Governance & Risk Oversight | Audit-ready institutional AI risk view |
| `/control-tower/portfolio` | `y$e` | AI Portfolio & Capital Allocation | CFO-grade AI investment portfolio view |
| `/control-tower/maturity` | `b$e` | Maturity (Control Tower view) | Reads `kD` and `qo` hardcoded data arrays |

---

## 4. Shared Data Constants Detected

The following global hardcoded arrays/objects appear across multiple routes and will map to shared DB tables:

| Bundle Symbol | Used By Routes | Likely DB Table |
|---|---|---|
| `sJ` | `/maturity` | `domains`, `domain_criteria` |
| `kD` | `/control-tower`, `/control-tower/maturity` | `maturity_config` |
| `qo` | `/control-tower/maturity` | `maturity_assessments` |
| `Le` | `/control-tower`, `/control-tower/governance` | `use_cases` (governance-tagged) |
| `Kw` | `/portfolio/:id` | `use_cases` (full list) |
| `_ke` | `/org-blueprint` | `strategy_nodes` |
| `v5` | `/geneye-chat` | `ai_agents` |
| `FSe` | `/` (Dashboard) | `dashboard_config` |

---

## 5. Supabase Stub Detected

On the **Dashboard (`/`)**, the following Supabase-like query pattern was found:

```js
const { data: k } = await ba.from("a...")
```

This suggests the original intent was to connect to **Supabase** as the backend. In our rebuild we will replace this entirely with **FastAPI + PostgreSQL**.

---

## 6. Key Observations & Architecture Notes

1. **All pages use a shared layout shell** (`<Wt>` with `title`/`subtitle` props). Rebuild as a single Next.js Layout component with a sidebar.
2. **TanStack Query is present but unused** — all data is currently hardcoded. In the rebuild, every page will be refactored to use `useQuery` hooks hitting FastAPI endpoints.
3. **next-themes is wired** — Dark/light mode is already built into the design system. We must preserve this in Tailwind via `darkMode: "class"`.
4. **`/geneye-chat` is the most complex route** — ~9 `useState` hooks including message history, model selection, agent mode, streaming state, and session tracking. Save for last.
5. **`/ato` is a multi-step wizard** — 7+ form fields across multiple steps (`company`, `industry`, `numBUs`, `stakeholders`, `strategicAIgoals`, `currentMaturity`, `aiOrgStructure`).
6. **`/portfolio/:id` is the only parametric route** — uses `useParams()` + `useNavigate()`.

---

## 7. Recommended Phase 2 Analysis Order

| Priority | Route | Rationale |
|---|---|---|
| 1 | **`/maturity`** | Cleanest schema — well-defined `domain × criteria` data model |
| 2 | **`/portfolio`** + **`/portfolio/:id`** | Core business entity (use cases) |
| 3 | **`/governance`** | Risk/compliance models |
| 4 | **`/control-tower`** family | Aggregation of the above — good integration test |
| 5 | **`/value`** | Financial KPI metrics |
| 6 | **`/command-center`** | Operational intelligence dashboard |
| 7 | **`/admin`** | User/org management |
| 8 | **`/agentcore`** | Agent orchestration |
| 9 | **`/ml-studio`** | ML deployment |
| 10 | **`/ato`** | Complex wizard form |
| 11 | **`/ai-engineering`** | ADLC platform |
| 12 | **`/physical-ai`** + **`/org-blueprint`** | Strategy/mapping tools |
| 13 | **`/geneye-chat`** | Most complex — real-time chat + streaming |
| 14 | **`/`** (Dashboard) | Aggregation of all above |
