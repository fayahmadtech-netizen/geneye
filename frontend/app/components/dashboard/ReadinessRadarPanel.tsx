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
  Tooltip,
} from "recharts";

import { DomainScore } from "../../types/dashboard";
import { mapMaturityToSixAxisRadar } from "../../lib/dashboardDerived";

interface Props {
  domainScores: DomainScore[];
}

export function ReadinessRadarPanel({ domainScores }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-[420px] w-full animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900" />
    );
  }

  const isDark = theme === "dark";
  const axisColor = isDark ? "#4B5563" : "#D1D5DB";
  const textColor = isDark ? "#9CA3AF" : "#6B7280";

  const sixAxis = mapMaturityToSixAxisRadar(domainScores);
  const data = sixAxis.map((row) => ({
    subject:
      row.subject.length > 22 ? `${row.subject.slice(0, 20)}…` : row.subject,
    A: row.A,
    fullMark: 5,
  }));

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Readiness Profile</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enterprise readiness across 6 strategic dimensions — from AI Diagnostic.
        </p>
      </div>
      <div className="min-h-[320px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="52%" outerRadius="72%" data={data}>
            <PolarGrid stroke={axisColor} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: textColor, fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} stroke={axisColor} tick={{ fill: textColor, fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#111827" : "#FFFFFF",
                borderColor: isDark ? "#374151" : "#E5E7EB",
                color: isDark ? "#F3F4F6" : "#111827",
                borderRadius: "0.5rem",
              }}
            />
            <Radar
              name="Score"
              dataKey="A"
              stroke={isDark ? "#38bdf8" : "#0ea5e9"}
              fill={isDark ? "#0284c7" : "#7dd3fc"}
              fillOpacity={0.45}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
