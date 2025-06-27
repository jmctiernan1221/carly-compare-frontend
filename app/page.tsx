'use client';

import { useState } from 'react';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    make: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://carly-compare-backend.onrender.com/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit waitlist data');

      await response.json();
      setSubmitted(true);
      setFormData({ name: '', email: '', make: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <main
      className="min-h-screen bg-cover bg-bottom flex items-start justify-center px-4 py-6 md:py-32"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="w-full max-w-md bg-white/90 rounded-lg shadow-lg p-6 md:p-8 mt-6 md:mt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          COMING SOON
        </h1>
        <p className="text-center text-gray-800 text-base md:text-lg mb-6">
          Carly compares real-time cash offers from top sites like Carvana and KBB to help you get the best deal. Launching soon!
        </p>

        {submitted && (
          <div className="bg-green-100 text-green-800 text-center p-3 mb-4 rounded shadow text-sm md:text-base">
            ✅ Thank you! You’ve been added to the waitlist.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="make"
            placeholder="Car Make"
            value={formData.make}
            onChange={handleChange}
            className="w-full p-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full p-3 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded transition"
          >
            Submit to get discounts when we launch
          </button>
        </form>
      </div>
    </main>
  );
}
