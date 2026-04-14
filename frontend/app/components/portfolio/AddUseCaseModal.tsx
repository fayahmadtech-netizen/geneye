import { useState } from "react";
import { UseCaseCreate, UseCase } from "../../types/portfolio";
import { portfolioService } from "../../services/portfolioService";
import { X, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUseCase: UseCase) => void;
}

export function AddUseCaseModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<UseCaseCreate>({
    name: "",
    domain: "Supply Chain",
    description: "",
    status: "Intake",
    risk_score: 50,
    value_score: 50,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await portfolioService.createUseCase(formData);
      onSuccess(result);
      
      // Reset form
      setFormData({
        name: "",
        domain: "Supply Chain",
        description: "",
        status: "Intake",
        risk_score: 50,
        value_score: 50,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create use case. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Intake New AI Initiative</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="useCaseForm" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initiative Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Autonomous Quality Control"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domain</label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                >
                  <option>Supply Chain</option>
                  <option>HR & Legal</option>
                  <option>R&D / Engineering</option>
                  <option>Customer Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Intake</option>
                  <option>Pilot</option>
                  <option>Production</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of the business case..."
              />
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Implementation Risk</span>
                  <span className="text-red-500">{formData.risk_score}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-red-500"
                  value={formData.risk_score}
                  onChange={(e) => setFormData({ ...formData, risk_score: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <span>Strategic Value</span>
                  <span className="text-emerald-500">{formData.value_score}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-500"
                  value={formData.value_score}
                  onChange={(e) => setFormData({ ...formData, value_score: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3 bg-gray-50 dark:bg-gray-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="useCaseForm"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-colors flex items-center disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Save Initiative" }
          </button>
        </div>

      </div>
    </div>
  );
}
