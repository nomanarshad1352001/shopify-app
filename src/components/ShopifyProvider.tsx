'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ShopifyProviderProps {
  children: ReactNode;
  shop: string;
  host: string;
}

export default function ShopifyProvider({ children, shop, host }: ShopifyProviderProps) {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    if (!window.shopify) {
      console.log("---------------- Shopify App Bridge not loaded ------------------")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('❌ Shopify App Bridge not loaded');
      return;
    }

    try {
      // ✅ Initialize
      window.shopify.initialize({
        apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
        host,
      });

      // ✅ Toast (NEW API)
      window.shopify.toast.show("App Bridge Loaded 🎉");

      setStatus('✅ Shopify App Bridge loaded');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error initializing App Bridge');
    }
  }, [host]);

  return (
    <>
      <div>{status}</div>
      <div>{shop} Shop</div>
      {children}
    </>
  );
}