

'use client';
export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


const allowedRoles = ['admin', 'recruiter'];

export default function CreateMembershipPlan() {
  const [form, setForm] = useState({
    name: '',
    duration: '',
    price: '',
    benefits: '',
  });
  const [userRole, setUserRole] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
    } catch {
      setUserRole(null);
    }
  }, []);

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 to-indigo-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-10 max-w-md text-center"
        >
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Access Denied
          </h2>
          <p className="text-gray-700">
            Only authorized users can create membership plans.
          </p>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, duration, price, benefits } = form;

    if (!name || !duration || !price || !benefits) {
      return setMessage({ type: 'error', text: 'All fields are required.' });
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          duration: Number(duration),
          price: Number(price),
          benefits: benefits.split(',').map((b) => b.trim()),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Membership plan created successfully!' });
        setForm({ name: '', duration: '', price: '', benefits: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create plan.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred. Try again.' });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50 to-purple-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-xl"
      >
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
          Create Membership Plan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Plan Name" name="name" value={form.name} onChange={handleChange} />
          <InputField label="Duration (months)" name="duration" value={form.duration} onChange={handleChange} type="number" />
          <InputField label="Price (₹)" name="price" value={form.price} onChange={handleChange} type="number" />
          <InputField label="Benefits (comma-separated)" name="benefits" value={form.benefits} onChange={handleChange} />

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center font-medium ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message.text}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Plan'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 text-base transition"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}
