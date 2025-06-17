"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function BookingForm({ trainer, onSubmit }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [error, setError] = useState(null);

  const timeSlots = ["6AM-7AM", "7AM-8AM", "8AM-9AM", "5PM-6PM", "6PM-7PM", "7PM-8PM"];

  const validateToken = (token) => {
    if (!token || token === 'undefined' || token === 'null') {
      throw new Error('Please login to book a session');
    }
    return true;
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return null;
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.date) {
        setAvailableSlots(timeSlots);
        return;
      }

      setIsCheckingAvailability(true);
      setError(null);
      
      try {
        const headers = getAuthHeaders();
        if (!headers) return;

        const response = await fetch(
          `${API_URL}/booking/availability?trainerId=${trainer._id}&date=${formData.date}`,
          { headers }
        );

        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to check availability');
        }

        const data = await response.json();
        setAvailableSlots(timeSlots.filter(slot => !(data.bookedSlots || []).includes(slot)));
      } catch (err) {
        console.error('Availability check error:', err);
        setError(err.message);
        toast.error(err.message);
        setAvailableSlots(timeSlots);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [formData.date, trainer._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      validateToken(token);

      if (!formData.date || !formData.timeSlot) {
        throw new Error('Please select both date and time slot');
      }

      if (!availableSlots.includes(formData.timeSlot)) {
        throw new Error('Selected slot is no longer available');
      }

      onSubmit({
        trainerId: trainer._id,
        date: formData.date,
        timeSlot: formData.timeSlot
      });
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message);
      toast.error(err.message);
      if (err.message.includes('login')) {
        router.push('/login');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Book with {trainer.name}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Picker */}
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-gray-700 mb-2">Time Slot</label>
            
            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {isCheckingAvailability ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                    disabled={!availableSlots.includes(slot)}
                    className={`py-3 px-4 rounded-md text-sm font-medium transition-all ${
                      formData.timeSlot === slot
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                        : availableSlots.includes(slot)
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.date || !formData.timeSlot || isCheckingAvailability}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition ${
              (!formData.date || !formData.timeSlot || isCheckingAvailability) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isCheckingAvailability ? 'Checking Availability...' : 'Book Session'}
          </button>
        </form>
      </div>
    </div>
  );
}
// "use client"
// import { useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// export default function BookingForm({ trainer, onSubmit }) {
//   const router = useRouter();
//   const [date, setDate] = useState('');
//   const [selectedSlot, setSelectedSlot] = useState('');
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
//   const [error, setError] = useState(null);

//   const timeSlots = ["6AM-7AM", "7AM-8AM", "8AM-9AM", "5PM-6PM", "6PM-7PM", "7PM-8PM"];

//   // Validate token and redirect if invalid
//   const validateToken = () => {
//     const token = localStorage.getItem('token');
//     console.log("token in booking form is",token);
//     if (!token) {
//       router.push('/login');
//       return false;
//     }

//     try {
//       const decoded = jwtDecode(token);
//       if (Date.now() >= decoded.exp * 1000) {
//         localStorage.removeItem('token');
//         router.push('/login');
//         return false;
//       }
//       return true;
//     } catch (err) {
//       localStorage.removeItem('token');
//       router.push('/login');
//       return false;
//     }
//   };

//   useEffect(() => {
//     if (!validateToken()) return;
    
//     if (date) {
//       checkSlotAvailability();
//     } else {
//       setAvailableSlots(timeSlots);
//       setSelectedSlot('');
//     }
//   }, [date]);

//   const checkSlotAvailability = async () => {
//     if (!validateToken()) return;

//     setIsCheckingAvailability(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(
//         `${API_URL}/booking/availability?trainerId=${trainer._id}&date=${date}`,
//         {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           credentials: 'include'
//         }
//       );

//       // Handle unauthorized responses
//       if (response.status === 401) {
//         localStorage.removeItem('token');
//         router.push('/login');
//         throw new Error('Session expired. Please login again.');
//       }

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to check availability');
//       }

//       const data = await response.json();
//       setAvailableSlots(timeSlots.filter(slot => !(data.bookedSlots || []).includes(slot)));
      
//     } catch (err) {
//       console.error('Availability check failed:', err);
//       setError(err.message);
//       toast.error(err.message);
//       setAvailableSlots(timeSlots); // Fallback to all slots
//     } finally {
//       setIsCheckingAvailability(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!validateToken()) return;

//     if (!date || !selectedSlot) {
//       setError('Please select both date and time slot');
//       return;
//     }

//     if (!availableSlots.includes(selectedSlot)) {
//       setError('Selected slot is no longer available');
//       return;
//     }

//     onSubmit({
//       trainerId: trainer._id,
//       date,
//       timeSlot: selectedSlot
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Date Picker */}
//       <div>
//         <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
//           Select Date
//         </label>
//         <input
//           type="date"
//           id="date"
//           min={new Date().toISOString().split('T')[0]}
//           className="w-full rounded-md border-gray-300 shadow-sm py-3 px-4 border focus:border-blue-500 focus:ring-blue-500"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           required
//         />
//       </div>

//       {/* Time Slots */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Available Time Slots
//         </label>
        
//         {error && (
//           <div className="mb-4 p-2 bg-red-50 text-red-700 rounded text-sm">
//             {error}
//           </div>
//         )}

//         {isCheckingAvailability ? (
//           <div className="flex justify-center py-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {timeSlots.map((slot) => (
//               <button
//                 type="button"
//                 key={slot}
//                 onClick={() => setSelectedSlot(slot)}
//                 disabled={!availableSlots.includes(slot)}
//                 className={`py-3 px-4 rounded-md text-sm font-medium transition-all ${
//                   selectedSlot === slot
//                     ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
//                     : availableSlots.includes(slot)
//                       ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
//                       : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
//                 }`}
//               >
//                 {slot}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Submit Button */}
//       <div className="pt-4">
//         <button
//           type="submit"
//           disabled={!date || !selectedSlot || isCheckingAvailability}
//           className={`w-full py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium ${
//             (!date || !selectedSlot || isCheckingAvailability) ? 'opacity-70 cursor-not-allowed' : ''
//           }`}
//         >
//           Confirm Booking
//         </button>
//       </div>
//     </form>
//   );
// }


