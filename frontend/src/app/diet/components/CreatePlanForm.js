import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

const CreatePlanForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    goal: 'weight loss',
    totalcalories: '',
    meals: [{ time: 'Breakfast', name: '', calories: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMealChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMeals = [...formData.meals];
    updatedMeals[index][name] = value;
    setFormData(prev => ({ ...prev, meals: updatedMeals }));
  };

  const addMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, { time: '', name: '', calories: '' }]
    }));
  };

  const removeMeal = (index) => {
    if (formData.meals.length <= 1) return;
    const updatedMeals = [...formData.meals];
    updatedMeals.splice(index, 1);
    setFormData(prev => ({ ...prev, meals: updatedMeals }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dietPlan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create plan');
      }

      onSuccess(data.newPlan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 w-full max-w-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Diet Plan</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="athletic performance">Athletic Performance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Calories (kcal)</label>
            <input
              type="number"
              name="totalcalories"
              value={formData.totalcalories}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-800">Meals</h3>
            <motion.button
              type="button"
              onClick={addMeal}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors duration-200"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Meal</span>
            </motion.button>
          </div>

          <div className="space-y-4">
            {formData.meals.map((meal, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <select
                    name="time"
                    value={meal.time}
                    onChange={(e) => handleMealChange(index, e)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Morning Snack">Morning Snack</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Afternoon Snack">Afternoon Snack</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Evening Snack">Evening Snack</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    name="name"
                    value={meal.name}
                    onChange={(e) => handleMealChange(index, e)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={meal.calories}
                    onChange={(e) => handleMealChange(index, e)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div className="col-span-1">
                  {formData.meals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMeal(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 disabled:opacity-70 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : 'Create Plan'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreatePlanForm;