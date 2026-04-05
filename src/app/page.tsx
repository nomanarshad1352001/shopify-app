// app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Loading...');
  const [shopInfo, setShopInfo] = useState<any>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');

    console.log("Page loaded - Shop:", shop);

    if (!shop) {
      setStatus('No shop parameter found. Please install the app from Shopify admin.');
      return;
    }

    fetch(`/api/auth/session?shop=${shop}`)
      .then(res => res.json())
      .then(data => {
        console.log("Session response:", data);
        if (data.valid) {
          setStatus('✅ Authentication successful!');
          setShopInfo(data.shopInfo);
        } else {
          setStatus('❌ Authentication failed: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setStatus('❌ Error checking authentication');
      });
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
        <h2>{status}</h2>
      </div>

      {shopInfo && (
        <div style={{ padding: '20px', background: '#e7f3ff', borderRadius: '8px' }}>
          <h3>Store Information:</h3>
          <p><strong>Name:</strong> {shopInfo.name}</p>
          <p><strong>Domain:</strong> {shopInfo.domain}</p>
          <p><strong>Email:</strong> {shopInfo.email}</p>
        </div>
      )}
    </div>
  );
}