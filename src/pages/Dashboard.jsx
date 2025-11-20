import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotes,
  addNote,
  updateNote,
  deleteNote
} from '../redux/features/NoteSlice';
import { setCredentials } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, user } = useSelector(state => state.auth);
  const { notes, loading, error } = useSelector(state => state.notes);

  const [note, setNote] = useState({ title: '', description: '', tag: '' });
  const [editId, setEditId] = useState(null);

  // ✅ Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken && !token) {
      dispatch(setCredentials({
        user: JSON.parse(storedUser),
        token: storedToken
      }));
    }
  }, [dispatch, token]);

  // ✅ Fetch notes if token exists
  useEffect(() => {
    if (!token) return navigate("/login");
    dispatch(fetchNotes());
  }, [dispatch, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.title || !note.description) {
      toast.warning("🚫 Title & Description required!");
      return;
    }

    try {
      if (editId) {
        await dispatch(updateNote({ id: editId, updatedData: note })).unwrap();
        toast.success("✏️ Note updated!");
        setEditId(null);
      } else {
        await dispatch(addNote({ note })).unwrap();
        toast.success("✅ Note added!");
      }
      setNote({ title: '', description: '', tag: '' });
      dispatch(fetchNotes());
    } catch (err) {
      toast.error("❌ Something went wrong!");
    }
  };

  const handleEdit = (n) => {
    setNote({ title: n.title, description: n.description, tag: n.tag });
    setEditId(n._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this note?")) {
      try {
        await dispatch(deleteNote(id)).unwrap();
        toast.success("🗑️ Deleted!");
        dispatch(fetchNotes());
      } catch {
        toast.error("❌ Failed to delete note!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Welcome, <span className="text-purple-400">{user?.name || "User"}</span> 
        </h2>

        {/* Add Note Form */}
        <div
          className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-xl shadow-2xl
          transform hover:scale-[1.01] transition-all"
        >
          <h3 className="text-xl font-semibold mb-4">
            {editId ? "✏️ Edit Note" : "➕ Add a New Note"}
          </h3>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Title"
              value={note.title}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="bg-white/20 border border-white/30 px-4 py-2 rounded-lg 
              focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />

            <input
              type="text"
              placeholder="Tag (optional)"
              value={note.tag}
              onChange={(e) => setNote({ ...note, tag: e.target.value })}
              className="bg-white/20 border border-white/30 px-4 py-2 rounded-lg 
              focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <textarea
              placeholder="Description"
              value={note.description}
              onChange={(e) =>
                setNote({ ...note, description: e.target.value })
              }
              className="md:col-span-2 bg-white/20 border border-white/30 px-4 py-3 rounded-lg 
              focus:ring-2 focus:ring-purple-400 outline-none h-24"
              required
            />

            <button
              type="submit"
              className="md:col-span-2 py-2 bg-purple-600 hover:bg-purple-700 
              rounded-lg shadow-lg shadow-purple-900/40 transition text-lg font-semibold"
            >
              {editId ? "Update Note" : "Add Note"}
            </button>
          </form>
        </div>

        {/* Notes List */}
        <h3 className="text-2xl font-semibold mt-10 mb-4">📝 Your Notes</h3>

        {loading && (
          <p className="text-gray-300 animate-pulse text-center">Loading...</p>
        )}

        {error && (
          <p className="text-red-400 text-center">❌ {error}</p>
        )}

        {notes.length === 0 && !loading && (
          <p className="text-gray-400 text-center mt-10 animate-pulse">
            No notes found. Start adding one!
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {notes.map((n) => (
            <div
              key={n._id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 
              p-4 rounded-xl shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl"
            >
              <h4 className="text-lg font-bold text-purple-300">{n.title}</h4>
              <p className="text-gray-200 mt-1">{n.description}</p>
              <p className="text-sm text-gray-400 mt-1">#{n.tag}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(n)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
