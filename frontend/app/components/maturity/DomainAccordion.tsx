import { useState } from "react";
import { MaturityDomain } from "../../types/maturity";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface Props {
  domain: MaturityDomain;
}

export function DomainAccordion({ domain }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
      >
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{domain.label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{domain.description}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
          {domain.criteria.length === 0 ? (
            <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              Rubric not yet defined by administration.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {domain.criteria.map((crt) => (
                <li key={crt.id} className="py-3 flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{crt.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{crt.description}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg ml-4 whitespace-nowrap">
                    Wt: {crt.weight}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
