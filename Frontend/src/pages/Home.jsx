import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Home() {
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const navigate = useNavigate();

  // Fetch top 3 trending blogs (most views)
  const fetchTrendingBlogs = async () => {
    try {
      const res = await axios.get(`${API}/blogs/trending`); // Backend endpoint for trending
      setTrendingBlogs(res.data);
    } catch (err) {
      console.error("Error fetching trending blogs:", err);
    }
  };

  useEffect(() => {
    fetchTrendingBlogs();
  }, []);

  // Handle clicking a blog: increment views and navigate
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
    <main className="text-white">
      {/* Hero Section */}
      <section
        className="h-[80vh] flex flex-col justify-center items-center text-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <motion.div
          className="relative z-10 px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Welcome to <span className="text-[#00adb5] drop-shadow-lg">Bloger</span>
          </h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-6 text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Discover <span className="text-[#00adb5]">ideas</span>,{" "}
            <span className="text-[#00adb5]">tutorials</span>, and{" "}
            <span className="text-[#00adb5]">thoughts</span> that inspire creativity.
          </motion.p>
          <motion.a
            href="#trending"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00adb5] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#08c4cc] transition-all shadow-lg hover:shadow-[#00adb5]/50 inline-block"
          >
            Explore Trending Blogs
          </motion.a>
        </motion.div>
      </section>

      {/* Trending Blogs Section */}
      <section id="trending" className="bg-[#0f1626] py-20 px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Trending Blogs
        </h2>

        {trendingBlogs.length === 0 ? (
          <p className="text-center text-gray-400">No trending blogs available.</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-3">
            {trendingBlogs.map((blog) => (
              <motion.div
                key={blog.id}
                onClick={() => handleViewBlog(blog.id)} // increment views only once
                className="bg-[#16213e] rounded-2xl overflow-hidden shadow-lg cursor-pointer group hover:shadow-[#00adb5]/20 transition-all"
                whileHover={{ scale: 1.03 }}
              >
                {blog.image && (
                  <div className="h-64 w-full overflow-hidden">
                    <img
                      src={`${API}/blogs/images/${blog.image.split("/").pop()}`}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                    By <span className="text-[#00adb5]">{blog.author?.name}</span> |{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action / About Section */}
      <section className="bg-[#1a1a2e] py-20 px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Join the Community
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore insightful blogs, tutorials, and ideas shared by authors worldwide.
          Stay inspired and keep learning every day.
        </p>
      </section>

     
    </main>
  );
}
