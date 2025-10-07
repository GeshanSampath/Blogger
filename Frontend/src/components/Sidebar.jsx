// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ role }) {
  const location = useLocation();

  const links = {
    super_admin: [
      { path: "/admin/dashboard", label: "Dashboard" },
      { path: "/admin/pending-authors", label: "Pending Authors" },
      { path: "/admin/manage-blogs", label: "Manage Blogs" },
    ],
    author: [
      { path: "/author/authordashboard", label: "Dashboard" },
      { path: "/author/createblog", label: "Create Blog" },
      { path: "/author/myblogs", label: "My Blogs" }, 
      { path: "/", label: "Home" }, 
    ],
  };

  const currentLinks = links[role] || [];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
        {role === "super_admin" ? "Super Admin Panel" : "Author Panel"}
      </h2>

      <ul className="flex-1 space-y-3">
        {currentLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-3 py-2 rounded-md transition ${
                location.pathname === link.path
                  ? "bg-gray-700 font-semibold text-yellow-300"
                  : "hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/login";
        }}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
      >
        Logout
      </button>
    </div>
  );
}
