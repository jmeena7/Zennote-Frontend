import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL
const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/notes`;

// 🔁 Fetch Notes
export const fetchNotes = createAsyncThunk('notes/fetchNotes', async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const token = state.auth.token || localStorage.getItem('token');

    if (!token) return thunkAPI.rejectWithValue('Token not found');

    const res = await axios.get(API_URL, {
      headers: { 'auth-token': token }
    });

    return res.data; // { success, notes }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch notes');
  }
});

// 🆕 Add Note
export const addNote = createAsyncThunk('notes/addNote', async ({ note }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token || localStorage.getItem('token');

    const res = await axios.post(API_URL, note, {
      headers: { 'auth-token': token }
    });

    return res.data; // { success, note }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to add note');
  }
});

// 📝 Update Note
export const updateNote = createAsyncThunk('notes/updateNote', async ({ id, updatedData }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token || localStorage.getItem('token');

    const res = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: { 'auth-token': token }
    });

    return res.data; // { success, note }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to update note');
  }
});

// ❌ Delete Note
export const deleteNote = createAsyncThunk('notes/deleteNote', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token || localStorage.getItem('token');

    await axios.delete(`${API_URL}/${id}`, {
      headers: { 'auth-token': token }
    });

    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to delete note');
  }
});

const noteSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ⭐ Fetch Notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload.notes || [];   // FIXED
        state.loading = false;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⭐ Add Note
      .addCase(addNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload.note);   // FIXED
        state.loading = false;
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⭐ Update Note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const updatedNote = action.payload.note;  // FIXED
        const index = state.notes.findIndex(n => n._id === updatedNote._id);
        if (index !== -1) state.notes[index] = updatedNote;
        state.loading = false;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ⭐ Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default noteSlice.reducer;
