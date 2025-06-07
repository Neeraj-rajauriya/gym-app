"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true); // assume true initially

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first.");
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        const { data } = await axios.get("http://localhost:4000/api/auth/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.success) {
          setUsers(data.allUsers);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          toast.error(data.message || "Not authorized");
        }
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          setIsAuthorized(false);
          toast.error("🚫 You don't have permission to access this page.");
        } else {
          toast.error("Something went wrong while fetching users.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          aria-label="Loading spinner"
        />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 text-xl font-semibold">
        ❌ You don’t have permission to access this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        All Registered Users
      </h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full border">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Mobile</th>
                <th className="py-3 px-4 text-left">User Type</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-blue-50"
                >
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone || "N/A"}</td>
                  <td className="py-3 px-4 capitalize">{user.role || "user"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
