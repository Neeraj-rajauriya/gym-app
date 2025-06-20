"use client";
export const dynamic = "force-dynamic";
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          aria-label="Loading spinner"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Member Subscriptions
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View and manage all active gym memberships
          </p>
        </motion.div>

        {memberships.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto text-center"
          >
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800">No memberships found</h3>
            <p className="mt-2 text-gray-500">There are currently no active subscriptions.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Member
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      End Date
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {memberships.map((m) => (
                    <motion.tr
                      key={m._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {m.userId?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{m.userId?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{m.userId?.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                          {m.userId?.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {m.membershipPlanId?.name || 'No plan'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(m.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(m.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${new Date(m.endDate) > new Date() 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}>
                          {new Date(m.endDate) > new Date() ? 'Active' : 'Expired'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function AllUserMembership() {
//   const [memberships, setMemberships] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMemberships = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("You must be logged in as admin to access this page.");
//           setLoading(false);
//           return;
//         }

//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/userMembership/all`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (data.Success) {
//           setMemberships(data.membership);
//         } else {
//           toast.error(data.message || "Failed to fetch memberships");
//         }
//       } catch (error) {
//         toast.error("Something went wrong fetching memberships");
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMemberships();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <motion.div
//           className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
//           aria-label="Loading spinner"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-8">
//       <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 drop-shadow-md">
//         All User Memberships
//       </h1>
//       {memberships.length === 0 ? (
//         <p className="text-center text-gray-600 italic">No memberships found.</p>
//       ) : (
//         <div className="overflow-x-auto rounded-lg shadow-lg">
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white">
//               <tr>
             
//                 <th className="py-3 px-6 text-left">Username</th>
//                 <th className="py-3 px-6 text-left">Role</th>
//                 <th className="py-3 px-6 text-left">Membership Plan</th>
//                 <th className="py-3 px-6 text-left">Start Date</th>
//                 <th className="py-3 px-6 text-left">End Date</th>
//                 <th className="py-3 px-6 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {memberships.map((m) => (
//                 <motion.tr
//                   key={m._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="border-b border-gray-200 hover:bg-purple-50 cursor-pointer"
//                 >
//                   <td className="py-4 px-6 text-gray-700">{m.userId?.name}</td>
//                   <td className="py-4 px-6 text-gray-700 capitalize">{m.userId?.role}</td>
//                   <td className="py-4 px-6 text-gray-700">
//                     {m.membershipPlanId?.name}
//                   </td>
//                   <td className="py-4 px-6 text-gray-700">
//                     {new Date(m.startDate).toLocaleDateString()}
//                   </td>
//                   <td className="py-4 px-6 text-gray-700">
//                     {new Date(m.endDate).toLocaleDateString()}
//                   </td>
//                   <td
//                     className={`py-4 px-6 font-semibold ${
//                       new Date(m.endDate) > new Date()
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {new Date(m.endDate) > new Date() ? "Active" : "Expired"}
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

