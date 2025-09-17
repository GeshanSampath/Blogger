// src/pages/Blogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Confetti from "react-confetti";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Typewriter effect for titles
const TypewriterTitle = ({ text }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}</span>;
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", content: "" });
  const [showConfetti, setShowConfetti] = useState(false);

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

  const openBlog = (blog) => {
    setSelectedBlog(blog);
    setViewOpen(true);
  };

  const closeBlog = () => {
    setViewOpen(false);
    setSelectedBlog(null);
  };

  const openForm = () => setFormOpen(true);
  const closeForm = () => {
    setFormOpen(false);
    setForm({ title: "", author: "", content: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/blogs`, form);
      fetchBlogs();
      closeForm();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      console.error("Error adding blog:", err);
    }
  };

  return (
    <section
      className="min-h-screen relative overflow-hidden p-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showConfetti && <Confetti recycle={false} />}

      {/* Header */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <TypewriterTitle text="Related Blogs" />
        </motion.h1>
        <motion.button
          onClick={openForm}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          + Add Blog
        </motion.button>
      </div>

      {/* Blog Grid */}
      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="p-6 rounded-3xl bg-white/20 backdrop-blur-md border border-white/10 shadow-xl cursor-pointer hover:shadow-2xl transform-gpu transition-transform"
            whileHover={{ rotateY: 8, rotateX: -4, scale: 1.05 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            onClick={() => openBlog(blog)}
          >
            <h2 className="text-2xl font-bold mb-1 text-white bg-clip-text">
              {blog.title}
            </h2>
            <p className="text-sm text-white/70">{blog.author || "Unknown Author"}</p>
            <p className="mt-3 text-sm text-white/80 line-clamp-3">
              {blog.content?.replace(/<[^>]+>/g, "").slice(0, 120)}...
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* View Blog Modal */}
      <AnimatePresence>
        {viewOpen && selectedBlog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBlog}
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 max-w-3xl w-[90%] p-8 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-xl"
              initial={{ y: 50, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
            >
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {selectedBlog.title}
                  </h2>
                  {selectedBlog.author && (
                    <p className="text-sm text-gray-600 mt-1">
                      By {selectedBlog.author}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeBlog}
                  className="ml-auto rounded-full p-2 hover:bg-gray-100 transition"
                >
                  ✕
                </button>
              </header>
              <main className="mt-6 max-h-[65vh] overflow-auto prose prose-pink space-y-4">
                {selectedBlog.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                ) : (
                  <p className="text-gray-700">No content available.</p>
                )}
              </main>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Blog Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeForm}
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 max-w-2xl w-[90%] p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-white/80 to-pink-50 backdrop-blur-xl border border-white/20"
              initial={{ y: -30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <header className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-pink-600">Add New Blog 🚀</h2>
                <button
                  onClick={closeForm}
                  className="rounded-full p-2 hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </header>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={(value) => setForm({ ...form, content: value })}
                  className="h-40 mb-10"
                />
                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit Blog ✨
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
