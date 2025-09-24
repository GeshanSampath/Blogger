import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const token = localStorage.getItem("token");
  const [authors, setAuthors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAuthors();
    fetchBlogs();
    fetchComments();
  }, []);

  const fetchAuthors = async () => {
    const res = await axios.get("http://localhost:3000/users/pending", { headers: { Authorization: `Bearer ${token}` } });
    setAuthors(res.data);
  };

  const fetchBlogs = async () => {
    const res = await axios.get("http://localhost:3000/blogs/pending", { headers: { Authorization: `Bearer ${token}` } });
    setBlogs(res.data);
  };

  const fetchComments = async () => {
    const res = await axios.get("http://localhost:3000/comments/pending", { headers: { Authorization: `Bearer ${token}` } });
    setComments(res.data);
  };

  const approveAuthor = async (id) => {
    await axios.post(`http://localhost:3000/users/approve`, { id }, { headers: { Authorization: `Bearer ${token}` } });
    setMessage("Author approved!");
    fetchAuthors();
  };

  const approveBlog = async (id) => {
    await axios.post(`http://localhost:3000/blogs/approve`, { id }, { headers: { Authorization: `Bearer ${token}` } });
    setMessage("Blog approved!");
    fetchBlogs();
  };

  const approveComment = async (id) => {
    await axios.post(`http://localhost:3000/comments/approve`, { id }, { headers: { Authorization: `Bearer ${token}` } });
    setMessage("Comment approved!");
    fetchComments();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      {message && <p className="text-green-500 mb-4">{message}</p>}

      <h2 className="text-xl font-bold mb-3">Pending Authors</h2>
      {authors.map(a => (
        <div key={a.id} className="border p-2 mb-2 flex justify-between">
          <span>{a.name} ({a.email})</span>
          <button onClick={() => approveAuthor(a.id)} className="bg-green-500 text-white p-1 rounded">Approve</button>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6 mb-3">Pending Blogs</h2>
      {blogs.map(b => (
        <div key={b.id} className="border p-2 mb-2 flex justify-between">
          <span>{b.title} by {b.user.name}</span>
          <button onClick={() => approveBlog(b.id)} className="bg-green-500 text-white p-1 rounded">Approve</button>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6 mb-3">Pending Comments</h2>
      {comments.map(c => (
        <div key={c.id} className="border p-2 mb-2 flex justify-between">
          <span>{c.user_name}: {c.content}</span>
          <button onClick={() => approveComment(c.id)} className="bg-green-500 text-white p-1 rounded">Approve</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
