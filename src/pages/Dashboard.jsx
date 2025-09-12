import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotes,
  addNote,
  updateNote,
  deleteNote
} from '../redux/features/NoteSlice';
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

  useEffect(() => {
    if (token) {
      dispatch(fetchNotes());
    } else {
      navigate("/login");
    }
  }, [dispatch, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.title || !note.description) {
      toast.warning("🚫 Title and Description are required!");
      return;
    }

    try {
      if (editId) {
        await dispatch(updateNote({ id: editId, updatedData: note })).unwrap();
        toast.success("✏️ Note updated successfully!");
        setEditId(null);
      } else {
        await dispatch(addNote({ note })).unwrap();
        toast.success("✅ Note added successfully!");
      }

      setNote({ title: '', description: '', tag: '' });
      dispatch(fetchNotes());
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(`❌ ${err || 'Something went wrong!'}`);
    }
  };

  const handleEdit = (note) => {
    setNote({
      title: note.title,
      description: note.description,
      tag: note.tag
    });
    setEditId(note._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await dispatch(deleteNote(id)).unwrap(); // ✅ FIXED: pass only ID, not object
        toast.success("🗑️ Note deleted!");
        dispatch(fetchNotes());
      } catch (err) {
        console.error("❌ Delete Error:", err);
        toast.error("❌ Failed to delete note");
      }
    }
  };

  return (
    <div>
      <Navbar />

      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {user?.name || 'User'} 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={note.description}
            onChange={(e) => setNote({ ...note, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            placeholder="Tag"
            value={note.tag}
            onChange={(e) => setNote({ ...note, tag: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            {editId ? 'Update Note' : 'Add Note'}
          </button>
        </form>

        {loading && <p>🔄 Loading notes...</p>}
        {error && <p className="text-red-500">❌ Error: {error}</p>}

        {notes.length === 0 && !loading && (
          <p className="text-gray-500 text-center">No notes found. Start by adding one!</p>
        )}

        <ul className="space-y-2">
          {notes.map(n => (
            <li key={n._id} className="border rounded p-3 shadow-sm">
              <div className="font-semibold">{n.title}</div>
              <div>{n.description}</div>
              <div className="text-sm text-gray-500">#{n.tag}</div>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(n)}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="text-red-600 underline hover:text-red-800"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
