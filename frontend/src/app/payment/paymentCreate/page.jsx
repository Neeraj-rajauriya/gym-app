"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

function PaymentComponent() {
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const plan = {
    name: searchParams.get("name"),
    price: searchParams.get("price"),
    duration: searchParams.get("duration"),
    benefits: (() => {
      try {
        const b = searchParams.get("benefits");
        return b ? JSON.parse(b) : [];
      } catch {
        return [];
      }
    })(),
  };

  const paymentId = searchParams.get("paymentId");
  const token = searchParams.get("token");
  const membershipPlanId = searchParams.get("membershipPlanId");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const createMembershipAfterPayment = async () => {
    try {
      const res = await fetch(`${API_URL}/userMembership`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ membershipPlanId }),
      });

      const data = await res.json();
      console.log("Membership creation response:", data);
      if (data.success) {
        setMessage({
          type: "success",
          text: "🎉 Membership activated successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to create membership",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: "⚠️ Error while creating membership",
      });
    }
  };

  const handlePayClick = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/payment/${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Success" }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "🎉 Payment status updated successfully!" });
        await createMembershipAfterPayment();
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update payment status" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "⚠️ Error updating payment status. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!plan.name || !paymentId || !token || !membershipPlanId) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10 text-center text-red-700 bg-red-100 rounded-lg shadow-md">
        <p className="text-lg font-semibold">❌ Missing payment information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 mt-10 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-2xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800 drop-shadow-md">
        Confirm Your Payment
      </h2>

      <div className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow-inner border border-blue-200">
        <p className="text-lg">
          <strong className="text-blue-700">Plan Name:</strong>{" "}
          <span className="text-blue-900 font-semibold">{plan.name}</span>
        </p>

        <p className="text-gray-700 font-medium">
          Duration: <span className="italic">{plan.duration ? `${plan.duration} month(s)` : "N/A"}</span>
        </p>

        <div>
          <strong className="text-blue-700">Benefits:</strong>
          {plan.benefits && plan.benefits.length > 0 ? (
            <ul className="list-disc list-inside mt-1 text-gray-600 space-y-1 max-h-40 overflow-y-auto">
              {plan.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-400">No benefits provided</p>
          )}
        </div>

        <p className="text-xl font-bold text-green-700">
          Amount: ₹{plan.price}
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 px-5 py-3 rounded-lg text-center font-medium transition-opacity duration-800 ease-in-out
            ${showMessage ? "opacity-100" : "opacity-0 pointer-events-none"}
            ${
              message.type === "success"
                ? "bg-green-200 text-green-900 shadow-md"
                : "bg-red-200 text-red-900 shadow-md"
            }
          `}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handlePayClick}
        disabled={loading}
        className={`w-full py-4 rounded-lg text-white font-bold tracking-wide uppercase
          transition-transform duration-300 ease-in-out
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          }
          flex items-center justify-center gap-3
        `}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          "Pay Now"
        )}
      </button>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10 text-gray-500">Loading payment details...</div>}>
      <PaymentComponent />
    </Suspense>
  );
}
