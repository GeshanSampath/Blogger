import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MessageCircle, Send, Reply, Eye, EyeOff, Sparkles, User } from "lucide-react";

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
      setComments(res.data.filter((c) => c.isApproved));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 text-center">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <section className="relative z-10 p-6 md:p-10">
        <div className="max-w-5xl mx-auto mt-20 md:mt-32">
          {/* Blog Header with Glass Morphism */}
          <article className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition-transform duration-300">
            {blog?.image && (
              <div className="relative overflow-hidden group">
                <img
                  src={`${API}/blogs/images/${blog.image.split("/").pop()}`}
                  alt={blog.title}
                  className="w-full h-72 md:h-96 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                    {blog?.author?.name}
                  </p>
                  <p className="text-gray-500 text-sm">Author</p>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 leading-tight">
                {blog?.title}
              </h1>

              <article
                className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-purple-400 prose-headings:to-pink-400 prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-pink-400"
                dangerouslySetInnerHTML={{ __html: blog?.content }}
              />
            </div>
          </article>

          {/* Comments Section with Modern Design */}
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-6 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Comments
              </h2>
              <span className="ml-auto px-4 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-semibold">
                {comments.length}
              </span>
            </div>

            {commentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400 text-lg">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => (
                  <li key={c.id} className="group">
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {(c.user?.name || "A").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-purple-300">{c.user?.name || "Anonymous"}</p>
                          <p className="text-gray-200 mt-1">{c.content}</p>
                        </div>
                      </div>

                      {currentUser && +blog.author.id === +currentUser.id && (
                        <button
                          onClick={() => setReplyBox((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                          className="flex items-center gap-2 text-xs text-pink-400 hover:text-pink-300 mt-3 ml-13 group-hover:translate-x-1 transition-all"
                        >
                          <Reply className="w-3 h-3" />
                          {replyBox[c.id] ? "Cancel" : "Reply"}
                        </button>
                      )}

                      {c.replies?.length > 0 && (
                        <div className="mt-4 ml-13">
                          <button
                            onClick={() => setVisibleReplies((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                            className="flex items-center gap-2 text-xs text-pink-400 hover:text-pink-300 transition-colors"
                          >
                            {visibleReplies[c.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {visibleReplies[c.id] ? "Hide replies" : `View ${c.replies.length} ${c.replies.length === 1 ? 'reply' : 'replies'}`}
                          </button>

                          {visibleReplies[c.id] && (
                            <ul className="mt-3 space-y-3">
                              {c.replies.map((r) => (
                                <li key={r.id} className="bg-white/5 p-4 rounded-xl ml-4 border-l-2 border-purple-500/50">
                                  <div className="flex items-start gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                                      <span className="text-white font-bold text-xs">
                                        {(r.user?.name || "A").charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-purple-300 text-sm">{r.user?.name}</p>
                                      <p className="text-gray-300 text-sm mt-1">{r.content}</p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}

                      {replyBox[c.id] && (
                        <form onSubmit={(e) => postReply(c.id, e)} className="mt-4 ml-13 flex gap-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            className="flex-1 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            value={replyContent[c.id] || ""}
                            onChange={(e) => setReplyContent({ ...replyContent, [c.id]: e.target.value })}
                          />
                          <button
                            type="submit"
                            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {currentUser && (
              <form onSubmit={postComment} className="mt-8 flex gap-3 flex-col md:flex-row">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  <Send className="w-5 h-5" />
                  <span>Comment</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}