'use client';

import { Page, Layout, Card, Text, BlockStack } from '@shopify/polaris';

export default function Support() {
  return (
    <Page title="Support">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Support & Contact
              </Text>
              <Text as="p">
                If you need help or have questions about using the app,
                please contact our support team.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
