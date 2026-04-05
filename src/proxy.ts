import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get('shop');

  // Skip auth routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has('shopify_app_session'); // or whatever your session cookie name is

  if (!hasSession && shop) {
    return NextResponse.redirect(new URL(`/api/auth?shop=${shop}`, request.url));
  }

  const res = NextResponse.next();

  // Important for embedded apps
  const ancestorStr = shop
    ? `https://${shop} https://admin.shopify.com https://*.myshopify.com`
    : 'https://*.myshopify.com https://admin.shopify.com';

  res.headers.set('Content-Security-Policy', `frame-ancestors ${ancestorStr};`);

  // Optional: Add stricter cookie headers if needed
  res.headers.set('X-Frame-Options', 'ALLOW-FROM https://admin.shopify.com');

  return res;
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};