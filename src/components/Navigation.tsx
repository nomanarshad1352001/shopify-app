'use client';

import { useEffect, createElement } from 'react';

export function Navigation() {
  useEffect(() => {
    // We only want this once. App Bridge handles `<ui-nav-menu>` automatically.
    // If you define `<ui-nav-menu>` anywhere, App Bridge will pick it up and render it in Shopify admin
  }, []);

  return createElement('ui-nav-menu', null, [
    createElement('a', { href: '/', rel: 'home', key: 'home' }, 'Home'),
    createElement('a', { href: '/billing', key: 'billing' }, 'Billing'),
    createElement('a', { href: '/support', key: 'support' }, 'Support')
  ]);
}
