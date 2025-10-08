import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setLoggedIn(false);
    setRole(null);
    navigate("/");
    window.dispatchEvent(new Event("storage"));
  };

  // Hide navbar for dashboard routes
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/author")) return null;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center shadow-lg transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl"
          : "bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white"
      }`}
    >
      {/* Logo */}
      <div className="text-2xl font-extrabold tracking-wider drop-shadow-lg">
        <Link to="/">Blogger</Link>
      </div>

      {/* Menu */}
      <ul className="flex space-x-6 items-center font-medium">
        <li>
          <Link
            to="/"
            className={`hover:text-yellow-300 transition-colors duration-300 ${
              scrolled ? "hover:text-yellow-400" : ""
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className={`hover:text-yellow-300 transition-colors duration-300 ${
              scrolled ? "hover:text-yellow-400" : ""
            }`}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/blogs"
            className={`hover:text-yellow-300 transition-colors duration-300 ${
              scrolled ? "hover:text-yellow-400" : ""
            }`}
          >
            Blogs
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className={`hover:text-yellow-300 transition-colors duration-300 ${
              scrolled ? "hover:text-yellow-400" : ""
            }`}
          >
            Contact
          </Link>
        </li>

        {/* Role-based links */}
        {loggedIn && role === "super_admin" && (
          <li>
            <Link
              to="/admin/dashboard"
              className="hover:text-yellow-300 transition-colors duration-300"
            >
              Dashboard
            </Link>
          </li>
        )}
        {loggedIn && role === "author" && (
          <li>
            <Link
              to="/author/authordashboard"
              className="hover:text-yellow-300 transition-colors duration-300"
            >
              Profile
            </Link>
          </li>
        )}

        {/* Auth buttons */}
        {loggedIn ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg font-semibold transition-colors duration-300 shadow-md"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              className="bg-green-400 hover:bg-green-500 px-4 py-1 rounded-lg font-semibold transition-colors duration-300 shadow-md"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
