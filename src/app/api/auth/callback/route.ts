// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { shopify, sessionStorage } from "@/lib/shopify";

export async function GET(request: Request) {
  try {
    // Get the URL parameters
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const host = url.searchParams.get("host");
    const code = url.searchParams.get("code");

    console.log("Callback received:", { shop, host, hasCode: !!code });

    if (!shop || !host) {
      console.error("Missing shop or host");
      return NextResponse.json({ error: "Missing shop or host" }, { status: 400 });
    }

    // Complete the OAuth callback
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
    });

    const { session, headers } = callbackResponse;

    // Store the session
    await sessionStorage.storeSession(session);

    console.log("Session stored for shop:", session.shop);

    // Redirect to the embedded app
    const redirectUrl = new URL(`/?shop=${session.shop}&host=${host}`, url.origin);
    const response = NextResponse.redirect(redirectUrl);

    // Forward all cookies from the Shopify SDK
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === "string") {
          response.headers.set(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => response.headers.append(key, v));
        }
      }
    }

    return response;
  } catch (err: any) {
    console.error("OAuth callback failed:", err);
    return NextResponse.json(
      { error: "OAuth callback failed", details: err.message },
      { status: 500 }
    );
  }
}