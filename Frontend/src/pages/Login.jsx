import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // <-- store error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // clear old error first

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });

      // ✅ Save token
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("role", res.data.role);

      if (onLogin) onLogin();

      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      // 🔴 Instead of alert, show message in UI
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
      <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-2xl p-10 border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Blogger
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Log in to your account</p>
        </div>

        {/* 🔴 Error Message Box */}
        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-900 transition"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => alert("Forgot password flow here")}
              className="text-sm text-blue-500 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
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
          Don’t have an account?{" "}
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