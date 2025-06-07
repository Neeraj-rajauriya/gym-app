"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentInitiate({ plan, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
   console.log("plan is",plan);
  // Helper function to delay for given milliseconds
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePayment = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      onError("You must be logged in to make a payment.");
      setLoading(false);
      return;
    }

    try {
      // Run fetch and delay in parallel to ensure minimum 2 seconds loading
      const [res] = await Promise.all([
        fetch("http://localhost:4000/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            membershipPlanId: plan._id,
            amount: plan.price,
          }),
        }),
        delay(2000), // 2 seconds delay
      ]);

      const data = await res.json();

      if (data.success) {
        const paymentId = data.newPayment._id;

        onSuccess(`Payment initiated successfully for ${plan.name}`);

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
        onError(data.message || "Payment initiation failed");
      }
    } catch (error) {
        console.log("err",error.message);
      onError("Server error during payment initiation");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`mt-auto px-4 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition mb-4 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading
        ? "Initiating Payment..."
        : `Buy ${plan.name} for ₹${plan.price}`}
    </button>
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
