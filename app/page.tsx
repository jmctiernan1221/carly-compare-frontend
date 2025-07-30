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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setMakes([
      'Audi', 'BMW', 'Bentley', 'Chevrolet', 'Chrysler', 'Ford', 'GMC', 'Honda', 'Hyundai',
      'Jeep', 'Kia', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Nissan', 'Porsche', 'Subaru', 'Toyota', 'Volkswagen',
    ]);
  }, []);

  useEffect(() => {
    if (formData.make) {
      fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${formData.make}?format=json`)
        .then(res => res.json())
        .then(data => {
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

    setErrors(prev => ({ ...prev, [name]: '' }));

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'vin') {
      setFormData(prev => ({ ...prev, vin: value, make: '', model: '', trim: '' }));
    } else if (name === 'make') {
      setFormData(prev => ({ ...prev, make: value, model: '', trim: '' }));
    } else if (name === 'model') {
      setFormData(prev => ({ ...prev, model: value, trim: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const decodeVIN = async () => {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${formData.vin}?format=json`);
    const data = await response.json();
    const result = data.Results.reduce((acc: any, item: any) => {
      if (item.Variable === 'Make') acc.make = item.Value;
      if (item.Variable === 'Model') acc.model = item.Value;
      if (item.Variable === 'Trim') acc.trim = item.Value;
      if (item.Variable === 'Model Year') acc.year = item.Value;
      return acc;
    }, {});
    setFormData(prev => ({
      ...prev,
      make: result.make || '',
      model: result.model || '',
      trim: result.trim || '',
      year: result.year || '',
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.vin && !formData.year) newErrors.year = 'Year is required if no VIN is entered.';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (formData.zip && !/^\d{5}$/.test(formData.zip)) newErrors.zip = 'ZIP code must be 5 digits.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('https://carly-compare-backend.onrender.com/api/quote-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Quote API failed');

      const data = await response.json();
      const parsed = typeof data.quote === 'string' ? JSON.parse(data.quote) : data.quote;
      setQuote(parsed);

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
      console.error("Error fetching quote:", err);
    }
  };

  const nextStep = async () => {
    if (step === 1 && formData.vin) await decodeVIN();
    if (validate()) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const renderInput = (
    name: keyof typeof formData,
    placeholder: string,
    type: string = 'text',
    required: boolean = false
  ) => (
    <>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full p-3 border border-gray-300 rounded"
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {renderInput('vin', 'Enter VIN (optional)')}
            {!formData.vin && (
              <>
                {renderInput('year', 'Enter Year')}
                <select name="make" value={formData.make} onChange={handleChange} required>
                  <option value="">Select Make</option>
                  {makes.map(make => <option key={make} value={make}>{make}</option>)}
                </select>
                {formData.make && (
                  <select name="model" value={formData.model} onChange={handleChange} required>
                    <option value="">Select Model</option>
                    {models.map(model => <option key={model} value={model}>{model}</option>)}
                  </select>
                )}
                {formData.model && renderInput('trim', 'Enter Trim (optional)')}
              </>
            )}
          </>
        );
      case 2:
        return renderInput('mileage', 'Mileage', 'number', true);
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
            <label className="block mt-2">
              <input type="checkbox" name="accidents" checked={formData.accidents} onChange={handleChange} />
              <span className="ml-2">Has it been in an accident?</span>
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
        return renderInput('zip', 'ZIP Code');
      case 6:
        return renderInput('email', 'Your Email', 'email');
      default:
        return null;
    }
  };

  return (
    <>
      <GoogleAnalytics />
      {/* Your UI and JSX elements continue here... */}
    </>
  );
}
