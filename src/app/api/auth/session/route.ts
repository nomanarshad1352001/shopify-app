import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');

    if (!shop) {
      return NextResponse.json({ valid: false, error: 'Missing shop' }, { status: 400 });
    }

    // Get session from storage
    const session = await sessionStorage.loadSession(shop);

    if (!session || !session.accessToken) {
      return NextResponse.json({ valid: false, error: 'No valid session found' }, { status: 401 });
    }

    // Optional: Verify session is still valid by making a test API call
    const client = new shopify.clients.Rest({
      session: session,
    });

    try {
      const shopInfo = await client.get({
        path: 'shop',
      });

      return NextResponse.json({
        valid: true,
        shopInfo: {
          name: shopInfo.body.shop.name,
          domain: shopInfo.body.shop.domain,
          email: shopInfo.body.shop.email,
        },
      });
    } catch (apiError) {
      // Session might be expired
      return NextResponse.json({ valid: false, error: 'API call failed' }, { status: 401 });
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ valid: false, error: 'Internal error' }, { status: 500 });
  }
}