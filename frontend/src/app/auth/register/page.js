"use client";
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaBirthdayCake, FaVenusMars, FaUserTag } from "react-icons/fa";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    gender: "",
    role: "user", // Default to user
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Check admin existence on component mount
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/admin-exists`);
        setAdminExists(response.data.exists);
      } catch (err) {
        console.error("Error checking admin:", err);
        toast.error("Failed to check admin status");
      } finally {
        setLoadingRoles(false);
      }
    };
    checkAdmin();
  }, [API_URL]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Client-side validation to prevent admin registration if admin exists
      if (adminExists && form.role === 'admin') {
        toast.error("Admin account already exists. Please choose another role.");
        return;
      }

      const response = await axios.post(`${API_URL}/auth/register`, form);
      if (response.data.success) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        toast.error(response.data.msg || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input field configuration
  const inputFields = [
    { name: "name", placeholder: "Full Name", type: "text", icon: <FaUser /> },
    { name: "email", placeholder: "Email", type: "email", icon: <FaEnvelope /> },
    { name: "phone", placeholder: "Phone (optional)", type: "text", icon: <FaPhone /> },
    { name: "password", placeholder: "Password", type: "password", icon: <FaLock /> },
    { name: "age", placeholder: "Age (optional)", type: "number", icon: <FaBirthdayCake /> },
  ];

  // Role options based on admin existence
  const roleOptions = [
    { value: "user", label: "User" },
    { value: "trainer", label: "Trainer" },
    ...(!adminExists ? [{ value: "admin", label: "Admin" }] : []),
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 15}s infinite alternate`
            }}
          />
        ))}
      </div>

      <ToastContainer position="top-center" theme="dark" />

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
            className="text-3xl font-bold text-center text-white mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Create Your Account
          </motion.h2>

          {inputFields.map((input) => (
            <motion.div 
              className="mb-5 relative" 
              key={input.name}
              variants={itemVariants}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                {input.icon}
              </div>
              <input
                id={input.name}
                name={input.name}
                type={input.type}
                value={form[input.name]}
                onChange={handleChange}
                required={input.name !== "phone" && input.name !== "age"}
                placeholder={input.placeholder}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-400"
              />
            </motion.div>
          ))}

          <motion.div className="mb-5 relative" variants={itemVariants}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaVenusMars />
            </div>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white appearance-none hover:border-purple-400 transition"
            >
              <option value="" className="bg-gray-800">Select Gender</option>
              <option value="male" className="bg-gray-800">Male</option>
              <option value="female" className="bg-gray-800">Female</option>
            </select>
          </motion.div>

          <motion.div className="mb-6 relative" variants={itemVariants}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaUserTag />
            </div>
            {loadingRoles ? (
              <div className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700/50 text-gray-400">
                Loading roles...
              </div>
            ) : (
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white appearance-none hover:border-purple-400 transition"
              >
                <option value="" className="bg-gray-800">Select Role</option>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {adminExists && (
              <p className="text-xs text-gray-400 mt-1">
                Admin registration is disabled as an admin already exists
              </p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            disabled={isSubmitting || loadingRoles}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg ${isSubmitting || loadingRoles ? 'opacity-70' : ''}`}
            variants={itemVariants}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Register Now"
            )}
          </motion.button>

          <motion.p 
            className="mt-6 text-center text-sm text-gray-400"
            variants={itemVariants}
          >
            Already have an account?{" "}
            <Link 
              href="/auth/login" 
              className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition"
            >
              Login here
            </Link>
          </motion.p>
        </motion.form>
      </motion.div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        select option {
          background-color: #1f2937;
        }
      `}</style>
    </div>
  );
}
// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { motion } from "framer-motion";
// import { FaUser, FaEnvelope, FaPhone, FaLock, FaBirthdayCake, FaVenusMars, FaUserTag } from "react-icons/fa";

// export default function Register() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     age: "",
//     gender: "",
//     role: "user",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post(`${API_URL}/auth/register`, form);
//       if (response.data.success) {
//         toast.success("Registration successful! Redirecting to login...");
//         setForm({
//           name: "",
//           email: "",
//           phone: "",
//           password: "",
//           age: "",
//           gender: "",
//           role: "",
//         });
//         setTimeout(() => router.push("/auth/login"), 2000);
//       } else {
//         toast.error(response.data.msg || "Registration failed");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Server Error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Input field configuration
//   const inputFields = [
//     { name: "name", placeholder: "Full Name", type: "text", icon: <FaUser /> },
//     { name: "email", placeholder: "Email", type: "email", icon: <FaEnvelope /> },
//     { name: "phone", placeholder: "Phone (optional)", type: "text", icon: <FaPhone /> },
//     { name: "password", placeholder: "Password", type: "password", icon: <FaLock /> },
//     { name: "age", placeholder: "Age (optional)", type: "number", icon: <FaBirthdayCake /> },
//   ];

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 10
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(15)].map((_, i) => (
//           <div 
//             key={i}
//             className="absolute w-1 h-1 bg-white rounded-full opacity-10"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `float ${15 + Math.random() * 15}s infinite alternate`
//             }}
//           />
//         ))}
//       </div>

//       <ToastContainer position="top-center" theme="dark" />

//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md z-10"
//       >
//         <motion.form
//           onSubmit={handleSubmit}
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="w-full p-8 rounded-2xl bg-gray-800/70 backdrop-blur-lg border border-gray-700 shadow-2xl"
//         >
//           <motion.h2 
//             className="text-3xl font-bold text-center text-white mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
//             variants={itemVariants}
//           >
//             Create Your Account
//           </motion.h2>

//           {inputFields.map((input) => (
//             <motion.div 
//               className="mb-5 relative" 
//               key={input.name}
//               variants={itemVariants}
//             >
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//                 {input.icon}
//               </div>
//               <input
//                 id={input.name}
//                 name={input.name}
//                 type={input.type}
//                 value={form[input.name]}
//                 onChange={handleChange}
//                 required={input.name !== "phone" && input.name !== "age"}
//                 placeholder={input.placeholder}
//                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-400"
//               />
//             </motion.div>
//           ))}

//           <motion.div className="mb-5 relative" variants={itemVariants}>
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//               <FaVenusMars />
//             </div>
//             <select
//               name="gender"
//               value={form.gender}
//               onChange={handleChange}
//               className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white appearance-none hover:border-purple-400 transition"
//             >
//               <option value="" className="bg-gray-800">Select Gender</option>
//               <option value="male" className="bg-gray-800">Male</option>
//               <option value="female" className="bg-gray-800">Female</option>
//             </select>
//           </motion.div>

//           <motion.div className="mb-6 relative" variants={itemVariants}>
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
//               <FaUserTag />
//             </div>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               required
//               className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white appearance-none hover:border-purple-400 transition"
//             >
//               <option value="" className="bg-gray-800">Select Role</option>
//               <option value="user" className="bg-gray-800">User</option>
//               <option value="admin" className="bg-gray-800">Admin</option>
//               <option value="trainer" className="bg-gray-800">Trainer</option>
//             </select>
//           </motion.div>

//           <motion.button
//             type="submit"
//             whileTap={{ scale: 0.98 }}
//             whileHover={{ scale: 1.02 }}
//             disabled={isSubmitting}
//             className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg ${isSubmitting ? 'opacity-70' : ''}`}
//             variants={itemVariants}
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </span>
//             ) : (
//               "Register Now"
//             )}
//           </motion.button>

//           <motion.p 
//             className="mt-6 text-center text-sm text-gray-400"
//             variants={itemVariants}
//           >
//             Already have an account?{" "}
//             <Link 
//               href="/auth/login" 
//               className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition"
//             >
//               Login here
//             </Link>
//           </motion.p>
//         </motion.form>
//       </motion.div>

//       <style jsx global>{`
//         @keyframes float {
//           0% { transform: translateY(0) translateX(0); }
//           50% { transform: translateY(-20px) translateX(10px); }
//           100% { transform: translateY(0) translateX(0); }
//         }
//         select option {
//           background-color: #1f2937;
//         }
//       `}</style>
//     </div>
//   );
// }
