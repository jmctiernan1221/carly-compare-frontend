'use client';

import { useEffect } from 'react';

export function GoogleAnalytics() {
  useEffect(() => {
    // Avoid duplicate script injection
    if (window.gtag) return;

    const script1 = document.createElement('script');
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-46WT61QP70';
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-46WT61QP70');
    `;
    document.head.appendChild(script2);
  }, []);

  return null;
}