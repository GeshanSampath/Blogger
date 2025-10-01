import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { User } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BlogDetails() {
  const { id } = useParams(); // ✅ Blog ID from URL
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${API}/blogs/${id}`);
      setBlog(res.data);
    } catch (err) {
      console.error("Error fetching blog:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API}/blogs/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API}/blogs/${id}/comments`, {
        text: commentText,
      });
      setCommentText("");
      fetchComments(); // refresh comments
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleReplySubmit = async (commentId, replyText) => {
    if (!replyText.trim()) return;
    try {
      await axios.post(`${API}/comments/${commentId}/replies`, {
        text: replyText,
      });
      fetchComments();
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  if (!blog) return <p className="p-10">Loading blog...</p>;

  return (
    <section className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">{blog.title}</h1>
      <p className="flex items-center gap-2 text-gray-600 mb-6">
        <User size={18} className="text-indigo-500" />{" "}
        {blog.author?.name || "Unknown Author"}
      </p>
      {blog.image && (
        <img
          src={`${API}/blogs/images/${blog.image.split("/").pop()}`}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-lg mb-6"
        />
      )}
      <div
        className="prose prose-indigo max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      ></div>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Post
          </button>
        </div>

        <ul className="space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="border-b pb-4">
              <p className="font-medium text-gray-800">{c.user?.name || "User"}</p>
              <p className="text-gray-700">{c.text}</p>

              {/* Replies */}
              <ul className="ml-6 mt-2 space-y-2 border-l pl-4">
                {c.replies?.map((r) => (
                  <li key={r.id}>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-indigo-600">
                        {r.user?.name || "Author"}:
                      </span>{" "}
                      {r.text}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Reply Box (for authors) */}
              <ReplyBox commentId={c.id} onReply={handleReplySubmit} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ReplyBox({ commentId, onReply }) {
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    onReply(commentId, replyText);
    setReplyText("");
  };

  return (
    <div className="mt-2 flex gap-2">
      <input
        type="text"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Reply to comment..."
        className="flex-1 border border-gray-300 rounded-lg px-3 py-1"
      />
      <button
        onClick={handleReply}
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
      >
        Reply
      </button>
    </div>
  );
}