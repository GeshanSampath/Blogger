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
  const [hoverMoon, setHoverMoon] = useState(false);
  const [fireflies, setFireflies] = useState([]);

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

  const spawnFirefly = (e) => {
    const newFirefly = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 5 + 3,
    };
    setFireflies([...fireflies, newFirefly]);
    setTimeout(() => {
      setFireflies((prev) => prev.filter((f) => f.id !== newFirefly.id));
    }, newFirefly.duration * 1000);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden text-white"
      onClick={spawnFirefly}
    >
      {/* Animated Night Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120] via-[#0f172a] to-[#1e293b]">
        {/* Stars Layers */}
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}

        {/* Moon */}
        <div
          className={`moon ${hoverMoon ? "blood" : ""}`}
          onMouseEnter={() => setHoverMoon(true)}
          onMouseLeave={() => setHoverMoon(false)}
        ></div>

        {/* Fireflies */}
        {fireflies.map((f) => (
          <div
            key={f.id}
            className="firefly"
            style={{
              left: f.x,
              top: f.y,
              width: f.size,
              height: f.size,
              animationDuration: `${f.duration}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Form */}
      <div className="relative w-full max-w-3xl bg-[#1e293b]/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-blue-900/40 z-10">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-blue-300 mb-2 drop-shadow-lg">
            Welcome, {authorName}
          </h1>
          <p className="text-gray-300">Add or edit your blogs below</p>
        </div>

        {successMessage && (
          <div className="bg-green-200/20 border border-green-500 text-green-300 text-center py-3 px-4 mb-6 rounded-lg animate-fadeIn">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0f172a]/80 border border-blue-800 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Blog Content
            </label>
            <textarea
              placeholder="Write your blog content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0f172a]/80 border border-blue-800 text-white h-56 focus:ring-2 focus:ring-blue-400 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="border-2 border-dashed border-blue-800 p-6 rounded-xl text-center hover:border-blue-400 transition-all duration-300 cursor-pointer relative bg-[#0f172a]/60">
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
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-gray-400">
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

          <button
            type="submit"
            disabled={loading}
            className={`py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all ${
              loading
                ? "bg-blue-400/50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-800/40"
            }`}
          >
            {loading ? "Saving..." : blog ? "Update Blog" : "Publish Blog"}
          </button>
        </form>
      </div>

      <style>{`
        /* Stars */
        .star {
          position: absolute;
          background: radial-gradient(circle, #fff, transparent);
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        /* Moon hover effect */
        .moon {
          position: absolute;
          top: 10%;
          right: 15%;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle at 30% 30%, #fff, #ddd);
          border-radius: 50%;
          box-shadow: 0 0 50px 10px rgba(255,255,255,0.2);
          transition: all 0.5s ease;
        }
        .moon.blood {
          background: radial-gradient(circle at 30% 30%, #ff3b3b, #aa1111);
          box-shadow: 0 0 70px 20px rgba(255,59,59,0.5);
        }

        /* Fireflies */
        .firefly {
          position: absolute;
          background: radial-gradient(circle, #ffd700, transparent);
          border-radius: 50%;
          pointer-events: none;
          animation: floatFirefly linear infinite alternate;
        }
        @keyframes floatFirefly {
          0% { transform: translate(0,0) rotate(0deg); opacity: 0.8; }
          50% { transform: translate(calc(-50px + 100px*var(--rand)), calc(-50px + 100px*var(--rand))) rotate(180deg); opacity: 1; }
          100% { transform: translate(0,0) rotate(360deg); opacity: 0.8; }
        }

        /* Fade in success */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
