"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import type { ReadinessExportFormat } from "./readinessExportBus";

const items: { id: ReadinessExportFormat; label: string; Icon: typeof FileText }[] = [
  { id: "pdf", label: "Download PDF", Icon: FileText },
  { id: "xlsx", label: "Download Excel", Icon: FileSpreadsheet },
  { id: "json", label: "Download JSON", Icon: FileJson },
];

export function ReadinessExportMenu({
  onChoose,
  disabled,
  variant = "card",
}: {
  onChoose: (format: ReadinessExportFormat) => void;
  disabled?: boolean;
  variant?: "card" | "topbar";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const baseBtn =
    variant === "topbar"
      ? "inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
      : "inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800";

  const menuClass =
    variant === "topbar"
      ? "absolute right-0 z-50 mt-1 min-w-[11rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
      : "absolute right-0 z-50 mt-1 min-w-[12rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={baseBtn}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Download className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
        <span className={variant === "topbar" ? "hidden sm:inline" : undefined}>Export</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
      </button>
      {open && (
        <ul className={menuClass} role="menu">
          {items.map(({ id, label, Icon }) => (
            <li key={id} role="none">
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => {
                  setOpen(false);
                  onChoose(id);
                }}
              >
                <Icon className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
