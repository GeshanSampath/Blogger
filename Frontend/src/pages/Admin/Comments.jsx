import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComment, setSelectedComment] = useState(null); // for modal
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Prioritize pending comments
      const sorted = res.data.sort((a, b) => {
        if (!a.isApproved && b.isApproved) return -1;
        if (a.isApproved && !b.isApproved) return 1;
        return 0;
      });

      setComments(sorted);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (commentId) => {
    try {
      await axios.patch(
        `${API}/admin/comments/${commentId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Comment approved!");
      fetchComments();
    } catch (err) {
      console.error(err);
      alert("Failed to approve comment");
    }
  };

  // Pagination
  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
  const paginatedComments = comments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="p-10 bg-gray-50 min-h-screen text-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        Comments Management
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 font-medium">Loading comments...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-green-600 font-medium">
          No comments found 🎉
        </p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full border-collapse text-sm text-left">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 font-semibold">#</th>
                  <th className="px-6 py-3 font-semibold">Blog</th>
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Content</th>
                  <th className="px-6 py-3 font-semibold text-center">Status</th>
                  <th className="px-6 py-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedComments.map((comment, index) => (
                  <tr
                    key={comment.id}
                    className="border-b hover:bg-gray-50 transition-all"
                  >
                    <td className="px-6 py-4">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td className="px-6 py-4 font-medium">{comment.blog?.title || "Unknown"}</td>
                    <td className="px-6 py-4">{comment.user?.name || "Unknown"}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{comment.content}</td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        comment.isApproved ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {comment.isApproved ? "Approved" : "Pending"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!comment.isApproved ? (
                        <button
                          onClick={() => approveComment(comment.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold text-sm">
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg font-medium ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal for viewing comment */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
            <button
              onClick={() => setSelectedComment(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Comment Details
            </h3>

            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-700">Blog:</span>{" "}
              {selectedComment.blog?.title || "Unknown"}
            </p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold text-gray-700">User:</span>{" "}
              {selectedComment.user?.name || "Unknown"}
            </p>
            <p className="text-gray-800 mb-4">
              <span className="font-semibold text-gray-700">Content:</span>{" "}
              {selectedComment.content}
            </p>
            <p
              className={`font-semibold mb-6 ${
                selectedComment.isApproved ? "text-green-600" : "text-red-500"
              }`}
            >
              {selectedComment.isApproved ? "Approved" : "Pending Approval"}
            </p>

            <div className="flex justify-end gap-3">
              {!selectedComment.isApproved && (
                <button
                  onClick={() => {
                    approveComment(selectedComment.id);
                    setSelectedComment(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => setSelectedComment(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
