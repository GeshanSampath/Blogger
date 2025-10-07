import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [replyBox, setReplyBox] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${API}/blogs/${id}`);
      setBlog(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Blog not found or not approved.");
      } else {
        setError("Failed to load blog.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API}/blogs/${id}/comments`);
      setComments(res.data);
    } catch {
      setComments([]);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(
        `${API}/blogs/${id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setComment("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err.response?.data || err.message);
    }
  };

  const postReply = async (commentId, e) => {
    e.preventDefault();
    if (!replyContent[commentId]?.trim()) return;
    try {
      await axios.post(
        `${API}/blogs/${id}/comments/${commentId}/replies`,
        { content: replyContent[commentId] },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      fetchComments();
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Only the blog author can reply to comments.");
      } else {
        alert("Failed to post reply");
      }
      console.error("Error posting reply:", err.response?.data || err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="p-10 bg-gray-900 text-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        {blog?.image && (
          <img
            src={`${API}/blogs/images/${blog.image.split("/").pop()}`}
            alt={blog.title}
            className="w-full h-56 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-4xl font-bold mb-2">{blog?.title}</h1>
        <p className="text-indigo-300 mb-6">By {blog?.author?.name}</p>
        <article
          className="text-gray-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog?.content }}
        />

        <div className="mt-12 p-6 rounded-xl bg-gray-800 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 && (
            <p className="text-gray-400">No comments yet. Be the first!</p>
          )}

          <ul className="space-y-5">
            {comments.map((c) => (
              <li key={c.id}>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="font-semibold">{c.user?.name || "Anonymous"}</p>
                  <p className="text-gray-200">{c.content}</p>
                </div>

                {/* Reply button only for blog author */}
                {currentUser && +blog.author.id === +currentUser.id && (
                  <button
                    onClick={() =>
                      setReplyBox((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                    }
                    className="text-xs text-indigo-400 hover:underline mt-2"
                  >
                    {replyBox[c.id] ? "Cancel Reply" : "Reply"}
                  </button>
                )}

                {/* Replies List */}
                {c.replies?.length > 0 && (
                  <div className="mt-2 ml-4">
                    <button
                      onClick={() =>
                        setVisibleReplies((prev) => ({
                          ...prev,
                          [c.id]: !prev[c.id],
                        }))
                      }
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      {visibleReplies[c.id]
                        ? "Hide replies"
                        : `View replies (${c.replies.length})`}
                    </button>

                    {visibleReplies[c.id] && (
                      <ul className="mt-2 space-y-2">
                        {c.replies.map((r) => (
                          <li
                            key={r.id}
                            className="bg-white/5 p-2 rounded-lg ml-4"
                          >
                            <p className="font-semibold">{r.user?.name}</p>
                            <p className="text-gray-300">{r.content}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Reply form */}
                {replyBox[c.id] && (
                  <form
                    onSubmit={(e) => postReply(c.id, e)}
                    className="mt-2 flex gap-2 ml-6"
                  >
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      className="flex-1 p-2 rounded-lg text-black"
                      value={replyContent[c.id] || ""}
                      onChange={(e) =>
                        setReplyContent({
                          ...replyContent,
                          [c.id]: e.target.value,
                        })
                      }
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 rounded-lg text-white"
                    >
                      Reply
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>

          {/* Add comment */}
          {currentUser && (
            <form onSubmit={postComment} className="mt-8 flex gap-3">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 p-3 text-black rounded-lg"
              />
              <button
                type="submit"
                disabled={!comment}
                className="px-6 py-2 bg-pink-600 rounded-lg text-white"
              >
                Comment
              </button>
            </form>
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-8 text-indigo-400 hover:underline"
        >
          ← Back to Blogs
        </button>
      </div>
    </section>
  );
}