import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
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
  const [adminName, setAdminName] = useState("Admin");

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
      <nav className="bg-white shadow-md px-4 md:px-6 py-4 flex justify-between items-center flex-wrap sticky top-0 z-50">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
          Welcome to the Admin Panel
        </h1>
        <span className="text-gray-700 font-semibold text-sm md:text-base mt-2 md:mt-0">
          {adminName}
        </span>
      </nav>

      {/* Main Content */}
      <div className="p-4 md:p-10 space-y-10">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center">
          <MetricCard title="Users" value={counts.users} icon={<FaUser />} />
          <MetricCard title="Authors" value={counts.authors} icon={<FaUserTie />} />
          <MetricCard
            title="Pending Authors"
            value={counts.pendingAuthors}
            icon={<FaClock />}
            alert={counts.pendingAuthors > 0}
          />
          <MetricCard title="Total Blogs" value={counts.totalBlogs} icon={<FaFileAlt />} />
          <MetricCard
            title="Pending Blogs"
            value={counts.pendingBlogs}
            icon={<FaClock />}
            alert={counts.pendingBlogs > 0}
          />
        </div>

        {/* Pie Charts */}
        <div className="flex flex-col lg:flex-row gap-6 flex-wrap justify-center items-stretch">
          <ChartCard title="User Role Distribution">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Blog Status">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={blogStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
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
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, alert }) {
  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-3 sm:p-4 md:p-6 w-[140px] sm:w-[160px] md:w-[200px] text-center flex flex-col items-center justify-center space-y-1 transition hover:scale-105 ${
        alert ? "border-2 border-red-400" : ""
      }`}
    >
      <div className="text-2xl md:text-3xl text-gray-700">{icon}</div>
      <h2 className="text-gray-500 font-semibold text-xs sm:text-sm md:text-base">
        {title}
      </h2>
      <p
        className={`text-xl sm:text-2xl md:text-3xl font-bold ${
          alert ? "text-red-500" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// Chart Card Wrapper
function ChartCard({ title, children }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg hover:shadow-2xl transition w-full lg:w-[48%] flex flex-col justify-center">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-center md:text-left">
        {title}
      </h2>
      {children}
    </div>
  );
}
