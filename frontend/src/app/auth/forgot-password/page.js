

"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (res.data.Success) {
        toast.success("Reset link sent! Check your email.");
        setEmail("");
      } else {
        toast.error(res.data.message || "Failed to send reset link");
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Forgot Password 🔐</h2>

        <p className="text-center text-sm text-gray-700 mb-6">
          Enter your registered email to receive a password reset link.
        </p>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 transition"
            autoComplete="email"
          />
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
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
