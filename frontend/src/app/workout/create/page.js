"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

export default function CreateWorkout() {
  const router = useRouter();

  const [userRole, setUserRole] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Check token and role on mount
    const token = localStorage.getItem("token");
    console.log("token is",token);
    if (!token) {
      setAuthorized(false);
      return;
    }

    try {
        console.log("Inside try");
      const decoded = jwtDecode(token);
      console.log("decoded is",decoded);
      if (decoded.role === "admin" || decoded.role === "trainer") {
        setUserRole(decoded.role);
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (err) {
      setAuthorized(false);
    }
  }, []);

  // Handle input changes for exercises array
  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: "", reps: "" }]);
  };

  const removeExercise = (index) => {
    if (exercises.length === 1) return; // at least one exercise required
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    // Prepare payload
    const payload = {
      title,
      goal,
      difficulty,
      exercises: exercises.map((ex) => ({
        name: ex.name,
        sets: Number(ex.sets),
        reps: Number(ex.reps),
      })),
    };
    console.log("Payload is",payload);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workout/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.Success) {
        setSuccess("Workout created successfully!");
        setTitle("");
        setGoal("");
        setDifficulty("beginner");
        setExercises([{ name: "", sets: "", reps: "" }]);
      } else {
        setError(res.data.message || "Failed to create workout");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  if (!authorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center"
        >
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            🚫 Not Authorized
          </h1>
          <p className="text-gray-700">
            You do not have permission to access this page.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-center mb-8 text-blue-700"
      >
        Create New Workout
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter workout title"
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Goal</label>
          <input
            type="text"
            required
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter workout goal"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Exercises */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">Exercises</label>
          {exercises.map((ex, index) => (
            <div
              key={index}
              className="flex space-x-3 items-center mb-3"
            >
              <input
                type="text"
                placeholder="Exercise name"
                required
                value={ex.name}
                onChange={(e) =>
                  handleExerciseChange(index, "name", e.target.value)
                }
                className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                min="1"
                placeholder="Sets"
                required
                value={ex.sets}
                onChange={(e) =>
                  handleExerciseChange(index, "sets", e.target.value)
                }
                className="w-20 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                min="1"
                placeholder="Reps"
                required
                value={ex.reps}
                onChange={(e) =>
                  handleExerciseChange(index, "reps", e.target.value)
                }
                className="w-20 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => removeExercise(index)}
                className="text-red-500 hover:text-red-700 font-bold text-xl"
                title="Remove exercise"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExercise}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Add Exercise
          </button>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Workout"}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <p className="text-red-600 font-semibold text-center mt-4">{error}</p>
        )}
        {success && (
          <p className="text-green-600 font-semibold text-center mt-4">{success}</p>
        )}
      </form>
    </div>
  );
}
