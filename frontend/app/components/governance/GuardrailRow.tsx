import { GuardrailRead } from "../../types/governance";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface Props {
  guardrail: GuardrailRead;
}

export function GuardrailRow({ guardrail }: Props) {
  // Coerce backend bool-variants
  const active = guardrail.is_active === true || guardrail.is_active === "True" || guardrail.is_active === "true";

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-lg transition-colors hover:shadow-sm">
      <div className="flex items-start flex-1 min-w-0">
        <div className={`p-2 rounded-lg mr-4 mt-0.5 shrink-0 ${active ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-gray-100 dark:bg-gray-900"}`}>
          {active ? (
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ShieldAlert className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </div>
        <div className="pr-4 min-w-0 flex flex-col justify-center">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{guardrail.name}</h4>
          {guardrail.config && Object.keys(guardrail.config).length > 0 && (
             <span className="text-xs text-gray-500 font-mono mt-1 truncate">
               {JSON.stringify(guardrail.config)}
             </span>
          )}
        </div>
      </div>
      
      {/* Toggle UI */}
      <div className="shrink-0 flex items-center ml-4">
        <span className={`text-xs font-medium mr-3 ${active ? "text-emerald-500" : "text-gray-400"}`}>
          {active ? "Active" : "Bypassed"}
        </span>
        <button 
          role="switch"
          aria-checked={active}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
            active ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              active ? "translate-x-6" : "translate-x-1"
            }`} 
          />
        </button>
      </div>
    </div>
  );
}
