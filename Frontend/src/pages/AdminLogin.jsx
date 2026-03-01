import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (response.data.user.is_admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Invalid credentials or server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#303030] px-4">
      <div className="w-full max-w-md bg-[#1f2024] shadow-lg rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Admin Login
        </h2>

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-900/30 p-2 rounded-lg text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 bg-[#2a2b30] text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 bg-[#2a2b30] text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a href="#/register" className="text-blue-400 hover:underline">
            Register here
          </a>
        </p>

      </div>
    </div>
  );
}