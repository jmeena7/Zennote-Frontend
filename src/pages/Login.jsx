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

  // ✅ Use env variable for API URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("⚠️ Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      // ✅ Make axios call with proper headers for CORS
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      const { user, token } = res.data;

      // ✅ Store token in localStorage
      localStorage.setItem("token", token);

      // ✅ Update redux state
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          Login to Zennote
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-indigo-300"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-indigo-300"
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-500"
              >
                {showPass ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
