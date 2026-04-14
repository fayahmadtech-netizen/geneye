"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./layout/Sidebar";
import { Topbar } from "./layout/Topbar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="flex-1 w-full bg-gray-50 dark:bg-gray-950 transition-colors">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-950/50 p-6 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}
