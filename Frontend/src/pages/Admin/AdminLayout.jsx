import React from "react";
import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Super Admin</h1>
        <ul>
          <li className="mb-4">
            <Link to="/admin/pending-authors" className="hover:underline">
              Pending Authors
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-blogs" className="hover:underline">
              Manage Blogs
            </Link>
          </li>
        </ul>
        <button
          className="mt-6 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
