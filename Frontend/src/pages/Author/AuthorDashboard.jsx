import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogForm from "../../components/BlogForm";
import { PlusCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AuthorDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [authorName, setAuthorName] = useState("");

  // Fetch blogs of logged-in author
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        return;
      }
      const res = await axios.get(`${API}/blogs/author`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogs(res.data);
      if (res.data.length > 0) {
        setAuthorName(res.data[0].author?.name || "Author");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Build image URL using our API endpoint
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    const filename = imagePath.split("/").pop();
    return `${API}/blogs/images/${filename}`;
  };

  return (
    <section className="p-10 min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Profile
          </h1>
          {authorName && (
            <p className="text-lg text-gray-600 mt-2">
              Welcome, <span className="font-semibold text-indigo-600">{authorName}</span>
            </p>
          )}
        </div>

        {/* Modern Add Blog Button */}
        <button
          onClick={() => {
            setEditingBlog(null);
            setFormOpen(true);
          }}
          className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3 
                     bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 
                     text-white font-semibold rounded-full shadow-md 
                     hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Blog</span>
        </button>
      </div>

      {/* Blogs grid */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No blogs yet. Create one!</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden 
                         transform hover:scale-[1.02] transition-all duration-300 border border-gray-200"
            >
              {/* Blog image */}
              {b.image && (
                <div className="overflow-hidden">
                  <img
                    src={getImageUrl(b.image)}
                    alt={b.title}
                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Blog content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 truncate mb-2">
                  {b.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {b.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog form modal */}
      {formOpen && (
        <BlogForm
          blog={editingBlog}
          onClose={() => setFormOpen(false)}
          onSuccess={fetchBlogs}
        />
      )}
    </section>
  );
}