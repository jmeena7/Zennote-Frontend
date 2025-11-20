import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials } from "../redux/features/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const backend = process.env.REACT_APP_BACKEND_URL;


  const API_URL = backend || "http://localhost:5000";

  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      toast.error("⚠️ Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/api/auth/createuser", formData);

      dispatch(setCredentials(res.data));

      toast.success("🎉 Registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        "❌ " +
          (err.response?.data?.message ||
            err.response?.statusText ||
            err.message ||
            "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 
      bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 
      dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all">

      {/* Glassmorphism Card */}
      <div
        className="backdrop-blur-xl bg-white/20 dark:bg-white/10 
        border border-white/30 shadow-2xl rounded-2xl p-8 max-w-md w-full
        transform hover:scale-[1.02] transition-all duration-300 
        hover:shadow-purple-500/40"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-white text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              autoComplete="name"
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/40 
              text-black placeholder-gray-700 
              focus:outline-none focus:ring-4 focus:ring-purple-300 
              backdrop-blur-sm transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-white text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/40 
              text-black placeholder-gray-700 
              focus:outline-none focus:ring-4 focus:ring-purple-300 
              backdrop-blur-sm transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              autoComplete="new-password"
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/40 
              text-black placeholder-gray-700 
              focus:outline-none focus:ring-4 focus:ring-purple-300 
              backdrop-blur-sm transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg 
              shadow-lg shadow-black/30 transition-all
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 hover:shadow-xl"
              }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-5 text-center text-white text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold underline hover:text-yellow-300 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
