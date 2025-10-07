import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { FaUser, FaUserTie, FaFileAlt, FaClock } from "react-icons/fa";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    users: 0,
    authors: 0,
    pendingAuthors: 0,
    totalBlogs: 0,
    activeBlogs: 0,
    pendingBlogs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("Admin"); // Replace with auth context if needed

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const usersRes = await axios.get("http://localhost:3000/dashboard/users-count");
        const blogsRes = await axios.get("http://localhost:3000/dashboard/blogs-count");

        setCounts({
          users: usersRes.data.users,
          authors: usersRes.data.authors,
          pendingAuthors: usersRes.data.pendingAuthors,
          totalBlogs: blogsRes.data.totalBlogs,
          activeBlogs: blogsRes.data.activeBlogs,
          pendingBlogs: blogsRes.data.totalBlogs - blogsRes.data.activeBlogs,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  const roleData = [
    { name: "Users", value: counts.users },
    { name: "Authors", value: counts.authors },
  ];

  const blogStatusData = [
    { name: "Active Blogs", value: counts.activeBlogs },
    { name: "Pending Blogs", value: counts.pendingBlogs },
  ];

  const COLORS = ["#4ade80", "#3b82f6"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Blogger Admin</h1>
        <span className="text-gray-700 font-semibold">{adminName}</span>
      </nav>

      {/* Main Content */}
      <div className="p-10 space-y-10">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <MetricCard title="Users" value={counts.users} icon={<FaUser />} />
          <MetricCard title="Authors" value={counts.authors} icon={<FaUserTie />} />
          <MetricCard title="Pending Authors" value={counts.pendingAuthors} icon={<FaClock />} alert={counts.pendingAuthors > 0} />
          <MetricCard title="Total Blogs" value={counts.totalBlogs} icon={<FaFileAlt />} />
          <MetricCard title="Pending Blogs" value={counts.pendingBlogs} icon={<FaClock />} alert={counts.pendingBlogs > 0} />
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ChartCard title="User Role Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {roleData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Blog Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={blogStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {blogStatusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, alert }) {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 text-center flex flex-col items-center justify-center space-y-2 transition hover:scale-105 ${alert ? "border-2 border-red-400" : ""}`}>
      <div className="text-3xl text-gray-700">{icon}</div>
      <h2 className="text-gray-500 font-semibold">{title}</h2>
      <p className={`text-3xl font-bold ${alert ? "text-red-500" : ""}`}>{value}</p>
    </div>
  );
}

// Chart Card Wrapper
function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
