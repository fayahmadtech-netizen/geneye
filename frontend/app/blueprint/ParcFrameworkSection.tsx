"use client";

import type { LucideIcon } from "lucide-react";
import { Check, ChevronDown, Clock, GraduationCap, Map, Network, Target, Users } from "lucide-react";
import { useCallback, useState } from "react";

type ParcColumn = {
  title: string;
  num: string;
  headerClass: string;
  bodyClass: string;
  body: string;
};

const PARC_COLUMNS: ParcColumn[] = [
  {
    title: "People",
    num: "#01",
    headerClass: "bg-[#2980B9]",
    bodyClass: "bg-sky-50 text-slate-800 dark:bg-sky-950/40 dark:text-sky-100",
    body:
      "Transition the workforce from 'Task Masters' to Agent Supervisors who oversee autonomous fab systems. This addresses the Talent and Literacy building block of your strategy.",
  },
  {
    title: "Architecture",
    num: "#02",
    headerClass: "bg-[#8E44AD]",
    bodyClass: "bg-purple-50 text-slate-800 dark:bg-purple-950/35 dark:text-purple-100",
    body:
      "Utilize your 6-Layered Framework to ensure a secure, interoperable data foundation from the End Node (Fab sensors) up through the Processing (Edge AI) and Action (Enterprise Platform) layers. Adopts formal and informal organizational structures that empower AI/ML teams rather than siloing them.",
  },
  {
    title: "Routine",
    num: "#03",
    headerClass: "bg-[#27AE60]",
    bodyClass: "bg-emerald-50 text-slate-800 dark:bg-emerald-950/35 dark:text-emerald-100",
    body:
      "Establish an AI Council / EAI Board for executive alignment and funding. Establishes a cadence of meetings—from Daily Syncs to MBRs and QBRs—to ensure information and goals cascade across the global organization.",
  },
  {
    title: "Culture",
    num: "#04",
    headerClass: "bg-[#34495E]",
    bodyClass: "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-100",
    body:
      "Foster a Mission-Driven culture focused on customer obsession and operational excellence.",
  },
];

type ResourceId =
  | "operationalizing"
  | "council-charter"
  | "talent-roadmap"
  | "bu-adoption"
  | "champion-network"
  | "ai-academy";

type ResourceRow = {
  id: ResourceId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconWrapClass: string;
};

const RESOURCE_ROWS: ResourceRow[] = [
  {
    id: "operationalizing",
    title: "Operationalizing AI",
    subtitle: "HI-FACTS guiding principles to ensure all AI systems are enterprise-ready",
    icon: Clock,
    iconWrapClass: "bg-blue-600 text-white",
  },
  {
    id: "council-charter",
    title: "AI Council Charter",
    subtitle: "Governing body membership, mandate, and decision rights",
    icon: Target,
    iconWrapClass: "bg-emerald-600 text-white",
  },
  {
    id: "talent-roadmap",
    title: "Talent Roadmap",
    subtitle: "Skills development, hiring pipeline, and AI capability building",
    icon: Users,
    iconWrapClass: "bg-orange-500 text-white",
  },
  {
    id: "bu-adoption",
    title: "BU Adoption Model",
    subtitle: "Wave-based rollout plan across all business units",
    icon: Map,
    iconWrapClass: "bg-sky-500 text-white",
  },
  {
    id: "champion-network",
    title: "Champion Network Model",
    subtitle: "BU-level AI champions driving adoption and feedback loops",
    icon: Network,
    iconWrapClass: "bg-blue-600 text-white",
  },
  {
    id: "ai-academy",
    title: "AI Academy",
    subtitle: "Role-based, responsible, and in-house AI training programs across the enterprise",
    icon: GraduationCap,
    iconWrapClass: "bg-amber-400 text-amber-950",
  },
];

const COUNCIL_MEMBERSHIP: {
  role: string;
  reportsTo: string;
  headcount: string;
  types: { label: string; variant: "blue" | "green" | "red" | "orange" }[];
}[] = [
  {
    role: "Chief AI Officer (Chair)",
    reportsTo: "CEO",
    headcount: "1",
    types: [
      { label: "Voting", variant: "blue" },
      { label: "Strategic", variant: "green" },
    ],
  },
  {
    role: "VP Data & Analytics",
    reportsTo: "CAIO",
    headcount: "1",
    types: [{ label: "Voting", variant: "blue" }],
  },
  {
    role: "Chief Risk Officer",
    reportsTo: "CEO",
    headcount: "1",
    types: [
      { label: "Voting", variant: "blue" },
      { label: "Risk", variant: "red" },
    ],
  },
  {
    role: "BU AI Leads (rotating)",
    reportsTo: "CAIO",
    headcount: "3–5",
    types: [{ label: "Advisory", variant: "orange" }],
  },
  {
    role: "Legal & Compliance",
    reportsTo: "CLO",
    headcount: "1",
    types: [
      { label: "Advisory", variant: "orange" },
      { label: "Risk", variant: "red" },
    ],
  },
];

const RESPONSIBILITY_LEFT = [
  "Approve enterprise AI initiatives and stage-gate funding",
  "Allocate AI investment across portfolios and business units",
  "Adjudicate priority conflicts between BUs and shared platforms",
];

const RESPONSIBILITY_RIGHT = [
  "Set enterprise risk tolerance for AI systems and data use",
  "Review maturity and value realization reports on a quarterly cadence",
  "Sponsor updates to responsible AI and data ethics policies",
];

const TALENT_MILESTONES: { label: string; done: boolean }[] = [
  { label: "Define AI talent taxonomy", done: true },
  { label: "Conduct current-state skills gap assessment", done: true },
  { label: "Align hiring profiles with enterprise AI capability model", done: true },
  { label: "Publish internal AI role catalog", done: true },
  { label: "Kick off pilot upskilling cohort", done: true },
  { label: "Design role-specific AI upskilling curriculum", done: false },
  { label: "Define retention & incentive strategy", done: false },
  { label: "Integrate AI skills into performance cycles", done: false },
];

const TALENT_DONE = TALENT_MILESTONES.filter((m) => m.done).length;
const TALENT_TOTAL = TALENT_MILESTONES.length;

function TypePill({
  label,
  variant,
}: {
  label: string;
  variant: "blue" | "green" | "red" | "orange";
}) {
  const cls = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
    green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
    red: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200",
    orange: "bg-orange-100 text-orange-900 dark:bg-orange-950/40 dark:text-orange-200",
  }[variant];
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function CouncilCharterExpanded() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Mission statement
        </p>
        <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-950/50 dark:text-gray-200">
          The AI Council is the governing body accountable for enterprise AI strategy, investment, risk posture, and
          ethical use of AI across the organization.
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Council membership
        </p>
        <div className="mt-2 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">Role</th>
                <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">Reports To</th>
                <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">Headcount</th>
                <th className="px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">Type</th>
              </tr>
            </thead>
            <tbody>
              {COUNCIL_MEMBERSHIP.map((row) => (
                <tr
                  key={row.role}
                  className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                >
                  <td className="px-3 py-2.5 text-gray-900 dark:text-gray-100">{row.role}</td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-300">{row.reportsTo}</td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-300">{row.headcount}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {row.types.map((t) => (
                        <TypePill key={t.label} label={t.label} variant={t.variant} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Key responsibilities
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ul className="space-y-2">
            {RESPONSIBILITY_LEFT.map((text) => (
              <li key={text} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {RESPONSIBILITY_RIGHT.map((text) => (
              <li key={text} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TalentRoadmapExpanded() {
  const pct = Math.round((TALENT_DONE / TALENT_TOTAL) * 100);
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Roadmap completion
        </p>
        <div className="mt-2 flex items-center gap-4">
          <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-orange-500 transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="shrink-0 text-sm font-semibold text-gray-900 dark:text-white">
            {TALENT_DONE} / {TALENT_TOTAL} milestones
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {TALENT_MILESTONES.map((m) => (
          <li
            key={m.label}
            className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900/50"
          >
            {m.done ? (
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
            ) : (
              <span
                className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600"
                aria-hidden
              />
            )}
            <span
              className={`text-sm ${m.done ? "font-medium text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100"}`}
            >
              {m.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlaceholderExpanded({ title }: { title: string }) {
  return (
    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Detailed guidance for <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span> will appear
      here as your organization configures templates and links to source documents.
    </p>
  );
}

function ExpandedBody({ id }: { id: ResourceId }) {
  switch (id) {
    case "council-charter":
      return <CouncilCharterExpanded />;
    case "talent-roadmap":
      return <TalentRoadmapExpanded />;
    case "operationalizing":
      return <PlaceholderExpanded title="Operationalizing AI" />;
    case "bu-adoption":
      return <PlaceholderExpanded title="BU Adoption Model" />;
    case "champion-network":
      return <PlaceholderExpanded title="Champion Network Model" />;
    case "ai-academy":
      return <PlaceholderExpanded title="AI Academy" />;
    default:
      return null;
  }
}

function ParcColumnCard({ col }: { col: ParcColumn }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200/80 shadow-sm dark:border-gray-700">
      <div
        className={`flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-white ${col.headerClass}`}
      >
        <span>{col.title}</span>
        <span className="text-xs font-medium opacity-95">{col.num}</span>
      </div>
      <div className="flex flex-col items-center px-1 pt-1">
        <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden />
      </div>
      <div className={`flex-1 p-3 text-[11px] leading-relaxed sm:text-xs ${col.bodyClass}`}>{col.body}</div>
    </div>
  );
}

export function ParcFrameworkSection() {
  const [openIds, setOpenIds] = useState<Set<ResourceId>>(() => new Set());

  const toggle = useCallback((id: ResourceId) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <section className="mt-10">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Operating model diagram — PARC framework
      </p>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
          The Operating Model : Governance &amp; Scale (PARC Framework)
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PARC_COLUMNS.map((col) => (
            <ParcColumnCard key={col.title} col={col} />
          ))}
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {RESOURCE_ROWS.map((row) => {
          const Icon = row.icon;
          const isOpen = openIds.has(row.id);
          return (
            <li key={row.id}>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => toggle(row.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/80"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${row.iconWrapClass}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{row.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{row.subtitle}</p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 dark:text-gray-500 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-200 px-4 pb-4 pt-1 dark:border-gray-700">
                    <div className="pt-3">
                      <ExpandedBody id={row.id} />
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
