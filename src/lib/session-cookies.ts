// lib/session-cookies.ts
import { cookies } from 'next/headers';
import { shopify } from './shopify';

interface SessionData {
  accessToken: string;
  shop: string;
  scope: string;
  expires: Date;
  state: string;
  userId?: number;
}

export async function storeSessionInCookies(session: any) {
  const sessionData: SessionData = {
    accessToken: session.accessToken,
    shop: session.shop,
    scope: session.scope,
    expires: session.expires || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    state: session.state || '',
    userId: session.userId,
  };

  // Store in cookie (encrypted)
  const cookieStore = await cookies();
  cookieStore.set('shopify_session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: sessionData.expires,
    path: '/',
  });

  return true;
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('shopify_session');

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData: SessionData = JSON.parse(sessionCookie.value);

    // Check if expired
    if (new Date(sessionData.expires) < new Date()) {
      return null;
    }

    // Reconstruct full session object that Shopify client expects
    return {
      id: sessionData.shop,
      shop: sessionData.shop,
      state: sessionData.state,
      scope: sessionData.scope,
      expires: sessionData.expires,
      accessToken: sessionData.accessToken,
      isOnline: false,
      onlineAccessInfo: null,
      userId: sessionData.userId || null,
    };
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}

export async function deleteSessionFromCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('shopify_session');
}