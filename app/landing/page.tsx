'use client';

import { useState } from 'react';
import Image from 'next/image';
import carlyImage from '../../public/landingpagecarly.png';

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
  className="w-full md:w-1/2 px-6 py-8 flex flex-col justify-center relative z-10 bg-white/90 md:bg-transparent bg-[url('/landingpagecarly.png')] md:bg-none bg-cover bg-center"
>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Coming Soon: Hi, I’m Carly—I’ll help you find the best cash offer for your car
          </h1>
          <p className="text-gray-800 mb-6 text-med">
            Launching soon: Carly compares top offers from KBB, CarMax, and others, and gives you a detailed report.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
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

{/* Right Column Image - Hidden on mobile */}
<div className="hidden md:flex md:w-1/2 items-stretch justify-end">
  <Image
    src={carlyImage}
    alt="Carly Illustration"
    className="h-full w-auto object-cover !m-0"
    priority
  />
</div>
      </div>
    </main>
  );
}