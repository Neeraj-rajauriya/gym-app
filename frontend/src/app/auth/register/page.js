// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Register() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     age: "",
//     gender: "",
//     role: "",
//   });

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_URL}/auth/register`, form);
//       if (response.data.success) {
//         toast.success("✅Registration successful! Redirecting to login...");
//         setForm({
//         name: "",
//         email: "",
//         phone: "",
//         password: "",
//         age: "",
//         gender: "",
//         role: "",
//       });
//         setTimeout(() => router.push("/login"), 2000);
//       } else {
//         toast.error(response.data.msg || "Registration failed");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Server Error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4">
//       <ToastContainer />
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Sign Up</h2>

//         {[
//           { name: "name", placeholder: "Name", type: "text" },
//           { name: "email", placeholder: "Email", type: "email" },
//           { name: "phone", placeholder: "Phone", type: "text" },
//           { name: "password", placeholder: "Password", type: "password" },
//           { name: "age", placeholder: "Age", type: "number" },
//         ].map((input) => (
//           <input
//             key={input.name}
//             name={input.name}
//             type={input.type}
//             placeholder={input.placeholder}
//             value={form[input.name]}
//             onChange={handleChange}
//             required={input.name !== "phone" && input.name !== "age"}
//             className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
//           />
//         ))}

//         <select
//           name="gender"
//           value={form.gender}
//           onChange={handleChange}
//           className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//         </select>

//         <select
//           name="role"
//           value={form.role}
//           onChange={handleChange}
//           className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
//           required
//         >
//           <option value="">Select Role</option>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//           <option value="trainer">Trainer</option>
//         </select>

//         <button
//           type="submit"
//           className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
    gender: "",
    role: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, form);
      if (response.data.success) {
        toast.success("Registration successful! Redirecting to login...");
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          age: "",
          gender: "",
          role: "",
        });
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        toast.error(response.data.msg || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center justify-center px-4">
      <ToastContainer position="top-center" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-10 rounded-3xl bg-white/40 backdrop-blur-md border border-gray-300 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
         Register
        </h2>

        {[
          { name: "name", placeholder: "Full Name", type: "text" },
          { name: "email", placeholder: "Email", type: "email" },
          { name: "phone", placeholder: "Phone (optional)", type: "text" },
          { name: "password", placeholder: "Password", type: "password" },
          { name: "age", placeholder: "Age (optional)", type: "number" },
        ].map((input) => (
          <div className="mb-4" key={input.name}>
            <label
              htmlFor={input.name}
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              {input.placeholder}
            </label>
            <input
              id={input.name}
              name={input.name}
              type={input.type}
              value={form[input.name]}
              onChange={handleChange}
              required={input.name !== "phone" && input.name !== "age"}
              placeholder={input.placeholder}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 transition"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 transition"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/70 transition"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-white font-semibold rounded-lg transition duration-200 bg-indigo-600 hover:bg-indigo-700"
        >
          Register
        </button>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
