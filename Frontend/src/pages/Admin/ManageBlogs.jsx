import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/blogs/pending`, {
        headers: { Authorization: `Bearer ${token}` }, // Only SUPER_ADMIN allowed
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching pending blogs:", err);
      alert("Failed to fetch pending blogs");
    } finally {
      setLoading(false);
    }
  };

  const approveBlog = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/blogs/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlogs(blogs.filter((blog) => blog.id !== id));
      alert("✅ Blog approved!");
    } catch (err) {
      console.error("Error approving blog:", err);
      alert("Failed to approve blog");
    }
  };

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  return (
    <section className="p-8 min-h-screen bg-gray-50 text-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Manage Pending Blogs
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && blogs.length === 0 && (
        <p className="text-gray-500">No pending blogs 🎉</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 
                      hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200"
          >
            {blog.image && (
              <img
                src={`${API}/blogs/images/${blog.image.split("/").pop()}`}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
            <p className="text-sm text-gray-600 mb-3">
              By <span className="font-medium text-indigo-600">{blog.author?.name}</span>
            </p>
            <p className="text-gray-700 text-sm line-clamp-3 mb-4">
              {blog.content
                ? blog.content.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
                : "No content available"}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => approveBlog(blog.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Approve ✅
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}