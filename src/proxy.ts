// middleware.ts (or proxy.ts)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get('shop');
  const pathname = request.nextUrl.pathname;

  // Skip auth routes and static files
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // Critical: Set proper CSP headers for embedded app
  if (shop) {
    res.headers.set(
      'Content-Security-Policy',
      `frame-ancestors https://${shop} https://admin.shopify.com https://*.myshopify.com;`
    );
  } else {
    res.headers.set(
      'Content-Security-Policy',
      `frame-ancestors https://admin.shopify.com https://*.myshopify.com;`
    );
  }

  return res;
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};