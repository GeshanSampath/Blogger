// src/layouts/AuthorLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";

export default function AuthorLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed width, full height */}
      <aside className="w-64 h-screen fixed top-0 left-0 bg-[#1f2937] text-white shadow-lg">
             <Sidebar role="author" />
           </aside>
   {/* Main content scrolls independently */}
      <main className="flex-1 ml-64 bg-gray-100 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
