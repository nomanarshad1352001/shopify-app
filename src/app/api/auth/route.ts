import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
  }

  const sanitizedShop = shopify.utils.sanitizeShop(shop, true);
  if (!sanitizedShop) {
    return NextResponse.json({ error: 'Invalid shop' }, { status: 400 });
  }

  try {
    // Begin OAuth. isOnline determines if we get an online or offline token.
    // For an embedded app, we usually do online for user actions, but let's do offline for MVP setup.
    const response = await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: '/api/auth/callback',
      isOnline: false, // offline tokens are good for background jobs / MVP
      rawRequest: request,
    });
    
    // The web-api adapter returns a standard Response object which is what Next expects.
    return response;
  } catch (err: any) {
    console.error('Failed to begin OAuth', err);
    return NextResponse.json({ error: 'OAuth initialization failed' }, { status: 500 });
  }
}
