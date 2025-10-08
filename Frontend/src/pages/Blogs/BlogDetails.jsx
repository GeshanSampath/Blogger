import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const [replyBox, setReplyBox] = useState({});
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
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
      console.error(err);
    }
  };

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/blogs/${id}`);
      setBlog(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.status === 404 ? "Blog not found or not approved." : "Failed to load blog.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await axios.get(`${API}/blogs/${id}/comments`);
      setComments(res.data);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const postComment = useCallback(
    async (e) => {
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
        console.error(err.response?.data || err.message);
      }
    },
    [comment, id]
  );

  const postReply = useCallback(
    async (commentId, e) => {
      e.preventDefault();
      const content = replyContent[commentId]?.trim();
      if (!content) return;

      try {
        await axios.post(
          `${API}/blogs/${id}/comments/${commentId}/replies`,
          { content },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
        fetchComments();
        setReplyBox((prev) => ({ ...prev, [commentId]: false }));
      } catch (err) {
        if (err.response?.status === 403) alert("Only the blog author can reply.");
        else alert("Failed to post reply");
        console.error(err.response?.data || err.message);
      }
    },
    [id, replyContent]
  );

  if (loading) return <p className="text-center text-gray-400 mt-20">Loading blog...</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  return (
    <section className="p-6 md:p-10 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto mt-32">
        {/* Blog Header */}
        {blog?.image && (
          <img
            src={`${API}/blogs/images/${blog.image.split("/").pop()}`}
            alt={blog.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg mb-6"
          />
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-wide">{blog?.title}</h1>
        <p className="text-indigo-300 mb-6 text-sm md:text-base">
          By <span className="font-semibold">{blog?.author?.name}</span>
        </p>
        <article
          className="text-gray-200 leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog?.content }}
        />

        {/* Comments Section */}
        <div className="mt-12 p-6 rounded-2xl bg-gray-800 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
            Comments ({comments.length})
          </h2>

          {commentsLoading ? (
            <p className="text-gray-400">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400">No comments yet. Be the first!</p>
          ) : (
            <ul className="space-y-5">
              {comments.map((c) => (
                <li key={c.id}>
                  <div className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">
                    <p className="font-semibold text-indigo-300">{c.user?.name || "Anonymous"}</p>
                    <p className="text-gray-200">{c.content}</p>
                  </div>

                  {/* Reply button */}
                  {currentUser && +blog.author.id === +currentUser.id && (
                    <button
                      onClick={() => setReplyBox((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                      className="text-xs text-pink-400 hover:underline mt-2 ml-2"
                    >
                      {replyBox[c.id] ? "Cancel Reply" : "Reply"}
                    </button>
                  )}

                  {/* Replies List */}
                  {c.replies?.length > 0 && (
                    <div className="mt-2 ml-6">
                      <button
                        onClick={() =>
                          setVisibleReplies((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                        }
                        className="text-xs text-pink-400 hover:underline"
                      >
                        {visibleReplies[c.id]
                          ? "Hide replies"
                          : `View replies (${c.replies.length})`}
                      </button>

                      {visibleReplies[c.id] && (
                        <ul className="mt-2 space-y-2">
                          {c.replies.map((r) => (
                            <li key={r.id} className="bg-white/5 p-3 rounded-lg ml-4">
                              <p className="font-semibold text-indigo-300">{r.user?.name}</p>
                              <p className="text-gray-300">{r.content}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyBox[c.id] && (
                    <form
                      onSubmit={(e) => postReply(c.id, e)}
                      className="mt-2 flex gap-2 ml-6"
                    >
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        className="flex-1 p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={replyContent[c.id] || ""}
                        onChange={(e) =>
                          setReplyContent({ ...replyContent, [c.id]: e.target.value })
                        }
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-white font-semibold transition"
                      >
                        Reply
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Add comment */}
          {currentUser && (
            <form onSubmit={postComment} className="mt-8 flex gap-3 flex-col md:flex-row">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 p-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white font-semibold transition"
              >
                Comment
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
