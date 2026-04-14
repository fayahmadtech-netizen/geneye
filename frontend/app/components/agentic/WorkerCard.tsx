import { DigitalWorker } from "../../types/agentic";
import { UserCog, Activity, Cpu } from "lucide-react";

interface Props {
  worker: DigitalWorker;
}

export function WorkerCard({ worker }: Props) {
  // Translate efficiency to a color
  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg group-hover:scale-105 transition-transform">
          <UserCog className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex items-center text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
           <Cpu className="h-3 w-3 mr-1" />
           {worker.persona_id}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        {worker.role_label}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Autonomous Digital Worker Persona
      </p>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center uppercase tracking-wide">
            <Activity className="h-3 w-3 mr-1" />
            Efficiency Score
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            {worker.efficiency_score.toFixed(1)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getEfficiencyColor(worker.efficiency_score)} transition-all duration-1000`} 
            style={{ width: `${worker.efficiency_score}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
