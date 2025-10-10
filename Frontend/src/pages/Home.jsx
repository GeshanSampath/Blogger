import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Reusable Scroll Animation Wrapper
function RevealOnScroll({ children, delay = 0, duration = 0.8 }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, delay, ease: "easeOut" },
        },
      }}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchTrendingBlogs = async () => {
    try {
      const res = await axios.get(`${API}/blogs/trending`);
      setTrendingBlogs(res.data);
    } catch (err) {
      console.error("Error fetching trending blogs:", err);
    }
  };

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  const handleViewBlog = async (blogId) => {
    try {
      await axios.patch(`${API}/blogs/${blogId}/increment-view`);
    } catch (err) {
      console.error("Failed to increment views:", err);
    } finally {
      navigate(`/blogs/${blogId}`);
    }
  };

  return (
    <main className="text-white bg-[#0a0f1c] overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative h-[90vh] flex flex-col justify-center items-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#0a0f1c]"></div>

        <motion.div
          className="relative z-10 px-6"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Welcome to{" "}
            <span className="text-[#00adb5] bg-gradient-to-r from-[#00adb5] to-[#08c4cc] bg-clip-text text-transparent">
              Bloger
            </span>
          </h1>
          <motion.p
            className="text-lg md:text-2xl max-w-2xl mx-auto mb-8 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Discover{" "}
            <span className="text-[#00adb5]">ideas</span>,{" "}
            <span className="text-[#00adb5]">tutorials</span>, and{" "}
            <span className="text-[#00adb5]">stories</span> that ignite
            creativity.
          </motion.p>
          <motion.a
            href="#trending"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00adb5] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#08c4cc] shadow-lg hover:shadow-[#00adb5]/50 transition-all"
          >
            Explore Trending Blogs
          </motion.a>
        </motion.div>

        {/* Floating animated circles */}
        <motion.div
          className="absolute w-40 h-40 bg-[#00adb5]/10 rounded-full blur-3xl top-10 left-10"
          animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-60 h-60 bg-[#00adb5]/10 rounded-full blur-3xl bottom-10 right-10"
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
      </section>

      {/* Trending Blogs Section */}
      <section id="trending" className="py-24 px-6 md:px-12 bg-[#0f1626]">
        <RevealOnScroll>
          <h2 className="text-4xl font-bold text-center mb-14 text-white">
            Trending Blogs
          </h2>
        </RevealOnScroll>

        {trendingBlogs.length === 0 ? (
          <RevealOnScroll>
            <p className="text-center text-gray-400">
              No trending blogs available.
            </p>
          </RevealOnScroll>
        ) : (
          <div className="grid gap-12 md:grid-cols-3">
            {trendingBlogs.map((blog, index) => (
              <RevealOnScroll key={blog.id} delay={index * 0.2}>
                <motion.div
                  onClick={() => handleViewBlog(blog.id)}
                  className="bg-[#16213e] rounded-2xl overflow-hidden shadow-lg cursor-pointer group relative transition-all hover:shadow-[#00adb5]/20"
                  whileHover={{ scale: 1.03 }}
                >
                  {blog.image && (
                    <div className="h-64 w-full overflow-hidden">
                      <motion.img
                        src={`${API}/blogs/images/${blog.image.split("/").pop()}`}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#00adb5] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {blog.content
                        ? blog.content.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
                        : "No content"}
                    </p>
                    <p className="text-sm text-gray-500">
                      By{" "}
                      <span className="text-[#00adb5]">
                        {blog.author?.name || "Unknown"}
                      </span>{" "}
                      | {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* About / Call to Action Section */}
      <section className="bg-[#1a1a2e] py-24 px-6 md:px-12 text-center relative overflow-hidden">
        <motion.div
          className="absolute w-80 h-80 bg-[#00adb5]/10 rounded-full blur-3xl top-0 left-1/4"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <RevealOnScroll>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white z-10 relative">
            Join the Community 
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg z-10 relative">
            Explore insightful blogs, tutorials, and stories shared by authors
            worldwide. Stay inspired and keep learning every day.
          </p>
        </RevealOnScroll>
      </section>

      
     
    </main>
  );
}
