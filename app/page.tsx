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

        {/* Main Section with Background */}
       <section className="w-full">
  <Image
    src="/newbackground.jpg"
    alt="Carly Compare Banner"
    width={1920}
    height={600}
    className="w-full h-auto object-cover"
    priority
  />
</section>
         <section className="w-full px-4 pt-8 pb-12 text-center text-gray-900">
  <div className="max-w-3xl mx-auto space-y-8 bg-white/70 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-xl">
            {/* Intro Text */}
            {!submitted && (
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
            )}

            {/* Feature List Toggle */}
            {!submitted && (
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
            )}

            {/* Form */}
            <div className="pt-4">
              {!submitted && (
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Join the Waitlist</h2>
              )}
              {submitted ? (
                <div className="bg-orange-500 text-white text-center p-3 rounded shadow text-sm sm:text-base">
                  Thank you! You’ve been added to the waitlist.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 text-sm sm:text-base text-gray-800 border border-gray-300 rounded bg-white/80 placeholder-gray-800"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 text-sm sm:text-base text-gray-800 border border-gray-300 rounded bg-white/80 placeholder-gray-800"
                  />
                  <input
                    type="text"
                    name="make"
                    placeholder="Car Make"
                    value={formData.make}
                    onChange={handleChange}
                    className="w-full p-3 text-sm sm:text-base text-gray-800 border border-gray-300 rounded bg-white/80 placeholder-gray-800"
                  />
                  <label className="flex items-start gap-2 text-sm sm:text-base text-gray-700 bg-white/80 p-3 rounded-md">
                    <input
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
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-gray-100 text-center text-sm text-gray-600 py-4">
        © {new Date().getFullYear()} Carly Compare. All rights reserved.
      </footer>
    </>
  );
}
