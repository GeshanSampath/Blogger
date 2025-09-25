import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
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

  return (
    <nav className="bg-[#1a1a2e] text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">
        <Link to="/">Bloger</Link>
      </div>
      <ul className="flex space-x-4">
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

        {loggedIn && role === "super_admin" && (
          <li>
            <Link to="/Admin/AdminLayout">Dashboard</Link>
          </li>
        )}
        {loggedIn && role === "author" && (
          <li>
            <Link to="/dashboard/author">Dashboard</Link>
          </li>
        )}

        {loggedIn ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
