import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PendingAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingAuthors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/users/pending-authors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthors(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch pending authors");
    } finally {
      setLoading(false);
    }
  };

  const approveAuthor = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/users/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAuthors(authors.filter((author) => author.id !== id));
      alert("✅ Author approved!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve author");
    }
  };

  const rejectAuthor = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/users/reject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthors(authors.filter((author) => author.id !== id));
      alert("❌ Author rejected!");
    } catch (err) {
      console.error(err);
      alert("Failed to reject author");
    }
  };

  useEffect(() => {
    fetchPendingAuthors();
  }, []);

  return (
    <section className="p-10 bg-gray-50 min-h-screen text-gray-900">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        Pending Authors
      </h2>

      {loading && (
        <p className="text-center text-gray-500 font-medium">Loading...</p>
      )}

      {!loading && authors.length === 0 && (
        <p className="text-center text-green-600 font-medium">
          All authors are approved!
        </p>
      )}

      {!loading && authors.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">#</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author, index) => (
                <tr
                  key={author.id}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {author.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{author.email}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => approveAuthor(author.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                 hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectAuthor(author.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg 
                                 hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
