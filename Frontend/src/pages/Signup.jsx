import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
        role,
      });

      if (role === "author") {
        setMessage(
          "Signup successful! Your account is pending approval by Super Admin."
        );
      } else {
        setMessage("Signup successful! You can now log in.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-blue-50 px-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-300 rounded-full blur-3xl opacity-40"></div>

      {/* Signup Card */}
      <div className="relative z-10 bg-white w-full max-w-md rounded-2xl shadow-2xl p-10 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
            Blogger 
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Create your account</p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-gray-900 transition"
            />
          </div>

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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-gray-900 transition"
            />
          </div>

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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-gray-900 transition"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-gray-50 text-gray-900 transition"
            >
              <option value="user">User</option>
              <option value="author">Author</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}