import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PendingAuthors() {
  const [authors, setAuthors] = useState([]);

  const fetchPendingAuthors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users/pending-authors");
      setAuthors(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch pending authors");
    }
  };

  const approveAuthor = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/users/approve/${id}`);
      setAuthors(authors.filter((author) => author.id !== id));
      alert("Author approved!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve author");
    }
  };

  useEffect(() => {
    fetchPendingAuthors();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Authors</h2>
      {authors.length === 0 && <p>No pending authors</p>}
      <ul>
        {authors.map((author) => (
          <li
            key={author.id}
            className="flex justify-between items-center mb-2 p-2 border rounded-lg"
          >
            <span>{author.name} ({author.email})</span>
            <button
              onClick={() => approveAuthor(author.id)}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
