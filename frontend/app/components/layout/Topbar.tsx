"use client";

import { useAuth } from "../../hooks/useAuth";
import {
  Bell,
  Calendar,
  ChevronDown,
  Download,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getHeaderMeta, initialsFromName } from "./headerMeta";
import { triggerReadinessExport } from "../../readiness/readinessExportBus";
import { ReadinessExportMenu } from "../../readiness/ReadinessExportMenu";

export function Topbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { title, subtitle } = getHeaderMeta(pathname);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user ? initialsFromName(user.full_name) : "PL";

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex min-h-[4.5rem] items-center justify-between gap-4 px-6 py-2.5 lg:gap-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold tracking-tight text-gray-900 dark:text-white lg:text-xl">
            {title}
          </h1>
          <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-haspopup="listbox"
          >
            GF
            <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Calendar className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
            <span className="whitespace-nowrap">FY 2025–2026</span>
          </button>

          {pathname.startsWith("/readiness") ? (
            <ReadinessExportMenu
              variant="topbar"
              onChoose={(format) => triggerReadinessExport(format)}
            />
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Export"
            >
              <Download className="h-4 w-4 text-gray-500" aria-hidden />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" aria-hidden />

          <button
            type="button"
            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" aria-hidden />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
          </button>

          <div className="relative pl-1" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm ring-2 ring-white transition hover:bg-blue-700 dark:ring-gray-950"
              aria-expanded={accountOpen}
              aria-haspopup="true"
            >
              {initials}
            </button>
            {accountOpen && (
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                {user ? (
                  <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user.full_name}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                ) : null}
                {mounted && (
                  <button
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                  </button>
                )}
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
