// src/types/shopify.d.ts
export {};

declare global {
  interface Window {
    shopify: {
      toast: {
        show: (message: string, options?: { duration?: number; isError?: boolean }) => void;
      };
      createComponent: (componentName: string) => any;
      initialize: (config: { apiKey: string; host: string; shop: string }) => void;
      config: () => { apiKey: string; shopOrigin: string; host: string };
    };
  }
}