import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // JWT token from login

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let endpoint = "/users";
      if (filter === "users") endpoint = "/users/only-users";
      else if (filter === "authors") endpoint = "/users/only-authors";

      const res = await axios.get(`${API}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔹 Exclude SUPER_ADMIN users
      const filtered = res.data.filter(user => user.role !== "SUPER_ADMIN");
      setUsers(filtered);

      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) setError("Unauthorized – log in as Admin");
      else setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        User & Author Management
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        {["all","users","authors"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center text-gray-500">Loading...</p> :
      error ? <p className="text-center text-red-600">{error}</p> :
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-3 px-4 border">ID</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Role</th>
              <th className="py-3 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 border-b">
                <td className="py-3 px-4 border">{user.id}</td>
                <td className="py-3 px-4 border">{user.name}</td>
                <td className="py-3 px-4 border">{user.email}</td>
                <td className="py-3 px-4 border font-medium text-blue-700">{user.role}</td>
                <td className={`py-3 px-4 border font-semibold ${user.isApproved ? "text-green-600":"text-red-500"}`}>
                  {user.isApproved ? "Approved" : "Pending"}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>}
    </div>
  );
}
