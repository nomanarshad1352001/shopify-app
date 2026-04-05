// lib/shopify.ts
import "@shopify/shopify-api/adapters/web-api";
import { shopifyApi, ApiVersion, LogSeverity } from "@shopify/shopify-api";

const getHostName = () => {
  const appUrl = process.env.SHOPIFY_APP_URL || "http://localhost:3000";
  return appUrl.replace(/https?:\/\//, "").replace(/\/$/, "");
};

if (!process.env.NEXT_PUBLIC_SHOPIFY_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SHOPIFY_API_KEY");
}
if (!process.env.SHOPIFY_API_SECRET) {
  throw new Error("Missing SHOPIFY_API_SECRET");
}

export const shopify = shopifyApi({
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
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

// We'll handle session storage via cookies instead