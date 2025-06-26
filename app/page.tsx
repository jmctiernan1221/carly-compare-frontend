'use client';

import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player"; // npm install lottie-react
import Image from "next/image";

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', carMake: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    // TODO: Replace with your API or waitlist handling
    setSubmitted(true);
    setFormData({ name: '', email: '', carMake: '' });
  };

  return (
    <main
      className="min-h-screen flex flex-col justify-between items-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="max-w-md w-full bg-white/90 rounded-xl shadow-2xl p-8 mt-6 mb-0 flex flex-col items-center">
        <h1 className="text-4xl font-black text-blue-900 mb-2">COMING SOON</h1>
        <p className="text-base text-gray-800 mb-3 font-medium">
          Carly compares real-time cash offers from top sites like Carvana and KBB to help you get the best deal. Launching soon!
        </p>

        {/* Animated Carly */}
        <div className="w-40 h-44 mb-4 flex items-center justify-center">
          <Player
            autoplay
            loop={false}
            src="/carly-waving.json"
            style={{ height: "170px", width: "170px" }}
          />
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mb-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="carMake"
            placeholder="Car Make"
            value={formData.carMake}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
          >
            Submit to Get Discounts When We Launch
          </button>
        </form>
        {submitted && (
          <div className="bg-green-100 text-green-700 py-2 px-3 rounded font-semibold">
            Thank you! You'll be the first to know.
          </div>
        )}
      </div>

      {/* Car/Road visual */}
      <div className="w-full flex justify-center mt-[-40px]">
        <Image
          src="/car-on-road.png"
          alt="CarlyCompare Car on Road"
          width={370}
          height={170}
          priority
        />
      </div>
    </main>
  );
}
