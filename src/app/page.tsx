'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState("Loading...");
  const [shop, setShop] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      if (!window.shopify) {
        setStatus("Shopify App Bridge not loaded");
        return;
      }

      try {
        const token = await window.shopify.idToken();

        const res = await fetch("/api/auth/session", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.valid) {
          setStatus("✅ Authenticated");
          setShop(data.shop);
        } else {
          setStatus("❌ " + data.error);
        }
      } catch (err) {
        console.error(err);
        setStatus("Error");
      }
    };

    init();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Shopify App</h1>
      <h2>{status}</h2>

      {shop && (
        <div>
          <p>{shop.name}</p>
          <p>{shop.email}</p>
        </div>
      )}
    </div>
  );
}