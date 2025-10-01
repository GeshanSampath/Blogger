import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "lucide-react";

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
      alert("❌ Author rejected and removed!");
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

      {loading && <p className="text-gray-500 text-center">Loading...</p>}

      {!loading && authors.length === 0 && (
        <p className="text-center text-green-600 font-medium">
          ✅ All authors are approved!
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200 
                       hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-100 p-3 rounded-full">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{author.name}</h3>
                <p className="text-sm text-gray-600">{author.email}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="text-xs text-gray-500">
                {author.createdAt
                  ? new Date(author.createdAt).toLocaleDateString()
                  : "New Author"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => approveAuthor(author.id)}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                             hover:bg-green-700 transition"
                >
                  Approve ✅
                </button>
                <button
                  onClick={() => rejectAuthor(author.id)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg 
                             hover:bg-red-700 transition"
                >
                  Reject ❌
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}