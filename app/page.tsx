'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    make: '',
  });

  const [agreed, setAgreed] = useState(false);
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
        body: JSON.stringify({ ...formData, agreed }),
      });

      if (!response.ok) throw new Error('Failed to submit waitlist data');

      await response.json();
      setSubmitted(true);
      setFormData({ name: '', email: '', make: '' });
      setAgreed(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <main
className="relative min-h-screen overflow-x-hidden bg-cover bg-bottom bg-no-repeat bg-fixed flex flex-col md:flex-row items-start justify-center px-4 pt-6 pb-6 md:pt-4 md:pb-24"
      style={!isDesktop ? { backgroundImage: "url('/background.png')" } : {}}
    >
      <div className="relative w-full max-w-3xl overflow-visible">
        {/* Avatar Image */}
        <Image
          src="/avatar-6-26.png"
          alt="Carly Avatar"
          width={220}
          height={220}
className="absolute z-10 object-contain animate-fade-bounce-once -top-20 -right-6 md:-top-0 md:-right-6"
          priority
        />

        {/* Mobile-only heading above card */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2 pl-4 md:hidden">
          COMING SOON
        </h1>

        {/* White Card */}
        <div
        className={relative rounded-xl shadow-2xl bg-white/80 backdrop-blur-sm ${
  submitted ? 'hidden md:flex' : 'flex'
} p-6 md:p-20 pt-20 md:pt-2 mt-12 md:mt-24 md:-mt-12 flex-col justify-center overflow-hidden}
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
          {/*{isDesktop && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl z-0" />
          )}*/}

  <div className="relative z-10">
  {/* Desktop-only heading */}
  <h1 className="hidden md:block text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
    COMING SOON
  </h1>

  {/* P2 - Mobile wrap-around version */}
  <div className="flex md:hidden mb-4 px-2">
    <p className="text-sm text-gray-800 -mt-8 pr-2 max-w-[70%]">
    CarlyCompare.com is your personal guide to making smarter, faster car-selling decisions. Instead of visiting multiple websites and repeating the same information, CarlyCompare helps you explore and compare real-time cash offers from top car-buying services, all in one place. We save you time and give you confidence by helping you understand what your vehicle is worth.
    </p>
  </div>

  {/* ✅ Updated Desktop version - centered, closer to avatar */}
  <p className="hidden md:block text-sm text-gray-800 text-center mb-4 px-2 max-w-[80%] mx-auto leading-relaxed">
    CarlyCompare.com is your personal guide to making smarter, faster car-selling decisions. Instead of visiting multiple websites and repeating the same information, CarlyCompare helps you explore and compare real-time cash offers from top car-buying services, all in one place. We save you time and give you confidence by helping you understand what your vehicle is worth.
  </p>

  {/* ✅ P1 - Visible on all screen sizes with consistent spacing */}
     <p className="text-sm text-gray-700 text-center mb-6 md:mb-8 px-2">
    Carly Compare helps you get the most cash for your car by comparing real-time offers from Carvana, KBB, and CarMax — all in one place. Fast. Transparent. Free.
  </p>

            {/* Thank-you message for desktop (inside card) */}
            {submitted && (
              <div className="hidden md:block bg-green-100 text-green-800 text-center p-3 mt-4 rounded shadow text-base">
                ✅ Thank you! You’ve been added to the waitlist.
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className={space-y-4 ${submitted ? 'hidden' : ''}}
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
className="w-full p-2.5 text-base text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
className="w-full p-2.5 text-base text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="make"
                placeholder="Car Make"
                value={formData.make}
                onChange={handleChange}
className="w-full p-2.5 text-base text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* ✅ Checkbox */}
<label className="flex items-start gap-2 text-sm text-gray-700 md:bg-white/70 md:backdrop-blur-sm md:p-3 md:rounded-md">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>
                  I agree to receive an email from Carly Compare when it goes live.
                </span>
              </label>

              <button
                type="submit"
                className="w-full p-3 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded transition"
              >
                Submit to get discounts when we launch
              </button>
            </form>
          </div>
        </div>

        {/* Thank-you message for mobile (outside card) */}
        {submitted && (
          <div className="bg-green-100 text-green-800 text-center p-3 mt-24 rounded shadow text-sm z-20 relative md:hidden">
            ✅ Thank you! You’ve been added to the waitlist.
          </div>
        )}
      </div>
    </main>
  );
}
