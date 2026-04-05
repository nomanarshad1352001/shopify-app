'use client';

import { AppProvider as PolarisProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { Suspense } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading App...</div>}>
      <PolarisProvider i18n={enTranslations}>
        {children}
      </PolarisProvider>
    </Suspense>
  );
}
