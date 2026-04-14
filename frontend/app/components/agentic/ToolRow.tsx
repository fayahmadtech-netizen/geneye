import { AgentTool } from "../../types/agentic";
import { Wrench } from "lucide-react";

interface Props {
  tool: AgentTool;
}

export function ToolRow({ tool }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg transition-colors hover:shadow-sm">
      <div className="flex items-start flex-1 min-w-0">
        <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg mr-4 mt-0.5 shrink-0">
          <Wrench className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <div className="pr-4 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{tool.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
        </div>
      </div>
      
      {/* Toggle UI */}
      <div className="shrink-0 flex items-center ml-4">
        <span className={`text-xs font-medium mr-3 ${tool.is_enabled ? "text-emerald-500" : "text-gray-400"}`}>
          {tool.is_enabled ? "Enabled" : "Disabled"}
        </span>
        <button 
          role="switch"
          aria-checked={tool.is_enabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
            tool.is_enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              tool.is_enabled ? "translate-x-6" : "translate-x-1"
            }`} 
          />
        </button>
      </div>
    </div>
  );
}
