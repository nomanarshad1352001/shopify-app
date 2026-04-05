'use client';

import { useEffect, useState, ReactNode } from 'react';
import { createApp } from '@shopify/app-bridge';
import { Toast } from '@shopify/app-bridge/actions';

interface Props {
  children: ReactNode;
  host: string;
}

export default function ShopifyProvider({ children, host }: Props) {
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    console.log(host)
    if (!host) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('❌ Missing host param');
      return;
    }

    try {
      const app = createApp({
        apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
        host,
      });

      const toast = Toast.create(app, {
        message: 'App Bridge Loaded 🎉',
        duration: 3000,
      });

      toast.dispatch(Toast.Action.SHOW);

      setStatus('✅ App Bridge working');
    } catch (err) {
      console.error(err);
      setStatus('❌ App Bridge error');
    }
  }, [host]);

  return (
    <>
      <div>{status}</div>
      {children}
    </>
  );
}