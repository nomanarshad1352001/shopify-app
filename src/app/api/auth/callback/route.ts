import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    url.protocol = 'https:';

    const secureRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      duplex: 'half' as any,
    });

    // Log cookies for debugging (remove in production)
    console.log('Callback cookies:', Object.fromEntries(request.headers.entries()).cookie || 'No cookies');

    const callbackResponse = await shopify.auth.callback({
      rawRequest: secureRequest,
    });

    const { session, headers } = callbackResponse;
    await sessionStorage.storeSession(session);

    const host = url.searchParams.get('host');
    if (!host) {
      return NextResponse.json({ error: 'Missing host parameter' }, { status: 400 });
    }

    const appUrl = new URL(`/?shop=${session.shop}&host=${host}`, url.origin);
    const response = NextResponse.redirect(appUrl);

    // Copy headers (including Set-Cookie) from Shopify SDK
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === 'string') {
          response.headers.set(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => response.headers.append(key, v));
        }
      }
    }

    return response;
  } catch (err: any) {
    console.error('OAuth callback failed:', {
      message: err.message,
      stack: err.stack,
      shop: new URL(request.url).searchParams.get('shop'),
    });
    return NextResponse.json({
      error: 'OAuth callback failed',
      details: err.message
    }, { status: 500 });
  }
}