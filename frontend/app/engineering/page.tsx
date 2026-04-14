"use client";

import { useEffect, useState } from "react";
import { EngineeringSystem, AdlcPipelineRun } from "../types/engineering";
import { engineeringService } from "../services/engineeringService";
import { SystemCanvas } from "../components/engineering/SystemCanvas";
import { Loader2, Activity, Play, CheckCircle, XCircle } from "lucide-react";

export default function EngineeringPage() {
  const [system, setSystem] = useState<EngineeringSystem | null>(null);
  const [runs, setRuns] = useState<AdlcPipelineRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEngineeringData = async () => {
      try {
        setLoading(true);
        // Usually, the user would select a system from a list. 
        // For now, we fetch all and grab the first one.
        const systemsList = await engineeringService.getSystems();
        if (systemsList.length > 0) {
          const sysId = systemsList[0].id;
          const [sysData, runData] = await Promise.all([
            engineeringService.getSystem(sysId),
            engineeringService.getPipelineRuns(sysId)
          ]);
          setSystem(sysData);
          setRuns(runData);
        } else {
          setError("No ADLC Engineering Systems found for this organization.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load engineering systems architecture.");
      } finally {
        setLoading(false);
      }
    };

    loadEngineeringData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !system) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
        {error || "System not initialized."}
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Engineering ADLC</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Current System: <span className="font-semibold text-blue-600 dark:text-blue-400">{system.name}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
           <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-800 flex items-center">
             <Activity className="h-4 w-4 mr-2" />
             {system.status}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-[600px]">
        
        {/* Left Column: React Flow Canvas */}
        <div className="xl:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm relative">
           {/* Flow renders absolutely to fill container */}
           <SystemCanvas systemId={system.id} initialNodes={system.nodes} initialEdges={system.edges} />
        </div>

        {/* Right Column: Pipeline Execution History Menu */}
        <div className="xl:col-span-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-3 mb-4 flex items-center">
            <Play className="h-4 w-4 mr-2 text-gray-400" />
            Pipeline Executions
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {runs.length === 0 ? (
               <p className="text-xs text-gray-500">No execution history.</p>
            ) : (
              runs.map((run) => (
                <div key={run.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{run.pipeline_name}</span>
                    {run.status === "Success" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : run.status === "Failed" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <p>Started: {new Date(run.started_at).toLocaleString()}</p>
                    {run.completed_at && <p>Finished: {new Date(run.completed_at).toLocaleString()}</p>}
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg text-sm transition-colors border border-gray-200 dark:border-gray-700">
            Trigger Build Manually
          </button>
        </div>

      </div>
    </div>
  );
}
