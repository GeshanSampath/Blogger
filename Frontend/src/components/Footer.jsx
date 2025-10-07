// Footer.jsx
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer({ categories = [], latestBlogs = [] }) {
  return (
    <footer className="bg-[#0f1626] text-gray-400 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white">Bloger</h1>
          <p className="text-gray-400 text-sm">
            Explore insightful blogs, tutorials, and ideas shared by authors worldwide.
            Stay inspired and keep learning every day.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-[#00adb5] transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#00adb5] transition"><FaTwitter /></a>
            <a href="#" className="hover:text-[#00adb5] transition"><FaInstagram /></a>
            <a href="#" className="hover:text-[#00adb5] transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <a href="/" className="hover:text-[#00adb5] transition">Home</a>
          <a href="#trending" className="hover:text-[#00adb5] transition">Trending</a>
          <a href="#categories" className="hover:text-[#00adb5] transition">Categories</a>
          <a href="#about" className="hover:text-[#00adb5] transition">About</a>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2">Categories</h3>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories yet.</p>
          ) : (
            categories.slice(0, 6).map((cat) => (
              <a
                key={cat.id}
                href={`#category-${cat.id}`}
                className="hover:text-[#00adb5] transition"
              >
                {cat.name}
              </a>
            ))
          )}
        </div>

        {/* Latest Blogs */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2">Latest Blogs</h3>
          {latestBlogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent posts.</p>
          ) : (
            latestBlogs.slice(0, 4).map((blog) => (
              <a
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="hover:text-[#00adb5] transition line-clamp-1"
              >
                {blog.title}
              </a>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Bloger. All rights reserved.
      </div>
    </footer>
  );
}
// Footer.jsx
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer({ categories = [], trendingBlogs = [] }) {
  return (
    <footer className="bg-[#0f1626] text-gray-400 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white">Bloger</h1>
          <p className="text-gray-400 text-sm">
            Explore insightful blogs, tutorials, and ideas shared by authors worldwide.
            Stay inspired and keep learning every day.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-[#00adb5] transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#00adb5] transition"><FaTwitter /></a>
            <a href="#" className="hover:text-[#00adb5] transition"><FaInstagram /></a>
            <a href="#" className="hover:text-[#00adb5] transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <a href="/" className="hover:text-[#00adb5] transition">Home</a>
          <a href="#trending" className="hover:text-[#00adb5] transition">Trending</a>
          <a href="#categories" className="hover:text-[#00adb5] transition">Categories</a>
          <a href="#about" className="hover:text-[#00adb5] transition">About</a>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2">Categories</h3>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories yet.</p>
          ) : (
            categories.slice(0, 6).map((cat) => (
              <a
                key={cat.id}
                href={`#category-${cat.id}`}
                className="hover:text-[#00adb5] transition"
              >
                {cat.name}
              </a>
            ))
          )}
        </div>

        {/* Trending Blogs */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-semibold mb-2">Trending Blogs</h3>
          {trendingBlogs.length === 0 ? (
            <p className="text-gray-500 text-sm">No trending blogs.</p>
          ) : (
            trendingBlogs.slice(0, 4).map((blog) => (
              <a
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="hover:text-[#00adb5] transition line-clamp-1"
              >
                {blog.title}
              </a>
            ))
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Bloger. All rights reserved.
      </div>
    </footer>
  );
}
