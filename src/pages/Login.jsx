import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const backend = process.env.REACT_APP_BACKEND_URL;

  const API_URL = backend || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("⚠️ Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      dispatch(setCredentials({ user, token }));

      toast.success("✅ Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        "❌ Login failed: " +
          (err.response?.data?.message || err.message || "Server Error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-black transition">
      
      {/* Glass Card */}
      <div className="backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-[1.02] hover:shadow-indigo-500/40">
        
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-md">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="text-white text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/40 text-black placeholder-gray-700 
              focus:outline-none focus:ring-4 focus:ring-indigo-300 backdrop-blur-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white/40 text-black placeholder-gray-700 
                focus:outline-none focus:ring-4 focus:ring-indigo-300 backdrop-blur-sm"
                required
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 cursor-pointer text-white text-lg"
              >
                {showPass ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg 
            transition-all shadow-lg shadow-black/30
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-5 text-center text-white text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold underline hover:text-yellow-300 transition"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
