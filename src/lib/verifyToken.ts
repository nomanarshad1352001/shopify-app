import jwt from "jsonwebtoken";

export function verifyShopifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET!);
    return decoded as any;
  } catch (err) {
    return null;
  }
}