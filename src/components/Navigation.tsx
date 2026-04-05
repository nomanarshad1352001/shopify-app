// components/Navigation.tsx
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    shopify: any;
  }
}

export function Navigation() {
  useEffect(() => {
    // Initialize navigation menu for Shopify admin sidebar
    const initNavigation = () => {
      if (typeof window !== 'undefined' && window.shopify) {
        try {
          // For App Bridge v4, navigation is handled differently
          // This creates the sidebar menu items
          const NavigationMenu = window.shopify.createComponent('navigation-menu');

          if (NavigationMenu) {
            NavigationMenu.addItem({
              label: 'Dashboard',
              destination: '/'
            });
            NavigationMenu.addItem({
              label: 'Billing',
              destination: '/billing'
            });
            NavigationMenu.addItem({
              label: 'Support',
              destination: '/support'
            });
          }
        } catch (error) {
          console.error('Failed to initialize navigation:', error);
        }
      }
    };

    // Wait for App Bridge to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
      initNavigation();
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Make sure to export it as default if you're using default import
// Or keep named export and use named import