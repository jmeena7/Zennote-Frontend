import { createSlice } from '@reduxjs/toolkit';

// 🔐 Initial state for auth
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null, // ✅ Load from localStorage if available
};

// ✅ Create Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 🔐 Login or Register success
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('token', token); // ✅ Store token in localStorage
    },

    // 🚪 Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // ❌ Remove token
    },
  },
});

// 🎯 Export
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
