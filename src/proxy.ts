import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get('shop');
  
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has('shopify_app_session');
  
  if (!hasSession && shop) {
    return NextResponse.redirect(new URL(`/api/auth?shop=${shop}`, request.url));
  }

  const res = NextResponse.next();
  // Shopify requires frame-ancestors to prevent clickjacking but allow embedding in Shopify Admin
  const ancestorStr = shop ? `https://${shop} https://admin.shopify.com` : 'https://*.myshopify.com https://admin.shopify.com';
  res.headers.set('Content-Security-Policy', `frame-ancestors ${ancestorStr};`);
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
