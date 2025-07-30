"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

export default function AllUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

        const { data } = await axios.get(`${API_URL}/auth`, {
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

  const handleViewAll = () => {
    router.push("/users/all");
  };

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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⛔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Gym Members
            </span>
          </h1>
          <p className="text-lg text-gray-600">Manage all registered members of your fitness community</p>
          
          {/* Added View All Button */}
          <button
            onClick={handleViewAll}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
          >
            View All Members
          </button>
        </motion.div>

        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto text-center"
          >
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800">No members found</h3>
            <p className="mt-2 text-gray-500">There are currently no registered users.</p>
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
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.phone || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            'bg-indigo-100 text-indigo-800'}`}>
                          {user.role || 'user'}
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
// export const dynamic = "force-dynamic";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { motion } from "framer-motion";
// import "react-toastify/dist/ReactToastify.css";

// export default function AllUsers() {

//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAuthorized, setIsAuthorized] = useState(true);
//   const API_URL=process.env.NEXT_PUBLIC_API_URL;

//   useEffect(() => {
//     const fetchAllUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Please login first.");
//           setIsAuthorized(false);
//           setLoading(false);
//           return;
//         }

//         const { data } = await axios.get(`${API_URL}/auth`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (data.success) {
//           setUsers(data.allUsers);
//           setIsAuthorized(true);
//         } else {
//           setIsAuthorized(false);
//           toast.error(data.message || "Not authorized");
//         }
//       } catch (err) {
//         if (err?.response?.status === 403 || err?.response?.status === 401) {
//           setIsAuthorized(false);
//           toast.error("🚫 You don't have permission to access this page.");
//         } else {
//           toast.error("Something went wrong while fetching users.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllUsers();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-50">
//         <motion.div
//           className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           aria-label="Loading spinner"
//         />
//       </div>
//     );
//   }

//   if (!isAuthorized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
//         <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md text-center">
//           <div className="text-red-500 text-5xl mb-4">⛔</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
//           <p className="text-gray-600">You don't have permission to access this page.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-4xl font-bold text-gray-900 mb-3">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
//               Gym Members
//             </span>
//           </h1>
//           <p className="text-lg text-gray-600">Manage all registered members of your fitness community</p>
//         </motion.div>

//         {users.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto text-center"
//           >
//             <div className="text-gray-400 mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-gray-800">No members found</h3>
//             <p className="mt-2 text-gray-500">There are currently no registered users.</p>
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
//           >
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
//                   <tr>
//                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                       Member
//                     </th>
//                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                       Contact
//                     </th>
//                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                       Phone
//                     </th>
//                     <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                       Role
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {users.map((user) => (
//                     <motion.tr
//                       key={user._id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
//                             <span className="text-indigo-600 font-medium">
//                               {user.name.charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{user.email}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">{user.phone || "N/A"}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
//                           ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
//                             'bg-indigo-100 text-indigo-800'}`}>
//                           {user.role || 'user'}
//                         </span>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// }


