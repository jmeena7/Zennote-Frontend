import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/features/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(setCredentials({ user: null, token: null }));
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      {/* 🔵 Navbar with red bottom border */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow border-b-4 border-red-500">
        <div className="text-xl font-bold">ZenNote</div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 transition"
        >
          Logout
        </button>
      </div>

      {/* 👤 User Name below navbar */}
      <div className="bg-gray-100 text-center py-2 text-gray-700 font-medium">
        Welcome, {user?.name || 'User'} 👋
      </div>
    </div>
  );
};

export default Navbar;
