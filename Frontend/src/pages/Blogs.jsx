// src/pages/Blogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Confetti from "react-confetti";
import { PlusCircle, User } from "lucide-react";

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
  return (
    <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
      {displayed}
    </span>
  );
};

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", content: "", image: null });
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
    setFormOpen({ title: "", author: "", content: "", image: null });
    setFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Please select an image for the blog.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author || "");
      formData.append("content", form.content);
      formData.append("image", form.image);

      await axios.post(`${API}/blogs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchBlogs();
      closeForm();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err) {
      console.error("Error adding blog:", err);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden p-10 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764] text-white">
      {/* Background blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
        animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {showConfetti && <Confetti recycle={false} />}

      {/* Header */}
      <div className="flex justify-between items-center mb-12 relative z-10">
        <motion.h1
          className="text-4xl md:text-4xl font-extrabold"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <TypewriterTitle text="Related Blog.... " />
        </motion.h1>
        <motion.button
          onClick={openForm}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-pink-400/50 transition"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusCircle className="w-5 h-5" /> Add Blog
        </motion.button>
      </div>

      {/* Blog Grid */}
      <motion.div
        className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 relative z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl group hover:shadow-pink-400/40 transition-all duration-300"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -8 }}
          >
            {blog.image && (
              <img
                src={`${API}/${blog.image}`}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent group-hover:drop-shadow-md transition">
              {blog.title}
            </h2>
            <p className="flex items-center gap-2 text-sm text-indigo-300">
              <User size={16} /> {blog.author || "Unknown Author"}
            </p>
            <p className="mt-3 text-sm text-gray-200/90 line-clamp-3">
              {blog.content
                ? blog.content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
                : "No content available."}
            </p>
            <button
              onClick={() => openBlog(blog)}
              className="mt-4 text-pink-400 font-semibold hover:text-pink-300 transition cursor-pointer"
            >
              Read More
            </button>
          </motion.div>
        ))}
      </motion.div>

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
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 max-w-2xl w-[90%] p-8 rounded-3xl shadow-2xl 
                         bg-gradient-to-br from-pink-50 via-white to-indigo-50 text-gray-900 border border-gray-200"
              initial={{ y: -30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <header className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-pink-600">
                  Add New Blog
                </h2>
                <button
                  onClick={closeForm}
                  className="rounded-full p-2 hover:bg-gray-200 transition"
                >
                  ✕
                </button>
              </header>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Blog title..."
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-pink-300 text-black focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="Author name..."
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-indigo-300 text-black focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Content
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={form.content}
                    onChange={(value) =>
                      setForm({ ...form, content: value })
                    }
                    className="h-40 mb-4 text-black"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Blog Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.files[0] })
                    }
                    className="w-full p-2 border rounded mb-4"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit Blog
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}