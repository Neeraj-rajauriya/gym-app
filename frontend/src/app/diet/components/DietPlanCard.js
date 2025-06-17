// import { motion } from 'framer-motion';
// import { FiEdit2, FiTrash2, FiUserPlus, FiClock } from 'react-icons/fi';

// const DietPlanCard = ({ plan, onAssign }) => {
//   const totalMeals = plan.meals.length;
//   const createdBy = plan.createdBy?.name || 'Unknown';

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       whileHover={{ y: -5 }}
//       className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//     >
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="text-xl font-bold text-gray-800 truncate">{plan.title}</h3>
//           <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
//             {plan.goal}
//           </span>
//         </div>

//         <div className="flex items-center text-gray-500 text-sm mb-4">
//           <FiClock className="mr-1" />
//           <span>Created by: {createdBy}</span>
//         </div>

//         <div className="mb-4">
//           <div className="flex justify-between items-center mb-1">
//             <span className="text-gray-600">Total Calories:</span>
//             <span className="font-semibold">{plan.totalcalories} kcal</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-green-500 h-2 rounded-full" 
//               style={{ width: `${Math.min(plan.totalcalories / 3000 * 100, 100)}%` }}
//             ></div>
//           </div>
//         </div>

//         <div className="mb-4">
//           <h4 className="text-sm font-medium text-gray-700 mb-2">Meal Times:</h4>
//           <div className="flex flex-wrap gap-2">
//             {plan.meals.slice(0, 4).map((meal, index) => (
//               <span 
//                 key={index} 
//                 className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full"
//               >
//                 {meal.time}
//               </span>
//             ))}
//             {totalMeals > 4 && (
//               <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
//                 +{totalMeals - 4} more
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-between pt-4 border-t border-gray-100">
//           <button 
//             onClick={onAssign}
//             className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors duration-200"
//           >
//             <FiUserPlus className="w-4 h-4" />
//             <span>Assign</span>
//           </button>
//           <div className="flex space-x-3">
//             <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
//               <FiEdit2 className="w-4 h-4" />
//             </button>
//             <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
//               <FiTrash2 className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default DietPlanCard;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiUserPlus, FiClock, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const DietPlanCard = ({ plan, onAssign, onEdit, onDelete }) => {
  const [expandedMealType, setExpandedMealType] = useState(null);
  const createdBy = plan.createdBy?.name || 'Unknown';
  
  // Define all possible meal types and their labels
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'morningSnack', label: 'Morning Snack' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'afternoonSnack', label: 'Afternoon Snack' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'eveningSnack', label: 'Evening Snack' },
    { key: 'preWorkout', label: 'Pre-Workout' }, // Added 7th meal type
  ];

  // Normalize meal data structure
  const getMealsByType = () => {
    const result = {};
    
    // If using plan.meals array structure
    if (plan.meals) {
      plan.meals.forEach(meal => {
        // Normalize meal type key (remove spaces, make lowercase)
        const typeKey = meal.time.toLowerCase().replace(/\s+/g, '');
        if (!result[typeKey]) result[typeKey] = [];
        result[typeKey].push(meal);
      });
    } 
    // If using separate properties (plan.breakfast, plan.lunch, etc.)
    else {
      mealTypes.forEach(({ key }) => {
        if (plan[key] && plan[key].length > 0) {
          result[key] = plan[key];
        }
      });
    }
    
    return result;
  };

  const mealsByType = getMealsByType();
  const hasMeals = Object.keys(mealsByType).length > 0;

  // Calculate total calories
  const totalCalories = plan.totalcalories || 
    (plan.meals 
      ? plan.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
      : mealTypes.reduce((sum, type) => sum + 
          ((plan[type.key] || []).reduce((mealSum, meal) => mealSum + (meal.calories || 0), 0)), 0)
    );

  const toggleMealType = (mealType) => {
    setExpandedMealType(expandedMealType === mealType ? null : mealType);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 truncate">{plan.title}</h3>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {plan.goal}
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <FiClock className="mr-1" />
          <span>Created by: {createdBy}</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600">Total Calories:</span>
            <span className="font-semibold">{totalCalories} kcal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${Math.min(totalCalories / 3000 * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Meal Times:</h4>
          {hasMeals ? (
            <div className="space-y-2">
              {mealTypes.map(({ key, label }) => {
                // Find matching meals regardless of exact key match
                const matchingKey = Object.keys(mealsByType).find(
                  k => k.toLowerCase().includes(key.toLowerCase())
                );
                
                return matchingKey && mealsByType[matchingKey]?.length > 0 ? (
                  <div key={key} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleMealType(matchingKey)}
                      className="w-full flex justify-between items-center p-2 bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700">{label}</span>
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {mealsByType[matchingKey].length} {mealsByType[matchingKey].length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      {expandedMealType === matchingKey ? (
                        <FiChevronUp className="text-gray-500" />
                      ) : (
                        <FiChevronDown className="text-gray-500" />
                      )}
                    </button>
                    {expandedMealType === matchingKey && (
                      <div className="p-2 bg-white">
                        <ul className="space-y-2">
                          {mealsByType[matchingKey].map((meal, index) => (
                            <li key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 truncate">{meal.name || meal.food || 'Meal'}</span>
                              <span className="text-gray-500 whitespace-nowrap ml-2">
                                {meal.calories || '--'} kcal
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No meals added to this plan yet</p>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-100">
          {onAssign && (
            <button 
              onClick={onAssign}
              className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors duration-200"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Assign</span>
            </button>
          )}
          <div className="flex space-x-3">
            {onEdit && (
              <button 
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={onDelete}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DietPlanCard;