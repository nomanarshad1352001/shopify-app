"use client"

import { type ReactNode } from "react"
import { AppProvider as PolarisProvider } from "@shopify/polaris"
import "@shopify/polaris/build/esm/styles.css"
import enTranslations from "@shopify/polaris/locales/en.json"

interface ShopifyProviderProps {
  children: ReactNode
}

// In @shopify/app-bridge-react v4, there is no AppProvider/Provider component.
// App Bridge auto-initializes from the Shopify CDN script injected in the iframe.
// Individual components (TitleBar, NavMenu, etc.) and the useAppBridge hook
// are available directly once the CDN script is present.
export function ShopifyProvider({ children }: ShopifyProviderProps) {
  return (
    <PolarisProvider i18n={enTranslations}>
      {children}
    </PolarisProvider>
  )
}
