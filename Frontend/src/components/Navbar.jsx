import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      className={`fixed top-0 left-0 w-full z-50 shadow-lg transition-all duration-300 ${
        scrolled ? "bg-gray-900 text-white shadow-2xl" : "bg-blue-800 text-white"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wider drop-shadow-lg">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Blogger
          </Link>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Menu (Desktop + Mobile Dropdown) */}
        <ul
          className={`md:flex md:space-x-6 items-center font-medium absolute md:static bg-gray-800 md:bg-transparent left-0 w-full md:w-auto text-center md:text-left transition-all duration-300 ease-in-out ${
            menuOpen ? "top-16 opacity-100" : "top-[-400px] opacity-0 md:opacity-100"
          }`}
        >
          <li className="py-2 md:py-0">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-yellow-300 transition-colors duration-300"
            >
              Home
            </Link>
          </li>
          <li className="py-2 md:py-0">
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-yellow-300 transition-colors duration-300"
            >
              About
            </Link>
          </li>
          <li className="py-2 md:py-0">
            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-yellow-300 transition-colors duration-300"
            >
              Blogs
            </Link>
          </li>
          <li className="py-2 md:py-0">
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-yellow-300 transition-colors duration-300"
            >
              Contact
            </Link>
          </li>

          {/* Role-based links */}
          {loggedIn && role === "super_admin" && (
            <li className="py-2 md:py-0">
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-yellow-300 transition-colors duration-300"
              >
                Dashboard
              </Link>
            </li>
          )}
          {loggedIn && role === "author" && (
            <li className="py-2 md:py-0">
              <Link
                to="/author/authordashboard"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-yellow-300 transition-colors duration-300"
              >
                Profile
              </Link>
            </li>
          )}

          {/* Auth Buttons */}
          {loggedIn ? (
            <li className="py-2 md:py-0">
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg font-semibold transition-colors duration-300 shadow-md"
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="py-2 md:py-0">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-lg font-semibold transition-colors duration-300 shadow-md"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}