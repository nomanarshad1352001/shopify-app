'use client';

import { useSearchParams } from 'next/navigation';
import ShopifyProvider from '@/components/ShopifyProvider';

export default function Page() {
  const params = useSearchParams();

  const host = params.get('host') || '';
  const shop = params.get('shop') || '';

  return (
    <ShopifyProvider host={host}>
      <div>
        <h1>Shopify App</h1>
        <p>{shop}</p>
      </div>
    </ShopifyProvider>
  );
}