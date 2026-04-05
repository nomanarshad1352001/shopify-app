import { NextResponse } from "next/server";
import { verifyShopifyToken } from "@/lib/verifyToken";
import { connectDB } from "@/lib/db";
import { Shop } from "@/models/Shop";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyShopifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const shop = decoded.dest.replace("https://", "");

    await connectDB();

    const shopData = await Shop.findOne({ shop });

    if (!shopData) {
      return NextResponse.json({ error: "Shop not found" }, { status: 401 });
    }

    const response = await fetch(
      `https://${shop}/admin/api/2024-04/shop.json`,
      {
        headers: {
          "X-Shopify-Access-Token": shopData.accessToken,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json({
      valid: true,
      shop: data.shop,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}