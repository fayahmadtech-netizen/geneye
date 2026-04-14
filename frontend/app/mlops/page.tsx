"use client";

import { useEffect, useState } from "react";
import { MlModel, PipelineRun } from "../types/mlops";
import { mlopsService } from "../services/mlopsService";
import { ModelRegistryTable } from "../components/mlops/ModelRegistryTable";
import { MetricCard } from "../components/dashboard/MetricCard";
import { Loader2, Database, Network, GitBranch } from "lucide-react";

export default function MlopsPage() {
  const [models, setModels] = useState<MlModel[]>([]);
  const [pipelines, setPipelines] = useState<PipelineRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMlopsData = async () => {
      try {
        setLoading(true);
        const [modelsData, pipelinesData] = await Promise.all([
          mlopsService.getModels(),
          mlopsService.getPipelines()
        ]);
        setModels(modelsData);
        setPipelines(pipelinesData.runs || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load MLOps overview.");
      } finally {
        setLoading(false);
      }
    };

    loadMlopsData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  // Calculate some summaries
  const championModels = models.filter(m => m.status.toLowerCase() === "champion").length;
  const activePipelines = pipelines.filter(p => p.status.toLowerCase() === "running").length;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MLOps Hub</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Model registry, training historicals, and execution pipeline status.
          </p>
        </div>
      </div>

      {/* Top Value Realization Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
         <MetricCard 
           title="Registered Models" 
           value={models.length} 
           icon={Database} 
         />
         <MetricCard 
           title="Champion ModelsDeployed" 
           value={championModels} 
           icon={GitBranch} 
         />
         <MetricCard 
           title="Active Pipelines" 
           value={activePipelines} 
           icon={Network} 
         />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
          Model Registry
        </h3>
        <ModelRegistryTable models={models} />
      </div>

    </div>
  );
}
