'use client';

import { AppProvider as PolarisProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { Suspense } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // We only run PolarisProvider here since App Bridge v4 uses a global script tag.
  return (
    <Suspense fallback={<div>Loading App...</div>}>
      <PolarisProvider i18n={enTranslations}>
        {children}
      </PolarisProvider>
    </Suspense>
  );
}
