import { NextResponse } from "next/server"
import { shopify } from "@/lib/shopify"

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ error: "Missing shop parameter" }, { status: 400 });
  }

  const sanitizedShop = shopify.utils.sanitizeShop(shop, true);
  if (!sanitizedShop) {
    return NextResponse.json({ error: "Invalid shop" }, { status: 400 });
  }

  try {
    // Don't modify the request protocol - let Vercel handle it
    // The response from shopify.auth.begin includes the redirect and cookies
    return await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: "/api/auth/callback",
      isOnline: false,
      rawRequest: request,
    });
  } catch (err) {
    console.error("OAuth begin failed:", err);
    return NextResponse.json({ error: "OAuth initialization failed" }, { status: 500 });
  }
}