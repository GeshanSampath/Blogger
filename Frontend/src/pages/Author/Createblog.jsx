// src/pages/Author/CreateBlog.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function CreateBlog({ blog, onSuccess }) {
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog?.image ? `${API}/blogs/images/${blog.image.split("/").pop()}` : "");
  const [loading, setLoading] = useState(false);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API}/blogs/author`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.length > 0) setAuthorName(res.data[0].author?.name || "Author");
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

      if (onSuccess) onSuccess();
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
    <div className="min-h-screen p-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
        Welcome, {authorName}
      </h1>
      <p className="text-gray-600 mb-8">Add or edit your blogs below</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md max-w-3xl mx-auto flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 h-48 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />

        <div className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-60 object-cover rounded-lg mx-auto"
            />
          ) : (
            <p className="text-gray-500">Drag & drop an image here or click to select</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : blog ? "Update Blog" : "Add Blog"}
        </button>
      </form>
    </div>
  );
}
