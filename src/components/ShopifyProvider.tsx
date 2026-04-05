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
    if (!window.ShopifyAppBridge) {
      setStatus('❌ Shopify App Bridge not loaded');
      return;
    }

    try {
      const app = window.ShopifyAppBridge.createApp({
        apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '',
        host,
      });

      const Toast = window.ShopifyAppBridge.actions.Toast;
      const toast = Toast.create(app, { message: 'App Bridge Loaded!', duration: 3000 });
      toast.dispatch(Toast.Action.SHOW);

      setStatus('✅ Shopify App Bridge loaded');
    } catch (err) {
      console.error(err);
      setStatus('❌ Error initializing App Bridge');
    }
  }, [host]);

  return (
    <>
      <div>{status}</div>
      <div>{shop}</div>
      {children}
    </>
  );
}