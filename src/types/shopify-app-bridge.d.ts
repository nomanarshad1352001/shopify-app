// src/types/shopify-app-bridge.d.ts
export {};

declare global {
  interface Window {
    ShopifyAppBridge: {
      createApp: (config: { apiKey: string; host: string }) => any;
      actions: {
        Toast: {
          create: (app: any, options: { message: string; duration?: number }) => {
            dispatch: (action: any) => void;
          };
          Action: {
            SHOW: string;
          };
        };
        // Add more actions here if you need (Modal, Redirect, etc.)
      };
    };
  }
}