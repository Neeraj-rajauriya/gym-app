
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, form);
      if (response.data.success) {
        toast.success("Login successful! Redirecting...");
        localStorage.setItem("token", response.data.token);
        // setTimeout(() => {
        //   router.push("/dashboard");
        // }, 2000);
        setForm({ email: "", password: "" });
      } else {
        toast.error(response.data.msg || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Server error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center justify-center px-4">
      <ToastContainer position="top-center" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-10 rounded-3xl bg-white/40 backdrop-blur-md border border-gray-300 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 transition"
            autoComplete="email"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 transition"
            autoComplete="current-password"
          />
        </div>

        <div className="text-right mb-6">
          <Link href="/auth/forgot-password" className="text-sm text-indigo-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition duration-200 ${
            loading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-indigo-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
