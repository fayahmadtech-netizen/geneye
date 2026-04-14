import { GovernanceAlertRead } from "../../types/governance";
import { AlertTriangle, AlertOctagon, Info } from "lucide-react";

interface Props {
  alert: GovernanceAlertRead;
}

export function AlertBanner({ alert }: Props) {
  const isCritical = alert.severity.toLowerCase() === "critical";
  const isHigh = alert.severity.toLowerCase() === "high";

  let styles = "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300";
  let Icon = Info;

  if (isCritical) {
    styles = "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300";
    Icon = AlertOctagon;
  } else if (isHigh) {
    styles = "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300";
    Icon = AlertTriangle;
  }

  return (
    <div className={`flex items-start p-4 border rounded-xl mb-6 shadow-sm ${styles}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="ml-3 flex-1 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">
            {alert.severity} Governance Alert
          </h3>
          <div className="text-sm">
            <p>{alert.message}</p>
          </div>
        </div>
        <div className="shrink-0 ml-4">
          <button className="text-sm font-medium hover:underline opacity-80">
            Review Details &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
