"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import { DomainScore } from "../../types/dashboard";

interface Props {
  domainScores: DomainScore[];
}

export function MaturityRadarChart({ domainScores }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-96 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>;

  const isDark = theme === "dark";
  const axisColor = isDark ? "#4B5563" : "#D1D5DB";
  const textColor = isDark ? "#9CA3AF" : "#6B7280";

  // Transform object to Recharts array format
  const data = domainScores.map((ds) => ({
    subject: ds.label,
    A: ds.score,
    fullMark: 5,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors h-full flex flex-col items-center">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 self-start w-full">
        Enterprise AI Maturity
      </h3>
      <div className="flex-1 w-full mt-4" style={{ minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke={axisColor} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: textColor, fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} stroke={axisColor} tick={{ fill: textColor }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? "#111827" : "#FFFFFF", 
                borderColor: isDark ? "#374151" : "#E5E7EB",
                color: isDark ? "#F3F4F6" : "#111827"
              }} 
            />
            <Radar
              name="Maturity Score"
              dataKey="A"
              stroke={isDark ? "#34d399" : "#10b981"} // Emerald-400 dark vs Emerald-500 light
              fill={isDark ? "#059669" : "#34d399"}
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
