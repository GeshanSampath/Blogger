import React from "react";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixed with full height */}
      <aside className="w-64 h-screen fixed top-0 left-0 bg-[#1f2937] text-white shadow-lg">
        <Sidebar role="super_admin" />
      </aside>

      {/* Main content scrolls independently */}
      <main className="flex-1 ml-64 bg-gray-100 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
