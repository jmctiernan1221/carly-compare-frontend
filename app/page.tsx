
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
  const [showMore, setShowMore] = useState(false); 

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
      className="relative min-h-screen overflow-x-hidden bg-cover bg-bottom bg-no-repeat bg-fixed flex flex-col items-start justify-center px-4 pt-6 pb-24 gap-6"
      
    >
      <div className="w-full max-w-3xl mx-auto">
        {/* Logo (visible on all screens) */}
        {!submitted && (
          <div className="flex justify-center mb-4 px-4">
            <Image
              src="/mobilelogotop.png"
              alt="Carly Compare Logo"
              width={280}
              height={100}
              className="object-contain"
              priority
            />
          </div>
        )}

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          COMING SOON
        </h1>

        {/* Intro Paragraphs */}
        {!submitted && (
          <div className="px-4 text-sm text-gray-800 space-y-3">
            <p>
              CarlyCompare.com is your personal guide to making smarter, faster car-selling decisions. Instead of visiting multiple websites and repeating the same information, CarlyCompare helps you explore and compare real-time cash offers from top car-buying services, all in one place.
            </p>
            <p>
              We save you time and give you confidence by helping you understand what your vehicle is worth.
            </p>
          </div>
        )}

        {/* Feature List */}
        {!submitted && (
          <div className="text-sm text-gray-700 mt-4 px-4">
            <p className="font-semibold mb-2 text-center md:text-left">
              When we launch, you’ll be able to get:
            </p>

            <ul className="list-disc pl-5 space-y-1">
              <li>Side-by-side cash offer comparisons from major car buyers</li>
              <li>A personalized estimate of your car’s value</li>

              {showMore && (
                <>
                  <li>Analysis of resale trends for your vehicle type</li>
                  <li>Insights on the best time to sell based on market data</li>
                  <li>Detailed reporting you can download or share</li>
                  <li>Tips to prepare your car for sale and maximize your offer</li>
                </>
              )}
            </ul>

            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="mt-2 text-orange-500 hover:underline text-sm font-medium"
            >
              {showMore ? 'Show Less' : 'Read More'}
            </button>
          </div>
        )}

        {/* Thank-you message */}
        {submitted && (
          <div className="bg-orange-500 text-gray-800 text-center p-3 mt-6 rounded shadow text-sm">
            Thank you! You’ve been added to the waitlist.
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mt-6 px-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2.5 text-base text-gray-800 bg-white/80 border border-gray-300 rounded placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2.5 text-base text-gray-800 bg-white/80 border border-gray-300 rounded placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="make"
              placeholder="Car Make"
              value={formData.make}
              onChange={handleChange}
              className="w-full p-2.5 text-base text-gray-800 bg-white/80 border border-gray-300 rounded placeholder-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="flex items-start gap-2 text-sm text-gray-700 bg-white/60 backdrop-blur-sm p-3 rounded-md">
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
        )}
      </div>
    </main>
  );
}
