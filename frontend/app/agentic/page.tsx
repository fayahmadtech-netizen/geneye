"use client";

import { useEffect, useState } from "react";
import { LlmModel, DigitalWorker, AgentTool } from "../types/agentic";
import { agenticService } from "../services/agenticService";
import { WorkerCard } from "../components/agentic/WorkerCard";
import { ToolRow } from "../components/agentic/ToolRow";
import { ModelBadge } from "../components/agentic/ModelBadge";
import { Loader2, Plus, Users, Wrench, Network } from "lucide-react";

export default function AgenticPage() {
  const [workers, setWorkers] = useState<DigitalWorker[]>([]);
  const [tools, setTools] = useState<AgentTool[]>([]);
  const [models, setModels] = useState<LlmModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgenticData = async () => {
      try {
        setLoading(true);
        const [workersData, toolsData, modelsData] = await Promise.all([
          agenticService.getWorkers(),
          agenticService.getTools(),
          agenticService.getModels()
        ]);
        setWorkers(workersData);
        setTools(toolsData);
        setModels(modelsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load Agentic Platform resources.");
      } finally {
        setLoading(false);
      }
    };

    loadAgenticData();
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

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agentic Platform</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Control plane for generative AI operational agents and tool configuration.
          </p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Deploy Persona
        </button>
      </div>

      {/* Top Section: Digital Workers (Highest Priority) */}
      <div className="space-y-4">
        <div className="flex items-center">
           <Users className="h-5 w-5 text-gray-400 mr-2" />
           <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Personas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {workers.map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
          {workers.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full">No active personas deployed yet.</p>
          )}
        </div>
      </div>

      {/* Bottom Section: Split between Tools and LLMs */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Authorized Tools */}
        <div className="xl:col-span-2 space-y-4">
           <div className="flex items-center">
             <Wrench className="h-5 w-5 text-gray-400 mr-2" />
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">Authorized Agent Tools</h2>
           </div>
           <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
             {tools.map(tool => (
               <ToolRow key={tool.id} tool={tool} />
             ))}
             {tools.length === 0 && (
               <p className="text-sm text-gray-500 p-2">No tools authorized.</p>
             )}
           </div>
        </div>

        {/* Right Col: Foundation Models */}
        <div className="xl:col-span-1 space-y-4">
           <div className="flex items-center">
             <Network className="h-5 w-5 text-gray-400 mr-2" />
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">LLM Foundations</h2>
           </div>
           <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
             {models.map(model => (
               <ModelBadge key={model.id} model={model} />
             ))}
             {models.length === 0 && (
               <p className="text-sm text-gray-500 p-2">No models registered in workspace.</p>
             )}
           </div>
        </div>

      </div>

    </div>
  );
}
