"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { portfolioService } from "../../services/portfolioService";
import { UseCaseDetail } from "../../types/portfolio";

export default function PortfolioUseCaseDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
  const [row, setRow] = useState<UseCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await portfolioService.getUseCaseById(id);
        if (!cancelled) setRow(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Could not load this initiative.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !row) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        {error || "Not found"}
        <div className="mt-4">
          <Link
            href="/portfolio"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const snaps = row.financial_snapshots ?? [];
  const latest = snaps.length > 0 ? snaps[snaps.length - 1] : null;

  return (
    <div className="space-y-6">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to portfolio
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{row.name}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {row.business_unit} · Owner: {row.owner} · {row.status}
        </p>
        {row.business_objective ? (
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{row.business_objective}</p>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <p className="text-xs font-medium uppercase text-gray-500">Risk score</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {row.risk_score}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <p className="text-xs font-medium uppercase text-gray-500">Value score</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {row.value_score}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
            <p className="text-xs font-medium uppercase text-gray-500">Priority</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {row.priority_score}
            </p>
          </div>
        </div>

        {latest ? (
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Latest financial snapshot
            </h2>
            <p className="mt-1 text-sm text-gray-500">{latest.snapshot_quarter}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-gray-500">Realized (K)</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {latest.realized_value_k}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Projected (K)</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {latest.projected_value_k}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">ROI %</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {latest.roi_pct ?? "—"}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  );
}
