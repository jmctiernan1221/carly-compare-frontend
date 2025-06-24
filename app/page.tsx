'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    vin: '',
    year: '',
    make: '',
    model: '',
    submodel: '',
    mileage: '',
    email: '',
    name: '',
    zip: '',
  });

  const [vinDecoded, setVinDecoded] = useState(false);
  const [submitted, setSubmitted] = useState(false); // ✅ New state for confirmation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVinDecode = async () => {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${formData.vin}?format=json`);
      const data = await response.json();
      const decoded = data.Results[0];

      setFormData((prev) => ({
        ...prev,
        year: decoded.ModelYear || '',
        make: decoded.Make || '',
        model: decoded.Model || '',
        submodel: decoded.Series || '',
      }));

      setVinDecoded(true);
    } catch (error) {
      console.error('Error decoding VIN:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://carly-compare-backend.onrender.com/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit waitlist data');
      }

      const result = await response.json();
      console.log('Waitlist response:', result);

      setSubmitted(true); // ✅ Show confirmation

      // ✅ Reset form
      setFormData({
        vin: '',
        year: '',
        make: '',
        model: '',
        submodel: '',
        mileage: '',
        email: '',
        name: '',
        zip: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-1"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="max-w-5xl w-full border border-black bg-blue-50 bg-opacity-90 rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden">
<div
  className="w-full md:w-1/2 px-6 pt-0 pb-8 md:pt-8 flex flex-col justify-center
             min-h-[1200px] md:min-h-auto
             bg-white/90 
             bg-[url('/landingpagecarly.png')] bg-cover bg-no-repeat bg-[center_30%] bg-scroll 
             md:bg-none md:bg-transparent"
>
          <div className="mt-80 md:mt-0">
            <h1
              className="text-4xl font-bold text-gray-900 mb-4 leading-tight 
                         bg-white/60 backdrop-blur-sm p-2 rounded 
                         md:bg-transparent md:backdrop-blur-0"
            >
              Hi, I’m Carly—I’ll help you find the best cash offer for your car
            </h1>
            <p
              className="text-gray-800 mb-6 text-med 
                         bg-white/60 backdrop-blur-sm p-2 rounded 
                         md:bg-transparent md:backdrop-blur-0"
            >
              Launching soon: Carly compares top offers from KBB, CarMax, and others, and gives you a detailed report.
            </p>

            {/* ✅ Confirmation Message */}
            {submitted && (
              <div className="bg-green-100 text-green-800 p-3 mb-4 rounded shadow">
                ✅ Thank you! You’ve been added to the waitlist.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-3 w-full rounded-md p-4 
                       bg-white/60 backdrop-blur-sm 
                       md:bg-transparent md:backdrop-blur-0"
            >
              <input
                type="text"
                name="vin"
                placeholder="VIN (optional)"
                value={formData.vin}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={handleVinDecode}
                className="w-full bg-gray-700 text-white font-semibold py-2 rounded transition"
              >
                Decode VIN
              </button>

              <input
                type="text"
                name="year"
                placeholder="Year"
                value={formData.year}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="make"
                placeholder="Make"
                value={formData.make}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="submodel"
                placeholder="Submodel"
                value={formData.submodel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="mileage"
                placeholder="Mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
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
                name="zip"
                placeholder="ZIP Code"
                value={formData.zip}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
              >
                Join the Waitlist
              </button>
            </form>
          </div>
        </div>

        {/* Right Column Image - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 items-stretch justify-end">
          <Image
            src="/landingpagecarly.png"
            alt="Carly Illustration"
            className="h-full w-auto object-cover !m-0"
            width={600}
            height={800}
            priority
          />
        </div>
      </div>
    </main>
  );
}
