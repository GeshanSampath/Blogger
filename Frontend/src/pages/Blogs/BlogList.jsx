// src/pages/BlogList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Backend already filters APPROVED blogs
      const res = await axios.get(`${API}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  // ✅ Consistent image URL builder (like Dashboard)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    const filename = imagePath.split("/").pop();
    return `${API}/blogs/images/${filename}`;
  };

  return (
    <section className="p-10 bg-gray-50 text-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-center text-indigo-700">
        Latest Blogs
      </h1>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden 
                      border border-gray-200 hover:shadow-xl 
                      transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            whileHover={{ y: -6 }}
            onClick={() => navigate(`/blogs/${blog.id}`)}
          >
            {/* Blog Image */}
            {blog.image && (
              <img
                src={getImageUrl(blog.image)}
                alt={blog.title}
                className="w-full h-56 object-cover" 
              />
            )}

            {/* Blog Content */}
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                {blog.title}
              </h2>
              <p className="flex items-center gap-2 text-sm mb-3">
                <User size={18} className="text-indigo-500" />
                <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  {blog.author?.name || "Unknown Author"}
                </span>
              </p>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {blog.content
                  ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
                  : "No content available."}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}