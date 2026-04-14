"use client";

import { useEffect, useState } from "react";
import { UseCase } from "../types/portfolio";
import { portfolioService } from "../services/portfolioService";
import { UseCaseTable } from "../components/portfolio/UseCaseTable";
import { AddUseCaseModal } from "../components/portfolio/AddUseCaseModal";
import { Plus, Loader2 } from "lucide-react";

export default function PortfolioPage() {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadUseCases();
  }, []);

  const loadUseCases = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getUseCases();
      setUseCases(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load portfolio initiatives.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (newUseCase: UseCase) => {
    // Optimistic UI update or append
    setUseCases([...useCases, newUseCase]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Portfolio</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your organization's AI initiatives and track value vs risk.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Initiative
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : (
        <UseCaseTable useCases={useCases} />
      )}

      {/* Modals */}
      <AddUseCaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess} 
      />

    </div>
  );
}
