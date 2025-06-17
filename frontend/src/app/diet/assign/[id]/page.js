'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiMail, FiCheck, FiAlertCircle, FiSearch, FiX } from 'react-icons/fi';
import {jwtDecode} from 'jwt-decode';

const AssignDietPlan = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        setError('Failed to verify user permissions');
      }
    }
    setLoading(false);
  }, []);

  const isAuthorized = () => {
    return userRole === 'admin' || userRole === 'trainer';
  };

  const handleSearchUser = async () => {
    if (!searchEmail.trim()) return;
    
    setSearchLoading(true);
    setSearchError(null);
    setSearchedUser(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/search?email=${encodeURIComponent(searchEmail)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      console.log("Data is",data)
;
      if (!res.ok) {
        throw new Error(data.message || 'Failed to find user');
      }

      if (data.Success && data.exists) {
        setSearchedUser(data.exists);
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!searchedUser || !isAuthorized()) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/assign/${searchedUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ dietPlanId: id })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to assign plan');
      }

      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        router.push('/diet');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Assign Diet Plan</title>
        <meta name="description" content="Assign diet plan to user" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to plans
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Assign Diet Plan</h1>
          <p className="text-gray-600">Assign this diet plan to a user</p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start">
            <FiAlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            disabled={!isAuthorized()}
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 disabled:opacity-70 flex items-center"
          >
            <FiUser className="mr-2" />
            Assign to User
          </button>
        </div>

        {/* Search User Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-medium text-gray-800">Find User by Email</h3>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setSearchEmail('');
                      setSearchedUser(null);
                      setSearchError(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex">
                    <input
                      type="email"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      placeholder="Enter user's email"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleSearchUser}
                      disabled={!searchEmail || searchLoading}
                      className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 disabled:opacity-70 flex items-center"
                    >
                      {searchLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FiSearch className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {searchError && (
                    <p className="mt-2 text-sm text-red-600">{searchError}</p>
                  )}
                </div>

                {searchedUser && (
                  <div className="mb-6">
                    <div className={`p-4 border rounded-lg transition-all duration-200 border-green-500 bg-green-50`}>
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600`}>
                          <FiUser className="w-5 h-5" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-800">{searchedUser.name}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <FiMail className="mr-1" />
                            <span>{searchedUser.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSearchEmail('');
                      setSearchedUser(null);
                      setSearchError(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssign}
                    disabled={!searchedUser || loading}
                    className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 disabled:opacity-70 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Assigning...
                      </>
                    ) : 'Assign Plan'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-xl shadow-md text-center max-w-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Plan Assigned Successfully!</h3>
              <p className="text-gray-600 mb-4">The diet plan has been assigned to the user.</p>
              <button
                onClick={() => {
                  setSuccess(false);
                  router.push('/diet');
                }}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
              >
                Back to Plans
              </button>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AssignDietPlan;
// 'use client'
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Head from 'next/head';
// import { motion } from 'framer-motion';
// import { FiArrowLeft, FiUser, FiMail, FiCheck } from 'react-icons/fi';

// const AssignDietPlan = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const data = await res.json();
//         if (data.Success) {
//           setUsers(data.users);
//         } else {
//           setError(data.message || 'Failed to fetch users');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchUsers();
//   }, [id]);

//   const handleAssign = async () => {
//     if (!selectedUser) return;
    
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/assign/${selectedUser}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ dietPlanId: id })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || 'Failed to assign plan');
//       }

//       setSuccess(true);
//       setTimeout(() => {
//         router.push('/');
//       }, 2000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Head>
//         <title>Assign Diet Plan</title>
//         <meta name="description" content="Assign diet plan to user" />
//       </Head>

//       <main className="container mx-auto px-4 py-8">
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <button 
//             onClick={() => router.back()}
//             className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4"
//           >
//             <FiArrowLeft className="mr-2" />
//             Back to plans
//           </button>
//           <h1 className="text-3xl font-bold text-gray-800">Assign Diet Plan</h1>
//           <p className="text-gray-600">Select a user to assign this plan to</p>
//         </motion.div>

//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
//             <p>{error}</p>
//           </div>
//         )}

//         {success ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white p-6 rounded-xl shadow-md text-center"
//           >
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//               <FiCheck className="w-8 h-8 text-green-600" />
//             </div>
//             <h3 className="text-xl font-medium text-gray-800 mb-2">Plan Assigned Successfully!</h3>
//             <p className="text-gray-600">The user has been notified via email.</p>
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white rounded-xl shadow-md overflow-hidden"
//           >
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-800 mb-4">Available Users</h3>
              
//               <div className="space-y-3">
//                 {users.length === 0 ? (
//                   <p className="text-gray-500">No users available</p>
//                 ) : (
//                   users.map(user => (
//                     <div 
//                       key={user._id}
//                       onClick={() => setSelectedUser(user._id)}
//                       className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedUser === user._id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${selectedUser === user._id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
//                           <FiUser className="w-5 h-5" />
//                         </div>
//                         <div className="ml-4">
//                           <h4 className="text-sm font-medium text-gray-800">{user.name}</h4>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <FiMail className="mr-1" />
//                             <span>{user.email}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={handleAssign}
//                   disabled={!selectedUser || loading}
//                   className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 disabled:opacity-70 flex items-center"
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Assigning...
//                     </>
//                   ) : 'Assign Plan'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AssignDietPlan;

