import { NextResponse } from "next/server"
import { shopify } from "@/lib/shopify"

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
  }

  const sanitizedShop = shopify.utils.sanitizeShop(shop, true);
  if (!sanitizedShop) {
    return NextResponse.json({ error: 'Invalid shop' }, { status: 400 });
  }

  try {
    // Force https for Vercel
    const reqUrl = new URL(request.url);
    reqUrl.protocol = 'https:';
    const secureRequest = new Request(reqUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      duplex: 'half',
    });

    return await shopify.auth.begin({
      shop: sanitizedShop,
      callbackPath: '/api/auth/callback',
      isOnline: false,
      rawRequest: secureRequest,
    });
  } catch (err: any) {
    console.error('OAuth begin failed:', err);
    return NextResponse.json({ error: 'OAuth initialization failed' }, { status: 500 });
  }
}