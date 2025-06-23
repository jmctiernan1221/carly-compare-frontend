'use client';

import { useState } from 'react';

type Quote = {
  buyer: string;
  price: string;
};

export default function Home() {
  const [formData, setFormData] = useState({
    vin: '',
    year: '',
    make: '',
    model: '',
    zip: ''
  });

  const [quotes, setQuotes] = useState<Quote[] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/getQuotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }

      const data = await response.json();
      setQuotes(data.quotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  return (

    <div className="min-h-screen p-8 bg-gray-50 space-y-10">
      

      {/* Carly Compare Header */}
      <h1 className="text-4xl font-bold text-center text-blue-600 bg-yellow-100 p-6 rounded-lg border border-blue-600">
        Carly Compare
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 bg-white p-6 rounded shadow-md">
        {['vin', 'year', 'make', 'model', 'zip'].map((field) => (
          <div className="flex flex-col" key={field}>
            <label htmlFor={field} className="mb-2 font-semibold text-gray-700">
              {field.toUpperCase()}:
            </label>
            <input
              id={field}
              type="text"
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Get Quotes
        </button>
      </form>

      {/* Quotes Display */}
      {quotes && (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quotes:</h2>
          <ul className="list-disc list-inside space-y-2">
            {quotes.map((quote: { buyer: string; price: string }, index: number) => (
              <li key={index} className="text-gray-700">
                <strong>{quote.buyer}:</strong> {quote.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
