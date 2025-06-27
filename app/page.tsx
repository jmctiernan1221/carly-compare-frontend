'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    make: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

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
      className="relative min-h-screen bg-cover bg-bottom bg-no-repeat bg-fixed flex flex-col md:flex-row items-start justify-center px-4 py-6 md:py-24"
      style={!isDesktop ? { backgroundImage: "url('/background.png')" } : {}}
    >
      <div className="relative w-full max-w-3xl overflow-visible">
        {/* Avatar Image */}
        <Image
          src="/avatar-6-26.png"
          alt="Carly Avatar"
          width={220}
          height={220}
          className="absolute -top-24 -right-14 md:-top-32 md:-right-20 z-10 object-contain animate-fade-bounce-once"
          priority
        />

        {/* Mobile-only heading above card */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 pl-4 md:hidden">
          COMING SOON
        </h1>

        {/* White Card with overlay background (desktop only) */}
        <div
          className="relative bg-white rounded-xl shadow-2xl p-6 md:p-20 pt-28 mt-12 md:mt-24 md:-mt-12 flex flex-col justify-center overflow-hidden"
          style={
            isDesktop
              ? {
                  backgroundImage: "url('/background.png')",
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '800px',
                }
              : {}
          }
        >
          {/* Overlay for desktop background tint */}
          {isDesktop && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl z-0" />
          )}

          <div className="relative z-10">
            {/* Desktop-only heading */}
            <h1 className="hidden md:block text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              COMING SOON
            </h1>

            {/* Paragraph inside card on all screen sizes */}
            <p className="text-sm text-gray-700 text-center mb-6 md:mb-8 px-2">
              Carly Compare helps you get the most cash for your car by comparing real-time offers from Carvana, KBB, and CarMax — all in one place. Fast. Transparent. Free.
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
        </div>
      </div>
    </main>
  );
}
