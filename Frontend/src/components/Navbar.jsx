import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      setLoggedIn(!!token);
      setRole(userRole);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);

    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setLoggedIn(false);
    setRole(null);
    navigate("/");
    window.dispatchEvent(new Event("storage"));
  };

  // 🧭 Hide navbar for dashboard routes
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/author")) {
    return null;
  }

  return (
    <nav className="bg-[#1a1a2e] text-white p-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link to="/">Blogger</Link>
      </div>

      {/* Menu */}
      <ul className="flex space-x-4 items-center">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/blogs">Blogs</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>

        {/* Role-based links */}
        {loggedIn && role === "super_admin" && (
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
        )}
        {loggedIn && role === "author" && (
          <li>
            <Link to="/author/myblogs">Profile</Link>
          </li>
        )}

        {/* Auth buttons */}
        {loggedIn ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
