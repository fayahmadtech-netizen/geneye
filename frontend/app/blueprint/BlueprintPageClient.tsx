"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Download, Factory, Gem, Settings } from "lucide-react";
import {
  KEY_BLOCKS,
  SECTION_DETAILS,
  type BlueprintSectionId,
  type KeyBlock,
} from "./blueprintContent";
import { OrgDesignSection } from "./OrgDesignSection";
import { ParcFrameworkSection } from "./ParcFrameworkSection";

function BlockButton({
  block,
  active,
  onSelect,
}: {
  block: KeyBlock;
  active: BlueprintSectionId;
  onSelect: (id: BlueprintSectionId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(block.id)}
      className={`flex min-h-[100px] flex-col rounded-xl px-3 py-3 text-left text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
        active === block.id ? "ring-2 ring-white ring-offset-2" : "hover:brightness-110"
      } ${block.bgClass}`}
    >
      <span className="text-sm font-bold leading-tight">{block.title}</span>
      <span className="mt-1 text-[11px] font-medium leading-snug text-white/90">{block.subtitle}</span>
    </button>
  );
}

function DetailIcon({ kind }: { kind: "factory" | "gear" | "diamond" }) {
  const cls = "h-5 w-5 shrink-0 text-gray-600 dark:text-gray-400";
  if (kind === "factory") return <Factory className={cls} aria-hidden />;
  if (kind === "gear") return <Settings className={cls} aria-hidden />;
  return <Gem className={cls} aria-hidden />;
}

export function BlueprintPageClient() {
  const [active, setActive] = useState<BlueprintSectionId>("strategy");
  const detail = SECTION_DETAILS[active];

  const lastUpdated = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date());
  }, []);

  const exportBlueprint = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            section: active,
            ...detail,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-org-blueprint-${active}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const vision = KEY_BLOCKS[0];
  const value = KEY_BLOCKS[1];
  const strategy = KEY_BLOCKS[2];
  const governance = KEY_BLOCKS[3];
  const adoption = KEY_BLOCKS[4];

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Org Blueprint</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enterprise operating model for AI — from vision to measured value.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left — KEY BLUEPRINT */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Key blueprint
            </h2>

            <div className="mt-4 space-y-3">
              {[
                [vision, strategy],
                [value, governance],
              ].map((pair, rowIdx) => (
                <div
                  key={rowIdx}
                  className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-3"
                >
                  <BlockButton block={pair[0]} active={active} onSelect={setActive} />
                  <div className="flex items-center justify-center px-0.5" aria-hidden>
                    <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                  </div>
                  <BlockButton block={pair[1]} active={active} onSelect={setActive} />
                </div>
              ))}

              <button
                type="button"
                onClick={() => setActive(adoption.id)}
                className={`w-full rounded-xl px-4 py-4 text-left text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 ${
                  active === adoption.id ? "ring-2 ring-white ring-offset-2" : "hover:brightness-110"
                } ${adoption.bgClass}`}
              >
                <span className="text-sm font-bold">{adoption.title}</span>
                <span className="mt-1 block text-[11px] font-medium text-white/90">{adoption.subtitle}</span>
              </button>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Your Org AI Blueprint</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Vision to Value Measurement Ready</p>
            </div>
          </div>
        </div>

        {/* Right — detail */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{detail.breadcrumb}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{detail.lead}</p>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Three – Pillar Vision</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {detail.pillars.map((p) => (
                  <div
                    key={p.title}
                    className={`rounded-xl border px-3 py-3 ${p.accentClass} dark:bg-opacity-20`}
                  >
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{p.title}</p>
                    <p className="mt-2 text-[11px] leading-snug text-gray-700 dark:text-gray-300">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <ul className="mt-8 space-y-6">
              {detail.details.map((d) => (
                <li key={d.title} className="flex gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <DetailIcon kind={d.icon} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{d.title}</p>
                    <p className="mt-1 text-xs font-medium text-blue-700 dark:text-blue-400">{d.bullet}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {d.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <OrgDesignSection />

      <ParcFrameworkSection />

      <footer className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Enterprise AI operating blueprint — Last updated {lastUpdated}
        </p>
        <button
          type="button"
          onClick={exportBlueprint}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          <Download className="h-4 w-4" />
          Export Blueprint
        </button>
      </footer>
    </div>
  );
}
