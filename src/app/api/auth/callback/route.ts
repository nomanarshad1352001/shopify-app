import { NextResponse } from "next/server";
import { shopify, sessionStorage } from "@/lib/shopify";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    // CRITICAL: Don't modify the URL protocol or create a new Request
    // The Shopify SDK needs the original request with original cookies
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request, // Use original request, don't recreate it
    });

    const { session, headers } = callbackResponse;

    // Store the session
    await sessionStorage.storeSession(session);

    const host = url.searchParams.get("host");
    if (!host) {
      return NextResponse.json({ error: "Missing host parameter" }, { status: 400 });
    }

    // Redirect to the embedded app
    const appUrl = new URL(`/?shop=${session.shop}&host=${host}`, url.origin);
    const response = NextResponse.redirect(appUrl);

    // Forward all cookies from Shopify SDK response
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
    console.error("OAuth callback failed:", {
      message: err.message,
      stack: err.stack,
    });
    return NextResponse.json(
      {
        error: "OAuth callback failed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}