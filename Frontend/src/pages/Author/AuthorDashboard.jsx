import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AuthorDashboard() {
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const fetchBlogCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/blogs/author`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const blogs = res.data;
        setAuthorName(blogs[0]?.author?.name || "Author");

        const approved = blogs.filter(b => b.status === "approved").length;
        const rejected = blogs.filter(b => b.status === "rejected").length;

        setApprovedCount(approved);
        setRejectedCount(rejected);
        setTotalCount(blogs.length);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogCounts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
        Welcome, {authorName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Total Blogs */}
        <div className="bg-blue-100 rounded-xl p-6 shadow flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-blue-800">Total Blogs</h2>
          <p className="text-5xl font-bold text-blue-900 mt-4">{totalCount}</p>
        </div>

        {/* Approved Blogs */}
        <div className="bg-green-100 rounded-xl p-6 shadow flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-green-800">Approved Blogs</h2>
          <p className="text-5xl font-bold text-green-900 mt-4">{approvedCount}</p>
        </div>

        {/* Rejected Blogs */}
        <div className="bg-red-100 rounded-xl p-6 shadow flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-red-800">Rejected Blogs</h2>
          <p className="text-5xl font-bold text-red-900 mt-4">{rejectedCount}</p>
        </div>
      </div>
    </div>
  );
}
