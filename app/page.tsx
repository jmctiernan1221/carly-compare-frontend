'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    make: '',
  });

  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showMore, setShowMore] = useState(false);

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
    <>
      <main className="min-h-screen flex flex-col items-center px-4 pb-24">
        {/* Logo */}
        <div className="flex justify-center mb-2 px-4 mt-2 sm:mb-6 sm:mt-8">
          <Image
            src="/carlylogotext.png"
            alt="Carly Compare Logo"
            width={320}
            height={140}
            className="object-contain"
            priority
          />
        </div>

        {/* Banner + Thank You Overlay */}
       <section className="w-full px-4 flex justify-center relative">
  <div className="w-full max-w-3xl mx-auto">
    <Image
      src="/newbackground.jpg"
      alt="Carly Compare Banner"
      width={1920}
      height={600}
      className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-xl shadow"
      priority
    />
  </div>

  {submitted && (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="bg-white text-orange-600 font-semibold text-lg sm:text-xl px-6 py-4 rounded shadow-lg text-center">
        ✅ Thank you! You’ve been added to the waitlist.
      </div>
    </div>
  )}
</section>

        {/* Form Section */}
        {!submitted && (
          <section className="w-full px-4 pt-8 pb-12 text-center text-gray-900 flex justify-center">
            <div className="w-full max-w-3xl mx-auto">
              <div className="space-y-8 bg-[#a9e0ff] px-6 sm:px-8 py-8 rounded-xl text-gray-900 shadow-md">
                {/* Intro Text */}
                <div className="space-y-4 text-sm sm:text-base md:text-lg text-gray-800 text-left">
                  <p>
                    CarlyCompare.com is your personal guide to making smarter, faster car-selling decisions.
                    Instead of visiting multiple websites and repeating the same information, CarlyCompare
                    helps you explore and compare real-time cash offers from top car-buying services — all in one place.
                  </p>
                  <p>
                    We save you time and give you confidence by helping you understand what your vehicle is worth.
                  </p>
                </div>

                {/* Feature List Toggle */}
                <div className="text-sm sm:text-base text-gray-800 text-left space-y-3">
                  {!showMore ? (
                    <button
                      type="button"
                      onClick={() => setShowMore(true)}
                      className="text-orange-500 hover:underline text-sm font-medium"
                    >
                      Read More
                    </button>
                  ) : (
                    <>
                      <p className="font-semibold">
                        When we launch, you’ll be able to get:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Side-by-side cash offer comparisons from major car buyers</li>
                        <li>A personalized estimate of your car’s value</li>
                        <li>Analysis of resale trends for your vehicle type</li>
                        <li>Insights on the best time to sell based on market data</li>
                        <li>Detailed reporting you can download or share</li>
                        <li>Tips to prepare your car for sale and maximize your offer</li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => setShowMore(false)}
                        className="mt-2 text-orange-500 hover:underline text-sm font-medium"
                      >
                        Show Less
                      </button>
                    </>
                  )}
                </div>

                {/* Form */}
                <div className="pt-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Join the Waitlist</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 text-sm sm:text-base text-gray-800 border border-gray-300 rounded bg-white/80 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 text-sm sm:text-base text-gray-800 border border-gray-300 rounded bg-white/80 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    />
                    <input
                      type="text"
                      name="make"
                      placeholder="Car Make"
                      value={formData.make}
                      onChange={handleChange}
                      className="w-full p-3 text-sm sm:text-base text-gray-800 border border-gray-300 rounded bg-white/80 placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    />
                    <label className="flex items-start gap-2 text-sm sm:text-base text-gray-700 bg-white/80 p-3 rounded-md">
                      <input
                        id="agree"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        className="mt-1 h-4 w-4"
                      />
                      <span className="font-semibold">
                        I agree to receive an email from Carly Compare when it goes live.
                      </span>
                    </label>
                    <button
                      type="submit"
                      className="w-full p-3 text-sm sm:text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded transition"
                    >
                      Submit to get discounts when we launch
                    </button>
                  </form>
                  <div className="pt-6 border-t border-white/50 mt-8">
  <div className="flex flex-col items-center gap-4 text-gray-700">
    <div className="flex gap-6">
      <a href="https://www.facebook.com/share/16dssyoApG/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <svg className="w-8 h-8 hover:text-orange-500 transition" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12a10 10 0 10-11.5 9.87v-6.99h-2.3V12h2.3v-1.5c0-2.28 1.35-3.55 3.42-3.55.99 0 2.02.18 2.02.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.42V12h2.5l-.4 2.88h-2.1v6.99A10 10 0 0022 12z" />
        </svg>
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg className="w-8 h-8 hover:text-orange-500 transition" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2a.75.75 0 110 1.5.75.75 0 010-1.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
        </svg>
      </a>
    </div>
    <a href="mailto:info@carlycompare.com" className="text-sm sm:text-base font-medium text-gray-700 hover:text-orange-500 transition">
      info@carlycompare.com
    </a>
  </div>
</div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="w-full bg-gray-100 text-center text-sm text-gray-600 py-4">
        © {new Date().getFullYear()} Carly Compare. All rights reserved.
      </footer>
    </>
  );
}
