// src/types/shopify.d.ts
export {};

declare global {
  interface Window {
    shopify: {
      idToken: () => Promise<string>;   // ✅ ADD THIS

      toast: {
        show: (
          message: string,
          options?: { duration?: number; isError?: boolean }
        ) => void;
      };

      createComponent: (componentName: string) => any;

      initialize: (config: {
        apiKey: string;
        host: string;
        shop?: string; // optional (safer)
      }) => void;

      config: () => {
        apiKey: string;
        shopOrigin: string;
        host: string;
      };
    };
  }
}