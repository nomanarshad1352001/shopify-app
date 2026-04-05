// lib/simple-session.ts
// Simple in-memory session storage (for testing on Vercel)

interface SimpleSession {
  accessToken: string;
  shop: string;
  scope: string;
  expires: Date;
  state: string;
  id: string;
}

// Global store (will persist within same serverless function instance)
const globalStore = new Map<string, SimpleSession>();

export async function saveSession(shop: string, session: any) {
  const sessionData: SimpleSession = {
    id: session.id || shop,
    accessToken: session.accessToken,
    shop: session.shop,
    scope: session.scope,
    expires: session.expires || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    state: session.state || '',
  };

  globalStore.set(shop, sessionData);
  console.log(`Session saved for ${shop}. Store size: ${globalStore.size}`);
  return true;
}

export async function loadSession(shop: string) {
  const session = globalStore.get(shop);
  console.log(`Loading session for ${shop}: ${!!session}`);

  if (!session) {
    return null;
  }

  // Check if expired
  if (new Date(session.expires) < new Date()) {
    console.log(`Session expired for ${shop}`);
    globalStore.delete(shop);
    return null;
  }

  // Return a session object that matches what the Shopify client expects
  return {
    id: session.id,
    shop: session.shop,
    state: session.state,
    scope: session.scope,
    expires: session.expires,
    accessToken: session.accessToken,
    isOnline: false,
    onlineAccessInfo: null,
  };
}