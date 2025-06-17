"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import PaymentInitiate from "@/app/payment/Initiate/page";
import { useRouter } from "next/navigation";

export default function AllMembershipPlans() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingPlan, setUpdatingPlan] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false); 

  const [updateForm, setUpdateForm] = useState({
    name: "",
    benefits: "",
    price: "",
    duration: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === "admin");
      setIsUser(decoded.role === "user");
    }
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateMembership = () => {
    router.push("/membership/create");
  };

  const fetchPlans = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in to access membership plans");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPlans(data.plans);
      else showToast("Failed to fetch plans");
    } catch (err) {
      console.error("Error fetching plans:", err);
      showToast("Error fetching plans");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      showToast("Access Denied: You are not authorized to delete plans.");
      return;
    }
    if (!confirm("Are you sure you want to delete this plan?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in to delete plans.");
      return;
    }
    try {
      setDeletingId(id);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        showToast("Plan deleted successfully", "success");
        await fetchPlans();
      } else {
        showToast("Failed to delete plan");
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      showToast("Server error while deleting plan");
    } finally {
      setDeletingId(null);
    }
  };

  const openUpdateModal = (plan) => {
    if (!isAdmin) {
      showToast("Access Denied: You are not authorized to update plans.");
      return;
    }
    setUpdatingPlan(plan);
    setUpdateForm({
      name: plan.name || "",
      benefits: plan.benefits ? plan.benefits.join(", ") : "",
      price: plan.price ?? "",
      duration: plan.duration ?? "",
    });
  };

  const closeUpdateModal = () => {
    setUpdatingPlan(null);
    setUpdateForm({ name: "", benefits: "", price: "", duration: "" });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updatingPlan) return;

    if (!isAdmin) {
      showToast("Access Denied: You are not authorized to update plans.");
      closeUpdateModal();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in to update plans.");
      return;
    }

    const updatedData = {
      name: updateForm.name.trim(),
      benefits: updateForm.benefits
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      price: Number(updateForm.price),
      duration: Number(updateForm.duration),
    };

    if (
      !updatedData.name ||
      isNaN(updatedData.price) ||
      updatedData.price < 0 ||
      isNaN(updatedData.duration) ||
      updatedData.duration < 1
    ) {
      showToast("Please fill all required fields correctly.");
      return;
    }

    try {
      setUpdateLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership/${updatingPlan._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await res.json();
      if (data.success) {
        showToast("Plan updated successfully", "success");
        closeUpdateModal();
        await fetchPlans();
      } else {
        showToast("Failed to update plan: " + (data.message || ""));
      }
    } catch (err) {
      console.error("Error updating plan:", err);
      showToast("Server error while updating plan");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBuy = async (plan) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in to make a payment.", "error");
      return;
    }

    showToast(`Initiating payment for ${plan.name}...`, "success");

    try {
      const res = await fetch("http://localhost:4000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          membershipPlanId: plan._id,
          amount: plan.price,
        }),
      });

      const data = await res.json();

      if (data.Success) {
        showToast(`Payment initiated successfully for ${plan.name}`, "success");
      } else {
        showToast(data.message || "Payment initiation failed", "error");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      showToast("Server error during payment initiation", "error");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
              Membership Plans
            </span>
          </motion.h1>
          <motion.p 
            className="mt-5 max-w-xl mx-auto text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Choose the perfect plan for your fitness journey
          </motion.p>
        </div>

        {/* Admin Create Button */}
        {isAdmin && (
          <div className="flex justify-end mb-8">
            <motion.button
              onClick={handleCreateMembership}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create New Membership
            </motion.button>
          </div>
        )}

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-medium z-50 flex items-center backdrop-blur-sm
                ${
                  toast.type === "error"
                    ? "bg-red-500/20 border border-red-500/30 text-red-100"
                    : "bg-green-500/20 border border-green-500/30 text-green-100"
                }`}
            >
              <svg
                className={`w-5 h-5 mr-2 ${
                  toast.type === "error" ? "text-red-300" : "text-green-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d={
                    toast.type === "error"
                      ? "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      : "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  }
                  clipRule="evenodd"
                />
              </svg>
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : plans.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <svg
              className="mx-auto h-12 w-12 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">
              No membership plans found
            </h3>
            <p className="mt-1 text-gray-400">
              There are currently no membership plans available.
            </p>
            {isAdmin && (
              <div className="mt-6">
                <button
                  onClick={handleCreateMembership}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow transition-all"
                >
                  Create New Membership
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id || index}
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 120,
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Plan header with accent */}
                <div className="relative">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">
                        {plan.name}
                      </h2>
                      {isAdmin && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openUpdateModal(plan)}
                            className="text-indigo-400 hover:text-indigo-200 transition-colors"
                            title="Edit plan"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(plan._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            disabled={deletingId === plan._id}
                            title="Delete plan"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-400 mb-6 italic">
                      {plan.description || "No description available."}
                    </p>

                    <div className="mb-6 flex-grow">
                      <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
                        Benefits
                      </h3>
                      <ul className="space-y-3">
                        {plan.benefits && plan.benefits.length > 0 ? (
                          plan.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start">
                              <svg
                                className="flex-shrink-0 h-5 w-5 text-green-400 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="ml-2 text-gray-300">{benefit}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-500">No benefits listed</li>
                        )}
                      </ul>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-extrabold text-white">
                          ₹{typeof plan.price === "number" ? plan.price.toLocaleString() : plan.price}
                        </span>
                        <span className="ml-2 text-lg font-medium text-gray-400">
                          /{plan.duration} {plan.duration === 1 ? "month" : "months"}
                        </span>
                      </div>

                      {isUser && (
                        <PaymentInitiate
                          plan={plan}
                          onSuccess={(msg) => showToast(msg, "success")}
                          onError={(msg) => showToast(msg, "error")}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Update Modal */}
        <AnimatePresence>
          {updatingPlan && (
            <motion.div
              className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden w-full max-w-md border border-gray-700"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">
                    Update Membership Plan
                  </h3>
                </div>
                <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={updateForm.name}
                      onChange={handleUpdateChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="benefits"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Benefits (comma separated)
                    </label>
                    <input
                      type="text"
                      id="benefits"
                      name="benefits"
                      value={updateForm.benefits}
                      onChange={handleUpdateChange}
                      placeholder="E.g. Access to library, 24/7 support"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={updateForm.price}
                      onChange={handleUpdateChange}
                      min="0"
                      step="any"
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Duration (months)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={updateForm.duration}
                      onChange={handleUpdateChange}
                      min="1"
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeUpdateModal}
                      className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all"
                    >
                      {updateLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        "Update Plan"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { jwtDecode } from "jwt-decode";
// import PaymentInitiate from "@/app/payment/Initiate/page";

// export default function AllMembershipPlans() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);
//   const [updatingPlan, setUpdatingPlan] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isUser, setIsUser] = useState(false); 

//   const [updateForm, setUpdateForm] = useState({
//     name: "",
//     benefits: "",
//     price: "",
//     duration: "",
//   });
//   const [updateLoading, setUpdateLoading] = useState(false);

//   // Toast notifications state
//   const [toast, setToast] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decoded = jwtDecode(token);
//       setIsAdmin(decoded.role === "admin");
//       setIsUser(decoded.role === "user");
//     }
//   }, []);

//   const showToast = (message, type = "error") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const fetchPlans = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       showToast("You must be logged in to access membership plans");
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) setPlans(data.plans);
//       else showToast("Failed to fetch plans");
//     } catch (err) {
//       console.error("Error fetching plans:", err);
//       showToast("Error fetching plans");
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     if (!isAdmin) {
//       showToast("Access Denied: You are not authorized to delete plans.");
//       return;
//     }
//     if (!confirm("Are you sure you want to delete this plan?")) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       showToast("You must be logged in to delete plans.");
//       return;
//     }
//     try {
//       setDeletingId(id);
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/membership/${id}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();
//       if (data.success) {
//         showToast("Plan deleted successfully", "success");
//         await fetchPlans();
//       } else {
//         showToast("Failed to delete plan");
//       }
//     } catch (err) {
//       console.error("Error deleting plan:", err);
//       showToast("Server error while deleting plan");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const openUpdateModal = (plan) => {
//     if (!isAdmin) {
//       showToast("Access Denied: You are not authorized to update plans.");
//       return;
//     }
//     setUpdatingPlan(plan);
//     setUpdateForm({
//       name: plan.name || "",
//       benefits: plan.benefits ? plan.benefits.join(", ") : "",
//       price: plan.price ?? "",
//       duration: plan.duration ?? "",
//     });
//   };

//   const closeUpdateModal = () => {
//     setUpdatingPlan(null);
//     setUpdateForm({ name: "", benefits: "", price: "", duration: "" });
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     if (!updatingPlan) return;

//     if (!isAdmin) {
//       showToast("Access Denied: You are not authorized to update plans.");
//       closeUpdateModal();
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       showToast("You must be logged in to update plans.");
//       return;
//     }

//     const updatedData = {
//       name: updateForm.name.trim(),
//       benefits: updateForm.benefits
//         .split(",")
//         .map((b) => b.trim())
//         .filter(Boolean),
//       price: Number(updateForm.price),
//       duration: Number(updateForm.duration),
//     };

//     if (
//       !updatedData.name ||
//       isNaN(updatedData.price) ||
//       updatedData.price < 0 ||
//       isNaN(updatedData.duration) ||
//       updatedData.duration < 1
//     ) {
//       showToast("Please fill all required fields correctly.");
//       return;
//     }

//     try {
//       setUpdateLoading(true);
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/membership/${updatingPlan._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(updatedData),
//         }
//       );
//       const data = await res.json();
//       if (data.success) {
//         showToast("Plan updated successfully", "success");
//         closeUpdateModal();
//         await fetchPlans();
//       } else {
//         showToast("Failed to update plan: " + (data.message || ""));
//       }
//     } catch (err) {
//       console.error("Error updating plan:", err);
//       showToast("Server error while updating plan");
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleBuy = async (plan) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       showToast("You must be logged in to make a payment.", "error");
//       return;
//     }

//     showToast(`Initiating payment for ${plan.name}...`, "success");

//     try {
//       const res = await fetch("http://localhost:4000/api/payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           membershipPlanId: plan._id,
//           amount: plan.price,
//         }),
//       });

//       const data = await res.json();

//       if (data.Success) {
//         showToast(`Payment initiated successfully for ${plan.name}`, "success");
//       } else {
//         showToast(data.message || "Payment initiation failed", "error");
//       }
//     } catch (error) {
//       console.error("Payment initiation error:", error);
//       showToast("Server error during payment initiation", "error");
//     }
//   };

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden opacity-10">
//         <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl"></div>
//         <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl"></div>
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="text-center mb-16">
//           <motion.h1 
//             className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
//               Membership Plans
//             </span>
//           </motion.h1>
//           <motion.p 
//             className="mt-5 max-w-xl mx-auto text-xl text-gray-300"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}
//           >
//             Choose the perfect plan for your fitness journey
//           </motion.p>
//         </div>

//         {/* Toast Notification */}
//         <AnimatePresence>
//           {toast && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-medium z-50 flex items-center backdrop-blur-sm
//                 ${
//                   toast.type === "error"
//                     ? "bg-red-500/20 border border-red-500/30 text-red-100"
//                     : "bg-green-500/20 border border-green-500/30 text-green-100"
//                 }`}
//             >
//               <svg
//                 className={`w-5 h-5 mr-2 ${
//                   toast.type === "error" ? "text-red-300" : "text-green-300"
//                 }`}
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d={
//                     toast.type === "error"
//                       ? "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                       : "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   }
//                   clipRule="evenodd"
//                 />
//               </svg>
//               {toast.message}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {loading ? (
//           <div className="flex justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//           </div>
//         ) : plans.length === 0 ? (
//           <motion.div 
//             className="text-center py-12 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700 max-w-md mx-auto"
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//           >
//             <svg
//               className="mx-auto h-12 w-12 text-purple-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <h3 className="mt-2 text-lg font-medium text-white">
//               No membership plans found
//             </h3>
//             <p className="mt-1 text-gray-400">
//               There are currently no membership plans available.
//             </p>
//           </motion.div>
//         ) : (
//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             {plans.map((plan, index) => (
//               <motion.div
//                 key={plan._id || index}
//                 className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                   delay: index * 0.15,
//                   type: "spring",
//                   stiffness: 120,
//                 }}
//                 whileHover={{ scale: 1.02 }}
//               >
//                 {/* Plan header with accent */}
//                 <div className="relative">
//                   <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
//                   <div className="p-6 flex-1 flex flex-col">
//                     <div className="flex items-center justify-between mb-4">
//                       <h2 className="text-2xl font-bold text-white">
//                         {plan.name}
//                       </h2>
//                       {isAdmin && (
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => openUpdateModal(plan)}
//                             className="text-indigo-400 hover:text-indigo-200 transition-colors"
//                             title="Edit plan"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="currentColor"
//                               viewBox="0 0 20 20"
//                             >
//                               <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(plan._id)}
//                             className="text-red-400 hover:text-red-300 transition-colors"
//                             disabled={deletingId === plan._id}
//                             title="Delete plan"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="currentColor"
//                               viewBox="0 0 20 20"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     <p className="text-gray-400 mb-6 italic">
//                       {plan.description || "No description available."}
//                     </p>

//                     <div className="mb-6 flex-grow">
//                       <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
//                         Benefits
//                       </h3>
//                       <ul className="space-y-3">
//                         {plan.benefits && plan.benefits.length > 0 ? (
//                           plan.benefits.map((benefit, idx) => (
//                             <li key={idx} className="flex items-start">
//                               <svg
//                                 className="flex-shrink-0 h-5 w-5 text-green-400 mt-0.5"
//                                 fill="currentColor"
//                                 viewBox="0 0 20 20"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                               <span className="ml-2 text-gray-300">{benefit}</span>
//                             </li>
//                           ))
//                         ) : (
//                           <li className="text-gray-500">No benefits listed</li>
//                         )}
//                       </ul>
//                     </div>

//                     <div className="mt-auto">
//                       <div className="flex items-baseline mb-6">
//                         <span className="text-4xl font-extrabold text-white">
//                           ₹{typeof plan.price === "number" ? plan.price.toLocaleString() : plan.price}
//                         </span>
//                         <span className="ml-2 text-lg font-medium text-gray-400">
//                           /{plan.duration} {plan.duration === 1 ? "month" : "months"}
//                         </span>
//                       </div>

//                       {isUser && (
//                         <PaymentInitiate
//                           plan={plan}
//                           onSuccess={(msg) => showToast(msg, "success")}
//                           onError={(msg) => showToast(msg, "error")}
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {/* Update Modal */}
//         <AnimatePresence>
//           {updatingPlan && (
//             <motion.div
//               className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <motion.div
//                 className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden w-full max-w-md border border-gray-700"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div className="px-6 py-4 border-b border-gray-700">
//                   <h3 className="text-lg font-medium text-white">
//                     Update Membership Plan
//                   </h3>
//                 </div>
//                 <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="block text-sm font-medium text-gray-300 mb-1"
//                     >
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={updateForm.name}
//                       onChange={handleUpdateChange}
//                       required
//                       className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="benefits"
//                       className="block text-sm font-medium text-gray-300 mb-1"
//                     >
//                       Benefits (comma separated)
//                     </label>
//                     <input
//                       type="text"
//                       id="benefits"
//                       name="benefits"
//                       value={updateForm.benefits}
//                       onChange={handleUpdateChange}
//                       placeholder="E.g. Access to library, 24/7 support"
//                       className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="price"
//                       className="block text-sm font-medium text-gray-300 mb-1"
//                     >
//                       Price (₹)
//                     </label>
//                     <input
//                       type="number"
//                       id="price"
//                       name="price"
//                       value={updateForm.price}
//                       onChange={handleUpdateChange}
//                       min="0"
//                       step="any"
//                       required
//                       className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="duration"
//                       className="block text-sm font-medium text-gray-300 mb-1"
//                     >
//                       Duration (months)
//                     </label>
//                     <input
//                       type="number"
//                       id="duration"
//                       name="duration"
//                       value={updateForm.duration}
//                       onChange={handleUpdateChange}
//                       min="1"
//                       required
//                       className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div className="flex justify-end space-x-3 pt-4">
//                     <button
//                       type="button"
//                       onClick={closeUpdateModal}
//                       className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={updateLoading}
//                       className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all"
//                     >
//                       {updateLoading ? (
//                         <>
//                           <svg
//                             className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Updating...
//                         </>
//                       ) : (
//                         "Update Plan"
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

