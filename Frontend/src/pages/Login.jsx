import React, { useState } from "react";
import { register, login } from "../auth/auth";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // -------------------------------
  // Handle registration
  // -------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      email,
      password,
      role: "author", // or "user"
    };

    try {
      const res = await register(formData);
      setMessage(res.message);
    } catch (err) {
      setMessage(err.message || "Registration failed");
      console.error(err);
    }
  };

  // -------------------------------
  // Handle login
  // -------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = { email, password };

    try {
      const res = await login(formData);
      setMessage(res.message);

      // Save token if needed
      localStorage.setItem("token", res.token);
    } catch (err) {
      setMessage(err.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
