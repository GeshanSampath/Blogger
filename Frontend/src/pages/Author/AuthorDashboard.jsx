import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { FaCheckCircle, FaClock, FaFileAlt, FaEnvelope, FaUser } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AuthorDashboard() {
  const [counts, setCounts] = useState({
    totalBlogs: 0,
    approvedBlogs: 0,
    pendingBlogs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState({
    name: "Author",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/blogs/author/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setAuthor({
          name: data.authorName || "Author",
          email: data.authorEmail || "No email available",
          avatar: data.authorAvatar || "", // if your API provides avatar
        });

        setCounts({
          totalBlogs: data.total,
          approvedBlogs: data.approved,
          pendingBlogs: data.pending,
        });
      } catch (err) {
        console.error("Error fetching author stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );

  const blogStatusData = [
    { name: "Approved", value: counts.approvedBlogs },
    { name: "Pending", value: counts.pendingBlogs },
  ];

  const COLORS = ["#4ade80", "#facc15"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          Welcome, {author.name}
        </h1>
      </nav>

      {/* Main Content */}
      <div className="p-10 space-y-10">
        {/* Author Profile Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0 hover:shadow-2xl transition">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt="Author Avatar"
              className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-indigo-100 rounded-full border-2 border-indigo-300">
              <FaUser className="text-indigo-500 text-3xl" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 justify-center sm:justify-start">
              <FaUser className="text-indigo-500" /> {author.name}
            </h2>
            <p className="text-gray-600 flex items-center gap-2 justify-center sm:justify-start mt-1">
              <FaEnvelope className="text-gray-500" /> {author.email}
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Blogs"
            value={counts.totalBlogs}
            icon={<FaFileAlt />}
          />
          <MetricCard
            title="Approved Blogs"
            value={counts.approvedBlogs}
            icon={<FaCheckCircle />}
          />
          <MetricCard
            title="Pending Blogs"
            value={counts.pendingBlogs}
            icon={<FaClock />}
            alert={counts.pendingBlogs > 0}
          />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
          <h2 className="text-xl font-semibold mb-4">Blog Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={blogStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {blogStatusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, alert }) {
  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-6 text-center flex flex-col items-center justify-center space-y-2 transition hover:scale-105 ${
        alert ? "border-2 border-yellow-400" : ""
      }`}
    >
      <div className="text-3xl text-gray-700">{icon}</div>
      <h2 className="text-gray-500 font-semibold">{title}</h2>
      <p className={`text-3xl font-bold ${alert ? "text-yellow-500" : ""}`}>
        {value}
      </p>
    </div>
  );
}
