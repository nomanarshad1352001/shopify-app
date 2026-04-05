// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// This is the main content component that uses browser APIs
function HomeContent() {
  const [status, setStatus] = useState('Loading...');
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');
      const host = urlParams.get('host');

      console.log("URL params:", { shop, host });

      if (!shop) {
        setStatus('❌ No shop parameter found. Please install the app from Shopify admin.');
        return;
      }

      try {
        const response = await fetch(`/api/auth/session?shop=${shop}`);
        const data = await response.json();

        console.log("Session response:", data);

        if (data.valid) {
          setStatus('✅ Authentication successful!');
          setShopInfo(data.shopInfo);
          setError(null);
        } else {
          setStatus('❌ Authentication failed');
          setError(data.error);
        }
      } catch (error) {
        setStatus('❌ Error checking authentication');
        setError(String(error));
        console.error(error);
      }
    };

    checkAuth();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Shopify Embedded App</h1>

      <div style={{
        padding: '20px',
        background: status.includes('✅') ? '#d4edda' : '#f8d7da',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{status}</h2>
        {error && <p style={{ color: '#721c24', margin: '0' }}>Error: {error}</p>}
      </div>

      {shopInfo && (
        <div style={{
          padding: '20px',
          background: '#e7f3ff',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Store Information:</h3>
          <p><strong>Name:</strong> {shopInfo.name}</p>
          <p><strong>Domain:</strong> {shopInfo.domain}</p>
          <p><strong>Email:</strong> {shopInfo.email}</p>
        </div>
      )}

      <div style={{
        padding: '20px',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <h3>Navigation:</h3>
        <ul>
          <li><a href={`/?shop=${new URLSearchParams(window.location.search).get('shop')}&host=${new URLSearchParams(window.location.search).get('host')}`}>Dashboard</a></li>
          <li><a href={`/billing?shop=${new URLSearchParams(window.location.search).get('shop')}&host=${new URLSearchParams(window.location.search).get('host')}`}>Billing</a></li>
          <li><a href={`/support?shop=${new URLSearchParams(window.location.search).get('shop')}&host=${new URLSearchParams(window.location.search).get('host')}`}>Support</a></li>
        </ul>
      </div>
    </div>
  );
}

// Export with SSR disabled to prevent window is not defined error
export default dynamic(() => Promise.resolve(HomeContent), {
  ssr: false,
});