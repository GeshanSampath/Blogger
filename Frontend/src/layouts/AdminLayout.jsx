// src/layouts/AdminLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="super_admin" />
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
