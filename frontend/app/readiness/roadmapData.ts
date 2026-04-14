export type RoadmapPhase = {
  weekRange: string;
  engine: string;
  title: string;
  description: string;
  deliverableCount: number;
  accent: "sky" | "indigo" | "emerald" | "amber" | "violet";
  tasks: string[];
};

export const ATO_ROADMAP_PHASES: RoadmapPhase[] = [
  {
    weekRange: "Week 1–5",
    engine: "Vision Engine",
    title: "Vision, Strategy & Org Design",
    description:
      "Enterprise AI vision undefined — establish strategic north star, use-case taxonomy, and executive alignment on AI ambition.",
    deliverableCount: 8,
    accent: "sky",
    tasks: [
      "Define Business Aligned Vision — Align AI vision to platform, product and tooling ecosystem",
      "Build Strategy Document",
      "Define operating model and AI guiding principles",
      "Complete org design",
      "Define criteria for build vs buy model for data and AI platform",
      "Establish unified data and AI platform with governance and monitoring capability",
      "Establish AI Helpdesk for production support",
      "Draft Board Level Material",
    ],
  },
  {
    weekRange: "Week 6–10",
    engine: "Governance Engine",
    title: "Policies, Council, Compliance & RAI Enforcement",
    description:
      "Critical governance gaps detected — prioritize policy & oversight setup, AI council charter, and RAI framework.",
    deliverableCount: 8,
    accent: "indigo",
    tasks: [
      "Set up lightweight governance process",
      "Set up AI Council or Enterprise AI Board with key members, mandate and decision rights",
      "Define and implement risk and value based AI use case prioritization",
      "Define Enterprise AI Risk Classification Framework",
      "Introduce AI Model Card",
      "Implement RAI review and approval workflow",
      "Implement automated controls (Guardrails and Red Teaming) applied across all Tier 2 and Tier 3 AI models",
      "Implement Regulatory & Framework Compliance Tracker",
    ],
  },
  {
    weekRange: "Week 11–15",
    engine: "Capital Engine",
    title: "Activate Capital & Investment Pipeline",
    description:
      "Capital discipline weak — establish ROI tracking, funding governance, and investment prioritization.",
    deliverableCount: 3,
    accent: "emerald",
    tasks: [
      "Establish Use Case Prioritization framework and Intake portal",
      "ROI tracking",
      "Funding processes (review, approvals and executive sign-off)",
    ],
  },
  {
    weekRange: "Week 16–20",
    engine: "Control Engine",
    title: "Control — Portfolio Visibility & Scale",
    description:
      "Portfolio visibility limited — build enterprise AI registry, shadow AI mapping, and KPI dashboards.",
    deliverableCount: 5,
    accent: "amber",
    tasks: [
      "Establish enterprise-wide AI project visibility and Executive Dashboard",
      "Establish routines — AI Council / EAI Board for executive alignment and funding",
      "Establish cadence of meetings — from Daily Syncs to MBRs and QBRs",
      "Track shadow AI mapping",
      "Track AI Maturity Score",
    ],
  },
  {
    weekRange: "Week 21–25",
    engine: "Adoption and Value Measurement Engine",
    title: "Scale & Enterprise Adoption",
    description:
      "Strong adoption posture — scale winning patterns, embed champions, and measure BU adoption metrics.",
    deliverableCount: 5,
    accent: "violet",
    tasks: [
      "Establish L&D partnership/AI Academy",
      "Build BU Adoption Model",
      "Design and Implement AI Champion Network",
      "Track Adoption insights",
      "Track AI investment returns",
    ],
  },
];

export const RECOMMENDED_NEXT_STEPS = [
  { icon: "shield" as const, text: "Establish governance framework and AI Council immediately" },
  { icon: "dollar" as const, text: "Build AI investment pipeline and ROI tracking methodology" },
  { icon: "eye" as const, text: "Map shadow AI and create enterprise initiative registry" },
  { icon: "users" as const, text: "Scale adoption patterns and activate BU champion network" },
];
