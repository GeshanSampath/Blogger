// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, PlusCircle } from "lucide-react";
import BlogForm from "../components/BlogForm";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  return (
    <section className="p-10 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">Blogs</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
        >
          <PlusCircle className="w-5 h-5" /> Add Blog
        </button>
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl group"
            whileHover={{ y: -8 }}
          >
            {blog.image && (
              <img
                src={`${API}/${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="flex items-center gap-2 text-sm text-indigo-300">
              <User size={16} /> {blog.author || "Unknown Author"}
            </p>
            <p className="mt-3 text-sm line-clamp-3">
              {blog.content
                ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
                : "No content available."}
            </p>
          </motion.div>
        ))}
      </div>

      {formOpen && (
        <BlogForm
          onClose={() => setFormOpen(false)}
          onSuccess={fetchBlogs}
        />
      )}
    </section>
  );
}
