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
  const [submitted, setSubmitted] = useState(false);

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

      setSubmitted(true);
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
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div
          className="w-full md:w-1/2 px-6 pt-12 pb-8 flex flex-col justify-start"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Hi, I’m Carly — your smart car-selling assistant
          </h1>
          <p className="text-gray-800 mb-6 text-base md:text-lg">
            CarlyCompare is launching soon! I’ll help you explore real offers from top sites like KBB, Carvana, and CarMax, and send you a custom report with value insights, trends, and when to sell.
          </p>

          {/* ✅ Embedded Video */}
          <div className="mb-6 w-full aspect-video">
            <video
              className="w-full h-full rounded shadow-md"
              controls
              preload="auto"
              poster="/poster-image.jpg"
            >
              <source src="/carlycomparevid_4.mp4.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {submitted && (
            <div className="bg-green-100 text-green-800 p-3 mb-4 rounded shadow">
              ✅ Thank you! You’ve been added to the waitlist.
            </div>
          )}

  <form
  onSubmit={handleSubmit}
  className={'space-y-3 w-full rounded-md p-4 
             bg-white/60 backdrop-blur-sm 
             md:bg-transparent md:backdrop-blur-0'}
>
  {/* VIN and Decode button - Temporarily disabled */}
  {/*
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
  */}

  <input
    type="text"
    name="year"
    placeholder="Year"
    value={formData.year}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />
  <input
    type="text"
    name="make"
    placeholder="Make"
    value={formData.make}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />
  <input
    type="text"
    name="model"
    placeholder="Model"
    value={formData.model}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />

  {/* Submodel - Temporarily disabled */}
  {/*
  <input
    type="text"
    name="submodel"
    placeholder="Submodel"
    value={formData.submodel}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />
  */}

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

  {/* ZIP Code - Temporarily disabled */}
  {/*
  <input
    type="text"
    name="zip"
    placeholder="ZIP Code"
    value={formData.zip}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />
  */}

  <button
    type="submit"
    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
  >
    Join the Waitlist
  </button>
</form>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-50">
          <Image src="/landingpagecarly.png" alt="Carly Illustration" className="h-full w-auto object-contain p-4" width={500} height={800} priority />
        </div>
      </div>
    </main>
  );
}
