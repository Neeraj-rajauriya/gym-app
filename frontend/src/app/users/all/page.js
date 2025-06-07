
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AllUserMembership() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in as admin to access this page.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/userMembership/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.Success) {
          setMemberships(data.membership);
        } else {
          toast.error(data.message || "Failed to fetch memberships");
        }
      } catch (error) {
        toast.error("Something went wrong fetching memberships");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 drop-shadow-md">
        All User Memberships
      </h1>
      {memberships.length === 0 ? (
        <p className="text-center text-gray-600 italic">No memberships found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white">
              <tr>
             
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Membership Plan</th>
                <th className="py-3 px-6 text-left">Start Date</th>
                <th className="py-3 px-6 text-left">End Date</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <motion.tr
                  key={m._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-200 hover:bg-purple-50 cursor-pointer"
                >
                  <td className="py-4 px-6 text-gray-700">{m.userId?.name}</td>
                  <td className="py-4 px-6 text-gray-700 capitalize">{m.userId?.role}</td>
                  <td className="py-4 px-6 text-gray-700">
                    {m.membershipPlanId?.name}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {new Date(m.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {new Date(m.endDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`py-4 px-6 font-semibold ${
                      new Date(m.endDate) > new Date()
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {new Date(m.endDate) > new Date() ? "Active" : "Expired"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

