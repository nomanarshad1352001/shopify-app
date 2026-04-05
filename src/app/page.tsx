// example: src/app/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ShopifyProvider from "@/components/ShopifyProvider";

export default function Page() {
  const searchParams = useSearchParams();
  const shop = searchParams.get("shop") || "";
  const host = searchParams.get("host") || "";

  const [status, setStatus] = useState("Loading...");
  const [shopName, setShop] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!window.shopify) {
        setStatus("Shopify App Bridge not loaded");
        return;
      }

      try {
        const token = await window.shopify.idToken?.();
        const res = await fetch("/api/auth/session", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.valid) {
          setStatus("✅ Authenticated");
          setShop(data.shop);
        } else {
          setStatus("❌ " + data.error);
        }
      } catch (err) {
        console.error(err);
        setStatus("Error");
      }
    };

    init();
  }, []);

  return (
    <ShopifyProvider shop={shop} host={host}>
        <h1>Shopify App</h1>
    </ShopifyProvider>
  );
}