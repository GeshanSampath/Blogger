import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Myblogs() {
  const [blogs, setBlogs] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState(""); // ✅ Success message state
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API}/blogs/author`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const approvedBlogs = res.data.filter(
        (b) => b.status && b.status.toLowerCase() === "approved"
      );

      setBlogs(approvedBlogs);
      if (approvedBlogs.length > 0) {
        setAuthorName(approvedBlogs[0].author?.name || "Author");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${API}/blogs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowModal(false);
      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);

      // ✅ Show message for 2 seconds
      setMessage("Your blog has been submitted and is waiting for admin approval.");
      setTimeout(() => setMessage(""), 2000);

      fetchBlogs();
    } catch (err) {
      console.error("Error publishing blog:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading blogs...
      </div>
    );

  return (
    <section className="p-10 min-h-screen bg-gray-50 text-gray-900 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">My Blogs</h1>
          {authorName && (
            <p className="text-lg text-gray-600 mt-2">
              Welcome,{" "}
              <span className="font-semibold text-indigo-600">{authorName}</span>
            </p>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          <PlusCircle /> Add Blog
        </button>
      </div>

      {/* ✅ Success message */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg text-center animate-fade">
          {message}
        </div>
      )}

      {/* Blog grid */}
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You don’t have any approved blogs yet.
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <div
              key={b.id}
              onClick={() => navigate(`/blogs/${b.id}`)}
              className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-gray-200 cursor-pointer"
            >
              {b.image && (
                <img
                  src={`${API}/blogs/images/${b.image.split("/").pop()}`}
                  alt={b.title}
                  className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 truncate mb-2">
                  {b.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {b.content}
                </p>
                <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  Approved
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-lg bg-[#0f172a] rounded-2xl text-white p-8 shadow-2xl border border-gray-700">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-2xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-3xl font-extrabold text-center mb-2">
              Welcome, {authorName || "Author"}
            </h2>
            <p className="text-center text-gray-400 mb-6 text-sm">
              Add or edit your blogs below
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Blog Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  className="w-full px-4 py-2 bg-[#1e293b] border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Blog Content
                </label>
                <textarea
                  rows="5"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content..."
                  className="w-full px-4 py-2 bg-[#1e293b] border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Blog Image
                </label>
                <div className="border-2 border-dashed border-blue-600 rounded-lg p-4 text-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {image ? image.name : "Drag & drop an image here or click to select"}
                  </label>
                </div>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-full h-52 object-cover rounded-lg border border-gray-500"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Publish Blog
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
