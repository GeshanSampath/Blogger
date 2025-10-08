import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null); // for modal

  // Fetch pending blogs (SUPER_ADMIN only)
  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const res = await axios.get(`${API}/blogs/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching pending blogs:", err);
      if (err.response?.status === 403) {
        alert("You are not authorized to view pending blogs (SUPER_ADMIN only).");
      } else {
        alert("Failed to fetch pending blogs. Make sure you are logged in.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Approve blog
  const approveBlog = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/blogs/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter(blog => blog.id !== id));
      setSelectedBlog(null);
      alert("✅ Blog approved!");
    } catch (err) {
      console.error("Error approving blog:", err);
      alert("Failed to approve blog");
    }
  };

  // Reject blog
  const rejectBlog = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/blogs/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter(blog => blog.id !== id));
      setSelectedBlog(null);
      alert("❌ Blog rejected!");
    } catch (err) {
      console.error("Error rejecting blog:", err);
      alert("Failed to reject blog");
    }
  };

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  return (
    <section className="p-10 bg-gray-50 min-h-screen text-gray-900">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        Manage Pending Blogs
      </h2>

      {loading && (
        <p className="text-center text-gray-500 font-medium">Loading...</p>
      )}

      {!loading && blogs.length === 0 && (
        <p className="text-center text-green-600 font-medium">
          No pending blogs 🎉
        </p>
      )}

      {!loading && blogs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">#</th>
                <th className="px-6 py-3 text-left font-semibold">Title</th>
                <th className="px-6 py-3 text-left font-semibold">Author</th>
                <th className="px-6 py-3 text-center font-semibold">View</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr
                  key={blog.id}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {blog.author?.name || "Unknown"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg 
                                 hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => approveBlog(blog.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg 
                                 hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectBlog(blog.id)}
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

      {/* MODAL */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg relative">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              {selectedBlog.title}
            </h3>
            <p className="text-gray-500 mb-2">
              By{" "}
              <span className="font-medium text-indigo-600">
                {selectedBlog.author?.name || "Unknown"}
              </span>
            </p>

            {selectedBlog.image && (
              <img
                src={`${API}/blogs/images/${selectedBlog.image.split("/").pop()}`}
                alt={selectedBlog.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <div
              className="text-gray-800 leading-relaxed mb-6 max-h-80 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => approveBlog(selectedBlog.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Approve
              </button>
              <button
                onClick={() => rejectBlog(selectedBlog.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedBlog(null)}
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
