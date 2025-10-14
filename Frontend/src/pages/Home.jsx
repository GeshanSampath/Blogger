import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Sparkles, TrendingUp, Users, BookOpen, Zap, Eye } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Reusable Scroll Animation Wrapper
function RevealOnScroll({ children, delay = 0, duration = 0.8 }) {
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
          transition: { duration, delay, ease: "easeOut" },
        },
      }}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

// Gradient text component
function GradientText({ children }) {
  return (
    <span className="bg-gradient-to-r from-[#00adb5] via-[#08c4cc] to-[#00d4d4] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

// Enhanced Blog Card Component
function BlogCard({ blog, onViewBlog, delay }) {
  return (
    <RevealOnScroll delay={delay}>
      <motion.div
        onClick={() => onViewBlog(blog.id)}
        className="group cursor-pointer h-full"
        whileHover={{ y: -8 }}
      >
        <div className="relative rounded-2xl overflow-hidden h-full bg-gradient-to-br from-[#16213e] to-[#0f1626] border border-[#00adb5]/10 hover:border-[#00adb5]/40 transition-all shadow-lg hover:shadow-2xl hover:shadow-[#00adb5]/20">
          {/* Image Container */}
          {blog.image && (
            <div className="h-56 w-full overflow-hidden relative bg-[#1a1a2e]">
              <motion.img
                src={`${API}/blogs/images/${blog.image.split("/").pop()}`}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity"></div>
              
              {/* Trending Badge */}
              <div className="absolute top-4 right-4">
                <motion.div
                  className="bg-[#00adb5]/90 backdrop-blur-md text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-3 h-3" /> Trending
                </motion.div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 flex flex-col h-full">
            {/* Title */}
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#00adb5] transition-colors line-clamp-2 flex-grow">
              {blog.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {blog.content
                ? blog.content.replace(/<[^>]+>/g, "").slice(0, 120) + "..."
                : "No content"}
            </p>

            {/* Divider */}
            <div className="border-t border-[#00adb5]/10 mb-4"></div>

            {/* Footer Info */}
            <div className="space-y-3">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00adb5] to-[#08c4cc] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-[#0a0f1c] font-bold">
                    {blog.author?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {blog.author?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>Read more</span>
                </div>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </RevealOnScroll>
  );
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <RevealOnScroll delay={delay}>
      <motion.div
        className="bg-gradient-to-br from-[#16213e] to-[#0f1626] p-6 rounded-xl border border-[#00adb5]/10 hover:border-[#00adb5]/40 transition-all"
        whileHover={{ y: -5 }}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#08c4cc] rounded-lg mb-4 flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Icon className="w-6 h-6 text-[#0a0f1c]" />
        </motion.div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </motion.div>
    </RevealOnScroll>
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
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-[#0a0f1c]/95"></div>
        </div>

        {/* Animated Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-[#00adb5]/15 rounded-full blur-3xl"
          style={{ top: "5%", left: "5%" }}
          animate={{ x: [0, 50, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-[#08c4cc]/10 rounded-full blur-3xl"
          style={{ bottom: "5%", right: "5%" }}
          animate={{ x: [0, -30, 30, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-block mb-6 px-4 py-2 bg-[#00adb5]/10 border border-[#00adb5]/30 rounded-full backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-sm font-semibold text-[#00adb5] flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" /> Welcome to Bloger
            </p>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Welcome to{" "}
            <GradientText>Bloger</GradientText>
          </h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-2xl max-w-2xl mx-auto mb-10 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Discover <span className="text-[#00adb5] font-semibold">ideas</span>, <span className="text-[#00adb5] font-semibold">tutorials</span>, and <span className="text-[#00adb5] font-semibold">stories</span> that ignite creativity.
          </motion.p>

          {/* CTA Button */}
          <motion.a
            href="#trending"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00adb5] to-[#08c4cc] text-black px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-[#00adb5]/50 transition-all"
          >
            Explore Trending Blogs 
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-8 h-12 border-2 border-[#00adb5] rounded-full flex justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-[#00adb5] rounded-full"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#0a0f1c] to-[#0f1626] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Why Choose <GradientText>Bloger?</GradientText>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Join a thriving community of creators and readers passionate about sharing knowledge
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={BookOpen}
              title="Rich Content"
              description="Create beautiful blogs with formatting, images, and multimedia support"
              delay={0}
            />
            <FeatureCard
              icon={Users}
              title="Community"
              description="Connect with thousands of readers and fellow creators worldwide"
              delay={0.1}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Get Discovered"
              description="Gain visibility through trending blogs and recommendations"
              delay={0.2}
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Optimized performance for seamless reading and writing experience"
              delay={0.3}
            />
          </div>
        </div>
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

      {/* Community CTA Section */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#0f1626] to-[#1a1a2e] relative overflow-hidden">
        {/* Background Animation */}
        <motion.div
          className="absolute w-96 h-96 bg-[#00adb5]/10 rounded-full blur-3xl"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <RevealOnScroll>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Join the <GradientText>Community</GradientText>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-10">
              Explore insightful blogs, tutorials, and stories shared by authors worldwide. Stay inspired and keep learning every day.
            </p>
<motion.div
  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  {/* Start Writing -> Signup Page */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-gradient-to-r from-[#00adb5] to-[#08c4cc] text-black px-10 py-3 rounded-lg font-bold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
    onClick={() => navigate("/signup")}
  >
    Start Writing <Sparkles className="w-5 h-5" />
  </motion.button>

  {/* Explore More -> Blog List Page */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="border-2 border-[#00adb5] text-[#00adb5] px-10 py-3 rounded-lg font-bold text-lg hover:bg-[#00adb5]/10 transition-all"
    onClick={() => navigate("/blogs")}
  >
    Explore More
  </motion.button>
</motion.div>
          </div>
        </RevealOnScroll>
      </section>
    </main>
  );
}