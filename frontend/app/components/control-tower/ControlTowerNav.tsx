"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/control-tower", label: "Dashboard" },
  { href: "/control-tower/governance", label: "Governance & Risk" },
  { href: "/control-tower/portfolio", label: "Portfolio & Capital" },
  { href: "/control-tower/maturity", label: "Maturity" },
] as const;

export function ControlTowerNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
      {tabs.map((tab) => {
        const active =
          tab.href === "/control-tower"
            ? pathname === "/control-tower"
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
