import { SiliconIpBlock } from "../../types/industrial";
import { Cpu, Zap, Star } from "lucide-react";

interface Props {
  block: SiliconIpBlock;
}

export function IpBlockCard({ block }: Props) {
  // Extract PPA/Process node from "metrics" array if they exist
  const processNodeMetric = block.metrics?.find(m => m.label.toLowerCase().includes("node") || m.label.toLowerCase().includes("process"));
  const ppaMetric = block.metrics?.find(m => m.label.toLowerCase().includes("ppa") || m.label.toLowerCase().includes("power"));
  
  const processNode = processNodeMetric ? processNodeMetric.value : "Standard Cell";
  const ppaScore = ppaMetric ? ppaMetric.value : "A+";

  // Check if AI generated based on items
  const isAIGenerated = block.items?.some(i => i.point.toLowerCase().includes("ai") || i.point.toLowerCase().includes("generative"));

  return (
    <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-md font-bold text-gray-900 dark:text-gray-100">{block.title}</h3>
        </div>
        {isAIGenerated && (
          <span className="flex items-center text-xs font-semibold px-2 py-0.5 rounded text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            AI Gen
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {block.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center">
           <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
             {processNode}
           </span>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-sm font-bold text-gray-900 dark:text-gray-200">{ppaScore}</span>
        </div>
      </div>
    </div>
  );
}
