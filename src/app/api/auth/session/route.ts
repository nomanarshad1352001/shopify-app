// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
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

    // Test the access token - use type assertion to bypass TypeScript
    const client = new shopify.clients.Rest({
      session: session as any,  // Type assertion
    });

    const shopInfo = await client.get({ path: 'shop' });

    return NextResponse.json({
      valid: true,
      shopInfo: {
        name: shopInfo.body.shop.name,
        domain: shopInfo.body.shop.domain,
        email: shopInfo.body.shop.email,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ valid: false, error: 'Internal error' }, { status: 500 });
  }
}