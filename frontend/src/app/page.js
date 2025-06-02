'use client';
import React from 'react';
import { FaUser, FaDumbbell, FaChartLine, FaClipboardList } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();

  const handleMembershipClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in, go to membership plans
      router.push('/membership/all');
    } else {
      // Not logged in, redirect to login
      router.push('/auth/login');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-100 flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full p-8 rounded-2xl shadow-2xl bg-white">
        
        {/* Left Side - Welcome Text */}
        <div className="flex flex-col justify-center gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Welcome to<br /> <span className="text-purple-600">Gym App</span>
          </h1>
          <p className="text-lg text-gray-600">
            Manage memberships, track workouts, monitor progress, and more!
          </p>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                Login
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="bg-white border border-purple-600 text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-purple-50 transition-all duration-300">
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side - Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Manage Members */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <FaUser className="text-3xl text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Manage Members</h3>
            <p className="text-sm text-gray-600 mt-1">Easily add, update, or remove gym members</p>
          </div>

          {/* Track Workouts */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <FaDumbbell className="text-3xl text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Track Workouts</h3>
            <p className="text-sm text-gray-600 mt-1">Log and view workout routines and sessions</p>
          </div>

          {/* Monitor Progress */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <FaChartLine className="text-3xl text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Monitor Progress</h3>
            <p className="text-sm text-gray-600 mt-1">Keep an eye on members' fitness achievements</p>
          </div>

          {/* Manage Plans */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <FaClipboardList className="text-3xl text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Manage Plans</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create and assign <br />
              {/* Use a button styled as a link so we can control click */}
              <button
                onClick={handleMembershipClick}
                className="text-purple-600 underline cursor-pointer bg-transparent border-none p-0"
                type="button"
              >
                membership plans
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
