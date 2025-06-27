'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_DASHBOARD) {
      setAuthorized(true);
      window.location.href = 'https://carly-compare-backend.onrender.com/dashboard?pass=' + password;

    } else {
      alert('Incorrect password');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      {!authorized && (
        <div className="bg-white p-6 rounded shadow max-w-sm w-full">
          <h1 className="text-lg font-semibold mb-4">Enter Dashboard Password</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded"
            placeholder="Password"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Access Dashboard
          </button>
        </div>
      )}
    </main>
  );
}
