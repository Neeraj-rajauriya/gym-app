'use client';
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from 'react';
import { FaUser, FaDumbbell, FaChartLine, FaClipboardList, FaArrowRight, FaUtensils, FaHome, FaInfoCircle, FaEnvelope, FaPhone, FaFacebook, FaTwitter, FaInstagram, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const verifyToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again.');
        return false;
      }
      
      setUserData(decoded);
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      toast.error('Invalid session. Please login again.');
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      // Verify the token
      const isValid = verifyToken(token);
      setIsLoggedIn(isValid);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleCardClick = (link, e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login to access this feature');
      router.push('/auth/login');
      return;
    }
    
    // Verify token again before navigation
    if (!verifyToken(token)) {
      router.push('/auth/login');
      return;
    }
    
    router.push(link);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    toast.success('Logged out successfully');
    router.push('/auth/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };

  const featureCards = [
    {
      icon: <FaUser className="text-3xl" />,
      title: "View Members",
      description: "View all registered members with active memberships",
      link: "/users/registeredUser",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <FaDumbbell className="text-3xl" />,
      title: "Track Workouts",
      description: "Log and view workout routines and sessions",
      link: "/workout/all",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: <FaUtensils className="text-3xl" />,
      title: "Diet Plans",
      description: "Manage nutrition and meal plans",
      link: "/diet",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Monitor Progress",
      description: "Keep an eye on members' fitness achievements",
      link: "/progress",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <FaClipboardList className="text-3xl" />,
      title: "Manage Plans",
      description: "Create and assign membership plans",
      link: "/membership/all",
      color: "from-rose-500 to-pink-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }


  return (
   <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaDumbbell className="text-3xl text-purple-400" />
              <h1 className="text-2xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  EliteFit
                </span>
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="flex items-center text-gray-300 hover:text-purple-300 transition">
                <FaHome className="mr-2" /> Home
              </Link>
              <Link href="#" className="flex items-center text-gray-300 hover:text-purple-300 transition">
                <FaInfoCircle className="mr-2" /> About
              </Link>
              <Link href="#" className="flex items-center text-gray-300 hover:text-purple-300 transition">
                <FaEnvelope className="mr-2" /> Contact
              </Link>
              
              {isLoggedIn && userData && (
                <div className="flex items-center space-x-4">
                  {console.log("UserData is",userData)}
                  <span className="text-white hidden lg:inline">Welcome, {userData.name || userData.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-2">
                  <Link 
                    href="#" 
                    className="block px-3 py-2 rounded-md text-gray-300 hover:text-purple-300 hover:bg-gray-700 transition"
                    onClick={toggleMobileMenu}
                  >
                    <FaHome className="inline mr-2" /> Home
                  </Link>
                  <Link 
                    href="#" 
                    className="block px-3 py-2 rounded-md text-gray-300 hover:text-purple-300 hover:bg-gray-700 transition"
                    onClick={toggleMobileMenu}
                  >
                    <FaInfoCircle className="inline mr-2" /> About
                  </Link>
                  <Link 
                    href="#" 
                    className="block px-3 py-2 rounded-md text-gray-300 hover:text-purple-300 hover:bg-gray-700 transition"
                    onClick={toggleMobileMenu}
                  >
                    <FaEnvelope className="inline mr-2" /> Contact
                  </Link>
                  
                  {isLoggedIn && userData && (
                    <>
                      <div className="px-3 py-2 text-white">
                        Welcome, {userData.name || userData.email}
                      </div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          toggleMobileMenu();
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-gray-300 hover:text-purple-300 hover:bg-gray-700 transition"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: Math.random() * 100, y: Math.random() * 100, opacity: 0.1 }}
              animate={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                transition: { duration: 20 + Math.random() * 20, repeat: Infinity, repeatType: "reverse" }
              }}
              className="absolute w-2 h-2 bg-white rounded-full opacity-10"
            />
          ))}
        </div>

        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Welcome Text */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <motion.h1 
                  className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Fitness</span> Journey
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-300 mb-8 max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {isLoggedIn 
                    ? "Manage your gym with our all-in-one solution" 
                    : "Transform your gym management with our all-in-one solution for memberships, workouts, and progress tracking."
                  }
                </motion.p>

                {!isLoggedIn && (
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link href="/auth/login">
                      <button className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                        <span className="relative z-10">Get Started</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </button>
                    </Link>
                    
                    <Link href="/auth/register">
                      <button className="relative overflow-hidden group bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <span className="relative z-10">Join Now</span>
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                      </button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>

              {/* Right Side - Cards */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
              >
                {featureCards.map((card, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-2xl cursor-pointer overflow-hidden relative group`}
                    onClick={(e) => handleCardClick(card.link, e)}
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    <div className="relative z-10">
                      <div className="text-white mb-4">{card.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-gray-200 text-sm">{card.description}</p>
                    </div>
                    
                    <AnimatePresence>
                      {activeCard === index && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute bottom-4 right-4 text-white"
                        >
                          <FaArrowRight className="text-xl" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="fixed bottom-8 right-8 z-20"
        >
          <Link href="/booking">
            <button className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
              <FaDumbbell className="text-xl" />
            </button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
 <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 border-t border-gray-700">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaDumbbell className="text-purple-400 mr-2" />
                EliteFit
              </h3>
              <p className="text-gray-400">
                Your premier fitness management solution for gyms and trainers.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-purple-300 transition">Home</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-purple-300 transition">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-purple-300 transition">Features</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-purple-300 transition">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400 hover:text-purple-300 transition">
                  <FaEnvelope className="mr-2" /> info@elitefit.com
                </li>
                <li className="flex items-center text-gray-400 hover:text-purple-300 transition">
                  <FaPhone className="mr-2" /> +1 (555) 123-4567
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-300 transition">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-300 transition">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-300 transition">
                  <FaInstagram className="text-xl" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EliteFit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
// 'use client';
// export const dynamic = "force-dynamic";
// import React, { useEffect, useState } from 'react';
// import { FaUser, FaDumbbell, FaChartLine, FaClipboardList, FaArrowRight, FaUtensils } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { jwtDecode } from "jwt-decode";

// const Dashboard = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeCard, setActiveCard] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);

//   const verifyToken = (token) => {
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Date.now() / 1000;
      
//       if (decoded.exp < currentTime) {
//         localStorage.removeItem('token');
//         toast.error('Session expired. Please login again.');
//         return false;
//       }
      
//       setUserData(decoded);
//       return true;
//     } catch (error) {
//       console.error('Invalid token:', error);
//       localStorage.removeItem('token');
//       toast.error('Invalid session. Please login again.');
//       return false;
//     }
//   };

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
//       if (!token) {
//         setIsLoggedIn(false);
//         setIsLoading(false);
//         return;
//       }

//       // Verify the token
//       const isValid = verifyToken(token);
//       setIsLoggedIn(isValid);
//       setIsLoading(false);
//     };

//     checkAuth();
//   }, []);

//   const handleCardClick = (link, e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       toast.error('Please login to access this feature');
//       router.push('/auth/login');
//       return;
//     }
    
//     // Verify token again before navigation
//     if (!verifyToken(token)) {
//       router.push('/auth/login');
//       return;
//     }
    
//     router.push(link);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsLoggedIn(false);
//     setUserData(null);
//     toast.success('Logged out successfully');
//     router.push('/auth/login');
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.1,
//         duration: 0.5,
//         ease: "easeOut"
//       }
//     }),
//     hover: {
//       y: -10,
//       scale: 1.03,
//       transition: { duration: 0.3 }
//     }
//   };

//   const featureCards = [
//     {
//       icon: <FaUser className="text-3xl" />,
//       title: "View Members",
//       description: "View all registered members with active memberships",
//       link: "/users/registeredUser",
//       color: "from-purple-500 to-indigo-600"
//     },
//     {
//       icon: <FaDumbbell className="text-3xl" />,
//       title: "Track Workouts",
//       description: "Log and view workout routines and sessions",
//       link: "/workout/all",
//       color: "from-amber-500 to-orange-600"
//     },
//     {
//       icon: <FaUtensils className="text-3xl" />,
//       title: "Diet Plans",
//       description: "Manage nutrition and meal plans",
//       link: "/diet",
//       color: "from-green-500 to-emerald-600"
//     },
//     {
//       icon: <FaChartLine className="text-3xl" />,
//       title: "Monitor Progress",
//       description: "Keep an eye on members' fitness achievements",
//       link: "/progress",
//       color: "from-blue-500 to-cyan-600"
//     },
//     {
//       icon: <FaClipboardList className="text-3xl" />,
//       title: "Manage Plans",
//       description: "Create and assign membership plans",
//       link: "/membership/all",
//       color: "from-rose-500 to-pink-600"
//     }
//   ];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(10)].map((_, i) => (
//           <motion.div
//             key={i}
//             initial={{ x: Math.random() * 100, y: Math.random() * 100, opacity: 0.1 }}
//             animate={{
//               x: Math.random() * 100,
//               y: Math.random() * 100,
//               transition: { duration: 20 + Math.random() * 20, repeat: Infinity, repeatType: "reverse" }
//             }}
//             className="absolute w-2 h-2 bg-white rounded-full opacity-10"
//           />
//         ))}
//       </div>

//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
//         <div className="w-full max-w-7xl mx-auto">
//           {/* User Info and Logout Button */}
//           {isLoggedIn && userData && (
//             <div className="flex justify-end mb-6">
//               <div className="flex items-center space-x-4">
//                 <span className="text-white">Welcome, {userData.name || userData.email}</span>
//                 <button 
//                   onClick={handleLogout}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Left Side - Welcome Text */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-center lg:text-left"
//             >
//               <motion.h1 
//                 className="text-4xl md:text-6xl font-extrabold text-white mb-6"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Fitness</span> Journey
//               </motion.h1>
              
//               <motion.p 
//                 className="text-xl text-gray-300 mb-8 max-w-lg"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 {isLoggedIn 
//                   ? "Manage your gym with our all-in-one solution" 
//                   : "Transform your gym management with our all-in-one solution for memberships, workouts, and progress tracking."
//                 }
//               </motion.p>

//               {!isLoggedIn && (
//                 <motion.div 
//                   className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.6 }}
//                 >
//                   <Link href="/auth/login">
//                     <button className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
//                       <span className="relative z-10">Get Started</span>
//                       <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//                     </button>
//                   </Link>
                  
//                   <Link href="/auth/register">
//                     <button className="relative overflow-hidden group bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300 shadow-lg hover:shadow-xl">
//                       <span className="relative z-10">Join Now</span>
//                       <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
//                     </button>
//                   </Link>
//                 </motion.div>
//               )}
//             </motion.div>

//             {/* Right Side - Cards */}
//             <motion.div 
//               className="grid grid-cols-1 sm:grid-cols-2 gap-6"
//               initial="hidden"
//               animate="visible"
//             >
//               {featureCards.map((card, index) => (
//                 <motion.div
//                   key={index}
//                   custom={index}
//                   variants={cardVariants}
//                   initial="hidden"
//                   animate="visible"
//                   whileHover="hover"
//                   className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-2xl cursor-pointer overflow-hidden relative group`}
//                   onClick={(e) => handleCardClick(card.link, e)}
//                   onMouseEnter={() => setActiveCard(index)}
//                   onMouseLeave={() => setActiveCard(null)}
//                 >
//                   <div className="relative z-10">
//                     <div className="text-white mb-4">{card.icon}</div>
//                     <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
//                     <p className="text-gray-200 text-sm">{card.description}</p>
//                   </div>
                  
//                   <AnimatePresence>
//                     {activeCard === index && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="absolute bottom-4 right-4 text-white"
//                       >
//                         <FaArrowRight className="text-xl" />
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
                  
//                   <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Floating CTA */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.2 }}
//         className="fixed bottom-8 right-8 z-20"
//       >
//         <Link href="/booking">
//           <button className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
//             <FaDumbbell className="text-xl" />
//           </button>
//         </Link>
//       </motion.div>
//     </main>
//   );
// };

// export default Dashboard;

// 'use client';
// import React, { useEffect, useState } from 'react';
// import { FaUser, FaDumbbell, FaChartLine, FaClipboardList, FaArrowRight } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// const Dashboard = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeCard, setActiveCard] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     // Check if user is logged in (you can replace this with your actual auth check)
//     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//     setIsLoggedIn(!!token);
//     setIsLoading(false);
//   }, []);

//   const handleMembershipClick = (e) => {
//     e.preventDefault();
//     if (isLoggedIn) {
//       router.push('/membership/all');
//     } else {
//       router.push('/auth/login');
//     }
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: (i) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.1,
//         duration: 0.5,
//         ease: "easeOut"
//       }
//     }),
//     hover: {
//       y: -10,
//       scale: 1.03,
//       transition: { duration: 0.3 }
//     }
//   };

//   const featureCards = [
//     {
//       icon: <FaUser className="text-3xl" />,
//       title: "Manage Members",
//       description: "Easily add, update, or remove gym members",
//       link: "/membership/users",
//       color: "from-purple-500 to-indigo-600"
//     },
//     {
//       icon: <FaDumbbell className="text-3xl" />,
//       title: "Track Workouts",
//       description: "Log and view workout routines and sessions",
//       link: "/workout/all",
//       color: "from-amber-500 to-orange-600"
//     },
//     {
//       icon: <FaChartLine className="text-3xl" />,
//       title: "Monitor Progress",
//       description: "Keep an eye on members' fitness achievements",
//       link: "/progress",
//       color: "from-emerald-500 to-teal-600"
//     },
//     {
//       icon: <FaClipboardList className="text-3xl" />,
//       title: "Manage Plans",
//       description: "Create and assign membership plans",
//       link: "/membership/all",
//       color: "from-rose-500 to-pink-600",
//       onClick: handleMembershipClick
//     }
//   ];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
//         />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(10)].map((_, i) => (
//           <motion.div
//             key={i}
//             initial={{ x: Math.random() * 100, y: Math.random() * 100, opacity: 0.1 }}
//             animate={{
//               x: Math.random() * 100,
//               y: Math.random() * 100,
//               transition: { duration: 20 + Math.random() * 20, repeat: Infinity, repeatType: "reverse" }
//             }}
//             className="absolute w-2 h-2 bg-white rounded-full opacity-10"
//           />
//         ))}
//       </div>

//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
//         <div className="w-full max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Left Side - Welcome Text */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-center lg:text-left"
//             >
//               <motion.h1 
//                 className="text-4xl md:text-6xl font-extrabold text-white mb-6"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Fitness</span> Journey
//               </motion.h1>
              
//               <motion.p 
//                 className="text-xl text-gray-300 mb-8 max-w-lg"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 Transform your gym management with our all-in-one solution for memberships, workouts, and progress tracking.
//               </motion.p>

//               <motion.div 
//                 className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <Link href="/auth/login">
//                   <button className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
//                     <span className="relative z-10">Get Started</span>
//                     <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//                   </button>
//                 </Link>
                
//                 <Link href="/auth/register">
//                   <button className="relative overflow-hidden group bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300 shadow-lg hover:shadow-xl">
//                     <span className="relative z-10">Join Now</span>
//                     <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
//                   </button>
//                 </Link>
//               </motion.div>
//             </motion.div>

//             {/* Right Side - Cards */}
//             <motion.div 
//               className="grid grid-cols-1 sm:grid-cols-2 gap-6"
//               initial="hidden"
//               animate="visible"
//             >
//               {featureCards.map((card, index) => (
//                 <motion.div
//                   key={index}
//                   custom={index}
//                   variants={cardVariants}
//                   initial="hidden"
//                   animate="visible"
//                   whileHover="hover"
//                   className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-2xl cursor-pointer overflow-hidden relative group`}
//                   onClick={card.onClick || (() => router.push(card.link))}
//                   onMouseEnter={() => setActiveCard(index)}
//                   onMouseLeave={() => setActiveCard(null)}
//                 >
//                   <div className="relative z-10">
//                     <div className="text-white mb-4">{card.icon}</div>
//                     <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
//                     <p className="text-gray-200 text-sm">{card.description}</p>
//                   </div>
                  
//                   <AnimatePresence>
//                     {activeCard === index && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="absolute bottom-4 right-4 text-white"
//                       >
//                         <FaArrowRight className="text-xl" />
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
                  
//                   <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Floating CTA */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.2 }}
//         className="fixed bottom-8 right-8 z-20"
//       >
//         <Link href="/booking">
//           <button className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
//             <FaDumbbell className="text-xl" />
//           </button>
//         </Link>
//       </motion.div>
//     </main>
//   );
// };

// export default Dashboard;