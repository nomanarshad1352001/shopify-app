'use client';

import { useEffect } from 'react';
import { createApp } from '@shopify/app-bridge';
import { NavigationMenu, AppLink } from '@shopify/app-bridge/actions';
import { useSearchParams } from 'next/navigation';

export default function Navigation() {
  const params = useSearchParams();
  const host = params.get('host') || '';

  useEffect(() => {
    if (!host) {
      console.error('Missing host param');
      return;
    }

    try {
      const app = createApp({
        apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY!,
        host,
      });

      // ✅ Create AppLink objects
      const dashboard = AppLink.create(app, {
        label: 'Dashboard',
        destination: '/',
      });

      const billing = AppLink.create(app, {
        label: 'Billing',
        destination: '/billing',
      });

      const support = AppLink.create(app, {
        label: 'Support',
        destination: '/support',
      });

      // ✅ Pass AppLink objects
      NavigationMenu.create(app, {
        items: [dashboard, billing, support],
      });

    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [host]);

  return null;
}