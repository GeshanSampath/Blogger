import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/admin/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/admin/comments/${commentId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments(); // Refresh comments list
    } catch (err) {
      console.error(err);
      alert("Failed to approve comment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Comments Management
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading comments...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-3 px-4 border">ID</th>
                <th className="py-3 px-4 border">Blog</th>
                <th className="py-3 px-4 border">User</th>
                <th className="py-3 px-4 border">Content</th>
                <th className="py-3 px-4 border">Status</th>
                <th className="py-3 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="hover:bg-gray-50 transition border-b"
                  >
                    <td className="py-3 px-4 border">{comment.id}</td>
                    <td className="py-3 px-4 border">{comment.blog?.title}</td>
                    <td className="py-3 px-4 border">{comment.user?.name}</td>
                    <td className="py-3 px-4 border">{comment.content}</td>
                    <td
                      className={`py-3 px-4 border font-semibold ${
                        comment.isApproved ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {comment.isApproved ? "Approved" : "Pending"}
                    </td>
                    <td className="py-3 px-4 border">
                      {!comment.isApproved && (
                        <button
                          onClick={() => approveComment(comment.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-4 text-center text-gray-500"
                  >
                    No comments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
