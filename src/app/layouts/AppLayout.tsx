/** @format */

import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onMenuClick={() => setMobileSidebarOpen(true)} />

      <div className="flex min-h-[calc(100vh-4rem)] items-stretch">
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
