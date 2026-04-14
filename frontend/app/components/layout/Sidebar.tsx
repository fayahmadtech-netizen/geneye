import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  ClipboardCheck,
  Network,
  Briefcase,
  ShieldCheck,
  DollarSign,
  Cpu,
  Wrench,
  Shield,
  FlaskConical,
  Layers,
  TrendingUp,
  Settings,
  Zap,
  MessageSquarePlus,
  Plus,
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  /** If true, only exact href matches (avoids /portfolio matching /portfolio/capital). */
  exact?: boolean;
};

type NavSection = { title: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    title: "Strategy and readiness",
    items: [
      { name: "AI Transformation Control", href: "/", icon: LayoutGrid, exact: true },
      { name: "AI Readiness Diagnostic", href: "/readiness", icon: ClipboardCheck },
      { name: "AI Org Blueprint", href: "/blueprint", icon: Network },
      { name: "UseCaseX Portfolio", href: "/portfolio", icon: Briefcase, exact: true },
      { name: "AI Governance Stack", href: "/governance-stack", icon: ShieldCheck },
      { name: "Value Forecast", href: "/value-forecast", icon: DollarSign },
    ],
  },
  {
    title: "Build and deploy",
    items: [
      { name: "AI AgentCore Platform", href: "/agentic", icon: Cpu },
      { name: "AI Engineering Platform", href: "/engineering", icon: Wrench },
      { name: "AI Command Center", href: "/command-center", icon: Shield },
      { name: "ML Studio", href: "/mlops", icon: FlaskConical },
      { name: "Physical AI Platform", href: "/industrial", icon: Layers },
    ],
  },
  {
    title: "Govern and optimize",
    items: [
      { name: "Control Tower", href: "/control-tower", icon: LayoutGrid },
      { name: "Governance & Risk", href: "/governance", icon: ShieldCheck },
      { name: "Portfolio & Capital", href: "/portfolio/capital", icon: Briefcase },
      { name: "Maturity Engine", href: "/maturity", icon: TrendingUp },
      { name: "Admin", href: "/admin", icon: Settings },
    ],
  },
];

function itemIsActive(pathname: string, item: NavItem): boolean {
  const { href, exact } = item;
  if (href === "/") return pathname === "/";
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-[17rem] shrink-0 bg-slate-950 text-slate-200 border-r border-slate-800/80 h-full">
      <div className="flex items-center gap-3 px-4 h-[4.5rem] border-b border-slate-800/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/40">
          <Zap className="h-5 w-5 text-white" aria-hidden />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">GenEye</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {section.title}
            </p>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = itemIsActive(pathname, item);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-950/80 text-blue-300 ring-1 ring-blue-800/60"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`h-[18px] w-[18px] shrink-0 ${
                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                      }`}
                      aria-hidden
                    />
                    <span className="leading-snug">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            GenEye chat
          </p>
          <div className="space-y-2">
            <Link
              href="/chat"
              className="flex w-full items-center gap-3 rounded-lg border border-dashed border-blue-500/50 bg-blue-950/20 px-3 py-2.5 text-sm font-medium text-blue-300 transition-colors hover:bg-blue-950/40 hover:border-blue-400/60"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </span>
              <span className="flex-1 text-left">New Chat</span>
              <MessageSquarePlus className="h-4 w-4 text-blue-400/80" aria-hidden />
            </Link>
            <Link
              href="/chat"
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === "/chat" || pathname.startsWith("/chat/")
                  ? "bg-blue-950/80 text-blue-300 ring-1 ring-blue-800/60"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <MessageSquarePlus
                className={`h-[18px] w-[18px] shrink-0 ${
                  pathname === "/chat" || pathname.startsWith("/chat/")
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
                aria-hidden
              />
              <span className="leading-snug">GenEye Chat</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 px-4 py-3">
        <p className="text-[11px] text-slate-500">v2.1.4 · Enterprise Edition</p>
      </div>
    </div>
  );
}
