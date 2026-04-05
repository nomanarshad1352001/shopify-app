import { NextResponse } from "next/server";
import { shopify } from "@/lib/shopify";
import { connectDB } from "@/lib/db";
import { Shop } from "@/models/Shop";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const host = url.searchParams.get("host");

    if (!shop || !host) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const { session } = await shopify.auth.callback({
      rawRequest: request,
    });

    await connectDB();

    await Shop.findOneAndUpdate(
      { shop },
      { shop, accessToken: session.accessToken },
      { upsert: true }
    );

    const redirectUrl = `/?shop=${shop}&host=${host}`;

    return NextResponse.redirect(new URL(redirectUrl, url.origin));
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}