// app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { saveSession } from '@/lib/simple-session';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const host = url.searchParams.get("host");

    console.log("=== OAuth Callback Started ===");
    console.log("Shop:", shop);
    console.log("Host:", host);

    if (!shop || !host) {
      return NextResponse.json({ error: "Missing shop or host" }, { status: 400 });
    }

    // Complete OAuth
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
    });

    const { session } = callbackResponse;

    console.log("Session received - Has access token:", !!session.accessToken);

    // Save session to our simple store
    await saveSession(shop, session);

    console.log("Session saved successfully");

    // Redirect back to app with shop and host parameters
    const redirectUrl = new URL(`/?shop=${shop}&host=${host}`, url.origin);
    const response = NextResponse.redirect(redirectUrl);

    return response;
  } catch (err: any) {
    console.error("OAuth callback failed:", err);
    return NextResponse.json(
      { error: "OAuth callback failed", details: err.message },
      { status: 500 }
    );
  }
}