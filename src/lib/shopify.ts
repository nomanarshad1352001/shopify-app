import '@shopify/shopify-api/adapters/web-api';
import { shopifyApi, ApiVersion, LogSeverity } from '@shopify/shopify-api';
import { MemorySessionStorage } from '@shopify/shopify-app-session-storage-memory';

export const shopify = shopifyApi({
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '',
  apiSecretKey: process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET || '',
  scopes: process.env.NEXT_PUBLIC_SCOPES ? process.env.NEXT_PUBLIC_SCOPES.split(',') : [],
  hostName: process.env.NEXT_PUBLIC_SHOPIFY_APP_URL ? process.env.NEXT_PUBLIC_SHOPIFY_APP_URL.replace(/https?:\/\//, '') : '',
  hostScheme: 'https',
  isEmbeddedApp: true,
  apiVersion: ApiVersion.April26,
  logger: {
    level: LogSeverity.Info,
  },
});

export const sessionStorage = new MemorySessionStorage();
