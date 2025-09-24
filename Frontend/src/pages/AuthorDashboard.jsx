// src/pages/AuthorDashboard.jsx
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { createBlog, getMyBlogs } from '../api/blogs';
import { selectCommentByAuthor } from '../api/comments';

export default function AuthorDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getMyBlogs();
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBlog = async () => {
    if (!title || !content) return alert("Please fill all fields");
    try {
      await createBlog({ title, content });
      setTitle('');
      setContent('');
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectComment = async (id) => {
    try {
      await selectCommentByAuthor(id);
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar role="author" />
      <div className="p-10 flex-1">
        <h1 className="text-3xl font-bold mb-5">Create Blog</h1>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full mb-3"/>
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} className="border p-2 w-full mb-3"/>
        <button onClick={handleCreateBlog} className="bg-blue-500 text-white px-3 py-1 rounded">Submit</button>

        <h1 className="text-3xl font-bold my-5">My Blogs</h1>
        {blogs.length === 0 && <p>No blogs yet.</p>}
        {blogs.map(blog => (
          <div key={blog.id} className="p-5 border mb-3 rounded">
            <h2 className="font-bold">{blog.title} ({blog.status})</h2>

            {blog.comments?.length > 0 && <p className="mt-2 font-semibold">Comments:</p>}
            {blog.comments?.map(c => (
              <div key={c.id} className="flex justify-between border p-2 my-1 rounded">
                <p>{c.content} by {c.user.username}</p>
                {c.status === 'pending' && (
                  <button onClick={() => handleSelectComment(c.id)} className="bg-yellow-500 text-white px-2 rounded">Select</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
