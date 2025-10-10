import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const ITEMS_PER_PAGE = 10; // Number of users per page

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

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

      // Exclude SUPER_ADMIN
      let filtered = res.data.filter((user) => user.role !== "SUPER_ADMIN");

      // Prioritize pending authors
      filtered.sort((a, b) => {
        if (!a.isApproved && b.isApproved) return -1;
        if (a.isApproved && !b.isApproved) return 1;
        return 0;
      });

      setUsers(filtered);
      setError("");
      setCurrentPage(1); // Reset to first page on filter change
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 401
          ? "Unauthorized – log in as Admin"
          : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const approveAuthor = async (id) => {
    try {
      await axios.patch(
        `${API}/users/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Author approved!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to approve author");
    }
  };

  const rejectAuthor = async (id) => {
    try {
      await axios.delete(`${API}/users/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("❌ Author rejected!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to reject author");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="p-10 bg-gray-50 min-h-screen text-gray-900">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        Manage Users & Authors
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {["all", "users", "authors"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
              filter === f
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading / Error / Table */}
      {loading ? (
        <p className="text-center text-gray-500 font-medium">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-center text-green-600 font-medium">
          No users found 🎉
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">#</th>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Role</th>
                  <th className="px-6 py-3 text-center font-semibold">Status</th>
                  <th className="px-6 py-3 text-center font-semibold">View</th>
                  <th className="px-6 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-indigo-600 font-medium">
                      {user.role}
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        user.isApproved ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {user.isApproved ? "Approved" : "Pending"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {!user.isApproved ? (
                        <>
                          <button
                            onClick={() => approveAuthor(user.id)}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectAuthor(user.id)}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-green-600 font-semibold text-sm">
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg font-medium ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              User Details
            </h3>

            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-700">Name:</span>{" "}
              {selectedUser.name}
            </p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-700">Email:</span>{" "}
              {selectedUser.email}
            </p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-700">Role:</span>{" "}
              {selectedUser.role}
            </p>
            <p
              className={`font-semibold mb-6 ${
                selectedUser.isApproved ? "text-green-600" : "text-red-500"
              }`}
            >
              {selectedUser.isApproved ? "Approved" : "Pending Approval"}
            </p>

            <div className="flex justify-end gap-3">
              {!selectedUser.isApproved && (
                <>
                  <button
                    onClick={() => {
                      approveAuthor(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectAuthor(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
