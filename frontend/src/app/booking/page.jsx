"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import BookingForm from './components/BookingForm';
import ConfirmationModal from './components/ConfirmationModal';
import { getTrainers, createBooking, getTrainerBookings, updateBookingStatus } from './lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookingPage() {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [trainerBookings, setTrainerBookings] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to access this page');
          router.push('/auth/login');
          return;
        }

        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        const trainersData = await getTrainers(token);
        if (!Array.isArray(trainersData)) {
          throw new Error('Received invalid trainers data');
        }
        setTrainers(trainersData);

        if (decoded.role === 'trainer') {
          const bookings = await getTrainerBookings(token);
          setTrainerBookings(bookings);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message);
        setIsLoading(false);
        // router.push('/login');
      }
    };

    fetchData();
  }, [router]);

  const validateToken = (token) => {
    if (!token || token === 'undefined' || token === 'null') {
      throw new Error('No authentication token found. Please login again.');
    }
    return true;
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      validateToken(token);

      if (userRole === 'trainer') {
        throw new Error('Trainers cannot book other trainers');
      }

      if (!selectedTrainer) {
        throw new Error('Please select a trainer first');
      }

      setBookingData({
        trainerId: selectedTrainer._id,
        trainerName: selectedTrainer.name,
        date: formData.date,
        timeSlot: formData.timeSlot
      });

      setShowModal(true);
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.message);
      if (err.message.includes('token') || err.message.includes('login')) {
        // router.push('/login');
      }
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      validateToken(token);

      const res = await fetch(
        `${API_URL}/booking/availability?trainerId=${bookingData.trainerId}&date=${bookingData.date}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!res.ok) throw new Error('Failed to check availability');

      const availabilityData = await res.json();
      if (availabilityData.bookedSlots?.includes(bookingData.timeSlot)) {
        throw new Error('This slot was just booked. Please select another time.');
      }

      const response = await createBooking({
        trainerId: bookingData.trainerId,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot
      }, token);

      if (!response.success) throw new Error(response.message || 'Booking failed');

      setShowModal(false);
      router.push('/dashboard?booking=success');
      toast.success('Booking request sent successfully!');
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      validateToken(token);

      const response = await updateBookingStatus(bookingId, newStatus, token);
      if (!response.success) throw new Error(response.message);

      setTrainerBookings(prev => prev.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));

      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
      console.error('Status update error:', err);
      toast.error(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (userRole === 'trainer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Trainer <span className="text-blue-600">Dashboard</span>
            </h1>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowRequests(!showRequests)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              {showRequests ? 'Hide Booking Requests' : 'View Booking Requests'}
            </button>
          </div>

          {showRequests && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Requests</h2>
                
                {trainerBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No booking requests found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trainerBookings.map(booking => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              User: <span className="text-blue-600">{booking.user?.name}</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Date: {new Date(booking.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Time: {booking.timeSlot}
                            </p>
                            <p className="text-sm mt-2">
                              Status: 
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status}
                              </span>
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Book Your <span className="text-blue-600">Training Session</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Select a trainer and choose your preferred time slot
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Trainers</h2>
                <div className="space-y-4">
                  {trainers.map((trainer) => (
                    <div
                      key={trainer._id}
                      onClick={() => setSelectedTrainer(trainer)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${selectedTrainer?._id === trainer._id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {trainer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{trainer.name}</p>
                          <p className="text-sm text-gray-500">
                            {trainer.specialization || 'Fitness Trainer'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedTrainer ? (
              <BookingForm 
                trainer={selectedTrainer} 
                onSubmit={handleBookingSubmit}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Select a trainer</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a trainer from the list to book your session.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmBooking}
        bookingData={bookingData}
        isLoading={isSubmitting}
      />
    </div>
  );
}

// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode';
// import { toast } from 'react-toastify';
// import BookingForm from './components/BookingForm';
// import ConfirmationModal from './components/ConfirmationModal';
// import { getTrainers, createBooking } from './lib/api';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export default function BookingPage() {
//   const [trainers, setTrainers] = useState([]);
//   const [selectedTrainer, setSelectedTrainer] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [bookingData, setBookingData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           toast.error('Please login to access this page');
//           router.push('/login');
//           return;
//         }

//         const decoded = jwtDecode(token);
//         setUserRole(decoded.role);

//         const trainersData = await getTrainers(token);
//         if (!Array.isArray(trainersData)) {
//           throw new Error('Received invalid trainers data');
//         }

//         setTrainers(trainersData);
//         setIsLoading(false);
//       } catch (err) {
//         console.error('Initialization error:', err);
//         setError(err.message);
//         setIsLoading(false);
//         router.push('/login');
//       }
//     };

//     fetchData();
//   }, [router]);

//   const validateToken = (token) => {
//     if (!token || token === 'undefined' || token === 'null') {
//       throw new Error('No authentication token found. Please login again.');
//     }
//     return true;
//   };

//   const handleBookingSubmit = async (formData) => {
//     try {
//       const token = localStorage.getItem('token');
//       validateToken(token);

//       if (userRole === 'trainer') {
//         throw new Error('Trainers cannot book other trainers');
//       }

//       if (!selectedTrainer) {
//         throw new Error('Please select a trainer first');
//       }

//       setBookingData({
//         trainerId: selectedTrainer._id,
//         trainerName: selectedTrainer.name,
//         date: formData.date,
//         timeSlot: formData.timeSlot
//       });

//       setShowModal(true);
//     } catch (err) {
//       console.error('Booking error:', err);
//       toast.error(err.message);
//       if (err.message.includes('token') || err.message.includes('login')) {
//         router.push('/login');
//       }
//     }
//   };

//   const handleConfirmBooking = async () => {
//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem('token');
//       validateToken(token);

//       // Final availability check
//       const res = await fetch(
//         `${API_URL}/booking/availability?trainerId=${bookingData.trainerId}&date=${bookingData.date}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (!res.ok) throw new Error('Failed to check availability');

//       const availabilityData = await res.json();
//       if (availabilityData.bookedSlots?.includes(bookingData.timeSlot)) {
//         throw new Error('This slot was just booked. Please select another time.');
//       }

//       // Create booking
//       const response = await createBooking({
//         trainerId: bookingData.trainerId,
//         date: bookingData.date,
//         timeSlot: bookingData.timeSlot
//       }, token);

//       if (!response.success) throw new Error(response.message || 'Booking failed');

//       setShowModal(false);
//       router.push('/dashboard?booking=success');
//       toast.success('Booking request sent successfully!');
//     } catch (err) {
//       console.error('Booking error:', err);
//       toast.error(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (userRole === 'trainer') {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Trainer Access Restricted</h2>
//           <p className="text-gray-600 mb-6">
//             As a trainer, you cannot book other trainers.
//           </p>
//           <button
//             onClick={() => router.push('/dashboard')}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
//             Book Your <span className="text-blue-600">Training Session</span>
//           </h1>
//           <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
//             Select a trainer and choose your preferred time slot
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
//               <div className="p-6">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Trainers</h2>
//                 <div className="space-y-4">
//                   {trainers.map((trainer) => (
//                     <div
//                       key={trainer._id}
//                       onClick={() => setSelectedTrainer(trainer)}
//                       className={`p-4 rounded-lg cursor-pointer transition-all ${selectedTrainer?._id === trainer._id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
//                           {trainer.name.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">{trainer.name}</p>
//                           <p className="text-sm text-gray-500">
//                             {trainer.specialization || 'Fitness Trainer'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-2">
//             {selectedTrainer ? (
//               <BookingForm 
//                 trainer={selectedTrainer} 
//                 onSubmit={handleBookingSubmit}
//               />
//             ) : (
//               <div className="bg-white rounded-xl shadow-lg p-8 text-center">
//                 <div className="max-w-md mx-auto">
//                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                   </svg>
//                   <h3 className="mt-2 text-lg font-medium text-gray-900">Select a trainer</h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Choose a trainer from the list to book your session.
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <ConfirmationModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onConfirm={handleConfirmBooking}
//         bookingData={bookingData}
//         isLoading={isSubmitting}
//       />
//     </div>
//   );
// }