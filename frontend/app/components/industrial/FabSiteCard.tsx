import { FabSite } from "../../types/industrial";
import { Factory, Activity, AlertTriangle } from "lucide-react";

interface Props {
  site: FabSite;
}

export function FabSiteCard({ site }: Props) {
  // Determine latest metric if exists
  const latestYield = site.metrics && site.metrics.length > 0 
    ? site.metrics[site.metrics.length - 1].value 
    : 0;

  const isOperational = site.status === "active";
  const isWarning = latestYield < 90.0 || site.status === "warning" || site.status === "degraded";

  const siteName = site.id.charAt(0).toUpperCase() + site.id.slice(1);

  return (
    <div className={`relative bg-white dark:bg-gray-900 rounded-xl border p-5 transition-all
      ${isWarning 
        ? "border-amber-400/50 dark:border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]" 
        : "border-gray-200 dark:border-gray-800 shadow-sm"
      }
    `}>
      {/* Status Pulse Indicator */}
      <div className="absolute top-5 right-5 flex items-center">
        <span className="relative flex h-3 w-3">
          {isOperational && !isWarning && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-3 w-3 ${
            isWarning ? "bg-amber-500" : isOperational ? "bg-emerald-500" : "bg-gray-400"
          }`}></span>
        </span>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-lg ${isWarning ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-50 dark:bg-blue-900/40"}`}>
          <Factory className={`h-6 w-6 ${isWarning ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{siteName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Flag: {site.location_flag}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Yield</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-3xl font-bold ${isWarning ? "text-amber-600 dark:text-amber-500" : "text-gray-900 dark:text-white"}`}>
                {latestYield.toFixed(1)}%
              </span>
              {isWarning && <AlertTriangle className="h-4 w-4 text-amber-500" />}
            </div>
          </div>
          <div className="flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 capitalize">
            <Activity className="h-3 w-3 mr-1" />
            {site.status}
          </div>
        </div>
      </div>
    </div>
  );
}
