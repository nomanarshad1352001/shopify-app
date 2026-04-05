// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');

    if (!shop) {
      return NextResponse.json({ valid: false, error: 'Missing shop' }, { status: 400 });
    }

    const session = await sessionStorage.loadSession(shop);

    if (!session || !session.accessToken) {
      return NextResponse.json({ valid: false, error: 'No session found' }, { status: 401 });
    }

    const client = new shopify.clients.Rest({
      session: session,
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