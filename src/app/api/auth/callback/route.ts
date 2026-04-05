import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    // Vercel serverless functions often receive `request.url` with 'http' internally. 
    // Shopify strictly validates that the callback happens over 'https:`.
    const url = new URL(request.url);
    url.protocol = 'https:';
    
    // We clone the request and override its URL
    const secureRequest = new Request(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      // @ts-ignore - Duplex is required for Node.js 18+ streams if body exists
      duplex: 'half'
    });

    const callbackResponse = await shopify.auth.callback({
      rawRequest: secureRequest,
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
    console.error('Failed to complete OAuth callback', err.message, err.stack, err);
    return NextResponse.json({ error: 'OAuth callback failed', details: err.message }, { status: 500 });
  }
}
