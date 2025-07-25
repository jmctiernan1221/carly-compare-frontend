'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GoogleAnalytics } from './GoogleAnalytics';

export default function LandingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    vin: '',
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
    fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json')
      .then((res) => res.json())
      .then((data) => {
        const makeList = data.Results.map((item: any) => item.Make_Name);
        setMakes(makeList.sort());
      });
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
    const { name, value, type, checked } = e.target;
    if (name === 'vin') {
      setFormData((prev) => ({ ...prev, vin: value, make: '', model: '', trim: '' }));
    } else if (name === 'make') {
      setFormData((prev) => ({ ...prev, make: value, model: '', trim: '' }));
    } else if (name === 'model') {
      setFormData((prev) => ({ ...prev, model: value, trim: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const decodeVIN = async () => {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${formData.vin}?format=json`);
    const data = await response.json();
    const result = data.Results.reduce((acc: any, item: any) => {
      if (item.Variable === 'Make') acc.make = item.Value;
      if (item.Variable === 'Model') acc.model = item.Value;
      if (item.Variable === 'Trim') acc.trim = item.Value;
      return acc;
    }, {});
    setFormData((prev) => ({
      ...prev,
      make: result.make || '',
      model: result.model || '',
      trim: result.trim || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://carly-compare-backend.onrender.com/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to submit form');
      await response.json();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const nextStep = async () => {
    if (step === 1 && formData.vin) await decodeVIN();
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

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
                <select name="make" value={formData.make} onChange={handleChange} required>
                  <option value="">Select Make</option>
                  {makes.map((make) => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
                {formData.make && (
                  <select name="model" value={formData.model} onChange={handleChange} required>
                    <option value="">Select Model</option>
                    {models.map((model) => (
                      <option key={model} value={model}>{model}</option>
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
        return (
          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={formData.mileage}
            onChange={handleChange}
            required
          />
        );
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
              <input
                type="checkbox"
                name="accidents"
                checked={formData.accidents}
                onChange={handleChange}
              />
              Has it been in an accident?
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
        return (
          <input
            type="text"
            name="zip"
            placeholder="ZIP Code"
            value={formData.zip}
            onChange={handleChange}
            required
          />
        );
      case 6:
        return (
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <GoogleAnalytics />
      <main className="min-h-screen flex flex-col items-center px-4 pb-24 pt-12">
        <div className="w-full max-w-md bg-white/90 p-6 rounded-lg shadow-lg text-center space-y-6">
          <Image
            src="/carlylogotext.png"
            alt="Carly Compare Logo"
            width={300}
            height={100}
            className="mx-auto"
          />
          {submitted ? (
            <p className="text-green-700 font-semibold">✅ Thank you! Your submission was received.</p>
          ) : (
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
                  >
                    Get Offers
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
