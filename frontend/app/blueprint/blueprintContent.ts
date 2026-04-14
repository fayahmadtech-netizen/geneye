export type BlueprintSectionId =
  | "vision"
  | "value"
  | "strategy"
  | "governance"
  | "adoption";

export interface KeyBlock {
  id: BlueprintSectionId;
  title: string;
  subtitle: string;
  color: string; // tailwind bg-* or hex via style
  bgClass: string;
}

export const KEY_BLOCKS: KeyBlock[] = [
  {
    id: "vision",
    title: "AI Vision",
    subtitle: "Business Aligned Vision",
    color: "#E67E22",
    bgClass: "bg-[#E67E22]",
  },
  {
    id: "value",
    title: "Value Proposition",
    subtitle: "Risk and value based AI use cases",
    color: "#8E44AD",
    bgClass: "bg-[#8E44AD]",
  },
  {
    id: "strategy",
    title: "AI Strategy",
    subtitle: "Physical AI · Enterprise AI · Edge AI",
    bgClass: "bg-[#27AE60]",
    color: "#27AE60",
  },
  {
    id: "governance",
    title: "Responsible AI and Risk Management",
    subtitle: "Data and AI Governance",
    bgClass: "bg-[#2980B9]",
    color: "#2980B9",
  },
  {
    id: "adoption",
    title: "AI Adoption, Scale and Value Measurement",
    subtitle: "Adoption and Impact Measurement",
    bgClass: "bg-[#8B8000]",
    color: "#8B8000",
  },
];

export interface Pillar {
  title: string;
  body: string;
  accentClass: string;
}

export interface DetailBlock {
  title: string;
  bullet: string;
  description: string;
  icon: "factory" | "gear" | "diamond";
}

export interface SectionDetail {
  breadcrumb: string;
  lead: string;
  pillars: Pillar[];
  details: DetailBlock[];
}

export const SECTION_DETAILS: Record<BlueprintSectionId, SectionDetail> = {
  vision: {
    breadcrumb: "AI Vision > Business alignment",
    lead: "Anchor enterprise AI to measurable business outcomes and a single north-star narrative that every BU can execute against.",
    pillars: [
      {
        title: "Strategic clarity",
        body: "Executive narrative, portfolio taxonomy, and funding guardrails tied to ROI.",
        accentClass: "bg-[#E67E22]/15 border-[#E67E22]/40",
      },
      {
        title: "Operating cadence",
        body: "Quarterly AI portfolio reviews, initiative stage gates, and value tracking.",
        accentClass: "bg-[#27AE60]/15 border-[#27AE60]/40",
      },
      {
        title: "Capability signals",
        body: "Maturity baselines, adoption metrics, and leading indicators of value.",
        accentClass: "bg-[#2980B9]/15 border-[#2980B9]/40",
      },
    ],
    details: [
      {
        title: "North-star & roadmap",
        bullet: "Vision storyboard, KPI tree, and horizon plan",
        description:
          "Translate corporate strategy into an AI thesis every function can interpret — what to build, buy, or partner for.",
        icon: "factory",
      },
      {
        title: "Investment thesis",
        bullet: "Capital allocation, stage gates, and portfolio balance",
        description:
          "Balance horizon-3 bets with factory-floor wins so funding matches risk appetite and time-to-value.",
        icon: "gear",
      },
      {
        title: "Executive accountability",
        bullet: "Sponsors, outcomes, and board-ready reporting",
        description:
          "Clear ownership from C-suite to BU leads with transparent scorecards and escalation paths.",
        icon: "diamond",
      },
    ],
  },
  value: {
    breadcrumb: "Value Proposition > Risk / value prioritization",
    lead: "Prioritize initiatives using a shared risk–value language so Tier-3 exposure is visible before capital commits.",
    pillars: [
      {
        title: "Value thesis",
        body: "ROI models, benefit hypotheses, and realization tracking.",
        accentClass: "bg-[#8E44AD]/15 border-[#8E44AD]/40",
      },
      {
        title: "Risk posture",
        body: "Tiering, controls, and residual risk acceptance.",
        accentClass: "bg-[#E67E22]/15 border-[#E67E22]/40",
      },
      {
        title: "Portfolio hygiene",
        body: "Shadow AI mapping, duplication checks, and sunset criteria.",
        accentClass: "bg-[#2980B9]/15 border-[#2980B9]/40",
      },
    ],
    details: [
      {
        title: "Prioritization engine",
        bullet: "Common scoring, guardrails, and portfolio mix targets",
        description:
          "A single rubric for comparing initiatives across BUs without boiling the ocean on bespoke analyses.",
        icon: "factory",
      },
      {
        title: "Funding linkage",
        bullet: "Stage-gated releases tied to evidence",
        description:
          "Capital follows demonstrated de-risking — data, model, and operational readiness checkpoints.",
        icon: "gear",
      },
      {
        title: "Transparency",
        bullet: "Executive dashboards and audit trail",
        description:
          "Leaders see exposure, value, and dependencies in one place for faster decisions.",
        icon: "diamond",
      },
    ],
  },
  strategy: {
    breadcrumb: "AI Vision > Physical AI Strategy",
    lead: "Physical AI should cascade from enterprise strategy into execution — models and AI agentic workflow in the loop with tools, sensors, and process controls, not dashboards.",
    pillars: [
      {
        title: "ML Models (Yield Optimization)",
        body: "Yield prediction, defect detection, process drift, improve cycle time, reliability.",
        accentClass: "bg-[#E67E22]/15 border-[#E67E22]/50",
      },
      {
        title: "GenAI Apps & Agents",
        body: "Manufacturing assistants, Engineering copilots, G&A Assistants.",
        accentClass: "bg-[#27AE60]/15 border-[#27AE60]/50",
      },
      {
        title: "AI Automation / Agentic workflows",
        body: "Self Healing, Proactive Monitoring and Predictive Maintenance — Agentic workflow. Data products — omni channel insights.",
        accentClass: "bg-[#2980B9]/15 border-[#2980B9]/50",
      },
    ],
    details: [
      {
        title: "Enterprise AI Platform → Fab-Grade AI",
        bullet: "MLOps/LLMOps, Governance, Reliability & Monitoring Drift",
        description:
          "In a fab environment, models have to be treated like silicon — versioned, monitored, explainable, and safe. Running AI with the same discipline as manufacturing systems.",
        icon: "factory",
      },
      {
        title: "Edge + Embedded AI → Physical AI Execution",
        bullet: "Edge AI, Embedded systems, Robotics and Hardware-aware AI",
        description:
          "Edge AI is how Physical AI becomes real — inference close to tools and sensors, with enterprise oversight so local decisions remain globally consistent.",
        icon: "gear",
      },
      {
        title: "Responsible AI & Governance → Differentiator",
        bullet: "Risk classification, Human-in-the-loop, Governance boards and Auditability",
        description:
          "Physical AI without governance is operational risk. Embeds Responsible AI into deployment — not as policy, but as engineering.",
        icon: "diamond",
      },
    ],
  },
  governance: {
    breadcrumb: "Responsible AI > Data & AI Governance",
    lead: "Embed controls into the delivery lifecycle so every model and agent ships with evidence, monitoring, and clear accountability.",
    pillars: [
      {
        title: "Policy & standards",
        body: "Model cards, data lineage, access, and change control.",
        accentClass: "bg-[#2980B9]/15 border-[#2980B9]/40",
      },
      {
        title: "Operational controls",
        body: "Guardrails, red-teaming hooks, drift and incident response.",
        accentClass: "bg-[#E67E22]/15 border-[#E67E22]/40",
      },
      {
        title: "Assurance",
        body: "Auditability, evidence packs, and regulatory mapping.",
        accentClass: "bg-[#8E44AD]/15 border-[#8E44AD]/40",
      },
    ],
    details: [
      {
        title: "Lifecycle governance",
        bullet: "Design-time and run-time requirements",
        description:
          "From intake to retirement, every asset carries obligations, owners, and telemetry — not paperwork in a silo.",
        icon: "factory",
      },
      {
        title: "Human-in-the-loop",
        bullet: "Decision rights and escalation",
        description:
          "Define where humans must approve, augment, or intervene so autonomy scales safely.",
        icon: "gear",
      },
      {
        title: "Board-ready assurance",
        bullet: "KPIs, incidents, and remediation",
        description:
          "Leaders see residual risk and control effectiveness in language suitable for oversight forums.",
        icon: "diamond",
      },
    ],
  },
  adoption: {
    breadcrumb: "Adoption > Scale & value measurement",
    lead: "Measure adoption and value the way you run the business — leading and lagging indicators tied to workflows, not slide decks.",
    pillars: [
      {
        title: "Adoption metrics",
        body: "Usage, depth of use, and workflow integration.",
        accentClass: "bg-[#8B8000]/15 border-[#8B8000]/40",
      },
      {
        title: "Value realization",
        body: "Benefit tracking, variance analysis, and reinvestment rules.",
        accentClass: "bg-[#27AE60]/15 border-[#27AE60]/40",
      },
      {
        title: "Scale patterns",
        body: "Reference architectures, reuse, and enablement.",
        accentClass: "bg-[#2980B9]/15 border-[#2980B9]/40",
      },
    ],
    details: [
      {
        title: "Outcome chain",
        bullet: "From pilot to production KPIs",
        description:
          "Trace value from hypothesis to P&L impact with honest baselines and counterfactuals.",
        icon: "factory",
      },
      {
        title: "Change network",
        bullet: "Champions, playbooks, and skills",
        description:
          "Scale adoption through embedded support, not one-off training events.",
        icon: "gear",
      },
      {
        title: "Continuous improvement",
        bullet: "Feedback loops and portfolio tuning",
        description:
          "Use operational telemetry to retire low-value work and double down on what moves the needle.",
        icon: "diamond",
      },
    ],
  },
};
