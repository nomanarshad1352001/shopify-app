// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { storeSessionInCookies } from '@/lib/session-cookies';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const host = url.searchParams.get("host");

    console.log("=== OAuth Callback ===");
    console.log("Shop:", shop);

    if (!shop || !host) {
      return NextResponse.json({ error: "Missing shop or host" }, { status: 400 });
    }

    // Complete OAuth
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
    });

    const { session } = callbackResponse;

    console.log("Session received, access token:", !!session.accessToken);

    // Store session in cookies
    await storeSessionInCookies(session);
    console.log("Session stored in cookies");

    // Redirect back to app
    const redirectUrl = new URL(`/?shop=${session.shop}&host=${host}`, url.origin);
    const response = NextResponse.redirect(redirectUrl);

    console.log("=== OAuth Complete ===");
    return response;
  } catch (err: any) {
    console.error("OAuth callback failed:", err);
    return NextResponse.json(
      { error: "OAuth callback failed", details: err.message },
      { status: 500 }
    );
  }
}