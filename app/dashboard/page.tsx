'use client';

import { useEffect } from 'react';

export default function DashboardPage() {
  useEffect(() => {
    window.location.href = 'https://carly-compare-backend.onrender.com/dashboard';
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p>Redirecting to the dashboard...</p>
    </main>
  );
}