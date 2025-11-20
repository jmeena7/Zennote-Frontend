import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.auth);

  // ✅ Restore user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken && !token) {
      dispatch(setCredentials({ user: JSON.parse(storedUser), token: storedToken }));
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(setCredentials({ user: null, token: null }));
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sticky top-0 z-50">
      {/* 🌌 Dashboard Theme Matching Navbar without bottom border */}
      <div
        className="
          backdrop-blur-xl bg-purple-900/70
          text-white px-6 py-3
          flex justify-between items-center
          shadow-lg
          transition-all duration-300
          hover:shadow-2xl
        "
      >
        {/* Brand Logo */}
        <div className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
            Zen
          </span>
          <span className="text-white">Note</span>
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-4">

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="
              bg-white text-purple-900 px-4 py-1.5 rounded-xl
              font-medium shadow-md
              hover:bg-purple-50 
              hover:shadow-purple-300/50
              transition-all duration-300
              active:scale-95
            "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
