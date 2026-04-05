// lib/shopify.ts
import '@shopify/shopify-api/adapters/web-api';
import { shopifyApi, ApiVersion, LogSeverity } from '@shopify/shopify-api';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';

export const shopify = shopifyApi({
  // Credentials
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',

  // Scopes
  scopes: process.env.SHOPIFY_SCOPES
    ? process.env.SHOPIFY_SCOPES.split(',').map((s) => s.trim())
    : ['read_products', 'write_products', 'read_customers'],

  // Host Configuration - Very Important for OAuth
  hostName: process.env.SHOPIFY_APP_URL
    ? process.env.SHOPIFY_APP_URL
      .replace(/https?:\/\//, '')
      .replace(/\/$/, '')
    : 'localhost:3000',

  hostScheme: 'https',
  isEmbeddedApp: true,
  apiVersion: ApiVersion.April26,

  logger: {
    level: process.env.NODE_ENV === 'production'
      ? LogSeverity.Error
      : LogSeverity.Info,
  },
});

// Session Storage (only for development)
export const sessionStorage = new MemorySessionStorage();