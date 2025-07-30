'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GoogleAnalytics } from './GoogleAnalytics';

export default function LandingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [quote, setQuote] = useState<any | null>(null);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    vin: '',
    year: '',
    make: '',
    model: '',
    trim: '',
    mileage: '',
    interior: '',
    exterior: '',
    owners: '',
    accidents: false,
    damage: '',
    zip: '',
    email: '',
  });

  useEffect(() => {
  const topMakes = [
    'Audi',
    'BMW',
    'Bentley',
    'Chevrolet',
    'Chrysler',
    'Ford',
    'GMC',
    'Honda',
    'Hyundai',
    'Jeep',
    'Kia',
    'Lexus',
    'Mazda',
    'Mercedes-Benz',
    'Nissan',
    'Porsche',
    'Subaru',
    'Toyota',
    'Volkswagen',
  ];
  setMakes(topMakes);
}, []);

  useEffect(() => {
    if (formData.make) {
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${formData.make}?format=json`)
        .then((res) => res.json())
        .then((data) => {
          const modelList = data.Results.map((item: any) => item.Model_Name);
          setModels(modelList.sort());
        });
    } else {
      setModels([]);
    }
  }, [formData.make]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'vin') {
      setFormData((prev) => ({ ...prev, vin: value, make: '', model: '', trim: '' }));
    } else if (name === 'make') {
      setFormData((prev) => ({ ...prev, make: value, model: '', trim: '' }));
    } else if (name === 'model') {
      setFormData((prev) => ({ ...prev, model: value, trim: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

const decodeVIN = async () => {
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${formData.vin}?format=json`);
  const data = await response.json();
  const result = data.Results.reduce((acc: any, item: any) => {
    if (item.Variable === 'Make') acc.make = item.Value;
    if (item.Variable === 'Model') acc.model = item.Value;
    if (item.Variable === 'Trim') acc.trim = item.Value;
    if (item.Variable === 'Model Year') acc.year = item.Value; // 👈 ADD THIS
    return acc;
  }, {});
  setFormData((prev) => ({
    ...prev,
    make: result.make || '',
    model: result.model || '',
    trim: result.trim || '',
    year: result.year || '', // 👈 ADD THIS
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ✅ Validate year if VIN is not provided
  if (!formData.vin && !formData.year) {
    alert("Please enter either a VIN or the vehicle year.");
    return;
  }

  console.log("🚀 Submitting form with data:", formData);

  try {
    const response = await fetch('https://carly-compare-backend.onrender.com/api/quote-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response from backend:", errorText);
      throw new Error('Quote API failed');
    }

    const data = await response.json();
    console.log("📦 Raw response JSON:", data);

    const parsed = typeof data.quote === 'string' ? JSON.parse(data.quote) : data.quote;
    console.log("✅ Quote received:", parsed);

    setQuote(parsed);
        // ✅ Submit to waitlist after quote is generated
    await fetch('https://carly-compare-backend.onrender.com/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${formData.make} ${formData.model}`,
        email: formData.email,
        make: formData.make,
      }),
    });
    setSubmitted(true);
  } catch (err) {
    console.error("💥 Error fetching AI quote:", err);
  }
};

  const nextStep = async () => {
    if (step === 1 && formData.vin) await decodeVIN();
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const renderStep = () => {
    switch (step) {
      case 1:
  return (
    <>
      <input
        type="text"
        name="vin"
        placeholder="Enter VIN (optional)"
        value={formData.vin}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
      />
      {!formData.vin && (
        <>
          {/* 👇 New year input field when not using VIN */}
        <input
  type="text"
  name="year"
  placeholder="Enter Year"
  value={formData.year}
  onChange={handleChange}
  className="w-full p-3 border border-gray-300 rounded"
/>

          <select
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
          >
            <option value="">Select Make</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

          {formData.make && (
            <select
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            >
              <option value="">Select Model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          )}

          {formData.model && (
            <input
              type="text"
              name="trim"
              placeholder="Enter Trim (optional)"
              value={formData.trim}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
            />
          )}
        </>
      )}
    </>
  );
      case 2:
        return <input type="number" name="mileage" placeholder="Mileage" value={formData.mileage} onChange={handleChange} required />;
      case 3:
        return (
          <>
            <select name="interior" value={formData.interior} onChange={handleChange} required>
              <option value="">Interior Condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
            <select name="exterior" value={formData.exterior} onChange={handleChange} required>
              <option value="">Exterior Condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </>
        );
      case 4:
        return (
          <>
            <select name="owners" value={formData.owners} onChange={handleChange} required>
              <option value="">Number of Owners</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3+">3+</option>
            </select>
            <label>
              <input type="checkbox" name="accidents" checked={formData.accidents} onChange={handleChange} /> Has it been in an accident?
            </label>
            {formData.accidents && (
              <select name="damage" value={formData.damage} onChange={handleChange} required>
                <option value="">Damage Severity</option>
                <option value="Low">Low (cosmetic)</option>
                <option value="Medium">Medium (body)</option>
                <option value="High">High (frame)</option>
              </select>
            )}
          </>
        );
      case 5:
        return <input type="text" name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} required />;
      case 6:
        return <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />;
      default:
        return null;
    }
  };

  return (
    <>
      <GoogleAnalytics />
 
<main className="min-h-screen flex flex-col items-center bg-[#F8E9CF]">
  {/* LOGO in its own row, aligned with page content */}
  <div className="w-full max-w-5xl px-4 pt-8">
    <Image
      src="/carlylogotext2.png"
      alt="Carly Compare Logo"
      width={260}
      height={80}
      priority
    />
  </div>

  {/* Page content begins */}
<div className="w-full max-w-5xl px-4 mt-4 md:mt-[-1.5rem]">

  {/* Two Column Layout */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-8 min-h-[350px]">
  <div className="md:w-1/2 flex flex-col justify-center h-full">
<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
  Compare Cash Offers<br />
  <span>Instantly</span>
</h2>
<p className="text-gray-700 text-base mb-4">
  Carly Compare helps you get the best deal by pulling real-time offers from trusted platforms like Carvana, KBB, and CarMax.
</p>

<div className="flex items-center space-x-6 mb-6">
  {/* Orange Clock */}
  <div className="flex items-center space-x-2">
    <svg
      className="w-5 h-5 text-orange-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4m5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span className="text-sm text-gray-800">Save Time</span>
  </div>

  {/* Blue Scale */}
  <div className="flex items-center space-x-2">
    <svg
      className="w-5 h-5 text-blue-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18m0 0c-1.472 0-2.882.265-4.185.75M12 21c1.472 0 2.882.265 4.185.75M18.75 4.97C16.545 4.66 14.29 4.5 12 4.5c-2.291 0-4.546.16-6.75.47m13.5 0l2.62 10.725c.122.5-.106 1.028-.59 1.202-.634.229-1.318.354-2.03.354s-1.396-.125-2.03-.354c-.483-.174-.711-.702-.59-1.202L18.75 4.97zM5.25 4.97L7.87 15.695c.122.5-.106 1.028-.59 1.202-.634.229-1.318.354-2.03.354s-1.396-.125-2.03-.354c-.483-.174-.711-.702-.59-1.202L5.25 4.97z"
      />
    </svg>
    <span className="text-sm text-gray-800">Get Fair Offers</span>
  </div>
</div>
<div className="flex justify-center pt-4">
  <button
    className="inline-block bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition animate-bounce"
    onClick={() => {
      const formEl = document.getElementById('quote-form');
      formEl?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    Get Your Offer
  </button>
</div>
</div>

    {/* Right Column: Image */}
    <div className="md:w-1/2">
      <Image
        src="/avatar-6-26.png"
        alt="Car Hero"
        width={500}
        height={350}
        className="w-full h-auto object-contain"
      />
    </div>
  </div>
</div>
{/* Why Use CarlyCompare Section */}
<div className="w-full max-w-3xl px-4 mt-20 text-center">
  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
    Why Use CarlyCompare?
  </h3>
  <p className="text-gray-700 mb-6">
    We make selling your car easy by comparing top offers from trusted buyers — all in one place.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
    {/* Real-Time Offers */}
    <div className="bg-white/90 p-4 rounded shadow">
      <div className="flex items-start space-x-2 mb-2">
        <svg className="w-5 h-5 text-orange-500 mt-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h4 className="font-semibold text-lg">Real-Time Offers</h4>
      </div>
      <p className="text-sm text-gray-700">
        Instantly see what Carvana, KBB, CarMax, and more would pay for your car.
      </p>
    </div>

    {/* No Time Wasted */}
    <div className="bg-white/90 p-4 rounded shadow">
      <div className="flex items-start space-x-2 mb-2">
        <svg className="w-5 h-5 text-orange-500 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4m5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h4 className="font-semibold text-lg">No Time Wasted</h4>
      </div>
      <p className="text-sm text-gray-700">
        Skip the hassle of visiting dealer sites — we bring the offers to you.
      </p>
    </div>

    {/* Transparent Comparison */}
    <div className="bg-white/90 p-4 rounded shadow">
      <div className="flex items-start space-x-2 mb-2">
        <svg className="w-5 h-5 text-blue-500 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0 0c-1.472 0-2.882.265-4.185.75M12 21c1.472 0 2.882.265 4.185.75M18.75 4.97C16.545 4.66 14.29 4.5 12 4.5c-2.291 0-4.546.16-6.75.47m13.5 0l2.62 10.725c.122.5-.106 1.028-.59 1.202-.634.229-1.318.354-2.03.354s-1.396-.125-2.03-.354c-.483-.174-.711-.702-.59-1.202L18.75 4.97zM5.25 4.97L7.87 15.695c.122.5-.106 1.028-.59 1.202-.634.229-1.318.354-2.03.354s-1.396-.125-2.03-.354c-.483-.174-.711-.702-.59-1.202L5.25 4.97z" />
        </svg>
        <h4 className="font-semibold text-lg">Transparent Comparison</h4>
      </div>
      <p className="text-sm text-gray-700">
        Know who’s offering what — and why — so you can make the smartest choice.
      </p>
    </div>
  </div>
</div>
  <div className="flex justify-center mt-8">
  <button
    className="inline-block bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
    onClick={() => {
      const formEl = document.getElementById('quote-form');
      formEl?.scrollIntoView({ behavior: 'smooth' });
    }}
  >
    Get Your Offer
  </button>
</div>
  {/* Form Card */}
  <div
    id="quote-form"
    className="w-full max-w-md bg-white/90 p-6 rounded-lg shadow-lg text-center space-y-6 mt-16"
        >

{submitted && quote && (
  <div className="bg-white p-4 rounded shadow text-sm text-left">
    <h2 className="text-lg font-bold mb-2">💬 Your Estimated Offers</h2>

    {quote.estimated_trade_in_values && (
      <ul className="mb-4 space-y-1">
  {Object.entries(quote.estimated_trade_in_values).map(([platform, range]) => {
  if (
    !range ||
    typeof range !== 'object' ||
    typeof (range as any).low !== 'number' ||
    typeof (range as any).high !== 'number'
  ) {
    return (
      <li key={platform}>
        <strong>{platform}:</strong> {typeof range === 'string' ? range : 'Unavailable'}
      </li>
    );
  }

  const { low, high } = range as { low: number; high: number };
  return (
    <li key={platform}>
      <strong>{platform}:</strong> {formatCurrency(low)} – {formatCurrency(high)}
    </li>
  );
})}
      </ul>
    )}

    {quote.best_season_to_sell && (
      <p><strong>📅 Best Time to Sell:</strong> {quote.best_season_to_sell}</p>
    )}

    {quote.platform_recommendation?.best_platform && (
      <p><strong>✅ Recommended Platform:</strong> {quote.platform_recommendation.best_platform}</p>
    )}

    {quote.platform_recommendation?.explanation && (
      <p className="mt-2"><strong>💡 Why:</strong> {quote.platform_recommendation.explanation}</p>
    )}
  </div>
)}
          {!submitted && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderStep()}
              <div className="flex justify-between pt-4">
                {step > 1 && step <= 6 && (
                  <button type="button" onClick={prevStep} className="text-gray-500 hover:text-orange-500 text-sm">
                    ⬅ Back
                  </button>
                )}
                {step < 6 && (
                  <button type="button" onClick={nextStep} className="text-orange-600 font-semibold">
                    Next ➡
                  </button>
                )}
               {step === 6 && (
  <button
    type="submit"
    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
    onClick={() => console.log("🟠 Submit button clicked")}
  >
    Get Offers
  </button>
)}
              </div>
            </form>
          )}
        </div>
      </main>
      <footer className="w-full text-center text-sm text-gray-600 py-6">
  © 2025 CarlyCompare. All rights reserved.
</footer>
    </>
  );
}
