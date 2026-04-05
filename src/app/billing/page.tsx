'use client';

import { Page, Layout, Card, Text, BlockStack } from '@shopify/polaris';

export default function Billing() {
  return (
    <Page title="Billing">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Billing Overview
              </Text>
              <Text as="p">
                This area will later be integrated with Heymantle or Shopify Billing API
                to manage your app&#39;s subscriptions and charges.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
