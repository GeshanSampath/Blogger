import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import BlogForm from "../../components/BlogForm";
import CommentManager from "../../components/CommentManager";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AuthorDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [selectedBlogComments, setSelectedBlogComments] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/blogs/author`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormOpen(true);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleManageComments = (blog) => {
    setSelectedBlogComments(blog);
  };

  return (
    <section className="p-10 min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Author Dashboard</h1>
        <button
          onClick={() => {
            setEditingBlog(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
        >
          <PlusCircle className="w-5 h-5" /> Add Blog
        </button>
      </div>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs yet. Start by creating your first blog!</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              className="p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl group"
              whileHover={{ y: -5 }}
            >
              {blog.image && (
                <img
                  // ✅ Ensure full URL by prepending API origin
                  src={`${API}${blog.image.startsWith("/") ? "" : "/"}${blog.image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
              <p className="mt-2 text-sm line-clamp-3">
                {blog.content
                  ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
                  : "No content available."}
              </p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleEdit(blog)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 rounded hover:bg-blue-600"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  onClick={() => handleManageComments(blog)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 rounded hover:bg-green-600"
                >
                  Manage Comments
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Blog Form */}
      {formOpen && (
        <BlogForm
          onClose={() => setFormOpen(false)}
          onSuccess={fetchBlogs}
          blog={editingBlog}
        />
      )}

      {/* Comment Manager Modal */}
      {selectedBlogComments && (
        <CommentManager
          blog={selectedBlogComments}
          onClose={() => setSelectedBlogComments(null)}
        />
      )}
    </section>
  );
}
