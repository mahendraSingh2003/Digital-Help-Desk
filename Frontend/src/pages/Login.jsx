import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api";
import axios from "axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/auth/google-login",
        { token: credentialResponse.credential }
      );

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log("Login failed");
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/auth/login", { username, password });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.is_admin) {
        navigate("/adminDashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Invalid credentials or server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2b2b2b] to-[#1f1f1f] px-4">
      
      <div className="w-full max-w-md bg-[#1f2024] shadow-2xl rounded-2xl p-8 border border-gray-700">

        <h2 className="text-3xl font-semibold text-center mb-6 text-white">
          Welcome Back
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-900/30 p-2 rounded-lg text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-[#2a2b30] text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#2a2b30] text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 py-3 rounded-lg text-white font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </button>

        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Login Failed")}
            size="large"
            theme="outline"
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Register here
          </a>
        </p>

      </div>
    </div>
  );
}