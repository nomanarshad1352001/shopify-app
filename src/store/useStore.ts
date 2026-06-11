import { create } from 'zustand';
import { Product, ProductMatch, OutfitGroup, StoreLocation, IPadConfig, MatchType } from '../types';
import { PRODUCTS, PRODUCT_MATCHES, OUTFIT_GROUPS, LOCATIONS, IPAD_CONFIGS } from '../data/mockData';

// Shopping cart item
interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

interface AppState {
  // Data
  products: Product[];
  matches: ProductMatch[];
  outfitGroups: OutfitGroup[];
  locations: StoreLocation[];
  ipadConfigs: IPadConfig[];

  // Shopping cart
  cart: CartItem[];

  // Current context
  currentLocationId: string;
  currentView: 'kiosk' | 'admin';
  kioskSelectedProductId: string | null;

  // Admin state
  adminAuthenticated: boolean;
  adminSearchQuery: string;
  adminSelectedProductId: string | null;
  adminTab: 'products' | 'matches' | 'outfits' | 'settings' | 'reports';

  // Actions
  setCurrentLocation: (locationId: string) => void;
  setCurrentView: (view: 'kiosk' | 'admin') => void;
  setKioskSelectedProduct: (productId: string | null) => void;
  setAdminAuthenticated: (auth: boolean) => void;
  setAdminSearchQuery: (query: string) => void;
  setAdminSelectedProduct: (productId: string | null) => void;
  setAdminTab: (tab: AppState['adminTab']) => void;

  // Data helpers
  getProduct: (id: string) => Product | undefined;
  getProductByBarcode: (barcode: string) => Product | undefined;
  getMatchesForProduct: (productId: string) => Array<{ match: ProductMatch; product: Product }>;
  getOutfitGroupsForProduct: (productId: string) => OutfitGroup[];
  getProductInventoryAtLocation: (productId: string, locationId: string) => Record<string, number>;
  getTotalInventoryAtLocation: (productId: string, locationId: string) => number;
  searchProducts: (query: string) => Product[];

  // Admin actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateProductInventory: (productId: string, variantId: string, locationId: string, quantity: number) => void;
  addMatch: (productAId: string, productBId: string, matchType: MatchType, bidirectional: boolean) => void;
  removeMatch: (matchId: string) => void;
  toggleProductKioskVisibility: (productId: string) => void;
  addOutfitGroup: (group: Omit<OutfitGroup, 'id' | 'createdAt'>) => void;
  removeOutfitGroup: (groupId: string) => void;
  addProductToOutfitGroup: (groupId: string, productId: string) => void;
  removeProductFromOutfitGroup: (groupId: string, productId: string) => void;

  // Cart actions
  addToCart: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { items: number; subtotal: number };
}

export const useStore = create<AppState>((set, get) => ({
  products: PRODUCTS,
  matches: PRODUCT_MATCHES,
  outfitGroups: OUTFIT_GROUPS,
  locations: LOCATIONS,
  ipadConfigs: IPAD_CONFIGS,
  cart: [],

  currentLocationId: 'loc-1',
  currentView: 'kiosk',
  kioskSelectedProductId: null,

  adminAuthenticated: false,
  adminSearchQuery: '',
  adminSelectedProductId: null,
  adminTab: 'products',

  setCurrentLocation: (locationId) => set({ currentLocationId: locationId }),
  setCurrentView: (view) => set({ currentView: view }),
  setKioskSelectedProduct: (productId) => set({ kioskSelectedProductId: productId }),
  setAdminAuthenticated: (auth) => set({ adminAuthenticated: auth }),
  setAdminSearchQuery: (query) => set({ adminSearchQuery: query }),
  setAdminSelectedProduct: (productId) => set({ adminSelectedProductId: productId }),
  setAdminTab: (tab) => set({ adminTab: tab }),

  getProduct: (id) => get().products.find((p) => p.id === id),

  getProductByBarcode: (barcode) => {
    const products = get().products;
    for (const product of products) {
      for (const variant of product.variants) {
        if (variant.barcode === barcode) {
          return product;
        }
      }
    }
    return undefined;
  },

  getMatchesForProduct: (productId) => {
    const { matches, products } = get();
    const result: Array<{ match: ProductMatch; product: Product }> = [];

    matches.forEach((m) => {
      let matchedProductId: string | null = null;

      if (m.productAId === productId) {
        matchedProductId = m.productBId;
      } else if (m.productBId === productId && m.isBidirectional) {
        matchedProductId = m.productAId;
      }

      if (matchedProductId) {
        const product = products.find((p) => p.id === matchedProductId);
        if (product) {
          result.push({ match: m, product });
        }
      }
    });

    return result.sort((a, b) => a.match.sortOrder - b.match.sortOrder);
  },

  getOutfitGroupsForProduct: (productId) => {
    return get().outfitGroups.filter((g) => g.productIds.includes(productId));
  },

  getProductInventoryAtLocation: (productId, locationId) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return {};
    const result: Record<string, number> = {};
    product.variants.forEach((v) => {
      result[v.size] = (result[v.size] || 0) + (v.inventoryByLocation[locationId] || 0);
    });
    return result;
  },

  getTotalInventoryAtLocation: (productId, locationId) => {
    const inv = get().getProductInventoryAtLocation(productId, locationId);
    return Object.values(inv).reduce((sum, qty) => sum + qty, 0);
  },

  searchProducts: (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return get().products;
    return get().products.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.collections.some((c) => c.toLowerCase().includes(q)) ||
        p.variants.some(
          (v) =>
            v.sku.toLowerCase().includes(q) ||
            v.barcode.includes(q)
        )
      );
    });
  },

  addProduct: (productData) => {
    const id = `p-${Date.now()}`;
    const now = new Date().toISOString().split('T')[0];
    set((state) => ({
      products: [
        ...state.products,
        {
          ...productData,
          id,
          createdAt: now,
          updatedAt: now,
        },
      ],
    }));
  },

  updateProduct: (productId, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] }
          : p
      ),
    }));
  },

  deleteProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
      matches: state.matches.filter(
        (m) => m.productAId !== productId && m.productBId !== productId
      ),
    }));
  },

  updateProductInventory: (productId, variantId, locationId, quantity) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              variants: p.variants.map((v) =>
                v.id === variantId
                  ? {
                      ...v,
                      inventoryByLocation: {
                        ...v.inventoryByLocation,
                        [locationId]: quantity,
                      },
                    }
                  : v
              ),
            }
          : p
      ),
    }));
  },

  addMatch: (productAId, productBId, matchType, bidirectional) => {
    set((state) => ({
      matches: [
        ...state.matches,
        {
          id: `m-${Date.now()}`,
          productAId,
          productBId,
          matchType,
          isBidirectional: bidirectional,
          sortOrder: state.matches.length + 1,
        },
      ],
    }));
  },

  removeMatch: (matchId) => {
    set((state) => ({
      matches: state.matches.filter((m) => m.id !== matchId),
    }));
  },

  toggleProductKioskVisibility: (productId) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, isHiddenFromKiosk: !p.isHiddenFromKiosk } : p
      ),
    }));
  },

  addOutfitGroup: (group) => {
    set((state) => ({
      outfitGroups: [
        ...state.outfitGroups,
        {
          ...group,
          id: `og-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    }));
  },

  removeOutfitGroup: (groupId) => {
    set((state) => ({
      outfitGroups: state.outfitGroups.filter((g) => g.id !== groupId),
    }));
  },

  addProductToOutfitGroup: (groupId, productId) => {
    set((state) => ({
      outfitGroups: state.outfitGroups.map((g) =>
        g.id === groupId && !g.productIds.includes(productId)
          ? { ...g, productIds: [...g.productIds, productId] }
          : g
      ),
    }));
  },

  removeProductFromOutfitGroup: (groupId, productId) => {
    set((state) => ({
      outfitGroups: state.outfitGroups.map((g) =>
        g.id === groupId
          ? { ...g, productIds: g.productIds.filter((id) => id !== productId) }
          : g
      ),
    }));
  },

  // Cart actions
  addToCart: (productId, variantId, quantity) => {
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (existingIndex >= 0) {
        const newCart = [...state.cart];
        newCart[existingIndex].quantity += quantity;
        return { cart: newCart };
      }
      return { cart: [...state.cart, { productId, variantId, quantity }] };
    });
  },

  removeFromCart: (productId, variantId) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      ),
    }));
  },

  updateCartQuantity: (productId, variantId, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    const { cart, products } = get();
    let items = 0;
    let subtotal = 0;
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          items += item.quantity;
          subtotal += variant.price * item.quantity;
        }
      }
    });
    return { items, subtotal };
  },
}));
