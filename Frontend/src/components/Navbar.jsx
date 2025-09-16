import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons
import "../index.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] backdrop-blur-md text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      
      {/* Logo (Top Left) */}
      <Link to="/" className="flex items-center gap-3">
        <img src="/assets/logo.png" alt="Logo" className="h-12 w-12 rounded-full shadow-md hover:scale-105 transition-transform duration-300" />
        <span className="text-2xl font-bold tracking-wide hover:text-[#00adb5] transition-colors duration-300">
          Bloger
        </span>
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-10 text-lg font-medium list-none">
        {["Home", "About", "Blogs", "Contact"].map((item) => (
          <li key={item}>
            <Link
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative hover:text-[#00adb5] transition-colors duration-300 after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#00adb5] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Toggle Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-[72px] left-0 w-full bg-[#1a1a2e]/95 backdrop-blur-md md:hidden shadow-lg">
          <ul className="flex flex-col items-center gap-6 py-6 text-lg font-medium">
            {["Home", "About", "Blogs", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="hover:text-[#00adb5] transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
