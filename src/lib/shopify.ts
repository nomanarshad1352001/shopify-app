// lib/shopify.ts
import "@shopify/shopify-api/adapters/web-api";
import { shopifyApi, ApiVersion, LogSeverity } from "@shopify/shopify-api";
import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";

// Get the hostname without protocol for Shopify SDK
const getHostName = () => {
  const appUrl = process.env.SHOPIFY_APP_URL || "http://localhost:3000";
  return appUrl.replace(/https?:\/\//, "").replace(/\/$/, "");
};

export const shopify = shopifyApi({
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes: process.env.SHOPIFY_SCOPES?.split(",").map((s) => s.trim()) || [
    "read_products",
    "write_products",
    "read_customers",
  ],
  hostName: getHostName(),
  hostScheme: "https",
  isEmbeddedApp: true,
  apiVersion: ApiVersion.April26,
  logger: {
    level: process.env.NODE_ENV === "production" ? LogSeverity.Error : LogSeverity.Info,
  },
});

// For production, you'll want to replace this with a persistent storage (like Redis or Prisma)
export const sessionStorage = new MemorySessionStorage();