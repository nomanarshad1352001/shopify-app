// app/page.tsx - Simplified test version
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Loading...');
  const [shopInfo, setShopInfo] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');

      if (!shop) {
        setStatus('No shop parameter found. Please install the app from Shopify admin.');
        return;
      }

      try {
        const response = await fetch(`/api/auth/session?shop=${shop}`);
        const data = await response.json();

        if (data.valid) {
          setStatus('✅ Authentication successful!');
          setShopInfo(data.shopInfo);
        } else {
          setStatus('❌ Authentication failed. Please reinstall the app.');
        }
      } catch (error) {
        setStatus('Error checking authentication');
        console.error(error);
      }
    };

    checkAuth();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Shopify Embedded App</h1>
      <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Status: {status}</h2>
        {shopInfo && (
          <div>
            <p><strong>Store:</strong> {shopInfo.name}</p>
            <p><strong>Domain:</strong> {shopInfo.domain}</p>
            <p><strong>Email:</strong> {shopInfo.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}