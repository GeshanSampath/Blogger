import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/blogs"); // your endpoint
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch blogs");
    }
  };

  const approveBlog = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/blogs/approve/${id}`); // implement in backend
      setBlogs(blogs.filter((blog) => blog.id !== id));
      alert("Blog approved!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Blogs</h2>
      {blogs.length === 0 && <p>No blogs to manage</p>}
      <ul>
        {blogs.map((blog) => (
          <li
            key={blog.id}
            className="flex justify-between items-center mb-2 p-2 border rounded-lg"
          >
            <span>{blog.title}</span>
            <button
              onClick={() => approveBlog(blog.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
