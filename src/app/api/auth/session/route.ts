// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { loadSession } from '@/lib/simple-session';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');

    console.log("Session check for shop:", shop);

    if (!shop) {
      return NextResponse.json({ valid: false, error: 'Missing shop' }, { status: 400 });
    }

    // Load session from our simple store
    const session = await loadSession(shop);

    console.log("Session loaded:", !!session);

    if (!session || !session.accessToken) {
      return NextResponse.json({
        valid: false,
        error: 'No valid session found'
      }, { status: 401 });
    }

    // Make direct API call to Shopify using fetch
    const response = await fetch(`https://${shop}/admin/api/2024-04/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': session.accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Shopify API error:", response.status);
      return NextResponse.json({
        valid: false,
        error: 'Invalid access token'
      }, { status: 401 });
    }

    const data = await response.json();

    return NextResponse.json({
      valid: true,
      shopInfo: {
        name: data.shop.name,
        domain: data.shop.domain,
        email: data.shop.email,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ valid: false, error: 'Internal error' }, { status: 500 });
  }
}