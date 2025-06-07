

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import PaymentInitiate from "@/app/payment/Initiate/page";

export default function AllMembershipPlans() {
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
  const [toast, setToast] = useState(null); // { message: '', type: 'error' | 'success' }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === "admin");
      setIsUser(decoded.role === "user"); // <-- set user role flag
    }
  }, []);

  // Toast helper
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch plans from API
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

  // Delete plan handler
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

  // Open modal to update plan
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

  // Close update modal and reset form
  const closeUpdateModal = () => {
    setUpdatingPlan(null);
    setUpdateForm({ name: "", benefits: "", price: "", duration: "" });
  };

  // Form field change handler
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated plan data
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

    // Prepare updated data
    const updatedData = {
      name: updateForm.name.trim(),
      benefits: updateForm.benefits
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      price: Number(updateForm.price),
      duration: Number(updateForm.duration),
    };

    // Basic validation
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
        // You can handle navigation or payment gateway flow here if needed
      } else {
        showToast(data.message || "Payment initiation failed", "error");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      showToast("Server error during payment initiation", "error");
    }
  };

  // Fetch plans once component mounts
  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 py-12 px-6 relative">
      <h1 className="text-5xl font-extrabold text-center text-purple-800 mb-14 tracking-wide drop-shadow-lg">
        Available Membership Plans
      </h1>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold z-50
              ${
                toast.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-center text-lg text-purple-600 font-semibold">
          Loading plans...
        </p>
      ) : plans.length === 0 ? (
        <p className="text-center text-red-500 font-semibold text-xl">
          No membership plans found
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan._id || index}
              className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-300 hover:shadow-purple-400 transition-shadow duration-500 cursor-pointer relative overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                type: "spring",
                stiffness: 120,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 opacity-20 filter blur-3xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
              ></motion.div>

              <h2 className="text-3xl font-extrabold text-purple-700 mb-3 drop-shadow-md">
                {plan.name}
              </h2>
              <p className="text-gray-700 mb-5 italic">
                {plan.description || "No description available."}
              </p>

              <div className="mb-5 flex-grow">
                <h3 className="font-semibold text-purple-600 mb-2 underline">
                  Benefits:
                </h3>
                <ul className="list-disc ml-6 text-gray-800">
                  {plan.benefits && plan.benefits.length > 0 ? (
                    plan.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))
                  ) : (
                    <li>No benefits listed</li>
                  )}
                </ul>
              </div>

              <p className="text-xl font-semibold text-green-700 mb-2">
                ₹{" "}
                {typeof plan.price === "number"
                  ? plan.price.toLocaleString()
                  : plan.price}
              </p>
              <p className="text-sm font-medium text-gray-600 mb-6">
                {plan.duration} month(s)
              </p>

              {/* Buy button only for users */}
              {/* {isUser && (
                <button
                  onClick={() => handleBuy(plan)}
                  className="mt-auto px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition mb-4"
                >
                  Buy
                </button>
              )} */}
              {isUser && (
                <PaymentInitiate
                  plan={plan}
                  onSuccess={(msg) => showToast(msg, "success")}
                  onError={(msg) => showToast(msg, "error")}
                />
              )}

              {/* Admin buttons */}
              {isAdmin && (
                <div className="mt-auto flex space-x-4">
                  <button
                    onClick={() => openUpdateModal(plan)}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    disabled={deletingId === plan._id}
                  >
                    {deletingId === plan._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      <AnimatePresence>
        {updatingPlan && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-purple-700">
                Update Membership Plan
              </h3>
              <form onSubmit={handleUpdateSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-semibold mb-1 text-gray-700"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={updateForm.name}
                    onChange={handleUpdateChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="benefits"
                    className="block font-semibold mb-1 text-gray-700"
                  >
                    Benefits (comma separated):
                  </label>
                  <input
                    type="text"
                    id="benefits"
                    name="benefits"
                    value={updateForm.benefits}
                    onChange={handleUpdateChange}
                    placeholder="E.g. Access to library, 24/7 support"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block font-semibold mb-1 text-gray-700"
                  >
                    Price (₹):
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block font-semibold mb-1 text-gray-700"
                  >
                    Duration (months):
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={updateForm.duration}
                    onChange={handleUpdateChange}
                    min="1"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeUpdateModal}
                    className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
                  >
                    {updateLoading ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import jwtDecode from 'jwt-decode';
// import axios from 'axios';

// export default function AllMembershipPlans() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState(null);
//   const [updatingPlan, setUpdatingPlan] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isUser, setIsUser] = useState(false);
//   const [updateForm, setUpdateForm] = useState({
//     name: '',
//     benefits: '',
//     price: '',
//     duration: '',
//   });
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//  useEffect(() => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       setIsAdmin(decoded.role === 'admin');
//       setIsUser(decoded.role === 'user');
//     } catch {
//       // Token is invalid
//       setIsAdmin(false);
//       setIsUser(false);
//     }
//   }
// }, []);

//   const showToast = (message, type = 'error') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const fetchPlans = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     if (!token) {
//       showToast('You must be logged in to access membership plans');
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) setPlans(data.plans);
//       else showToast('Failed to fetch plans');
//     } catch (err) {
//       console.error('Error fetching plans:', err);
//       showToast('Error fetching plans');
//     }
//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     if (!isAdmin) {
//       showToast('Access Denied: You are not authorized to delete plans.');
//       return;
//     }
//     if (!confirm('Are you sure you want to delete this plan?')) return;

//     const token = localStorage.getItem('token');
//     if (!token) {
//       showToast('You must be logged in to delete plans.');
//       return;
//     }
//     try {
//       setDeletingId(id);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) {
//         showToast('Plan deleted successfully', 'success');
//         await fetchPlans();
//       } else {
//         showToast('Failed to delete plan');
//       }
//     } catch (err) {
//       console.error('Error deleting plan:', err);
//       showToast('Server error while deleting plan');
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const openUpdateModal = (plan) => {
//     if (!isAdmin) {
//       showToast('Access Denied: You are not authorized to update plans.');
//       return;
//     }
//     setUpdatingPlan(plan);
//     setUpdateForm({
//       name: plan.name || '',
//       benefits: plan.benefits ? plan.benefits.join(', ') : '',
//       price: plan.price ?? '',
//       duration: plan.duration ?? '',
//     });
//   };

//   const closeUpdateModal = () => {
//     setUpdatingPlan(null);
//     setUpdateForm({ name: '', benefits: '', price: '', duration: '' });
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     setUpdateForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     if (!updatingPlan) return;

//     if (!isAdmin) {
//       showToast('Access Denied: You are not authorized to update plans.');
//       closeUpdateModal();
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       showToast('You must be logged in to update plans.');
//       return;
//     }

//     const updatedData = {
//       name: updateForm.name.trim(),
//       benefits: updateForm.benefits
//         .split(',')
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
//       showToast('Please fill all required fields correctly.');
//       return;
//     }

//     try {
//       setUpdateLoading(true);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership/${updatingPlan._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedData),
//       });
//       const data = await res.json();
//       if (data.success) {
//         showToast('Plan updated successfully', 'success');
//         closeUpdateModal();
//         await fetchPlans();
//       } else {
//         showToast('Failed to update plan: ' + (data.message || ''));
//       }
//     } catch (err) {
//       console.error('Error updating plan:', err);
//       showToast('Server error while updating plan');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   const handleBuy = async (plan) => {
//     try {
//       showToast(`Processing your ${plan.name} membership...`, 'info');

//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/membership/create`,
//         { membershipPlanId: plan._id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data.success || response.data.Success) {
//         showToast(`Membership created for ${plan.name}`, 'success');
//         console.log('Membership Info:', response.data.membership);
//       } else {
//         showToast(`Failed to create membership: ${response.data.message || 'Unknown error'}`, 'error');
//       }
//     } catch (error) {
//       console.error('Error creating membership:', error);
//       showToast('An error occurred while creating membership', 'error');
//     }
//   };

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 py-12 px-6 relative">
//       <h1 className="text-5xl font-extrabold text-center text-purple-800 mb-14 tracking-wide drop-shadow-lg">
//         Available Membership Plans
//       </h1>

//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg font-semibold z-50 ${
//               toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
//             } text-white`}
//           >
//             {toast.message}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {loading ? (
//         <p className="text-center text-lg text-purple-600 font-semibold">Loading plans...</p>
//       ) : plans.length === 0 ? (
//         <p className="text-center text-red-500 font-semibold text-xl">No membership plans found</p>
//       ) : (
//         <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {plans.map((plan, index) => (
//             <motion.div
//               key={plan._id || index}
//               className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-300 hover:shadow-purple-400 transition-shadow duration-500 cursor-pointer relative overflow-hidden flex flex-col"
//               initial={{ opacity: 0, y: 40 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.15, type: 'spring', stiffness: 120 }}
//               whileHover={{ scale: 1.05 }}
//             >
//               <motion.div
//                 className="absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 opacity-20 filter blur-3xl"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
//               ></motion.div>

//               <h2 className="text-3xl font-extrabold text-purple-700 mb-3 drop-shadow-md">{plan.name}</h2>
//               <p className="text-gray-700 mb-5 italic">{plan.description || 'No description available.'}</p>

//               <div className="mb-5 flex-grow">
//                 <h3 className="font-semibold text-purple-600 mb-2 underline">Benefits:</h3>
//                 <ul className="list-disc list-inside text-purple-600">
//                   {(plan.benefits && plan.benefits.length > 0
//                     ? plan.benefits
//                     : ['No benefits listed']
//                   ).map((benefit, i) => (
//                     <li key={i}>{benefit}</li>
//                   ))}
//                 </ul>
//               </div>

//               <p className="text-xl font-bold text-purple-800 mb-6">
//                 ₹{plan.price.toLocaleString()} for {plan.duration} month{plan.duration > 1 ? 's' : ''}
//               </p>

//               <button
//                 onClick={() => handleBuy(plan)}
//                 className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-pink-500 hover:to-purple-600 transition-colors duration-400 focus:outline-none focus:ring-4 focus:ring-purple-300"
//                 aria-label={`Buy ${plan.name} plan`}
//               >
//                 Buy Now
//               </button>

//               {isAdmin && (
//                 <div className="flex justify-between mt-5 gap-4">
//                   <button
//                     onClick={() => openUpdateModal(plan)}
//                     className="text-indigo-700 font-semibold border border-indigo-700 rounded-lg px-4 py-2 hover:bg-indigo-700 hover:text-white transition"
//                   >
//                     Update Plan
//                   </button>
//                   <button
//                     onClick={() => handleDelete(plan._id)}
//                     disabled={deletingId === plan._id}
//                     className={`text-red-600 font-semibold border border-red-600 rounded-lg px-4 py-2 hover:bg-red-600 hover:text-white transition ${
//                       deletingId === plan._id ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     {deletingId === plan._id ? 'Deleting...' : 'Delete Plan'}
//                   </button>
//                 </div>
//               )}
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Update Modal */}
//       <AnimatePresence>
//         {updatingPlan && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={closeUpdateModal}
//           >
//             <motion.div
//               className="bg-white rounded-3xl p-8 w-96 relative"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-2xl font-bold mb-6 text-purple-700">Update Membership Plan</h2>
//               <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
//                 <input
//                   type="text"
//                   name="name"
//                   value={updateForm.name}
//                   onChange={handleUpdateChange}
//                   placeholder="Plan Name"
//                   className="border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
//                   required
//                 />
//                 <textarea
//                   name="benefits"
//                   value={updateForm.benefits}
//                   onChange={handleUpdateChange}
//                   placeholder="Benefits (comma separated)"
//                   rows={3}
//                   className="border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
//                   required
//                 />
//                 <input
//                   type="number"
//                   name="price"
//                   value={updateForm.price}
//                   onChange={handleUpdateChange}
//                   placeholder="Price"
//                   min={0}
//                   className="border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
//                   required
//                 />
//                 <input
//                   type="number"
//                   name="duration"
//                   value={updateForm.duration}
//                   onChange={handleUpdateChange}
//                   placeholder="Duration (months)"
//                   min={1}
//                   className="border border-purple-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
//                   required
//                 />
//                 <div className="flex justify-end gap-4 pt-2">
//                   <button
//                     type="button"
//                     onClick={closeUpdateModal}
//                     className="px-4 py-2 font-semibold rounded-lg border border-gray-300 hover:bg-gray-200 transition"
//                     disabled={updateLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-purple-700 text-white px-5 py-2 rounded-lg font-bold hover:bg-purple-800 transition disabled:opacity-70"
//                     disabled={updateLoading}
//                   >
//                     {updateLoading ? 'Updating...' : 'Update'}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
