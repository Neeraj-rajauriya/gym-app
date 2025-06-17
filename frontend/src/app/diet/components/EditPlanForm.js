'use client';
import { useState } from 'react';
import { FiSave, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function EditPlanForm({ plan, onSuccess, onClose, updateEndpoint }) {
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    goal: plan?.goal || 'maintenance',
    meals: plan?.meals || [],
    totalcalories: plan?.totalcalories || 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMealChange = (index, field, value) => {
    const updatedMeals = [...formData.meals];
    updatedMeals[index][field] = field === 'calories' ? Number(value) : value;
    setFormData(prev => ({
      ...prev,
      meals: updatedMeals,
      totalcalories: updatedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
    }));
  };

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { name: '', time: '', calories: 0 }]
    }));
  };

  const removeMeal = (index) => {
    const updatedMeals = formData.meals.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      meals: updatedMeals,
      totalcalories: updatedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(updateEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update plan');
      
      toast.success('Diet plan updated successfully!');
      onSuccess(data.updatedDietPlan);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Edit Diet Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="athletic performance">Athletic Performance</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Meals</label>
            <div className="max-h-64 overflow-y-auto mb-2 border rounded p-2">
              {formData.meals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No meals added yet</p>
              ) : (
                formData.meals.map((meal, index) => (
                  <div key={index} className="mb-3 p-2 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Meal {index + 1}</span>
                      <button 
                        type="button" 
                        onClick={() => removeMeal(index)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs mb-1">Name</label>
                        <input
                          type="text"
                          value={meal.name}
                          onChange={(e) => handleMealChange(index, 'name', e.target.value)}
                          className="w-full p-1 border rounded text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs mb-1">Time</label>
                        <input
                          type="text"
                          value={meal.time}
                          onChange={(e) => handleMealChange(index, 'time', e.target.value)}
                          className="w-full p-1 border rounded text-sm"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs mb-1">Calories</label>
                        <input
                          type="number"
                          min="0"
                          value={meal.calories}
                          onChange={(e) => handleMealChange(index, 'calories', e.target.value)}
                          className="w-full p-1 border rounded text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={addMeal}
            className="w-full flex items-center justify-center gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FiPlus />
            Add Meal
          </button>

          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              <FiSave />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 'use client';
// import { useState } from 'react';
// import { FiSave, FiTrash2 } from 'react-icons/fi';
// import { toast } from 'react-toastify';

// export default function EditPlanForm({ plan, onSuccess, onClose, updateEndpoint }) {
//   const [formData, setFormData] = useState({
//     title: plan?.title || '',
//     goal: plan?.goal || 'maintenance',
//     meals: plan?.meals || [],
//     totalcalories: plan?.totalcalories || 0
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleMealChange = (index, field, value) => {
//     const updatedMeals = [...formData.meals];
//     updatedMeals[index][field] = field === 'calories' ? Number(value) : value;
//     setFormData(prev => ({
//       ...prev,
//       meals: updatedMeals,
//       totalcalories: updatedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
//     }));
//   };

//   const addMeal = () => {
//     setFormData(prev => ({
//       ...prev,
//       meals: [...prev.meals, { name: '', time: '', calories: 0 }]
//     }));
//   };

//   const removeMeal = (index) => {
//     const updatedMeals = formData.meals.filter((_, i) => i !== index);
//     setFormData(prev => ({
//       ...prev,
//       meals: updatedMeals,
//       totalcalories: updatedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(updateEndpoint, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to update plan');
      
//       toast.success('Diet plan updated successfully!');
//       onSuccess(data.updatedDietPlan);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Edit Diet Plan</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1">Goal</label>
//           <select
//             name="goal"
//             value={formData.goal}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           >
//             <option value="weight loss">Weight Loss</option>
//             <option value="muscle gain">Muscle Gain</option>
//             <option value="maintenance">Maintenance</option>
//             <option value="athletic performance">Athletic Performance</option>
//           </select>
//         </div>

//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <label>Meals</label>
//             <button type="button" onClick={addMeal} className="text-sm bg-blue-500 text-white px-2 py-1 rounded">
//               Add Meal
//             </button>
//           </div>

//           {formData.meals.map((meal, index) => (
//             <div key={index} className="mb-3 p-2 border rounded">
//               <div className="flex justify-between items-center mb-2">
//                 <span>Meal {index + 1}</span>
//                 <button type="button" onClick={() => removeMeal(index)} className="text-red-500">
//                   <FiTrash2 />
//                 </button>
//               </div>

//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className="block text-xs mb-1">Name</label>
//                   <input
//                     type="text"
//                     value={meal.name}
//                     onChange={(e) => handleMealChange(index, 'name', e.target.value)}
//                     className="w-full p-1 border rounded text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs mb-1">Time</label>
//                   <input
//                     type="text"
//                     value={meal.time}
//                     onChange={(e) => handleMealChange(index, 'time', e.target.value)}
//                     className="w-full p-1 border rounded text-sm"
//                     required
//                   />
//                 </div>
//                 <div className="col-span-2">
//                   <label className="block text-xs mb-1">Calories</label>
//                   <input
//                     type="number"
//                     min="0"
//                     value={meal.calories}
//                     onChange={(e) => handleMealChange(index, 'calories', e.target.value)}
//                     className="w-full p-1 border rounded text-sm"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end space-x-2">
//           <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="px-3 py-1 bg-green-500 text-white rounded flex items-center"
//           >
//             <FiSave className="mr-1" />
//             {isSubmitting ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }