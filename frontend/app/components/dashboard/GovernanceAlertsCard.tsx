import { GovernanceAlert } from "../../types/dashboard";

function severityDot(severity: string): string {
  const s = severity.toLowerCase();
  if (s === "critical" || s === "high") return "bg-red-500";
  if (s === "medium") return "bg-orange-500";
  return "bg-amber-400";
}

interface Props {
  alerts: GovernanceAlert[];
}

export function GovernanceAlertsCard({ alerts }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Governance alerts</h3>
      {alerts.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No open governance alerts.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {alerts.map((a) => (
            <li key={a.id} className="flex gap-3 text-sm leading-snug text-gray-700 dark:text-gray-300">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot(a.severity)}`}
                aria-hidden
              />
              <span>
                <span className="font-medium text-gray-800 dark:text-gray-200">[{a.severity}]</span>{" "}
                {a.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
