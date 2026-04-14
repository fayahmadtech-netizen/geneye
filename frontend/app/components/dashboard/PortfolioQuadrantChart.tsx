"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceArea
} from "recharts";
import { QuadrantPoint } from "../../types/dashboard";

interface Props {
  data: QuadrantPoint[];
}

export function PortfolioQuadrantChart({ data }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-96 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>;

  const isDark = theme === "dark";
  const axisColor = isDark ? "#4B5563" : "#D1D5DB"; // Gray-600 vs Gray-300
  const textColor = isDark ? "#9CA3AF" : "#6B7280"; // Gray-400 vs Gray-500
  
  // Custom tooltip to show Portfolio Use Case details
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded shadow-lg transition-colors">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{data.status}</p>
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <p>Risk score: {data.x}</p>
            <p>Value score: {data.y}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
        AI Portfolio Prioritization Matrix
      </h3>
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid stroke={axisColor} strokeDasharray="3 3" opacity={isDark ? 0.2 : 0.6} />
            
            <XAxis
              type="number"
              dataKey="x"
              name="Risk score"
              domain={[0, 100]}
              stroke={axisColor}
              tick={{ fill: textColor }}
              label={{ value: "Risk score →", position: "bottom", fill: textColor, fontSize: 12 }}
            />

            <YAxis
              type="number"
              dataKey="y"
              name="Value score"
              domain={[0, 100]}
              stroke={axisColor}
              tick={{ fill: textColor }}
              label={{ value: "← Value score", angle: -90, position: "left", fill: textColor, fontSize: 12 }}
            />
            
            <ZAxis type="number" range={[100, 400]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
            
            {/* Quadrant Backgrounds (Optional subtle coloring) */}
            <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill={isDark ? "#065f46" : "#d1fae5"} fillOpacity={0.1} /> {/* Low Risk, High Value (Do Now) */}
            <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill={isDark ? "#991b1b" : "#fee2e2"} fillOpacity={0.05} /> {/* High Risk, Low Value (Avoid) */}

            <Scatter 
              name="Use Cases" 
              data={data} 
              fill={isDark ? "#60A5FA" : "#3B82F6"} // Blue-400 dark / Blue-500 light
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
