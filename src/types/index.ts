// Core data types for the Outfit Matching System

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode: string;
  size: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  inventoryByLocation: Record<string, number>; // locationId -> quantity
}

export interface Product {
  id: string;
  title: string;
  description: string;
  productType: string; // Top, Skirt, Dress, Shell, Cardigan, Accessory, etc.
  vendor: string;
  tags: string[];
  collections: string[];
  images: string[];
  color: string;
  season: string;
  variants: ProductVariant[];
  isHiddenFromKiosk: boolean;
  createdAt: string;
  updatedAt: string;
  shopifyId?: string;
}

export type MatchType =
  | 'exact_set'
  | 'best_match'
  | 'color_match'
  | 'style_match'
  | 'recommended_addon'
  | 'shell_cardigan'
  | 'accessory';

export const MATCH_TYPE_LABELS: Record<MatchType, string> = {
  exact_set: 'Exact Set',
  best_match: 'Best Match',
  color_match: 'Color Match',
  style_match: 'Style Match',
  recommended_addon: 'Recommended Add-on',
  shell_cardigan: 'Shell / Cardigan Match',
  accessory: 'Accessory',
};

export const MATCH_TYPE_COLORS: Record<MatchType, string> = {
  exact_set: 'bg-purple-100 text-purple-800',
  best_match: 'bg-emerald-100 text-emerald-800',
  color_match: 'bg-blue-100 text-blue-800',
  style_match: 'bg-amber-100 text-amber-800',
  recommended_addon: 'bg-rose-100 text-rose-800',
  shell_cardigan: 'bg-indigo-100 text-indigo-800',
  accessory: 'bg-teal-100 text-teal-800',
};

export interface ProductMatch {
  id: string;
  productAId: string;
  productBId: string;
  matchType: MatchType;
  isBidirectional: boolean;
  sortOrder: number;
}

export interface OutfitGroup {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  season: string;
  tags: string[];
  createdAt: string;
}

export interface IPadConfig {
  id: string;
  name: string;
  locationId: string;
  isActive: boolean;
}

export type InventoryStatus = 'available' | 'low_stock' | 'out_of_stock' | 'available_elsewhere';

export function getInventoryStatus(qty: number): InventoryStatus {
  if (qty <= 0) return 'out_of_stock';
  if (qty <= 2) return 'low_stock';
  return 'available';
}

export function getInventoryStatusLabel(status: InventoryStatus): string {
  switch (status) {
    case 'available': return 'Available Now';
    case 'low_stock': return 'Low Stock';
    case 'out_of_stock': return 'Out of Stock Here';
    case 'available_elsewhere': return 'Available in Another Store';
  }
}

export function getInventoryStatusColor(status: InventoryStatus): string {
  switch (status) {
    case 'available': return 'text-emerald-600';
    case 'low_stock': return 'text-amber-600';
    case 'out_of_stock': return 'text-red-500';
    case 'available_elsewhere': return 'text-blue-500';
  }
}

export const PRODUCT_TYPES = [
  'Top', 'Blouse', 'Shell', 'Sweater', 'Cardigan', 'Jacket',
  'Skirt', 'Pants', 'Dress', 'Set', 'Scarf', 'Belt', 'Jewelry',
  'Handbag', 'Shoes', 'Accessory',
];

export const COLORS = [
  'Black', 'White', 'Navy', 'Red', 'Blush', 'Ivory', 'Charcoal',
  'Burgundy', 'Emerald', 'Camel', 'Slate', 'Coral', 'Sage',
  'Lavender', 'Champagne', 'Multi',
];

export const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'];

export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter', 'Resort', 'All Season'];
