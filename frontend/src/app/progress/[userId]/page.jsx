'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserProgressPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [progress, setProgress] = useState([]);
  const [activeComment, setActiveComment] = useState({
    id: null,
    text: ''
  });
  const [form, setForm] = useState({
    weight: '',
    bodyFat: '',
    notes: '',
    photo: null
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [activeTab, setActiveTab] = useState('progress');

  // Verify authentication and authorization
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setError('Please login to view progress');
      router.push('/auth/login');
      return;
    }

    setToken(storedToken);
    try {
      const decoded = jwtDecode(storedToken);
      setUserRole(decoded.role);
      
      // Allow access if user is a trainer or if it's their own profile
      if (decoded.userId !== userId && decoded.role !== 'trainer') {
        setError('You are not authorized to view this progress');
        router.push('/auth/unauthorized');
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      setError('Invalid session. Please login again.');
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  }, [userId, router]);

  // Fetch progress from backend
  const fetchProgress = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_URL}/progress/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch progress (Status: ${res.status})`);
      }
      
      const response = await res.json();
      setProgress(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add new progress entry
  const addProgress = async (e) => {
    e.preventDefault();
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('weight', form.weight);
    formData.append('bodyFat', form.bodyFat);
    formData.append('notes', form.notes);
    if (form.photo) formData.append('photo', form.photo);

    try {
      const res = await fetch(`${API_URL}/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save progress');
      }
      
      const response = await res.json();
      setProgress(prev => [response.data, ...prev]);
      setForm({ weight: '', bodyFat: '', notes: '', photo: null });
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit trainer comment - Modified to allow any trainer to comment
  const submitComment = async (entryId) => {
    if (!token || userRole !== 'trainer' || !activeComment.text.trim()) return;
    
    try {
      const res = await fetch(`${API_URL}/progress/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          comment: activeComment.text
          // Removed the commentedBy field since we'll get trainer info from token
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add comment');
      }
      
      const response = await res.json();
      setProgress(prev => prev.map(p => p._id === response.data._id ? response.data : p));
      setActiveComment({ id: null, text: '' });
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProgress();
    }
  }, [token, userId]);

  const retryFetch = () => {
    setError(null);
    fetchProgress();
  };

  if (!token || error?.includes('Please login')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-white rounded-xl shadow-lg"
        >
          <p className="text-lg font-medium text-gray-700">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  if (loading && progress.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          animate={{ 
            rotate: 360,
            transition: { duration: 1, repeat: Infinity, ease: "linear" } 
          }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-red-500 p-4">
            <h2 className="text-white font-bold text-lg">Error loading progress</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-6">{error}</p>
            {!error.includes('authorized') && (
              <button 
                onClick={retryFetch}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <header className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
          >
            Progress Tracker
          </motion.h1>
          <p className="text-gray-600">Track your fitness journey with precision</p>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 font-medium ${activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Progress
          </button>
          {userRole === 'trainer' && (
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 font-medium ${activeTab === 'clients' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Clients
            </button>
          )}
        </div>

        {/* Add Progress Form */}
        <AnimatePresence>
          {activeTab === 'progress' && userRole !== 'trainer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <h2 className="text-xl font-semibold text-white">New Progress Entry</h2>
              </div>
              <form onSubmit={addProgress} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={form.weight}
                      onChange={(e) => setForm({...form, weight: e.target.value})}
                      required
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Body Fat (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={form.bodyFat}
                      onChange={(e) => setForm({...form, bodyFat: e.target.value})}
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows="4"
                    value={form.notes}
                    onChange={(e) => setForm({...form, notes: e.target.value})}
                    maxLength="500"
                    placeholder="How are you feeling? Any observations?"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress Photo</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {form.photo ? (
                          <p className="text-sm text-gray-500">{form.photo.name}</p>
                        ) : (
                          <>
                            <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="text-sm text-gray-500">Click to upload</p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => setForm({...form, photo: e.target.files[0]})}
                      />
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Progress"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Entries */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Progress History</h2>
          
          {progress.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 rounded-2xl shadow text-center"
            >
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No entries yet</h3>
              <p className="mt-1 text-gray-500">Add your first progress entry above to start tracking your journey</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {progress.map((entry) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {entry.weight} kg
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {entry.bodyFat}%
                        </span>
                      </div>
                    </div>
                    
                    {entry.notes && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{entry.notes}</p>
                      </div>
                    )}
                    
                    {entry.photo && (
                      <div className="mb-4 overflow-hidden rounded-lg">
                        <motion.img 
                          src={`http://localhost:4000/uploads/progress/${entry.photo.split('\\').pop()}`}
                          alt="Progress" 
                          className="h-auto max-h-80 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onError={(e) => {
                            console.error('Failed to load image:', e.target.src);
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Comment Section */}
                    <div className="mt-4">
                      {entry.trainerComment ? (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-yellow-800">Trainer's Feedback</h4>
                              <div className="mt-1 text-sm text-yellow-700">
                                <p>{entry.trainerComment}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : userRole === 'trainer' ? (
                        <div className="mt-4">
                          <label htmlFor={`comment-${entry._id}`} className="block text-sm font-medium text-gray-700 mb-2">
                            Add your feedback
                          </label>
                          <textarea
                            id={`comment-${entry._id}`}
                            placeholder="Provide constructive feedback..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            rows="3"
                            value={activeComment.id === entry._id ? activeComment.text : ''}
                            onChange={(e) => setActiveComment({
                              id: entry._id,
                              text: e.target.value
                            })}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => setActiveComment({ id: null, text: '' })}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => submitComment(entry._id)}
                              disabled={!activeComment.text.trim() || activeComment.id !== entry._id}
                              className={`px-3 py-1 text-sm rounded transition-colors ${
                                activeComment.text.trim() && activeComment.id === entry._id 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              Submit Feedback
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
// 'use client';
// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { jwtDecode } from 'jwt-decode';

// export default function UserProgressPage() {
//   const { userId } = useParams();
//   const router = useRouter();
//   const [progress, setProgress] = useState([]);
//   const [form, setForm] = useState({
//     weight: '',
//     bodyFat: '',
//     notes: '',
//     photo: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [error, setError] = useState(null);
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

//   // Verify authentication and authorization
//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     if (!storedToken) {
//       setError('Please login to view progress');
//       router.push('/auth/login');
//       return;
//     }

//     setToken(storedToken);
//     try {
//       const decoded = jwtDecode(storedToken);
//       setUserRole(decoded.role);
      
//       // Verify user has access to view this progress
//       if (decoded.userId !== userId && decoded.role !== 'trainer') {
//         setError('You are not authorized to view this progress');
//         router.push('/auth/unauthorized');
//       }
//     } catch (error) {
//       console.error("Token decoding error:", error);
//       setError('Invalid session. Please login again.');
//       localStorage.removeItem('token');
//       router.push('/auth/login');
//     }
//   }, [userId, router]);

//   // Fetch progress from backend
//   const fetchProgress = async () => {
//     if (!token) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const res = await fetch(`${API_URL}/progress/${userId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || `Failed to fetch progress (Status: ${res.status})`);
//       }
      
//       const response = await res.json();
//       setProgress(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("API Error:", error);
//       setError(error.message);
      
//       if (error.message.includes('401') || error.message.includes('Unauthorized')) {
//         localStorage.removeItem('token');
//         router.push('/auth/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add new progress entry
//   const addProgress = async (e) => {
//     e.preventDefault();
//     if (!token) return;
    
//     setLoading(true);
//     setError(null);
    
//     const formData = new FormData();
//     formData.append('weight', form.weight);
//     formData.append('bodyFat', form.bodyFat);
//     formData.append('notes', form.notes);
//     if (form.photo) formData.append('photo', form.photo);

//     try {
//       const res = await fetch(`${API_URL}/progress`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });
      
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to save progress');
//       }
      
//       const response = await res.json();
//       setProgress(prev => [response.data, ...prev]);
//       setForm({ weight: '', bodyFat: '', notes: '', photo: null });
//     } catch (error) {
//       console.error("API Error:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add trainer comment
//   const addComment = async (progressId, comment) => {
//     if (!token || userRole !== 'trainer') return;
    
//     try {
//       const res = await fetch(`${API_URL}/progress/${progressId}/comment`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ comment })
//       });
      
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to add comment');
//       }
      
//       const response = await res.json();
//       setProgress(prev => prev.map(p => p._id === response.data._id ? response.data : p));
//     } catch (error) {
//       console.error("API Error:", error);
//       setError(error.message);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchProgress();
//     }
//   }, [token, userId]);

//   const retryFetch = () => {
//     setError(null);
//     fetchProgress();
//   };

//   if (!token || error?.includes('Please login')) {
//     return <div className="p-4">Redirecting to login...</div>;
//   }

//   if (loading && progress.length === 0) {
//     return <div className="p-4">Loading progress data...</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-4 max-w-3xl mx-auto">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//           <strong className="font-bold">Error loading progress!</strong>
//           <span className="block sm:inline"> {error}</span>
//           {!error.includes('authorized') && (
//             <button 
//               onClick={retryFetch}
//               className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//             >
//               Try Again
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Progress Tracker</h1>

//       {/* Add Progress Form */}
//       <form onSubmit={addProgress} className="mb-8 bg-white p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">New Entry</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <div>
//             <label className="block mb-1">Weight (kg)</label>
//             <input
//               type="number"
//               step="0.1"
//               className="w-full p-2 border rounded"
//               value={form.weight}
//               onChange={(e) => setForm({...form, weight: e.target.value})}
//               required
//               min="0"
//             />
//           </div>
//           <div>
//             <label className="block mb-1">Body Fat (%)</label>
//             <input
//               type="number"
//               step="0.1"
//               className="w-full p-2 border rounded"
//               value={form.bodyFat}
//               onChange={(e) => setForm({...form, bodyFat: e.target.value})}
//               required
//               min="0"
//               max="100"
//             />
//           </div>
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1">Notes</label>
//           <textarea
//             className="w-full p-2 border rounded"
//             rows="3"
//             value={form.notes}
//             onChange={(e) => setForm({...form, notes: e.target.value})}
//             maxLength="500"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1">Progress Photo (optional)</label>
//           <input
//             type="file"
//             accept="image/*"
//             className="w-full"
//             onChange={(e) => setForm({...form, photo: e.target.files[0]})}
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
//           disabled={loading}
//         >
//           {loading ? 'Saving...' : 'Save Progress'}
//         </button>
//       </form>

//       {/* Progress Entries */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold">Progress History</h2>
        
//         {progress.length === 0 ? (
//           <p className="text-gray-500">No entries yet. Add your first progress entry above.</p>
//         ) : (
//           progress.map((entry) => (
//             <div key={entry._id} className="bg-white p-4 rounded-lg shadow">
//               <div className="flex justify-between items-start mb-2">
//                 <span className="font-medium">
//                   {new Date(entry.date).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric'
//                   })}
//                 </span>
//                 <div className="flex gap-2">
//                   <span className="bg-gray-100 px-2 py-1 rounded text-sm">
//                     {entry.weight} kg
//                   </span>
//                   <span className="bg-gray-100 px-2 py-1 rounded text-sm">
//                     {entry.bodyFat}%
//                   </span>
//                 </div>
//               </div>
              
//               {entry.notes && <p className="mb-3 text-gray-700">{entry.notes}</p>}
              
//               {entry.photo && (
//                 <div className="mb-3">
//                   <img 
//                    src={`http://localhost:4000/uploads/progress/${entry.photo.split('\\').pop()}`}
//                     alt="Progress" 
//                     className="max-w-full h-auto max-h-60 rounded border object-cover"
//                     onError={(e) => {
//                       console.error('Failed to load image:', e.target.src);
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 </div>
//               )}

//               {/* {entry.trainerComment ? (
//                 <div className="mt-3 bg-yellow-50 p-3 rounded border border-yellow-200">
//                   <p className="font-medium text-sm text-yellow-800">Trainer's Comment:</p>
//                   <p className="text-yellow-700">{entry.trainerComment}</p>
//                 </div>
//               ) : userRole === 'trainer' ? (
//                 <div className="mt-3">
//                   <textarea
//                     placeholder="Add trainer comment..."
//                     className="w-full p-2 border rounded mb-2 text-sm"
//                     onChange={(e) => {
//                       const comment = e.target.value;
//                       if (comment.trim().length > 0) {
//                         addComment(entry._id, comment);
//                       }
//                     }}
//                   />
//                 </div>
//               ) : null} */}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
