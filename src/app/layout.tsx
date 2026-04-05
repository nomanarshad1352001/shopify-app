// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@shopify/polaris/build/esm/styles.css";
import "./globals.css";
import { Providers } from "./providers";
import Navigation from "@/components/Navigation";
import Script from "next/script";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopify Embedded App",
  description: "Next.js App Router for Shopify",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
    <head>
      <meta
        name="shopify-api-key"
        content={process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || ""}
      />
      {/* This CDN script is REQUIRED for App Bridge v4 */}
      <Script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        strategy="beforeInteractive"
      />
      <title>Shopify Embedded App</title>
    </head>
    <body className="min-h-full flex flex-col">
    <Providers>
      <Navigation />
      {children}
    </Providers>
    </body>
    </html>
  );
}