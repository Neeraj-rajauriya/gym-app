"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PaymentInitiateContent({ plan: propPlan }) {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(propPlan || null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // If plan is passed as prop, use that
    if (propPlan) {
      setPlan(propPlan);
      return;
    }

    // Otherwise try to get from search params
    const planId = searchParams.get("planId");
    if (!planId) {
      setError("Plan ID is missing");
      return;
    }

    const fetchPlan = async () => {
      try {
        const res = await fetch(`${API_URL}/membership/${planId}`);
        const data = await res.json();
        if (data.success) {
          setPlan(data.plan);
        } else {
          setError(data.message || "Failed to load plan details");
        }
      } catch (err) {
        setError("Failed to fetch plan details");
        console.error(err);
      }
    };

    fetchPlan();
  }, [searchParams, API_URL, propPlan]);

  const handlePayment = async () => {
    if (!plan) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to make a payment.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          membershipPlanId: plan._id,
          amount: plan.price,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const paymentId = data.newPayment._id;
        router.push(
          `/payment/paymentCreate?paymentId=${paymentId}&token=${token}&name=${
            plan.name
          }&benefits=${encodeURIComponent(
            JSON.stringify(plan.benefits)
          )}&price=${plan.price}&duration=${
            plan.duration
          }&membershipPlanId=${plan._id}`
        );
      } else {
        setError(data.message || "Payment initiation failed");
      }
    } catch (error) {
      setError("Server error during payment initiation");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!plan) {
    return <div className="p-4">Loading plan details...</div>;
  }

  return (
    <div className="p-4">
      <button
        onClick={handlePayment}
        disabled={loading || !plan}
        className={`mt-auto px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition mb-4 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading
          ? "Initiating Payment..."
          : `Buy ${plan.name} for ₹${plan.price}`}
      </button>
    </div>
  );
}

export default function PaymentInitiate({ plan }) {
  return (
    <Suspense fallback={<div className="p-4">Loading payment page...</div>}>
      <PaymentInitiateContent plan={plan} />
    </Suspense>
  );
}
// import { useState } from 'react';

// export default function PaymentInitiate({ plan, onSuccess, onError }) {
//   const [loading, setLoading] = useState(false);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       onError("You must be logged in to make a payment.");
//       setLoading(false);
//       return;
//     }

//     // 1. Initiate payment from backend
//     try {
//       const res = await fetch("http://localhost:4000/api/payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           membershipPlanId: plan._id,
//           amount: plan.price,
//         }),
//       });
//       const data = await res.json();
//       if (!data.success) {
//         onError(data.message || "Payment initiation failed");
//         setLoading(false);
//         return;
//       }

//       // 2. Load Razorpay checkout script
//       const resScript = await loadRazorpayScript();
//       if (!resScript) {
//         onError("Failed to load Razorpay SDK");
//         setLoading(false);
//         return;
//       }

//       // 3. Open Razorpay checkout
//       const payment = data.payment; // payment document from backend with _id
//       const options = {
//         key: "YOUR_RAZORPAY_KEY_ID", // razorpay key id
//         amount: payment.amount * 100, // in paise
//         currency: "INR",
//         name: "Your Company Name",
//         description: `Membership plan: ${plan.name}`,
//         order_id: payment.razorpayOrderId, // agar backend se Razorpay order create kar rahe ho to yeh use karna, otherwise skip
//         handler: async function (response) {
//           // Razorpay success callback
//           // 4. Update payment status backend API call
//           try {
//             const updateRes = await fetch(
//               `http://localhost:4000/api/payment/${payment._id}/status`,
//               {
//                 method: "PUT",
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ status: "Success" }),
//               }
//             );
//             const updateData = await updateRes.json();
//             if (updateData.success) {
//               onSuccess("Payment successful and updated");
//             } else {
//               onError(updateData.message || "Payment status update failed");
//             }
//           } catch (err) {
//             onError("Payment success but server update failed");
//           }
//           setLoading(false);
//         },
//         prefill: {
//           email: "user@example.com", // optional, user email
//           contact: "9999999999", // optional, user phone
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", function (response) {
//         onError("Payment failed. Please try again.");
//         setLoading(false);
//       });
//       rzp.open();
//     } catch (error) {
//       onError("Server error during payment initiation");
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handlePayment}
//       disabled={loading}
//       className={`mt-auto px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition mb-4 ${
//         loading ? "opacity-50 cursor-not-allowed" : ""
//       }`}
//     >
//       {loading ? "Processing Payment..." : `Buy ${plan.name} for ₹${plan.price}`}
//     </button>
//   );
// }
