import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogForm from "../../components/BlogForm";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AuthorDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Fetch blogs of logged-in author
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }
      const res = await axios.get(`${API}/blogs/author`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Helper to build image URL using our new endpoint
  const getImageUrl = (imagePath) => {
    // imagePath looks like "/uploads/blogs/blog-xxxx.jpg"
    const filename = imagePath.split("/").pop(); // get just "blog-xxxx.jpg"
    return `${API}/blogs/images/${filename}`;
  };

  return (
    <section className="p-10 min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Author Dashboard</h1>
        <button
          onClick={() => {
            setEditingBlog(null);
            setFormOpen(true);
          }}
          className="px-6 py-2 rounded bg-pink-600 hover:bg-pink-700"
        >
          + Add Blog
        </button>
      </div>

      {/* Blogs list */}
      {blogs.length === 0 ? (
        <p>No blogs yet. Create one!</p>
      ) : (
        <ul className="space-y-4">
          {blogs.map((b) => (
            <li key={b.id} className="bg-gray-700 p-4 rounded">
              <h2 className="text-xl font-bold">{b.title}</h2>
              <p className="mt-1">{b.content}</p>

              {/* ✅ FIXED IMAGE PATH using get endpoint */}
              {b.image && (
                <img
                  src={getImageUrl(b.image)}
                  alt={b.title}
                  className="w-full h-48 object-cover rounded-lg mt-2"
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Blog form modal */}
      {formOpen && (
        <BlogForm
          blog={editingBlog}
          onClose={() => setFormOpen(false)}
          onSuccess={fetchBlogs}
        />
      )}
    </section>
  );
}