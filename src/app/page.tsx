'use client';

import { Page, Layout, Card, Text, Button, BlockStack } from '@shopify/polaris';

export default function Home() {
  const handleTestToast = () => {
    // @ts-ignore - shopify is globally injected by App Bridge v4
    if (typeof shopify !== 'undefined' && shopify.toast) {
      // @ts-ignore
      shopify.toast.show('This is a test toast from App Bridge!');
    } else {
      alert('This is a test toast! (App Bridge not found, running outside admin?)');
    }
  };

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Welcome to the Shopify Embedded App
              </Text>
              <Text as="p">
                This is the MVP for your Next.js Shopify embedded app.
                It features a server-first architecture with App Router, 
                Polaris UI, and App Bridge v4 integration.
              </Text>
              <Button onClick={handleTestToast} variant="primary">
                Test Toast
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
