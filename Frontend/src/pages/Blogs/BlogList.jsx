import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        (b.content && b.content.replace(/<[^>]+>/g, "").toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredBlogs(filtered);
    }
  }, [search, blogs]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/blogs`);
      setBlogs(res.data);
      setFilteredBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const handleBlogClick = async (blogId) => {
    try {
      await axios.patch(`${API}/blogs/${blogId}/increment-view`);
    } catch (err) {
      console.error("Failed to increment view:", err);
    } finally {
      navigate(`/blogs/${blogId}`);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    const filename = imagePath.split("/").pop();
    return `${API}/blogs/images/${filename}`;
  };

  return (
    <section className="p-6 md:p-10 bg-gradient-to-b from-gray-100 to-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        Latest Blogs
      </h1>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-10 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        />
      </div>

      {/* Blog Grid */}
      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No blogs found.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              whileHover={{ y: -5 }}
              onClick={() => handleBlogClick(blog.id)}
            >
              {blog.image && (
                <img
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                />
              )}

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
      )}
    </section>
  );
}
