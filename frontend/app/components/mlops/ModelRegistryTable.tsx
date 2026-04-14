import React, { useState } from "react";
import { MlModel } from "../../types/mlops";
import { ChevronDown, ChevronRight, Activity, Cpu, Code2 } from "lucide-react";

interface Props {
  models: MlModel[];
}

export function ModelRegistryTable({ models }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (modelId: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(modelId)) {
      newSet.delete(modelId);
    } else {
      newSet.add(modelId);
    }
    setExpandedRows(newSet);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "champion":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "challenger":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <th className="p-4 w-12"></th>
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model Name</th>
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version</th>
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top Metric</th>
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {models.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No models registered. Run a training pipeline.
                </td>
              </tr>
            ) : (
              models.map((model) => {
                const isExpanded = expandedRows.has(model.id);
                // Grab the first metric key value pair for the column if exists
                const topMetricEntry = model.metrics && Object.keys(model.metrics).length > 0 
                  ? Object.entries(model.metrics)[0] 
                  : null;

                return (
                  <React.Fragment key={model.id}>
                    {/* Main Row */}
                    <tr 
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer ${isExpanded ? "bg-gray-50 dark:bg-gray-800/30" : ""}`}
                      onClick={() => toggleRow(model.id)}
                    >
                      <td className="p-4 text-gray-400">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </td>
                      <td className="p-4 font-bold text-gray-900 dark:text-gray-100 flex items-center">
                        <Cpu className="h-4 w-4 text-indigo-500 mr-2 shrink-0" />
                        {model.name}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                        {model.version}
                      </td>
                      <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                        {model.type}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {topMetricEntry ? (
                          <span className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-1 uppercase">{topMetricEntry[0]}:</span> 
                            {topMetricEntry[1]}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadge(model.status)} capitalize`}>
                          {model.status}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Content (Experiments) */}
                    {isExpanded && (
                      <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                        <td colSpan={6} className="p-0">
                          <div className="pl-12 pr-6 py-5">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center mb-3">
                              <Activity className="h-4 w-4 mr-1.5 text-gray-500" />
                              Training Experiments
                            </h4>
                            
                            {model.experiments && model.experiments.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {model.experiments.map(exp => (
                                  <div key={exp.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-semibold text-sm text-gray-900 dark:text-white truncate pr-2">
                                        {exp.experiment_name}
                                      </span>
                                      <span className="inline-flex items-center font-bold text-sm text-emerald-600 dark:text-emerald-400 shrink-0">
                                        {(exp.accuracy * 100).toFixed(1)}% Acc
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-2">
                                      <Code2 className="h-3 w-3 mr-1" />
                                      {new Date(exp.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 p-2 rounded text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                                      {JSON.stringify(exp.parameters)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 p-2 italic">No experiments found for this version.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
