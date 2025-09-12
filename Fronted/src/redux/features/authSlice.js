import { createSlice } from '@reduxjs/toolkit';

// ✅ Constants for localStorage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// 🔐 Initial state for auth
const initialState = {
  user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
  token: localStorage.getItem(TOKEN_KEY) || null,
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

      // ✅ Persist in localStorage
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // 🚪 Logout
    logout: (state) => {
      state.user = null;
      state.token = null;

      // ❌ Remove from localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

// 🎯 Export actions and reducer
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
