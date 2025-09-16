import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      setError("Failed to fetch blogs");
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.content) {
      setError("Title and content are required");
      return;
    }
    try {
      const res = await axios.post(`${API}/blogs`, form);
      setBlogs((prev) => [res.data, ...prev]);
      setForm({ title: "", content: "", author: "" });
    } catch (err) {
      setError("Failed to create blog");
    }
  }

  return (
    <main
      className="min-h-screen text-white relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/70 to-black/80"></div>

      <div className="relative z-10 p-8">
        {/* Hero Section */}
        <section className="h-[60vh] flex flex-col justify-center items-center text-center mb-16">
          <motion.div
            className="px-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              Welcome to{" "}
              <span className="text-[#ff4d6d]">Bloger</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
              Share your ideas, tutorials, and creativity with the world.
            </p>
          </motion.div>
        </section>

        {/* Blog Form */}
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 mb-12 max-w-4xl mx-auto shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-[#ff4d6d] drop-shadow-md">
            Create a New Blog
          </h2>
          {error && <div className="text-red-400 text-center mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-[#ff4d6d]/50 shadow-lg"
            />
            <input
              type="text"
              placeholder="Author (optional)"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-[#ff4d6d]/50 shadow-lg"
            />
            <textarea
              placeholder="Content"
              rows="6"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-[#ff4d6d]/50 shadow-lg"
            />
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 20px #ff4d6d, 0px 0px 40px #3BC9DB",
              }}
              className="w-full py-4 bg-gradient-to-r from-[#ff4d6d] to-[#3BC9DB] text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-2xl"
            >
              Publish Blog
            </motion.button>
          </form>
        </motion.div>

        {/* Blogs Grid */}
        <motion.section
          className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {loading ? (
            <div className="col-span-full text-center text-xl">
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="col-span-full text-center text-white/70 text-xl">
              No blogs yet.
            </div>
          ) : (
            blogs.map((blog) => (
              <motion.div
                key={blog.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl cursor-pointer"
                whileHover={{
                  rotateY: 8,
                  rotateX: 4,
                  scale: 1.05,
                  boxShadow: "0px 20px 40px rgba(255,77,109,0.7)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="overflow-hidden rounded-lg">
                  <h3 className="text-2xl font-bold mb-2 text-[#3BC9DB]">
                    {blog.title}
                  </h3>
                  <p className="text-gray-200 mb-4 line-clamp-6">
                    {blog.content}
                  </p>
                  <div className="text-gray-400 text-sm text-right italic">
                    {blog.author || "Anonymous"}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.section>
      </div>
    </main>
  );
}
