"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export default function WorkoutList() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    difficulty: "",
    exercises: [{ name: "", sets: "", reps: "" }],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded?.role || "");
    }
    fetchWorkouts();
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchWorkouts = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to access workouts.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.Success || data.success) {
        setWorkouts(data.workouts || data.newWorkout || []);
      } else {
        setError("Failed to fetch workouts");
      }
    } catch (err) {
      setError("Failed to fetch workouts. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyOrder = ["beginner", "intermediate", "advance", "advanced"];
  const uniqueDifficulties = [
    ...new Set(workouts.map((w) => w.difficulty?.toLowerCase()).filter(Boolean)),
  ].sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b));

  const workoutsByDifficulty = uniqueDifficulties.reduce((acc, diff) => {
    acc[diff] = workouts.filter((w) => w.difficulty?.toLowerCase() === diff);
    return acc;
  }, {});

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this workout?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in to delete workouts.");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.Success || data.success) {
        showToast("Workout deleted", "success");
        fetchWorkouts();
      } else {
        showToast("Failed to delete workout: " + (data.message || ""));
      }
    } catch {
      showToast("Server error while deleting workout");
    }
  };

  const handleEditClick = (workout) => {
    setEditWorkout(workout);
    setFormData({
      title: workout.title || "",
      goal: workout.goal || "",
      difficulty: workout.difficulty || "",
      exercises:
        workout.exercises && workout.exercises.length > 0
          ? workout.exercises.map((ex) =>
              typeof ex === "string"
                ? { name: ex, sets: "", reps: "" }
                : { name: ex.name || "", sets: ex.sets || "", reps: ex.reps || "" }
            )
          : [{ name: "", sets: "", reps: "" }],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditWorkout(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (index, field, value) => {
    setFormData((prev) => {
      const newExercises = [...prev.exercises];
      newExercises[index][field] = value;
      return { ...prev, exercises: newExercises };
    });
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: "", reps: "" }],
    }));
  };

  const removeExercise = (index) => {
    setFormData((prev) => {
      const newExercises = prev.exercises.filter((_, i) => i !== index);
      return {
        ...prev,
        exercises: newExercises.length > 0 ? newExercises : [{ name: "", sets: "", reps: "" }],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("You must be logged in to update workouts.");
      return;
    }
    if (!formData.title.trim()) {
      showToast("Title is required");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/workout/${editWorkout._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.Success || data.success) {
        showToast("Workout updated successfully", "success");
        closeModal();
        fetchWorkouts();
      } else {
        showToast("Failed to update workout: " + (data.message || ""));
      }
    } catch {
      showToast("Server error while updating workout");
    }
  };

  const handleCreateClick = () => {
    router.push("/workout/create");
  };

  const handleAssignClick = () => {
    router.push("/workout/assign");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-6">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-24 h-24"
        >
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-70"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-xl font-semibold text-white text-center max-w-md"
        >
          <span className="inline-block bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Loading your workout plans...
          </span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block ml-1"
          >
            ...
          </motion.span>
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl text-center max-w-md border border-gray-700"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-30"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Error Occurred</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchWorkouts}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Workout Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse and manage all available workout plans categorized by difficulty level
          </p>
        </motion.div>

        {(userRole === "admin" || userRole === "trainer") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 flex flex-wrap justify-center gap-4"
          >
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAssignClick}
              className="relative overflow-hidden px-6 py-3 rounded-full font-semibold text-white shadow-lg"
              style={{
                background: "linear-gradient(45deg, #4f46e5, #7c3aed)"
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Assign Workout
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateClick}
              className="relative overflow-hidden px-6 py-3 rounded-full font-semibold text-white shadow-lg"
              style={{
                background: "linear-gradient(45deg, #4f46e5, #7c3aed)"
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create New Workout
              </span>
            </motion.button>
          </motion.div>
        )}

        {uniqueDifficulties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto border border-gray-100"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-indigo-100 rounded-full blur-md opacity-70"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-indigo-600"
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
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Workouts Found</h3>
            <p className="text-gray-600 mb-6">
              There are currently no workout plans available. Check back later or create a new one.
            </p>
            {(userRole === "admin" || userRole === "trainer") && (
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAssignClick}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Assign Workout
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateClick}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Create First Workout
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        <div className="space-y-16">
          {uniqueDifficulties.map((difficulty) => (
            <motion.section
              key={difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -top-8 -left-4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 -right-4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
              
              <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Difficulty:</h2>
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    className={`inline-block px-6 py-2 rounded-full text-lg font-semibold tracking-wide capitalize ${
                      difficulty === "beginner"
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-lg shadow-green-100/50"
                        : difficulty === "intermediate"
                        ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 shadow-lg shadow-amber-100/50"
                        : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 shadow-lg shadow-red-100/50"
                    }`}
                  >
                    {difficulty}
                  </motion.span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workoutsByDifficulty[difficulty].map((workout) => (
                    <motion.div
                      key={workout._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -8 }}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative p-6 h-full flex flex-col">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                              {workout.title}
                            </h3>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              difficulty === "beginner"
                                ? "bg-green-100 text-green-800"
                                : difficulty === "intermediate"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {workout.difficulty}
                            </span>
                          </div>
                          
                          {workout.goal && (
                            <div className="mb-4">
                              <span className="inline-block text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                {workout.goal}
                              </span>
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-indigo-500"
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
                              Exercises
                            </h4>
                            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                              {workout.exercises?.length ? (
                                workout.exercises.map((ex, i) => (
                                  <motion.li 
                                    key={i} 
                                    className="flex items-start"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                  >
                                    <span className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-500 rounded-full mr-2"></span>
                                    <span className="text-gray-600">
                                      {typeof ex === "string" ? ex : ex.name}{" "}
                                      {ex.sets && ex.reps && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-1">
                                          {ex.sets} sets × {ex.reps} reps
                                        </span>
                                      )}
                                    </span>
                                  </motion.li>
                                ))
                              ) : (
                                <li className="text-gray-400 italic">No exercises listed</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {(userRole === "admin" || userRole === "trainer") && (
                          <div className="mt-6 flex gap-3 justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditClick(workout)}
                              className="relative inline-flex items-center px-4 py-2 overflow-hidden text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group border border-indigo-100"
                            >
                              <span className="relative z-10 flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </span>
                              <span className="absolute inset-0 bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDelete(workout._id)}
                              className="relative inline-flex items-center px-4 py-2 overflow-hidden text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group border border-red-100"
                            >
                              <span className="relative z-10 flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </span>
                              <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold z-50 ${
              toast.type === "error" ? "bg-gradient-to-r from-red-500 to-pink-500" : "bg-gradient-to-r from-green-500 to-emerald-500"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "error" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Workout</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goal
                      </label>
                      <input
                        type="text"
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                      >
                        <option value="">Select difficulty</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advance">Advance</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Exercises
                      </label>
                      <motion.button
                        type="button"
                        onClick={addExercise}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Exercise
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      {formData.exercises.map((ex, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                        >
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Exercise Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Bench Press"
                              value={ex.name}
                              onChange={(e) =>
                                handleExerciseChange(idx, "name", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Sets
                              </label>
                              <input
                                type="number"
                                placeholder="3"
                                value={ex.sets}
                                onChange={(e) =>
                                  handleExerciseChange(idx, "sets", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Reps
                              </label>
                              <input
                                type="number"
                                placeholder="10"
                                value={ex.reps}
                                onChange={(e) =>
                                  handleExerciseChange(idx, "reps", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              />
                            </div>
                          </div>
                          {formData.exercises.length > 1 && (
                            <motion.button
                              type="button"
                              onClick={() => removeExercise(idx)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                                                           className="mt-3 text-xs font-medium text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove Exercise
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <motion.button
                      type="button"
                      onClick={closeModal}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-all shadow-sm"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { jwtDecode } from "jwt-decode";
// import { useRouter } from "next/navigation";

// export default function WorkoutList() {
//   const router = useRouter();
//   const [workouts, setWorkouts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [toast, setToast] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editWorkout, setEditWorkout] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     goal: "",
//     difficulty: "",
//     exercises: [{ name: "", sets: "", reps: "" }],
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decoded = jwtDecode(token);
//       setUserRole(decoded?.role || "");
//     }
//     fetchWorkouts();
//   }, []);

//   const showToast = (message, type = "error") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const fetchWorkouts = async () => {
//     setLoading(true);
//     setError("");
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("You must be logged in to access workouts.");
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.Success || data.success) {
//         setWorkouts(data.workouts || data.newWorkout || []);
//       } else {
//         setError("Failed to fetch workouts");
//       }
//     } catch (err) {
//       setError("Failed to fetch workouts. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const difficultyOrder = ["beginner", "intermediate", "advance", "advanced"];
//   const uniqueDifficulties = [
//     ...new Set(workouts.map((w) => w.difficulty?.toLowerCase()).filter(Boolean)),
//   ].sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b));

//   const workoutsByDifficulty = uniqueDifficulties.reduce((acc, diff) => {
//     acc[diff] = workouts.filter((w) => w.difficulty?.toLowerCase() === diff);
//     return acc;
//   }, {});

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this workout?")) return;
//     const token = localStorage.getItem("token");
//     if (!token) {
//       showToast("You must be logged in to delete workouts.");
//       return;
//     }
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.Success || data.success) {
//         showToast("Workout deleted", "success");
//         fetchWorkouts();
//       } else {
//         showToast("Failed to delete workout: " + (data.message || ""));
//       }
//     } catch {
//       showToast("Server error while deleting workout");
//     }
//   };

//   const handleEditClick = (workout) => {
//     setEditWorkout(workout);
//     setFormData({
//       title: workout.title || "",
//       goal: workout.goal || "",
//       difficulty: workout.difficulty || "",
//       exercises:
//         workout.exercises && workout.exercises.length > 0
//           ? workout.exercises.map((ex) =>
//               typeof ex === "string"
//                 ? { name: ex, sets: "", reps: "" }
//                 : { name: ex.name || "", sets: ex.sets || "", reps: ex.reps || "" }
//             )
//           : [{ name: "", sets: "", reps: "" }],
//     });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditWorkout(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleExerciseChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newExercises = [...prev.exercises];
//       newExercises[index][field] = value;
//       return { ...prev, exercises: newExercises };
//     });
//   };

//   const addExercise = () => {
//     setFormData((prev) => ({
//       ...prev,
//       exercises: [...prev.exercises, { name: "", sets: "", reps: "" }],
//     }));
//   };

//   const removeExercise = (index) => {
//     setFormData((prev) => {
//       const newExercises = prev.exercises.filter((_, i) => i !== index);
//       return {
//         ...prev,
//         exercises: newExercises.length > 0 ? newExercises : [{ name: "", sets: "", reps: "" }],
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       showToast("You must be logged in to update workouts.");
//       return;
//     }
//     if (!formData.title.trim()) {
//       showToast("Title is required");
//       return;
//     }
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/workout/${editWorkout._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       const data = await res.json();
//       if (data.Success || data.success) {
//         showToast("Workout updated successfully", "success");
//         closeModal();
//         fetchWorkouts();
//       } else {
//         showToast("Failed to update workout: " + (data.message || ""));
//       }
//     } catch {
//       showToast("Server error while updating workout");
//     }
//   };

//   const handleCreateClick = () => {
//     router.push("/workout/create");
//   };

//   const handleAssignClick = () => {
//     router.push("/workout/assign");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
//         <motion.div
//           animate={{ 
//             rotate: 360,
//             scale: [1, 1.2, 1]
//           }}
//           transition={{
//             duration: 2,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//           className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-12 w-12 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M13 10V3L4 14h7v7l9-11h-7z"
//             />
//           </svg>
//         </motion.div>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mt-6 text-2xl font-bold text-indigo-700"
//         >
//           Loading your workouts...
//         </motion.p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-6">
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md"
//         >
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8 text-red-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//               />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={fetchWorkouts}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//           >
//             Try Again
//           </button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
//             Workout Plans
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Browse and manage all available workout plans categorized by difficulty level
//           </p>
//         </motion.div>

//         {(userRole === "admin" || userRole === "trainer") && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="mb-12 flex justify-center sm:justify-end gap-4"
//           >
//             <button
//               onClick={handleAssignClick}
//               className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-semibold text-white rounded-full shadow-2xl transition-all duration-300 ease-out hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2"
//               style={{
//                 background: "linear-gradient(to right, #4f46e5, #7c3aed)"
//               }}
//             >
//               <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//               <span className="relative flex items-center gap-2">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//                 Assign Workout
//               </span>
//             </button>
//             <button
//               onClick={handleCreateClick}
//               className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-semibold text-white rounded-full shadow-2xl transition-all duration-300 ease-out hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2"
//               style={{
//                 background: "linear-gradient(to right, #4f46e5, #7c3aed)"
//               }}
//             >
//               <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//               <span className="relative flex items-center gap-2">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//                 </svg>
//                 Create New Workout
//               </span>
//             </button>
//           </motion.div>
//         )}

//         {uniqueDifficulties.length === 0 && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto"
//           >
//             <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-12 w-12 text-indigo-600"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">No Workouts Found</h3>
//             <p className="text-gray-600 mb-6">
//               There are currently no workout plans available. Check back later or create a new one.
//             </p>
//             {(userRole === "admin" || userRole === "trainer") && (
//               <div className="flex gap-4 justify-center">
//                 <button
//                   onClick={handleAssignClick}
//                   className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//                 >
//                   Assign Workout
//                 </button>
//                 <button
//                   onClick={handleCreateClick}
//                   className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
//                 >
//                   Create First Workout
//                 </button>
//               </div>
//             )}
//           </motion.div>
//         )}

//         <div className="space-y-16">
//           {uniqueDifficulties.map((difficulty) => (
//             <motion.section
//               key={difficulty}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="relative"
//             >
//               <div className="absolute -top-8 -left-4 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
//               <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
              
//               <div className="relative">
//                 <h2 className="text-3xl font-bold mb-8 flex items-center">
//                   <span className="mr-4">Difficulty:</span>
//                   <span
//                     className={`inline-block px-6 py-2 rounded-full text-lg font-semibold tracking-wide capitalize ${
//                       difficulty === "beginner"
//                         ? "bg-green-100 text-green-800 shadow-green-200"
//                         : difficulty === "intermediate"
//                         ? "bg-yellow-100 text-yellow-800 shadow-yellow-200"
//                         : "bg-red-100 text-red-800 shadow-red-200"
//                     } shadow-md`}
//                   >
//                     {difficulty}
//                   </span>
//                 </h2>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {workoutsByDifficulty[difficulty].map((workout) => (
//                     <motion.div
//                       key={workout._id}
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ duration: 0.3 }}
//                       whileHover={{ y: -5 }}
//                       className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
//                     >
//                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                       <div className="relative p-6 h-full flex flex-col">
//                         <div className="flex-1">
//                           <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
//                             {workout.title}
//                           </h3>
//                           <div className="flex items-center gap-2 mb-3">
//                             <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
//                               {workout.goal || "General Fitness"}
//                             </span>
//                           </div>
                          
//                           <div className="mb-4">
//                             <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 className="h-5 w-5 mr-1 text-indigo-500"
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M4 6h16M4 12h16M4 18h16"
//                                 />
//                               </svg>
//                               Exercises
//                             </h4>
//                             <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
//                               {workout.exercises?.length ? (
//                                 workout.exercises.map((ex, i) => (
//                                   <li key={i} className="flex items-start">
//                                     <span className="flex-shrink-0 w-2 h-2 mt-2 bg-indigo-500 rounded-full mr-2"></span>
//                                     <span className="text-gray-600">
//                                       {typeof ex === "string" ? ex : ex.name}{" "}
//                                       {ex.sets && ex.reps && (
//                                         <span className="text-sm text-gray-500">
//                                           ({ex.sets} sets × {ex.reps} reps)
//                                         </span>
//                                       )}
//                                     </span>
//                                   </li>
//                                 ))
//                               ) : (
//                                 <li className="text-gray-400 italic">No exercises listed</li>
//                               )}
//                             </ul>
//                           </div>
//                         </div>

//                         {(userRole === "admin" || userRole === "trainer") && (
//                           <div className="mt-6 flex gap-3 justify-end">
//                             <button
//                               onClick={() => handleEditClick(workout)}
//                               className="relative inline-flex items-center px-4 py-2 overflow-hidden text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group"
//                             >
//                               <span className="relative z-10 flex items-center gap-1">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="h-4 w-4"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke="currentColor"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                   />
//                                 </svg>
//                                 Edit
//                               </span>
//                               <span className="absolute inset-0 bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
//                             </button>
//                             <button
//                               onClick={() => handleDelete(workout._id)}
//                               className="relative inline-flex items-center px-4 py-2 overflow-hidden text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
//                             >
//                               <span className="relative z-10 flex items-center gap-1">
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="h-4 w-4"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                   stroke="currentColor"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                   />
//                                 </svg>
//                                 Delete
//                               </span>
//                               <span className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </motion.section>
//           ))}
//         </div>
//       </div>

//       {/* Toast Notification */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             transition={{ duration: 0.3 }}
//             className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-xl text-white font-semibold z-50 ${
//               toast.type === "error" ? "bg-red-500" : "bg-green-500"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               {toast.type === "error" ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//               )}
//               <span>{toast.message}</span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Edit Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", damping: 25 }}
//               className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//             >
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-bold text-gray-800">Edit Workout</h2>
//                   <button
//                     onClick={closeModal}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Goal
//                       </label>
//                       <input
//                         type="text"
//                         name="goal"
//                         value={formData.goal}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Difficulty
//                       </label>
//                       <select
//                         name="difficulty"
//                         value={formData.difficulty}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                       >
//                         <option value="">Select difficulty</option>
//                         <option value="beginner">Beginner</option>
//                         <option value="intermediate">Intermediate</option>
//                         <option value="advance">Advance</option>
//                         <option value="advanced">Advanced</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <div className="flex justify-between items-center mb-3">
//                       <label className="block text-sm font-medium text-gray-700">
//                         Exercises
//                       </label>
//                       <button
//                         type="button"
//                         onClick={addExercise}
//                         className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-4 w-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 4v16m8-8H4"
//                           />
//                         </svg>
//                         Add Exercise
//                       </button>
//                     </div>

//                     <div className="space-y-4">
//                       {formData.exercises.map((ex, idx) => (
//                         <motion.div
//                           key={idx}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.2 }}
//                           className="p-4 border border-gray-200 rounded-lg bg-gray-50"
//                         >
//                           <div className="mb-3">
//                             <label className="block text-xs font-medium text-gray-500 mb-1">
//                               Exercise Name
//                             </label>
//                             <input
//                               type="text"
//                               placeholder="e.g., Bench Press"
//                               value={ex.name}
//                               onChange={(e) =>
//                                 handleExerciseChange(idx, "name", e.target.value)
//                               }
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                               required
//                             />
//                           </div>
//                           <div className="grid grid-cols-2 gap-3">
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1">
//                                 Sets
//                               </label>
//                               <input
//                                 type="number"
//                                 placeholder="3"
//                                 value={ex.sets}
//                                 onChange={(e) =>
//                                   handleExerciseChange(idx, "sets", e.target.value)
//                                 }
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                               />
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1">
//                                 Reps
//                               </label>
//                               <input
//                                 type="number"
//                                 placeholder="10"
//                                 value={ex.reps}
//                                 onChange={(e) =>
//                                   handleExerciseChange(idx, "reps", e.target.value)
//                                 }
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
//                               />
//                             </div>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeExercise(idx)}
//                             className="mt-3 text-xs font-medium text-red-600 hover:text-red-800 flex items-center gap-1"
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-3 w-3"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                               />
//                             </svg>
//                             Remove Exercise
//                           </button>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-4 pt-4">
//                     <button
//                       type="button"
//                       onClick={closeModal}
//                       className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M5 13l4 4L19 7"
//                         />
//                       </svg>
//                       Save Changes
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {jwtDecode} from "jwt-decode";
// import { useRouter } from "next/navigation";

// export default function WorkoutList() {
//   const router = useRouter();
//   const [workouts, setWorkouts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [toast, setToast] = useState(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editWorkout, setEditWorkout] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     goal: "",
//     difficulty: "",
//     exercises: [{ name: "", sets: "", reps: "" }],
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decoded = jwtDecode(token);
//       setUserRole(decoded?.role || "");
//     }
//     fetchWorkouts();
//   }, []);

//   const showToast = (message, type = "error") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const fetchWorkouts = async () => {
//     setLoading(true);
//     setError("");
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("You must be logged in to access workouts.");
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.Success || data.success) {
//         setWorkouts(data.workouts || data.newWorkout || []);
//       } else {
//         setError("Failed to fetch workouts");
//       }
//     } catch (err) {
//       setError("Failed to fetch workouts. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const difficultyOrder = ["beginner", "intermediate", "advance", "advanced"];
//   const uniqueDifficulties = [
//     ...new Set(workouts.map((w) => w.difficulty?.toLowerCase()).filter(Boolean)),
//   ].sort((a, b) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b));

//   const workoutsByDifficulty = uniqueDifficulties.reduce((acc, diff) => {
//     acc[diff] = workouts.filter((w) => w.difficulty?.toLowerCase() === diff);
//     return acc;
//   }, {});

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this workout?")) return;
//     const token = localStorage.getItem("token");
//     if (!token) {
//       showToast("You must be logged in to delete workouts.");
//       return;
//     }
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workout/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.Success || data.success) {
//         showToast("Workout deleted", "success");
//         fetchWorkouts();
//       } else {
//         showToast("Failed to delete workout: " + (data.message || ""));
//       }
//     } catch {
//       showToast("Server error while deleting workout");
//     }
//   };

//   const handleEditClick = (workout) => {
//     setEditWorkout(workout);
//     setFormData({
//       title: workout.title || "",
//       goal: workout.goal || "",
//       difficulty: workout.difficulty || "",
//       exercises:
//         workout.exercises && workout.exercises.length > 0
//           ? workout.exercises.map((ex) =>
//               typeof ex === "string"
//                 ? { name: ex, sets: "", reps: "" }
//                 : { name: ex.name || "", sets: ex.sets || "", reps: ex.reps || "" }
//             )
//           : [{ name: "", sets: "", reps: "" }],
//     });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditWorkout(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleExerciseChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newExercises = [...prev.exercises];
//       newExercises[index][field] = value;
//       return { ...prev, exercises: newExercises };
//     });
//   };

//   const addExercise = () => {
//     setFormData((prev) => ({
//       ...prev,
//       exercises: [...prev.exercises, { name: "", sets: "", reps: "" }],
//     }));
//   };

//   const removeExercise = (index) => {
//     setFormData((prev) => {
//       const newExercises = prev.exercises.filter((_, i) => i !== index);
//       return {
//         ...prev,
//         exercises: newExercises.length > 0 ? newExercises : [{ name: "", sets: "", reps: "" }],
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       showToast("You must be logged in to update workouts.");
//       return;
//     }
//     if (!formData.title.trim()) {
//       showToast("Title is required");
//       return;
//     }
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/workout/${editWorkout._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(formData),
//         }
//       );
//       const data = await res.json();
//       if (data.Success || data.success) {
//         showToast("Workout updated successfully", "success");
//         closeModal();
//         fetchWorkouts();
//       } else {
//         showToast("Failed to update workout: " + (data.message || ""));
//       }
//     } catch {
//       showToast("Server error while updating workout");
//     }
//   };

//   const handleCreateClick = () => {
//     router.push("/workout/create");
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-2xl font-semibold text-indigo-700 dark:text-indigo-400 select-none">
//         Loading workouts...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-600 select-none">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-8 sm:p-12 lg:p-16">
//       <h1 className="text-5xl font-extrabold mb-12 tracking-tight text-gray-900 dark:text-white drop-shadow-md">
//         Workout Plans
//       </h1>

//       {(userRole === "admin" || userRole === "trainer") && (
//         <div className="mb-12 flex justify-start">
//           <button
//             onClick={handleCreateClick}
//             className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 focus-visible:ring-4 focus-visible:ring-green-400 focus:outline-none text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform active:scale-95"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//             </svg>
//             Create Workout
//           </button>
//         </div>
//       )}

//       {uniqueDifficulties.length === 0 && (
//         <p className="text-center text-lg text-gray-600 dark:text-gray-400 select-none">
//           No workouts found.
//         </p>
//       )}

//       {uniqueDifficulties.map((difficulty) => (
//         <section key={difficulty} className="mb-14">
//           <h2
//             className={`text-3xl font-semibold mb-8 capitalize border-b-4 border-indigo-500 pb-3 text-gray-900 dark:text-gray-100`}
//           >
//             Difficulty:{" "}
//             <span
//               className={`inline-block px-4 py-1 rounded-full text-base font-semibold tracking-wide ${
//                 difficulty === "beginner"
//                   ? "bg-green-200 text-green-900"
//                   : difficulty === "intermediate"
//                   ? "bg-yellow-200 text-yellow-900"
//                   : "bg-red-200 text-red-900"
//               }`}
//             >
//               {difficulty}
//             </span>
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//             {workoutsByDifficulty[difficulty].map((workout) => (
//               <motion.div
//                 key={workout._id}
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-gray-200 dark:border-gray-700 hover:shadow-indigo-500/30 transition-shadow duration-300"
//               >
//                 <div>
//                   <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 truncate">
//                     {workout.title}
//                   </h3>
//                   <p className="text-gray-700 dark:text-gray-300 mb-3">
//                     <span className="font-semibold">Goal:</span>{" "}
//                     <span className="capitalize">{workout.goal || "N/A"}</span>
//                   </p>
//                   <p className="text-gray-700 dark:text-gray-300 mb-4">
//                     <span className="font-semibold">Difficulty:</span>{" "}
//                     <span className="capitalize">{workout.difficulty || "N/A"}</span>
//                   </p>
//                   <h4 className="font-semibold mb-3 border-b border-gray-300 dark:border-gray-700 pb-1">
//                     Exercises
//                   </h4>
//                   <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-300 text-sm max-h-40 overflow-y-auto pr-2">
//                     {workout.exercises?.length ? (
//                       workout.exercises.map((ex, i) => (
//                         <li key={i} className="truncate">
//                           {typeof ex === "string" ? ex : ex.name}{" "}
//                           {ex.sets && ex.reps ? `- ${ex.sets} sets × ${ex.reps} reps` : ""}
//                         </li>
//                       ))
//                     ) : (
//                       <li>No exercises listed</li>
//                     )}
//                   </ul>
//                 </div>

//                 {(userRole === "admin" || userRole === "trainer") && (
//                   <div className="mt-6 flex gap-4 justify-end">
//                     <button
//                       onClick={() => handleEditClick(workout)}
//                       className="inline-flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-yellow-400"
//                       aria-label={`Edit workout ${workout.title}`}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(workout._id)}
//                       className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-md transition-colors focus-visible:ring-2 focus-visible:ring-red-400"
//                       aria-label={`Delete workout ${workout.title}`}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       ))}

//       {/* Toast */}
//       {toast && (
//         <div
//           className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white font-semibold select-none max-w-xs w-full z-50
//             ${
//               toast.type === "error"
//                 ? "bg-red-600 animate-fadeIn"
//                 : "bg-green-600 animate-fadeIn"
//             }`}
//           role="alert"
//           aria-live="assertive"
//         >
//           {toast.message}
//         </div>
//       )}

//       {/* Edit Modal */}
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start pt-16 z-50 overflow-auto"
//           aria-modal="true"
//           role="dialog"
//           aria-labelledby="edit-workout-title"
//         >
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl p-8 mx-4 mb-16"
//           >
//             <h2
//               id="edit-workout-title"
//               className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white select-none"
//             >
//               Edit Workout
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
//                   Goal
//                 </label>
//                 <input
//                   type="text"
//                   name="goal"
//                   value={formData.goal}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
//                   Difficulty
//                 </label>
//                 <select
//                   name="difficulty"
//                   value={formData.difficulty}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                 >
//                   <option value="">Select difficulty</option>
//                   <option value="beginner">Beginner</option>
//                   <option value="intermediate">Intermediate</option>
//                   <option value="advance">Advance</option>
//                   <option value="advanced">Advanced</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3">
//                   Exercises
//                 </label>
//                 {formData.exercises.map((ex, idx) => (
//                   <div
//                     key={idx}
//                     className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800"
//                   >
//                     <input
//                       type="text"
//                       placeholder="Exercise name"
//                       value={ex.name}
//                       onChange={(e) =>
//                         handleExerciseChange(idx, "name", e.target.value)
//                       }
//                       className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                       required
//                     />
//                     <div className="flex gap-4">
//                       <input
//                         type="number"
//                         placeholder="Sets"
//                         value={ex.sets}
//                         onChange={(e) =>
//                           handleExerciseChange(idx, "sets", e.target.value)
//                         }
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                       />
//                       <input
//                         type="number"
//                         placeholder="Reps"
//                         value={ex.reps}
//                         onChange={(e) =>
//                           handleExerciseChange(idx, "reps", e.target.value)
//                         }
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeExercise(idx)}
//                       className="mt-2 text-sm font-medium text-red-600 hover:underline focus:outline-none"
//                     >
//                       Remove Exercise
//                     </button>
//                   </div>
//                 ))}

//                 <button
//                   type="button"
//                   onClick={addExercise}
//                   className="text-sm font-semibold text-blue-600 hover:underline focus:outline-none"
//                 >
//                   + Add Exercise
//                 </button>
//               </div>

//               <div className="flex justify-end gap-6 mt-8">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="px-6 py-3 rounded-lg bg-gray-300 dark:bg-gray-700 dark:text-white font-semibold hover:bg-gray-400 transition focus:outline-none"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// }
