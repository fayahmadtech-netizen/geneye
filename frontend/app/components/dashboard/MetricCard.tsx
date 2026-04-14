import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function MetricCard({ title, value, icon: Icon, trend, trendUp }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
                {trend && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {trend}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
