// src/components/CommentManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function CommentManager({ blog, onClose }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/comments/blog/${blog.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (commentId, approve) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/comments/${commentId}`, { isApproved: approve }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Manage Comments for "{blog.title}"</h2>
        <button className="absolute top-4 right-4" onClick={onClose}>✕</button>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="flex justify-between items-center border-b pb-2">
                <span>{c.content}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(c.id, true)}
                    className="bg-green-500 px-2 py-1 rounded text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApprove(c.id, false)}
                    className="bg-red-500 px-2 py-1 rounded text-white"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
