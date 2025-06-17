// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const getTrainers = async (token) => {
//   try {
//     const response = await fetch(`${API_URL}/booking/trainers`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
    
//     // Clone the response before reading it
//     const responseClone = response.clone();
    
//     if (!response.ok) {
//       const errorData = await responseClone.json();
//       throw new Error(errorData.message || 'Failed to fetch trainers');
//     }
    
//     const data = await response.json();
//     console.log('API Response:', data); // Debugging
    
//     // Extract the trainers array from the response
//     if (data.Success && Array.isArray(data.trainers)) {
//       return data.trainers;
//     }
//     throw new Error('Invalid trainers data format');
    
//   } catch (error) {
//     console.error('Error fetching trainers:', error);
//     throw error;
//   }
// };

// export const createBooking = async (bookingData) => {
//   try {
//     const response = await fetch(`${API_URL}/booking`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify(bookingData)
//     });

//     if (!response.ok) {
//       throw new Error('Failed to create booking');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     throw error;
//   }
// };

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const getTrainers = async (token) => {
//   try {
//     const response = await fetch(`${API_URL}/booking/trainers`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to fetch trainers');
//     }
    
//     const data = await response.json();
//     return data.trainers || [];
//   } catch (error) {
//     console.error('Error fetching trainers:', error);
//     throw error;
//   }
// };

// export const createBooking = async (bookingData, token) => {
//   try {
//     const response = await fetch(`${API_URL}/booking`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(bookingData)
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to create booking');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     throw error;
//   }
// };


const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { jwtDecode } from "jwt-decode";

export const getTrainers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/booking/trainers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Clone the response before reading it
    const responseClone = response.clone();
    
    if (!response.ok) {
      const errorData = await responseClone.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch trainers');
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (data.Success && Array.isArray(data.trainers)) {
      return data.trainers;
    }
    throw new Error('Invalid trainers data format');
    
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error;
  }
};

export const createBooking = async (bookingData, token) => {
  try {
    const response = await fetch(`${API_URL}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });

    // Clone the response before reading it
    const responseClone = response.clone();
    
    if (!response.ok) {
      const errorData = await responseClone.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create booking');
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.success) {
      throw new Error(data.message || 'Booking creation failed');
    }
    
    return data;
    
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// export const getTrainerBookings = async (token) => {
//   try {
//     // First decode the token to get the trainer ID
//     const decoded = jwtDecode(token);
//     const trainerId = decoded.userId; // Assuming the token contains userId
    
//     const response = await fetch(`${API_URL}/booking/trainer/${trainerId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     // Clone the response before reading it
//     const responseClone = response.clone();
    
//     if (!response.ok) {
//       const errorData = await responseClone.json().catch(() => ({}));
//       throw new Error(errorData.message || 'Failed to fetch trainer bookings');
//     }

//     const data = await response.json();
    
//     // Validate response structure
//     if (!Array.isArray(data)) {
//       throw new Error('Invalid bookings data format');
//     }
    
//     return data;
    
//   } catch (error) {
//     console.error('Error fetching trainer bookings:', error);
//     throw error;
//   }
// };


export const getTrainerBookings = async (token) => {
  try {
    // First decode the token to get the trainer ID
    const decoded = jwtDecode(token);
    const trainerId = decoded.userId; // Assuming the token contains userId
    
    const response = await fetch(`${API_URL}/booking/trainer/${trainerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Clone the response before reading it
    const responseClone = response.clone();
    
    if (!response.ok) {
      const errorData = await responseClone.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch trainer bookings');
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.Success || !Array.isArray(data.bookings)) {
      throw new Error('Invalid bookings data format');
    }
    
    return data.bookings; // Return the bookings array instead of the whole response
    
  } catch (error) {
    console.error('Error fetching trainer bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status, token) => {
  try {
    const response = await fetch(`${API_URL}/booking/status/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    // Clone the response before reading it
    const responseClone = response.clone();
    
    if (!response.ok) {
      const errorData = await responseClone.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update booking status');
    }

    const data = await response.json();
    
    // Validate response structure - changed from data.success to data.Success
    if (!data.Success) {
      throw new Error(data.message || 'Status update failed');
    }
    
    return data;
    
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};