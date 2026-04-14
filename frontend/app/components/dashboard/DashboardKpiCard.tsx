import { LucideIcon } from "lucide-react";

type Accent = "blue" | "emerald" | "amber";

const accentStyles: Record<Accent, { box: string; icon: string }> = {
  blue: {
    box: "bg-sky-50 dark:bg-sky-950/50",
    icon: "text-sky-600 dark:text-sky-400",
  },
  emerald: {
    box: "bg-emerald-50 dark:bg-emerald-950/40",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    box: "bg-amber-50 dark:bg-amber-950/40",
    icon: "text-amber-600 dark:text-amber-400",
  },
};

interface DashboardKpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  accent: Accent;
}

export function DashboardKpiCard({ title, value, subtitle, icon: Icon, accent }: DashboardKpiCardProps) {
  const a = accentStyles[accent];
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start gap-4 p-5">
        <div className={`shrink-0 rounded-xl p-3 ${a.box}`}>
          <Icon className={`h-6 w-6 ${a.icon}`} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{value}</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
