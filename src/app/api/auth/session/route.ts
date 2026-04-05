// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { getSessionFromCookies } from '@/lib/session-cookies';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');

    console.log("Session check for shop:", shop);

    if (!shop) {
      return NextResponse.json({ valid: false, error: 'Missing shop' }, { status: 400 });
    }

    // Get session from cookies
    const session = await getSessionFromCookies();

    console.log("Session from cookies:", !!session);
    console.log("Session shop matches:", session?.shop === shop);

    if (!session || !session.accessToken || session.shop !== shop) {
      return NextResponse.json({
        valid: false,
        error: 'No valid session found'
      }, { status: 401 });
    }

    // Test the access token with Shopify API
    try {
      // Use the session directly - it now has the correct structure
      const client = new shopify.clients.Rest({
        session: session as any, // Type assertion for now
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
    } catch (apiError: any) {
      console.error("API call failed:", apiError.message);
      return NextResponse.json({
        valid: false,
        error: 'API call failed - session may be expired'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ valid: false, error: 'Internal error' }, { status: 500 });
  }
}