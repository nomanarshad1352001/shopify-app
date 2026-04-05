// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  Banner,
  Spinner
} from '@shopify/polaris';

export default function Home() {
  const [isValidating, setIsValidating] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const [shopInfo, setShopInfo] = useState<any>(null);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');

        if (!shop) {
          setIsValidating(false);
          return;
        }

        const response = await fetch(`/api/auth/session?shop=${shop}`);
        const data = await response.json();

        if (data.valid) {
          setSessionValid(true);
          setShopInfo(data.shopInfo);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, []);

  const showToast = (message: string, isError: boolean = false) => {
    if (typeof window !== 'undefined' && window.shopify?.toast) {
      window.shopify.toast.show(message, { duration: 3000, isError });
    } else {
      alert(message);
    }
  };

  const handleTestToast = () => {
    showToast('✅ OAuth and App Bridge are working perfectly!');
  };

  const handleTestApiCall = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get('shop');

      const response = await fetch(`/api/shop-info?shop=${shop}`);
      const data = await response.json();

      if (response.ok) {
        showToast(`Connected to: ${data.shop.name}`);
      } else {
        showToast('API call failed', true);
      }
    } catch (error) {
      console.error('API call failed:', error);
      showToast('Error calling API', true);
    }
  };

  if (isValidating) {
    return (
      <Page title="Dashboard">
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spinner accessibilityLabel="Validating session" size="large" />
                <Text as="p">Validating your session...</Text>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          {sessionValid ? (
            <Banner tone="success">
              <Text as="p" fontWeight="bold">
                ✅ OAuth Authentication Successful!
              </Text>
              <Text as="p">
                Your app is properly authenticated with Shopify. Session token and access token are working.
              </Text>
            </Banner>
          ) : (
            <Banner tone="warning">
              <Text as="p" fontWeight="bold">
                ⚠️ Session Not Validated
              </Text>
              <Text as="p">
                Please reinstall the app to complete authentication.
              </Text>
            </Banner>
          )}
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                App Bridge + OAuth Status
              </Text>

              {shopInfo && (
                <BlockStack gap="200">
                  <Text as="p">
                    <strong>Connected Store:</strong> {shopInfo.name}
                  </Text>
                  <Text as="p">
                    <strong>Shop Domain:</strong> {shopInfo.domain}
                  </Text>
                  <Text as="p">
                    <strong>Email:</strong> {shopInfo.email}
                  </Text>
                </BlockStack>
              )}

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <Button onClick={handleTestToast} variant="primary">
                  Test Toast Notification
                </Button>

                <Button onClick={handleTestApiCall} variant="secondary">
                  Test API Call
                </Button>
              </div>

              <div style={{ marginTop: '16px', padding: '12px', background: '#f6f6f7', borderRadius: '8px' }}>
                <Text as="p" variant="bodySm">
                  <strong>✅ Working Features:</strong>
                </Text>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>Server-side OAuth flow complete</li>
                  <li>Session token stored securely</li>
                  <li>Access token ready for Admin API calls</li>
                  <li>App Bridge v4 via CDN</li>
                  <li>Toast notifications working</li>
                  <li>Polaris UI components working</li>
                </ul>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}