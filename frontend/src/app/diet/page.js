// 'use client'

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';;
// import Head from 'next/head';
// import DietPlanCard from './components/DietplanCard.js';
// import LoadingSpinner from './components/LoadingSpinner.js';
// import Modal from './components/modal.js';
// import CreatePlanForm from './components/createPlanForm.js';
// import { FiPlus, FiSearch, FiRefreshCw, FiFilter } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// export default function Home() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [filter, setFilter] = useState('all');
//   const router = useRouter();

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const data = await res.json();
//         if (data.Success) {
//           setPlans(data.dielPlans);
//         } else {
//           setError(data.message || 'Failed to fetch plans');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   const filteredPlans = plans.filter(plan => {
//     const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          plan.goal.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filter === 'all' || plan.goal.toLowerCase() === filter.toLowerCase();
//     return matchesSearch && matchesFilter;
//   });

//   const refreshPlans = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await res.json();
//       if (data.Success) {
//         setPlans(data.dielPlans);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Head>
//         <title>Diet Plan Manager</title>
//         <meta name="description" content="Manage your diet plans" />
//       </Head>

//       <main className="container mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Diet Plan Manager</h1>
//           <p className="text-gray-600">Create, manage and assign diet plans to users</p>
//         </motion.div>

//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div className="relative w-full md:w-1/3">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search plans..."
//               className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center space-x-4 w-full md:w-auto">
//             <div className="relative">
//               <select
//                 className="appearance-none bg-white pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//               >
//                 <option value="all">All Goals</option>
//                 <option value="weight loss">Weight Loss</option>
//                 <option value="muscle gain">Muscle Gain</option>
//                 <option value="maintenance">Maintenance</option>
//                 <option value="athletic performance">Athletic Performance</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                 <FiFilter className="text-gray-400" />
//               </div>
//             </div>

//             <button
//               onClick={refreshPlans}
//               className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
//               aria-label="Refresh plans"
//             >
//               <FiRefreshCw className="w-5 h-5" />
//             </button>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowModal(true)}
//               className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
//             >
//               <FiPlus className="w-5 h-5" />
//               <span>New Plan</span>
//             </motion.button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
//             <p>{error}</p>
//           </div>
//         )}

//         {filteredPlans.length === 0 ? (
//           <div className="text-center py-12">
//             <h3 className="text-xl font-medium text-gray-600 mb-2">No plans found</h3>
//             <p className="text-gray-500">Try adjusting your search or create a new plan</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredPlans.map((plan) => (
//               <DietPlanCard
//                 key={plan._id}
//                 plan={plan}
//                 onAssign={() => router.push(`/assign/${plan._id}`)}
//               />
//             ))}
//           </div>
//         )}
//       </main>

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <CreatePlanForm
//           onSuccess={(newPlan) => {
//             setPlans([...plans, newPlan]);
//             setShowModal(false);
//           }}
//           onClose={() => setShowModal(false)}
//         />
//       </Modal>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Head from 'next/head';
// import {jwtDecode} from 'jwt-decode';
// import DietPlanCard from './components/DietPlanCard.js';
// import LoadingSpinner from './components/LoadingSpinner';
// import Modal from './components/Modal.js';
// import CreatePlanForm from './components/CreatePlanForm.js';
// import { FiPlus, FiSearch, FiRefreshCw, FiFilter, FiAlertCircle } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// export default function DietPlanPage() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [filter, setFilter] = useState('all');
//   const [userRole, setUserRole] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUserRole(decoded.role);
//       } catch (err) {
//         console.error('Error decoding token:', err);
//         setError('Failed to verify user permissions');
//       }
//     }

//     const fetchPlans = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         const data = await res.json();
//         if (data.Success) {
//           setPlans(data.dielPlans);
//         } else {
//           setError(data.message || 'Failed to fetch plans');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   const isAuthorized = () => {
//     return userRole === 'admin' || userRole === 'trainer';
//   };

//   const filteredPlans = plans.filter(plan => {
//     const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          plan.goal.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filter === 'all' || plan.goal.toLowerCase() === filter.toLowerCase();
//     return matchesSearch && matchesFilter;
//   });

//   const refreshPlans = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await res.json();
//       if (data.Success) {
//         setPlans(data.dielPlans);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Head>
//         <title>Diet Plan Manager</title>
//         <meta name="description" content="Manage your diet plans" />
//       </Head>

//       <main className="container mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Diet Plan Manager</h1>
//           <p className="text-gray-600">
//             {isAuthorized()
//               ? "Create, manage and assign diet plans to users"
//               : "View your assigned diet plans"}
//           </p>
//         </motion.div>

//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div className="relative w-full md:w-1/3">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search plans..."
//               className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="flex items-center space-x-4 w-full md:w-auto">
//             <div className="relative">
//               <select
//                 className="appearance-none bg-white pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//               >
//                 <option value="all">All Goals</option>
//                 <option value="weight loss">Weight Loss</option>
//                 <option value="muscle gain">Muscle Gain</option>
//                 <option value="maintenance">Maintenance</option>
//                 <option value="athletic performance">Athletic Performance</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                 <FiFilter className="text-gray-400" />
//               </div>
//             </div>

//             <button
//               onClick={refreshPlans}
//               className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
//               aria-label="Refresh plans"
//             >
//               <FiRefreshCw className="w-5 h-5" />
//             </button>

//             {isAuthorized() && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowModal(true)}
//                 className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
//               >
//                 <FiPlus className="w-5 h-5" />
//                 <span>New Plan</span>
//               </motion.button>
//             )}
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
//             <FiAlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mr-3 mt-0.5" />
//             <div>
//               <p className="font-medium">Error</p>
//               <p>{error}</p>
//             </div>
//           </div>
//         )}

//         {filteredPlans.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <FiSearch className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-medium text-gray-600 mb-2">No plans found</h3>
//             <p className="text-gray-500 max-w-md mx-auto">
//               {searchTerm
//                 ? "Try adjusting your search query"
//                 : isAuthorized()
//                   ? "Create your first diet plan"
//                   : "No plans have been assigned to you yet"}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredPlans.map((plan) => (
//               <DietPlanCard
//                 key={plan._id}
//                 plan={plan}
//                 onAssign={isAuthorized() ? () => router.push(`/diet/assign/${plan._id}`) : null}
//                 showActions={isAuthorized()}
//               />
//             ))}
//           </div>
//         )}
//       </main>

//       {isAuthorized() && (
//         <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//           <CreatePlanForm
//             onSuccess={(newPlan) => {
//               setPlans([...plans, newPlan]);
//               setShowModal(false);
//             }}
//             onClose={() => setShowModal(false)}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// }.

"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { jwtDecode } from "jwt-decode";
import DietPlanCard from "./components/DietPlanCard.js";
import LoadingSpinner from "./components/LoadingSpinner";
import Modal from "./components/Modal.js";
import EditPlanForm from "./components/EditPlanForm.js";
import CreatePlanForm from "./components/CreatePlanForm.js";
import {
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiAlertCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function DietPlanPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [userRole, setUserRole] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Failed to verify user permissions");
      }
    }

    fetchPlans();
  }, []);

  const API_URL=process.env.NEXT_PUBLIC_API_URL;
  console.log("API url is",API_URL);
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.Success) {
        setPlans(data.dielPlans || []);
      } else {
        setError(data.message || "Failed to fetch plans");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAuthorized = () => {
    return userRole === "admin" || userRole === "trainer";
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this diet plan?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dietPlan/${planId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setPlans(plans.filter((plan) => plan._id !== planId));
      } else {
        setError(data.message || "Failed to delete plan");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setShowEditModal(true);
  };

  const handlePlanCreated = (newPlan) => {
    setPlans([...plans, newPlan]);
    setShowCreateModal(false);
  };

  const handlePlanUpdated = (updatedPlan) => {
    setPlans(
      plans.map((plan) => (plan._id === updatedPlan._id ? updatedPlan : plan))
    );
    setShowEditModal(false);
    setEditingPlan(null);
  };

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.goal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" || plan.goal.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const refreshPlans = async () => {
    await fetchPlans();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Diet Plan Manager</title>
        <meta name="description" content="Manage your diet plans" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Diet Plan Manager
          </h1>
          <p className="text-gray-600">
            {isAuthorized()
              ? "Create, manage and assign diet plans to users"
              : "View your assigned diet plans"}
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search plans..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative">
              <select
                className="appearance-none bg-white pl-3 pr-8 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Goals</option>
                <option value="weight loss">Weight Loss</option>
                <option value="muscle gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="athletic performance">
                  Athletic Performance
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
            </div>

            <button
              onClick={refreshPlans}
              className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
              aria-label="Refresh plans"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>

            {isAuthorized() && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
              >
                <FiPlus className="w-5 h-5" />
                <span>New Plan</span>
              </motion.button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
            <FiAlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No plans found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search query"
                : isAuthorized()
                ? "Create your first diet plan"
                : "No plans have been assigned to you yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <DietPlanCard
                key={plan._id}
                plan={plan}
                onAssign={
                  isAuthorized()
                    ? () => router.push(`/diet/assign/${plan._id}`)
                    : null
                }
                onEdit={isAuthorized() ? () => handleEditClick(plan) : null}
                onDelete={
                  isAuthorized() ? () => handleDeletePlan(plan._id) : null
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Plan Modal */}
      {isAuthorized() && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        >
          <CreatePlanForm
            onSuccess={handlePlanCreated}
            onClose={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      {/* Edit Plan Modal */}
      {isAuthorized() && editingPlan && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <EditPlanForm
            plan={editingPlan}
            onSuccess={handlePlanUpdated}
            onClose={() => setShowEditModal(false)}
            updateEndpoint={`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/${editingPlan._id}`}
          />
        </Modal>
      )}
    </div>
  );
}
