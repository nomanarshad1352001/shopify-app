// components/Navigation.tsx
'use client';

import { useEffect } from 'react';

export default function Navigation() {
  useEffect(() => {
    const initNavigation = () => {
      if (typeof window !== 'undefined' && window.shopify) {
        try {
          // For App Bridge v4, create navigation menu
          if (window.shopify.createComponent) {
            const NavigationMenu = window.shopify.createComponent('navigation-menu');

            if (NavigationMenu && NavigationMenu.addItem) {
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
          }
        } catch (error) {
          console.error('Failed to initialize navigation:', error);
        }
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
      initNavigation();
    }
  }, []);

  return null;
}