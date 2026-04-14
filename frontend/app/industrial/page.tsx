"use client";

import { useEffect, useState } from "react";
import { FabSite, SiliconIpBlock, PhysicalAiOutcome } from "../types/industrial";
import { industrialService } from "../services/industrialService";
import { FabSiteCard } from "../components/industrial/FabSiteCard";
import { IpBlockCard } from "../components/industrial/IpBlockCard";
import { MetricCard } from "../components/dashboard/MetricCard";
import { Loader2, Zap, ArrowDownToLine, Factory } from "lucide-react";

export default function IndustrialPage() {
  const [sites, setSites] = useState<FabSite[]>([]);
  const [ipBlocks, setIpBlocks] = useState<SiliconIpBlock[]>([]);
  const [outcomes, setOutcomes] = useState<PhysicalAiOutcome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIndustrialData = async () => {
      try {
        setLoading(true);
        const [sitesData, ipData, outcomesData] = await Promise.all([
          industrialService.getSites(),
          industrialService.getIpBlocks(),
          industrialService.getOutcomes()
        ]);
        setSites(sitesData);
        setIpBlocks(ipData);
        setOutcomes(outcomesData);
      } catch (err) {
        console.error(err);
        setError("Failed to load Industrial AI monitoring data.");
      } finally {
        setLoading(false);
      }
    };

    loadIndustrialData();
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

  // Derive some top level metrics from outcomes for the top summary cards
  const yieldOutcome = outcomes.find(o => o.metric_name.toLowerCase().includes("yield"));
  const defectOutcome = outcomes.find(o => o.metric_name.toLowerCase().includes("defect") || o.metric_name.toLowerCase().includes("quality"));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Industrial AI Operations</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor Global Fab execution and browse AI-generated Silicon IP libraries.
          </p>
        </div>
      </div>

      {/* Top Value Realization Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {yieldOutcome ? (
          <MetricCard
            title={yieldOutcome.metric_name}
            value={yieldOutcome.current_value}
            icon={Factory}
            trend={`from ${yieldOutcome.baseline}`}
            trendUp={true}
          />
        ) : (
          <MetricCard title="Avg. Fab Yield" value="94.5%" icon={Factory} />
        )}
        
        {defectOutcome ? (
          <MetricCard
            title={defectOutcome.metric_name}
            value={defectOutcome.current_value}
            icon={ArrowDownToLine}
            trend={`from ${defectOutcome.baseline}`}
            trendUp={true}
          />
        ) : (
          <MetricCard title="Defect Rate" value="1.2%" icon={ArrowDownToLine} />
        )}

        <MetricCard
          title="Silicon IP Blocks"
          value={ipBlocks.length}
          icon={Zap}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Fab Sites */}
        <div className="xl:col-span-1 space-y-4 flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
            Global Fab Health
          </h3>
          <div className="space-y-4">
            {sites.map(site => (
              <FabSiteCard key={site.id} site={site} />
            ))}
            {sites.length === 0 && <p className="text-sm text-gray-500">No factory sites registered.</p>}
          </div>
        </div>

        {/* Right Column: Silicon IP Catalog */}
        <div className="xl:col-span-2 space-y-4 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center mb-1">
              Silicon IP Catalog
            </h3>
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-full font-medium">
              {ipBlocks.filter(b => b.items?.some(i => i.point.toLowerCase().includes("ai") || i.point.toLowerCase().includes("generative"))).length} AI-Generated
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ipBlocks.map(block => (
              <IpBlockCard key={block.id} block={block} />
            ))}
            {ipBlocks.length === 0 && <p className="text-sm text-gray-500">No IP Blocks in library.</p>}
          </div>
        </div>
      </div>

    </div>
  );
}
