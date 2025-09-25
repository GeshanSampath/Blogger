import React, { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BlogForm({ blog, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      setImage(null);
    } else {
      setTitle("");
      setContent("");
      setImage(null);
    }
  }, [blog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      if (blog) {
        await axios.put(`${API}/blogs/${blog.id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API}/blogs`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Failed to save blog. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-lg flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold">{blog ? "Edit Blog" : "Add Blog"}</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 rounded bg-gray-700 text-white"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="p-2 rounded bg-gray-700 text-white h-40"
        />

        {/* Preview existing image if editing */}
        {blog?.image && !image && (
          <img
            src={`${API}${blog.image}`}
            alt="Current"
            className="w-full h-40 object-cover rounded"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-white"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
          >
            {loading ? "Saving..." : blog ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
