import { useState } from "react";
import { MaturityDomain, ScoreInput } from "../../types/maturity";
import { maturityService } from "../../services/maturityService";
import { X, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  domains: MaturityDomain[];
}

export function NewAssessmentModal({ isOpen, onClose, onSuccess, domains }: Props) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Flatten criteria for the UI form
  const allCriteria = domains.flatMap(d => d.criteria);

  const handleScoreChange = (criterionId: string, value: number) => {
    setScores(prev => ({ ...prev, [criterionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Build the payload
    const scorePayload: ScoreInput[] = allCriteria.map(crt => ({
      criterion_id: crt.id,
      score: scores[crt.id] || 1, // Default to 1 if untouched
    }));

    try {
      await maturityService.submitAssessment({ scores: scorePayload });
      onSuccess();
      setScores({}); // Reset
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe checks if administration hasn't defined rubrics
  if (allCriteria.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center">
          <p className="text-gray-900 dark:text-gray-100 font-medium mb-4">No Rubric Defined.</p>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Run Maturity Assessment</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rate your organization's current state from 1 (Novice) to 5 (Leader).</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="assessmentForm" onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            {domains.map((domain) => {
              if (domain.criteria.length === 0) return null;
              
              return (
                <div key={domain.id} className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2">
                    {domain.label}
                  </h3>
                  
                  {domain.criteria.map(crt => (
                    <div key={crt.id} className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800/50">
                      <label className="flex flex-col mb-3">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{crt.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{crt.description}</span>
                      </label>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium text-gray-400 w-16">Novice</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500 mx-4"
                          value={scores[crt.id] || 1}
                          onChange={(e) => handleScoreChange(crt.id, parseInt(e.target.value))}
                        />
                        <span className="text-xs font-medium text-blue-500 w-16 text-right font-bold text-lg">
                          {scores[crt.id] || 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3 bg-white dark:bg-gray-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="assessmentForm"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-colors flex items-center disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Save Assessment Scores" }
          </button>
        </div>

      </div>
    </div>
  );
}
