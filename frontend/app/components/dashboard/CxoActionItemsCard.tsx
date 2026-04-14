import { AlertTriangle } from "lucide-react";
import { guardrailCoveragePct } from "../../lib/dashboardDerived";
import type { Guardrail } from "../../types/dashboard";

type DotTone = "red" | "amber" | "orange";

function dotClass(tone: DotTone): string {
  switch (tone) {
    case "red":
      return "bg-red-500";
    case "amber":
      return "bg-amber-400";
    default:
      return "bg-orange-500";
  }
}

interface Props {
  guardrails: Guardrail[];
  pendingApprovalCount: number;
  tier3InitiativeName?: string;
  tier3ActiveCount?: number;
}

/**
 * CXO Action Items — four executive lines aligned with the Control Plane reference,
 * using live metrics (coverage %, pending approvals, Tier 3 counts).
 */
export function CxoActionItemsCard({
  guardrails,
  pendingApprovalCount,
  tier3InitiativeName = "Contract Intelligence Engine",
  tier3ActiveCount = 3,
}: Props) {
  const coverage = guardrailCoveragePct(guardrails);

  const lines: { tone: DotTone; text: string }[] = [
    {
      tone: "red",
      text: `Tier 3 initiative '${tier3InitiativeName}' missing executive approval sign-off.`,
    },
    {
      tone: "red",
      text: `${tier3ActiveCount} active Tier 3 initiatives have not completed quarterly governance review.`,
    },
    {
      tone: "amber",
      text: `${pendingApprovalCount} initiative(s) awaiting governance review or approval.`,
    },
    {
      tone: "orange",
      text: `Risk assessment coverage at ${coverage ?? 58}% — below 80% threshold.`,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">CXO Action Items</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {lines.map((row, i) => (
          <li key={i} className="flex gap-3 text-sm leading-snug text-gray-700 dark:text-gray-300">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotClass(row.tone)}`}
              aria-hidden
            />
            <span>{row.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
