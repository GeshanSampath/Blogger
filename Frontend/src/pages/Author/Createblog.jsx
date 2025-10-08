import React, { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function CreateBlog({ blog, onSuccess }) {
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    blog?.image ? `${API}/blogs/images/${blog.image.split("/").pop()}` : ""
  );
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API}/blogs/author`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.length > 0)
          setAuthorName(res.data[0].author?.name || "Author");
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthor();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content are required");
    setLoading(true);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      if (blog) {
        await axios.put(`${API}/blogs/${blog.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/blogs`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setSuccessMessage("✅ Blog submitted successfully! Waiting for admin approval.");
      setTimeout(() => setSuccessMessage(""), 3000);

      if (onSuccess) onSuccess();

      // clear form
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            Welcome, {authorName}
          </h1>
          <p className="text-gray-500">Add or edit your blogs below</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 text-center py-3 px-4 mb-6 rounded-lg animate-fadeIn">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Blog Content
            </label>
            <textarea
              placeholder="Write your blog content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 h-56 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center hover:border-indigo-500 transition-all duration-300 cursor-pointer relative">
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-gray-500">
                Drag & drop an image here or click to select
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
            }`}
          >
            {loading ? "Saving..." : blog ? "Update Blog" : "Publish Blog"}
          </button>
        </form>
      </div>

      {/* Animation for Success */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
