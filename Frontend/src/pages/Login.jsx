import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, []);

  // Basic validation
  const validate = () => {
    if (!email || !password) {
      setError("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("role", res.data.role);

      if (onLogin) onLogin();
      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-blue-50 px-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-400 rounded-full blur-3xl opacity-40" />

      {/* Login Card */}
      <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-200">
        {/* Animated Panda */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Panda Head */}
            <div className="w-32 h-32 bg-white rounded-full border-4 border-gray-800 relative">
              {/* Ears */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-gray-800 rounded-full"></div>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gray-800 rounded-full"></div>
              
              {/* Eyes */}
              <div className="absolute top-8 left-6 w-6 h-6 bg-gray-800 rounded-full"></div>
              <div className="absolute top-8 right-6 w-6 h-6 bg-gray-800 rounded-full"></div>
              
              {/* Eye highlights */}
              <div className="absolute top-10 left-7 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-10 right-7 w-2 h-2 bg-white rounded-full"></div>
              
              {/* Nose */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gray-800 rounded-full"></div>
              
              {/* Mouth - Default straight line */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full"></div>
              
              {/* Panda Hands - Animated based on password visibility */}
              <div 
                className={`absolute top-10 left-2 w-8 h-5 bg-gray-800 rounded-full transition-all duration-500 ${showPassword ? 'opacity-0' : 'opacity-100'}`}
                style={{ transform: showPassword ? 'translateX(-10px)' : 'translateX(0)' }}
              ></div>
              <div 
                className={`absolute top-10 right-2 w-8 h-5 bg-gray-800 rounded-full transition-all duration-500 ${showPassword ? 'opacity-0' : 'opacity-100'}`}
                style={{ transform: showPassword ? 'translateX(10px)' : 'translateX(0)' }}
              ></div>
              
              {/* Smile - Appears when password is visible */}
              <div 
                className={`absolute top-20 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${showPassword ? 'w-8 h-3 opacity-100' : 'w-8 h-1 opacity-0'}`}
              >
                <div className="w-full h-full border-b-4 border-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Blogger
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Log in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-900 transition"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-900 transition pr-12"
            />
            <span
              className="absolute right-3 top-[38px] cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          {/* Forgot Password placeholder */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => alert("Forgot password flow here")}
              className="text-sm text-blue-500 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}