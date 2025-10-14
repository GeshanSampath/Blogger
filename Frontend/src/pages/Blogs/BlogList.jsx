import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Search, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Scroll animation wrapper
function RevealOnScroll({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, delay, ease: "easeOut" },
        },
      }}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

// Blog Card Component
function BlogCard({ blog, onBlogClick, imageUrl, delay }) {
  return (
    <RevealOnScroll delay={delay}>
      <motion.div
        className="group cursor-pointer"
        whileHover={{ y: -8 }}
        onClick={() => onBlogClick(blog.id)}
      >
        <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-transparent hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
          {blog.image && (
            <div className="h-56 w-full overflow-hidden relative bg-gradient-to-br from-indigo-100 to-indigo-50">
              <motion.img
                src={imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}

          <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-2">
              {blog.title}
            </h2>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
              {blog.content
                ? blog.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..."
                : "No content available"}
            </p>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-indigo-100">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {blog.author?.name || "Unknown Author"}
                </p>
                <p className="text-xs text-gray-500">
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "Date not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </RevealOnScroll>
  );
}

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs(search);
  }, [search]);

  const fetchBlogs = async (keyword = "") => {
    try {
      setIsSearching(true);
      const res = await axios.get(`${API}/blogs`);
      let data = res.data;

      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        data = data.filter(
          (blog) =>
            blog.title.toLowerCase().includes(lowerKeyword) ||
            (blog.author?.name || "").toLowerCase().includes(lowerKeyword)
        );
      }

      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setIsSearching(false);
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
    <main className="text-gray-900 bg-gradient-to-b from-white via-gray-50 to-indigo-50 min-h-screen pt-20">
      {/* Header */}
      <section className="px-6 md:px-12 py-16 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <div className="inline-block mb-6 px-4 py-2 bg-indigo-100/60 border border-indigo-300/50 rounded-full backdrop-blur-sm">
                <p className="text-sm font-semibold text-indigo-700 flex items-center gap-2 justify-center">
                  <TrendingUp className="w-4 h-4" /> Explore Our Collection
                </p>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
                Latest{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                  Blogs
                </span>
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Discover inspiring stories, in-depth tutorials, and valuable insights from our vibrant community of talented creators and writers
              </p>
            </div>
          </RevealOnScroll>

          {/* Search Bar */}
          <RevealOnScroll delay={0.1}>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search blogs by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 transition-all shadow-lg hover:border-indigo-400 focus:shadow-indigo-200/50"
              />
              {isSearching && (
                <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                  <motion.div
                    className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          {blogs.length === 0 ? (
            <RevealOnScroll>
              <div className="text-center py-24">
                <motion.div
                  className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <BookOpen className="w-10 h-10 text-indigo-600" />
                </motion.div>
                <p className="text-gray-700 text-xl mb-2 font-semibold">
                  {search ? "No blogs match your search" : "No blogs available yet"}
                </p>
                <p className="text-gray-500 text-lg">
                  {search ? "Try using different keywords to find what you're looking for" : "Come back soon to discover amazing content"}
                </p>
              </div>
            </RevealOnScroll>
          ) : (
            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {blogs.map((blog, index) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onBlogClick={handleBlogClick}
                  imageUrl={getImageUrl(blog.image)}
                  delay={index * 0.05}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
