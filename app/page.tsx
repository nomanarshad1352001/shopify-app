"use client"

import { useEffect, useState } from "react"
import { Button, Page, Banner, Spinner } from "@shopify/polaris"
import { useAppBridge } from "@shopify/app-bridge-react"

type AppBridgeStatus = "loading" | "ready" | "unavailable"

// Inner component that safely uses useAppBridge() — only rendered when window.shopify exists
function EmbeddedPageContent() {
  const shopify = useAppBridge()

  const showToast = () => {
    shopify.toast.show("Test toast!")
  }

  return (
    <Page title="Embedded App">
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button onClick={() => window.location.assign("/apps/billing")}>Billing</Button>
        <Button onClick={() => window.location.assign("/apps/support")}>Support</Button>
        <Button onClick={showToast} variant="primary">
          Test Toast
        </Button>
      </div>
    </Page>
  )
}

// Fallback page when running outside the Shopify iframe (e.g. local dev)
function StandalonePageContent() {
  return (
    <Page title="Embedded App">
      <Banner tone="warning" title="Running outside Shopify">
        <p>
          App Bridge is not available. This app must be loaded inside the Shopify
          Admin iframe for full functionality. Toast, navigation interception,
          and other App Bridge features are disabled.
        </p>
      </Banner>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Button onClick={() => window.location.assign("/apps/billing")}>Billing</Button>
        <Button onClick={() => window.location.assign("/apps/support")}>Support</Button>
        <Button disabled variant="primary">
          Test Toast (requires App Bridge)
        </Button>
      </div>
    </Page>
  )
}

export default function HomePage() {
  const [status, setStatus] = useState<AppBridgeStatus>("loading")

  useEffect(() => {
    // window.shopify is set by the App Bridge CDN script.
    // Give it up to 2 seconds to load, then fall back to standalone mode.
    if ((window as any).shopify) {
      setStatus("ready")
      return
    }

    let cancelled = false

    const poll = () => {
      if (cancelled) return
      if ((window as any).shopify) {
        setStatus("ready")
      } else {
        requestAnimationFrame(poll)
      }
    }
    poll()

    const timeout = setTimeout(() => {
      cancelled = true
      if (!(window as any).shopify) {
        setStatus("unavailable")
      }
    }, 2000)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        <Spinner accessibilityLabel="Loading" size="large" />
      </div>
    )
  }

  if (status === "unavailable") {
    return <StandalonePageContent />
  }

  return <EmbeddedPageContent />
}
