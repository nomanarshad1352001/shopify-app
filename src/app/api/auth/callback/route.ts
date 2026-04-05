import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
    });

    const { session, headers } = callbackResponse;
    await sessionStorage.storeSession(session);

    // After auth, redirect to the app inside Shopify admin
    const host = new URL(request.url).searchParams.get('host');
    if (!host) {
      return NextResponse.json({ error: 'Missing host parameter' }, { status: 400 });
    }

    const appUrl = new URL(`/?shop=${session.shop}&host=${host}`, request.url);
    const response = NextResponse.redirect(appUrl);

    // Append headers returned from the callback (which include the session cookie)
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === 'string') {
          response.headers.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => response.headers.append(key, v));
        }
      }
    }

    return response;
  } catch (err: any) {
    console.error('Failed to complete OAuth callback', err);
    return NextResponse.json({ error: 'OAuth callback failed' }, { status: 500 });
  }
}
