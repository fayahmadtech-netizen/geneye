interface StrategicPostureCardProps {
  category: string;
  avgValueScore: number;
  highRiskTier3Pct: number;
  scaleConversionPct: number;
}

export function StrategicPostureCard({
  category,
  avgValueScore,
  highRiskTier3Pct,
  scaleConversionPct,
}: StrategicPostureCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">Strategic Posture</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800">
          <dt className="text-gray-500 dark:text-gray-400">Risk &amp; Value Category</dt>
          <dd className="max-w-[55%] text-right font-medium text-gray-900 dark:text-white">{category}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800">
          <dt className="text-gray-500 dark:text-gray-400">Avg. Value Score</dt>
          <dd className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
            {avgValueScore} / 100
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3 dark:border-gray-800">
          <dt className="text-gray-500 dark:text-gray-400">High-Risk exposure</dt>
          <dd className="text-right font-medium text-gray-900 dark:text-white">
            {highRiskTier3Pct}% of initiatives (risk score ≥ 70)
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-500 dark:text-gray-400">Scale Conversion</dt>
          <dd className="text-right font-medium text-gray-900 dark:text-white">
            {scaleConversionPct}% in Production or Scaling
          </dd>
        </div>
      </dl>
    </div>
  );
}
