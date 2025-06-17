"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function AssignWorkout() {
  const [email, setEmail] = useState("");
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [user, setUser] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState({
    user: false,
    workout: false,
    assign: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Check JWT token and role on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const decoded = jwtDecode(storedToken);
      setToken(storedToken);
      setRole(decoded?.role);

      if (decoded?.role === "admin" || decoded?.role === "trainer") {
        setAuthorized(true);
      }
    } catch (err) {
      console.error("Invalid token", err.message);
    }
  }, []);

  const searchUser = async () => {
    setIsLoading(prev => ({...prev, user: true}));
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/auth/search?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.Success) {
        setUser(data.exists);
        setMessage("User found ✅");
      } else {
        setUser(null);
        setMessage("User not found ❌");
      }
    } catch (err) {
      console.error(err);
      setUser(null);
      setMessage("Something went wrong ❌");
    } finally {
      setIsLoading(prev => ({...prev, user: false}));
    }
  };

  const searchWorkout = async () => {
    setIsLoading(prev => ({...prev, workout: true}));
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/workout/search?name=${workoutTitle}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.Success) {
        setWorkout(data.foundWorkout);
        setMessage("Workout found ✅");
      } else {
        setWorkout(null);
        setMessage("Workout not found ❌");
      }
    } catch (err) {
      console.error(err);
      setWorkout(null);
      setMessage("Something went wrong ❌");
    } finally {
      setIsLoading(prev => ({...prev, workout: false}));
    }
  };

  const assignWorkout = async () => {
    if (!user || !workout) {
      setMessage("User or Workout missing ⚠️");
      return;
    }
    setIsLoading(prev => ({...prev, assign: true}));
    try {
      const res = await fetch(`${API_URL}/workout/assign/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workoutId: workout._id }),
      });
      const data = await res.json();
      if (data.Success) {
        setMessage("Workout assigned & email sent 📩");
      } else {
        setMessage("Assignment failed ❌");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong ❌");
    } finally {
      setIsLoading(prev => ({...prev, assign: false}));
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl text-center animate-fade-in">
          <div className="text-red-500 text-6xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            Only Admins and Trainers can assign workouts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden md:max-w-2xl transition-all duration-300 hover:shadow-3xl">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-indigo-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="ml-4 text-2xl font-bold text-gray-800">
              Assign Workout to User
            </h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter user's email"
              />
              <button
                onClick={searchUser}
                disabled={isLoading.user}
                className={`mt-2 w-full flex justify-center items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isLoading.user
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white shadow-md hover:shadow-lg`}
              >
                {isLoading.user ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Searching...
                  </>
                ) : (
                  "Search User"
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workout Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Enter workout title"
              />
              <button
                onClick={searchWorkout}
                disabled={isLoading.workout}
                className={`mt-2 w-full flex justify-center items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isLoading.workout
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white shadow-md hover:shadow-lg`}
              >
                {isLoading.workout ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Searching...
                  </>
                ) : (
                  "Search Workout"
                )}
              </button>
            </div>
          </div>

          {user && workout && (
            <button
              onClick={assignWorkout}
              disabled={isLoading.assign}
              className={`w-full flex justify-center items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                isLoading.assign
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white shadow-md hover:shadow-lg mt-6`}
            >
              {isLoading.assign ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Assigning...
                </>
              ) : (
                "Assign Workout"
              )}
            </button>
          )}

          {message && (
            <div
              className={`mt-6 p-3 rounded-lg text-center font-medium animate-fade-in ${
                message.includes("✅") || message.includes("📩")
                  ? "bg-green-100 text-green-800"
                  : message.includes("⚠️")
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import {jwtDecode} from "jwt-decode";

// export default function AssignWorkout() {
//   const [email, setEmail] = useState("");
//   const [workoutTitle, setWorkoutTitle] = useState("");
//   const [user, setUser] = useState(null);
//   const [workout, setWorkout] = useState(null);
//   const [message, setMessage] = useState("");
//   const [role, setRole] = useState(null);
//   const [authorized, setAuthorized] = useState(false);
//   const [token, setToken] = useState("");

//   const API_URL = process.env.NEXT_PUBLIC_API_URL;

//   // Check JWT token and role on page load
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (!storedToken) return;

//     try {
//       const decoded = jwtDecode(storedToken);
//       setToken(storedToken);
//       setRole(decoded?.role);

//       if (decoded?.role === "admin" || decoded?.role === "trainer") {
//         setAuthorized(true);
//       }
//     } catch (err) {
//       console.error("Invalid token", err.message);
//     }
//   }, []);

//   const searchUser = async () => {
//     try {
//       const res = await fetch(`${API_URL}/auth/search?email=${email}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (data.Success) {
//         setUser(data.exists);
//         setMessage("User found ✅");
//       } else {
//         setUser(null);
//         setMessage("User not found ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       setUser(null);
//       setMessage("Something went wrong ❌");
//     }
//   };

//   const searchWorkout = async () => {
//     try {
//       const res = await fetch(`${API_URL}/workout/search?name=${workoutTitle}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       console.log("Data is",data);
//       if (data.Success) {
//         setWorkout(data.foundWorkout);
//         setMessage("Workout found ✅");
//       } else {
//         setWorkout(null);
//         console.log("This is executing");
//         setMessage("Workout not found ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       setWorkout(null);
//       setMessage("Something went wrong ❌");
//     }
//   };

//   const assignWorkout = async () => {
//     if (!user || !workout) {
//       setMessage("User or Workout missing ⚠️");
//       return;
//     }
//     try {
//       const res = await fetch(`${API_URL}/workout/assign/${user._id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ workoutId: workout._id }),
//       });
//       const data = await res.json();
//       if (data.Success) {
//         setMessage("Workout assigned & email sent 📩");
//       } else {
//         setMessage("Assignment failed ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Something went wrong ❌");
//     }
//   };

//   if (!authorized) {
//     return (
//       <div className="max-w-md mx-auto p-6 mt-10 text-center text-red-600 font-semibold">
//         Access Denied ❌ — Only Admins and Trainers can assign workouts.
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md mt-10">
//       <h2 className="text-2xl font-bold mb-4">Assign Workout to User</h2>

//       <div className="mb-4">
//         <label className="block mb-1 font-semibold">User Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full border px-3 py-2 rounded"
//         />
//         <button
//           onClick={searchUser}
//           className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Search User
//         </button>
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1 font-semibold">Workout Title</label>
//         <input
//           type="text"
//           value={workoutTitle}
//           onChange={(e) => setWorkoutTitle(e.target.value)}
//           className="w-full border px-3 py-2 rounded"
//         />
//         <button
//           onClick={searchWorkout}
//           className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Search Workout
//         </button>
//       </div>

//       {user && workout && (
//         <button
//           onClick={assignWorkout}
//           className="bg-purple-600 text-white px-4 py-2 mt-4 rounded"
//         >
//           Assign Workout
//         </button>
//       )}

//       {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
//     </div>
//   );
// }


