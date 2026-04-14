"use client";

import { useEffect, useState } from "react";
import { RiskInventoryRead, GuardrailRead, GovernanceAlertRead } from "../types/governance";
import { governanceService } from "../services/governanceService";
import { GuardrailRow } from "../components/governance/GuardrailRow";
import { AlertBanner } from "../components/governance/AlertBanner";
import { Loader2, ShieldHalf, LayoutList, Layers } from "lucide-react";

export default function GovernancePage() {
  const [inventory, setInventory] = useState<RiskInventoryRead[]>([]);
  const [guardrails, setGuardrails] = useState<GuardrailRead[]>([]);
  const [alerts, setAlerts] = useState<GovernanceAlertRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [invData, guardData, alertData] = await Promise.all([
          governanceService.getInventory(),
          governanceService.getGuardrails(),
          governanceService.getAlerts()
        ]);
        // Sort tiers so P1 is first
        setInventory(invData.sort((a, b) => a.id.localeCompare(b.id)));
        setGuardrails(guardData);
        setAlerts(alertData);
      } catch (err) {
        console.error(err);
        setError("Failed to load Governance platform data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Governance & Risk</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ensure regulatory compliance, monitor safety guardrails, and track model risk tiers.
          </p>
        </div>
      </div>

      {/* Global Alerts Feed */}
      <div className="w-full">
         {alerts.map(alert => (
           <AlertBanner key={alert.id} alert={alert} />
         ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Risk Inventory */}
        <div className="space-y-4">
           <div className="flex items-center">
             <LayoutList className="h-5 w-5 text-gray-400 mr-2" />
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">Risk Tier Inventory</h2>
           </div>
           
           <div className="space-y-4">
             {inventory.map(tier => (
               <div key={tier.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
                 <div className="flex items-center mb-3">
                   <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded font-bold text-sm tracking-wider mr-3 border border-blue-200 dark:border-blue-800">
                     {tier.id}
                   </div>
                   <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{tier.label}</h3>
                 </div>
                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tier.criteria}</p>
                 
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                   <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center">
                     <Layers className="h-3 w-3 mr-1" />
                     Requirements
                   </h4>
                   <ul className="list-disc pl-5 space-y-1">
                     {tier.requirements.map((req, idx) => (
                       <li key={idx} className="text-xs text-gray-700 dark:text-gray-300">{req}</li>
                     ))}
                   </ul>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right Col: Active Guardrails */}
        <div className="space-y-4">
           <div className="flex items-center">
             <ShieldHalf className="h-5 w-5 text-gray-400 mr-2" />
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">System Guardrails</h2>
           </div>
           
           <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
             {guardrails.map(rail => (
               <GuardrailRow key={rail.id} guardrail={rail} />
             ))}
             {guardrails.length === 0 && (
               <p className="text-sm text-gray-500 p-2 border border-dashed rounded-lg text-center">No active guardrails.</p>
             )}
           </div>
        </div>

      </div>

    </div>
  );
}
