"use client";

import { useEffect, useState } from "react";
import { MaturityDomain } from "../types/maturity";
import { MaturitySummary } from "../types/dashboard";
import { maturityService } from "../services/maturityService";
import { DomainAccordion } from "../components/maturity/DomainAccordion";
import { NewAssessmentModal } from "../components/maturity/NewAssessmentModal";
import { MaturityRadarChart } from "../components/dashboard/MaturityRadarChart";
import { Plus, Loader2, Award } from "lucide-react";

export default function MaturityPage() {
  const [domains, setDomains] = useState<MaturityDomain[]>([]);
  const [summary, setSummary] = useState<MaturitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [domData, sumData] = await Promise.all([
        maturityService.getDomains(),
        maturityService.getSummary()
      ]);
      setDomains(domData);
      setSummary(sumData);
    } catch (err) {
      console.error(err);
      setError("Failed to load maturity rubrics.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentSuccess = () => {
    // Reload the page data to fetch the new scores!
    loadData();
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Maturity Hub</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Assess and monitor your enterprise AI capabilities across 5 strategic domains.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Run Assessment
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Radar Chart & High-Level Score */}
        <div className="xl:col-span-1 flex flex-col space-y-6">
          
          {summary && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex items-center shadow-sm">
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mr-5 border border-emerald-200 dark:border-emerald-800/50">
                <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">Current Level</p>
                <div className="flex items-baseline mt-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{summary.overall_score.toFixed(1)}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-500 ml-2">/ 5.0</span>
                </div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">Level {summary.level}</p>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-[400px]">
             {summary ? (
               <MaturityRadarChart domainScores={summary.domain_scores} />
             ) : (
               <div className="h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center p-6">
                 <p className="text-gray-500 text-sm">Submit an assessment to generate radar.</p>
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Detailed Accordion Rubrics */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Domain Competency Rubrics</h3>
          {domains.map((domain) => (
            <DomainAccordion key={domain.id} domain={domain} />
          ))}
        </div>

      </div>

      {/* Modals */}
      <NewAssessmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleAssessmentSuccess}
        domains={domains}
      />

    </div>
  );
}
