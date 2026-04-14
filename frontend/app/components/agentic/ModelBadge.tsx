import { LlmModel } from "../../types/agentic";
import { BrainCircuit } from "lucide-react";

interface Props {
  model: LlmModel;
}

export function ModelBadge({ model }: Props) {
  return (
    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg shrink-0">
      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded mr-3">
        <BrainCircuit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">{model.id}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{model.provider}</p>
      </div>
    </div>
  );
}
