// 'use client';

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function EditWorkout({ params }) {
//   const { id } = params;
//   const router = useRouter();

//   const [form, setForm] = useState({
//     title: "",
//     goal: "",
//     difficulty: "beginner",
//     exercises: [{ name: "", sets: "", reps: "" }],
//   });

//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchWorkout = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/workout/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.data.workout) throw new Error("Workout not found");

//         setForm(res.data.workout);
//         setMessage("");
//       } catch (err) {
//         console.log("error is",err.message);
//         setError("Failed to load workout. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchWorkout();
//   }, [id]);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleExerciseChange = (index, e) => {
//     const updated = [...form.exercises];
//     updated[index][e.target.name] = e.target.value;
//     setForm((prev) => ({ ...prev, exercises: updated }));
//   };

//   const addExercise = () => {
//     setForm((prev) => ({
//       ...prev,
//       exercises: [...prev.exercises, { name: "", sets: "", reps: "" }],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/workout/${id}`, form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setMessage("✅ Workout updated successfully!");
//       setTimeout(() => router.push("/workout/all"), 1200);
//     } catch (err) {
//       setMessage("");
//       setError("❌ Failed to update workout.");
//     }
//   };

//   if (loading)
//     return <div className="text-center mt-20 text-indigo-500 font-medium">Loading...</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-lg mt-10 dark:bg-gray-800">
//       <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">
//         Edit Workout Plan
//       </h1>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block font-semibold text-gray-700 dark:text-gray-200">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             required
//             className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold text-gray-700 dark:text-gray-200">Goal</label>
//           <input
//             type="text"
//             name="goal"
//             value={form.goal}
//             onChange={handleChange}
//             required
//             className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold text-gray-700 dark:text-gray-200">Difficulty</label>
//           <select
//             name="difficulty"
//             value={form.difficulty}
//             onChange={handleChange}
//             className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
//           >
//             <option value="beginner">Beginner</option>
//             <option value="intermediate">Intermediate</option>
//             <option value="advanced">Advanced</option>
//           </select>
//         </div>

//         <div>
//           <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">
//             Exercises
//           </h3>
//           {form.exercises.map((ex, index) => (
//             <div key={index} className="grid grid-cols-3 gap-4 mb-2">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Exercise name"
//                 value={ex.name}
//                 onChange={(e) => handleExerciseChange(index, e)}
//                 className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
//               />
//               <input
//                 type="number"
//                 name="sets"
//                 placeholder="Sets"
//                 value={ex.sets}
//                 onChange={(e) => handleExerciseChange(index, e)}
//                 className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
//               />
//               <input
//                 type="number"
//                 name="reps"
//                 placeholder="Reps"
//                 value={ex.reps}
//                 onChange={(e) => handleExerciseChange(index, e)}
//                 className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={addExercise}
//             className="mt-2 text-sm text-indigo-600 dark:text-indigo-300 hover:underline"
//           >
//             + Add another exercise
//           </button>
//         </div>

//         <button
//           type="submit"
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-md"
//         >
//           Update Workout
//         </button>

//         {message && (
//           <p className="mt-3 text-sm text-green-600 dark:text-green-400">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// }


"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function EditWorkout({ params }) {
  const { id } = params;
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    goal: "",
    difficulty: "beginner",
    exercises: [{ name: "", sets: "", reps: "" }],
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/workout/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setForm(res.data.workout);
        setMessage("");
      } catch (err) {
        setMessage("Failed to load workout");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExerciseChange = (index, e) => {
    const updated = [...form.exercises];
    updated[index][e.target.name] = e.target.value;
    setForm((prev) => ({ ...prev, exercises: updated }));
  };

  const addExercise = () => {
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: "", reps: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/workout/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Workout updated successfully!");
      setTimeout(() => router.push("/workout"), 1000);
    } catch (err) {
      setMessage("Failed to update workout.");
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-indigo-500 font-medium">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-lg mt-10 dark:bg-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">
        Edit Workout Plan
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-200">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-200">Goal</label>
          <input
            type="text"
            name="goal"
            value={form.goal}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-200">Difficulty</label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Exercises</h3>
          {form.exercises.map((ex, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-2">
              <input
                type="text"
                name="name"
                placeholder="Exercise name"
                value={ex.name}
                onChange={(e) => handleExerciseChange(index, e)}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                name="sets"
                placeholder="Sets"
                value={ex.sets}
                onChange={(e) => handleExerciseChange(index, e)}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                name="reps"
                placeholder="Reps"
                value={ex.reps}
                onChange={(e) => handleExerciseChange(index, e)}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addExercise}
            className="mt-2 text-sm text-indigo-600 dark:text-indigo-300 hover:underline"
          >
            + Add another exercise
          </button>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow-md"
        >
          Update Workout
        </button>

        {message && (
          <p className="mt-3 text-sm text-green-600 dark:text-green-400">{message}</p>
        )}
      </form>
    </div>
  );
}


