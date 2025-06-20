
"use client";
export const dynamic = "force-dynamic";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log("API URL is",API_URL);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Login API",`${API_URL}/auth/login`);
      const response = await axios.post(`${API_URL}/auth/login`, form);
      if (response.data.success) {
        toast.success("Login successful! Redirecting...");
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          router.push("/");
        }, 1500);
        setForm({ email: "", password: "" });
      } else {
        toast.error(response.data.msg || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Server error");
    }
    setLoading(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100, 
              y: Math.random() * 100, 
              opacity: 0.1 
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              transition: { 
                duration: 20 + Math.random() * 20, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }
            }}
            className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-10"
          />
        ))}
      </div>

      <ToastContainer 
        position="top-center" 
        theme="dark"
        toastClassName="bg-gray-800 text-white"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full p-8 rounded-2xl bg-gray-800/70 backdrop-blur-lg border border-gray-700 shadow-2xl"
        >
          <motion.h2 
            className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            variants={itemVariants}
            custom={0}
          >
            Welcome Back
          </motion.h2>

          <motion.div 
            className="mb-5 relative"
            variants={itemVariants}
            custom={1}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaEnvelope className="text-sm" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-400"
              autoComplete="email"
            />
          </motion.div>

          <motion.div 
            className="mb-4 relative"
            variants={itemVariants}
            custom={2}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaLock className="text-sm" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-400"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-400 transition"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </motion.div>

          <motion.div 
            className="text-right mb-6"
            variants={itemVariants}
            custom={3}
          >
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-purple-400 hover:text-purple-300 hover:underline transition"
            >
              Forgot Password?
            </Link>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            variants={itemVariants}
            custom={4}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg flex items-center justify-center ${
              loading ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                Login <FaArrowRight className="ml-2" />
              </>
            )}
          </motion.button>

          <motion.p 
            className="mt-6 text-center text-sm text-gray-400"
            variants={itemVariants}
            custom={5}
          >
            Don't have an account?{" "}
            <Link 
              href="/auth/register" 
              className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition"
            >
              Sign Up
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>
    </div>
  );
}