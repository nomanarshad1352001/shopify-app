import { Product, ProductMatch, OutfitGroup, StoreLocation, IPadConfig } from '../types';

export const LOCATIONS: StoreLocation[] = [
  { id: 'loc-1', name: 'Lawrence', address: '123 Main St, Lawrence, KS 66044', isActive: true },
  { id: 'loc-2', name: 'Pomona', address: '456 Valley Blvd, Pomona, CA 91766', isActive: true },
  { id: 'loc-3', name: 'Jackson', address: '789 Capitol St, Jackson, MS 39201', isActive: true },
];

export const IPAD_CONFIGS: IPadConfig[] = [
  { id: 'ipad-1', name: 'Lawrence Front', locationId: 'loc-1', isActive: true },
  { id: 'ipad-2', name: 'Lawrence Back', locationId: 'loc-1', isActive: true },
  { id: 'ipad-3', name: 'Pomona Floor', locationId: 'loc-2', isActive: true },
  { id: 'ipad-4', name: 'Jackson Main', locationId: 'loc-3', isActive: true },
];

// Generate realistic product data
function makeVariants(
  productId: string,
  color: string,
  price: number,
  sizes: string[],
  skuBase: string,
  inventoryPattern: number[][]
): Product['variants'] {
  return sizes.map((size, i) => ({
    id: `${productId}-v${i}`,
    productId,
    sku: `${skuBase}-${size}`,
    barcode: `8800${productId.replace('p-', '')}${String(i).padStart(2, '0')}`,
    size,
    color,
    price,
    inventoryByLocation: {
      'loc-1': inventoryPattern[0]?.[i] ?? 0,
      'loc-2': inventoryPattern[1]?.[i] ?? 0,
      'loc-3': inventoryPattern[2]?.[i] ?? 0,
    },
  }));
}

// Product image map — AI-generated product photography
// Products with dedicated generated images get their own file;
// remaining products share the closest visual match.
const PRODUCT_IMAGES: Record<string, string> = {
  'p-1':  '/images/p1-silk-blouse.jpg',      // Silk Pleated Blouse — Ivory
  'p-2':  '/images/p2-peplum-top.jpg',        // Structured Peplum Top — Black
  'p-3':  '/images/p19-leather-tote.jpg',     // Cashmere Crewneck — Camel (shares warm tone w/ tote)
  'p-4':  '/images/p9-cocktail-dress.jpg',    // Draped Wrap Blouse — Burgundy (shares red family)
  'p-5':  '/images/p2-peplum-top.jpg',        // Ribbed Turtleneck — Black
  'p-6':  '/images/p6-pleated-skirt.jpg',     // Black Pleated Midi Skirt
  'p-7':  '/images/p6-pleated-skirt.jpg',     // Pencil Skirt — Navy (similar dark skirt)
  'p-8':  '/images/p13-tweed-jacket.jpg',     // A-Line Tweed Skirt — Champagne (tweed family)
  'p-9':  '/images/p9-cocktail-dress.jpg',    // Fit & Flare Cocktail Dress — Red
  'p-10': '/images/p10-shirt-dress.jpg',      // Shirt Dress with Belt — White
  'p-11': '/images/p11-silk-shell.jpg',       // Silk Camisole Shell — Blush
  'p-12': '/images/p2-peplum-top.jpg',        // Longline Cardigan — Charcoal (dark knit)
  'p-13': '/images/p13-tweed-jacket.jpg',     // Cropped Tweed Jacket — Champagne
  'p-14': '/images/p6-pleated-skirt.jpg',     // Wide-Leg Trousers — Navy
  'p-15': '/images/p6-pleated-skirt.jpg',     // Slim Ankle Pants — Black
  'p-16': '/images/p11-silk-shell.jpg',       // Silk Scarf — Coral (light fabric)
  'p-17': '/images/p19-leather-tote.jpg',     // Leather Statement Belt — Black (leather family)
  'p-18': '/images/p1-silk-blouse.jpg',       // Pearl Drop Earrings — Ivory (light accessory)
  'p-19': '/images/p19-leather-tote.jpg',     // Structured Leather Tote — Camel
  'p-20': '/images/p20-wrap-dress.jpg',       // Emerald Wrap Dress
  'p-21': '/images/p13-tweed-jacket.jpg',     // Navy Blazer (structured jacket family)
  'p-22': '/images/p11-silk-shell.jpg',       // Lavender Silk Cami (silk cami family)
  'p-23': '/images/p10-shirt-dress.jpg',      // Sage Linen Pants (light casual)
  'p-24': '/images/p1-silk-blouse.jpg',       // Gold Chain Necklace (light/ivory accessory)
};

function productImage(productId: string): string {
  return PRODUCT_IMAGES[productId] || '/images/p1-silk-blouse.jpg';
}

export const PRODUCTS: Product[] = [
  // === TOPS ===
  {
    id: 'p-1',
    title: 'Silk Pleated Blouse',
    description: 'Elegant silk blouse with delicate pleating detail. Perfect for office to evening.',
    productType: 'Blouse',
    vendor: 'Atelier Collection',
    tags: ['new-arrival', 'silk', 'workwear', 'evening'],
    collections: ['Spring 2025', 'Office Essentials', 'New Arrivals'],
    images: [productImage('p-1')],
    color: 'Ivory',
    season: 'Spring',
    variants: makeVariants('p-1', 'Ivory', 128, ['XS', 'S', 'M', 'L', 'XL'], 'SLK-BLS-IVR', [
      [1, 3, 4, 2, 1],
      [0, 2, 3, 1, 0],
      [1, 1, 2, 2, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-15',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-2',
    title: 'Structured Peplum Top',
    description: 'Modern peplum silhouette with architectural lines. Fully lined.',
    productType: 'Top',
    vendor: 'Atelier Collection',
    tags: ['structured', 'workwear', 'statement'],
    collections: ['Spring 2025', 'Office Essentials'],
    images: [productImage('p-2')],
    color: 'Black',
    season: 'All Season',
    variants: makeVariants('p-2', 'Black', 98, ['XS', 'S', 'M', 'L', 'XL'], 'PEP-TOP-BLK', [
      [2, 4, 5, 3, 2],
      [1, 3, 4, 2, 1],
      [0, 2, 3, 1, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-10',
    updatedAt: '2025-03-05',
  },
  {
    id: 'p-3',
    title: 'Cashmere Crewneck Sweater',
    description: 'Ultra-soft cashmere crewneck in a relaxed fit. Timeless layering piece.',
    productType: 'Sweater',
    vendor: 'Luxe Knits',
    tags: ['cashmere', 'basics', 'layering'],
    collections: ['Fall 2025', 'Cashmere Collection'],
    images: [productImage('p-3')],
    color: 'Camel',
    season: 'Fall',
    variants: makeVariants('p-3', 'Camel', 245, ['XS', 'S', 'M', 'L'], 'CSH-CRW-CML', [
      [1, 2, 3, 1],
      [0, 1, 2, 1],
      [1, 2, 1, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-01',
    updatedAt: '2025-03-10',
  },
  {
    id: 'p-4',
    title: 'Draped Wrap Blouse',
    description: 'Flattering wrap silhouette with adjustable tie. Flows beautifully.',
    productType: 'Blouse',
    vendor: 'Atelier Collection',
    tags: ['wrap', 'date-night', 'flattering'],
    collections: ['Spring 2025', 'Date Night'],
    images: [productImage('p-4')],
    color: 'Burgundy',
    season: 'All Season',
    variants: makeVariants('p-4', 'Burgundy', 118, ['XS', 'S', 'M', 'L', 'XL'], 'DRP-WRP-BRG', [
      [0, 2, 3, 2, 1],
      [1, 1, 2, 1, 0],
      [0, 1, 1, 0, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-20',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-5',
    title: 'Ribbed Turtleneck',
    description: 'Fine-gauge ribbed turtleneck. Slim fit, perfect under blazers.',
    productType: 'Top',
    vendor: 'Luxe Knits',
    tags: ['basics', 'layering', 'winter'],
    collections: ['Fall 2025', 'Basics'],
    images: [productImage('p-5')],
    color: 'Black',
    season: 'Fall',
    variants: makeVariants('p-5', 'Black', 78, ['XS', 'S', 'M', 'L', 'XL'], 'RIB-TRT-BLK', [
      [3, 5, 6, 4, 2],
      [2, 4, 5, 3, 1],
      [1, 3, 4, 2, 1],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-05',
    updatedAt: '2025-03-01',
  },
  // === SKIRTS ===
  {
    id: 'p-6',
    title: 'Black Pleated Midi Skirt',
    description: 'Classic pleated midi skirt. Moves elegantly, sits at the waist.',
    productType: 'Skirt',
    vendor: 'Atelier Collection',
    tags: ['pleated', 'midi', 'classic', 'workwear'],
    collections: ['Spring 2025', 'Office Essentials'],
    images: [productImage('p-6')],
    color: 'Black',
    season: 'All Season',
    variants: makeVariants('p-6', 'Black', 145, ['XS', 'S', 'M', 'L', 'XL'], 'PLT-SKT-BLK', [
      [2, 4, 1, 0, 1],
      [1, 2, 3, 1, 0],
      [0, 1, 2, 1, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-12',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-7',
    title: 'Pencil Skirt',
    description: 'Tailored pencil skirt with back slit. Fully lined.',
    productType: 'Skirt',
    vendor: 'Atelier Collection',
    tags: ['pencil', 'tailored', 'workwear'],
    collections: ['Spring 2025', 'Office Essentials'],
    images: [productImage('p-7')],
    color: 'Navy',
    season: 'All Season',
    variants: makeVariants('p-7', 'Navy', 135, ['XS', 'S', 'M', 'L'], 'PEN-SKT-NVY', [
      [1, 3, 2, 1],
      [0, 2, 3, 2],
      [1, 1, 2, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-18',
    updatedAt: '2025-03-05',
  },
  {
    id: 'p-8',
    title: 'A-Line Tweed Skirt',
    description: 'Structured A-line skirt in luxe tweed fabric. French-inspired.',
    productType: 'Skirt',
    vendor: 'Parisian Edit',
    tags: ['tweed', 'a-line', 'french', 'statement'],
    collections: ['Fall 2025', 'French Collection'],
    images: [productImage('p-8')],
    color: 'Champagne',
    season: 'Fall',
    variants: makeVariants('p-8', 'Champagne', 168, ['XS', 'S', 'M', 'L'], 'TWD-SKT-CHP', [
      [0, 1, 2, 1],
      [1, 2, 1, 0],
      [0, 0, 1, 1],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-05',
    updatedAt: '2025-03-10',
  },
  // === DRESSES ===
  {
    id: 'p-9',
    title: 'Fit & Flare Cocktail Dress',
    description: 'Stunning fit & flare silhouette for special occasions. Back zip closure.',
    productType: 'Dress',
    vendor: 'Atelier Collection',
    tags: ['cocktail', 'special-occasion', 'fit-flare'],
    collections: ['Spring 2025', 'Date Night', 'Special Occasion'],
    images: [productImage('p-9')],
    color: 'Red',
    season: 'Spring',
    variants: makeVariants('p-9', 'Red', 285, ['XS', 'S', 'M', 'L'], 'FNF-DRS-RED', [
      [1, 2, 2, 1],
      [0, 1, 1, 0],
      [0, 0, 1, 1],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-10',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-10',
    title: 'Shirt Dress with Belt',
    description: 'Relaxed shirt dress with removable belt. Cotton-silk blend.',
    productType: 'Dress',
    vendor: 'Atelier Collection',
    tags: ['shirt-dress', 'casual-chic', 'versatile'],
    collections: ['Spring 2025', 'Weekend'],
    images: [productImage('p-10')],
    color: 'White',
    season: 'Spring',
    variants: makeVariants('p-10', 'White', 195, ['XS', 'S', 'M', 'L', 'XL'], 'SHT-DRS-WHT', [
      [1, 2, 3, 2, 0],
      [0, 1, 2, 1, 1],
      [1, 1, 1, 0, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-15',
    updatedAt: '2025-03-01',
  },
  // === SHELLS & CARDIGANS ===
  {
    id: 'p-11',
    title: 'Silk Camisole Shell',
    description: 'Delicate silk camisole with adjustable straps. Layer under blazers or cardigans.',
    productType: 'Shell',
    vendor: 'Atelier Collection',
    tags: ['shell', 'layering', 'silk', 'basics'],
    collections: ['Spring 2025', 'Basics', 'Layering Essentials'],
    images: [productImage('p-11')],
    color: 'Blush',
    season: 'All Season',
    variants: makeVariants('p-11', 'Blush', 88, ['XS', 'S', 'M', 'L'], 'SLK-SHL-BLS', [
      [2, 4, 5, 3],
      [1, 3, 4, 2],
      [1, 2, 3, 1],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-08',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-12',
    title: 'Longline Cardigan',
    description: 'Luxurious longline cardigan in soft merino wool. Open front design.',
    productType: 'Cardigan',
    vendor: 'Luxe Knits',
    tags: ['cardigan', 'longline', 'layering', 'merino'],
    collections: ['Fall 2025', 'Layering Essentials'],
    images: [productImage('p-12')],
    color: 'Charcoal',
    season: 'Fall',
    variants: makeVariants('p-12', 'Charcoal', 198, ['S', 'M', 'L', 'XL'], 'LNG-CRD-CHR', [
      [1, 3, 2, 1],
      [0, 2, 2, 1],
      [1, 1, 1, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-01',
    updatedAt: '2025-03-05',
  },
  {
    id: 'p-13',
    title: 'Cropped Tweed Jacket',
    description: 'Structured cropped jacket in signature tweed. Gold-tone buttons.',
    productType: 'Jacket',
    vendor: 'Parisian Edit',
    tags: ['tweed', 'cropped', 'jacket', 'french', 'statement'],
    collections: ['Fall 2025', 'French Collection'],
    images: [productImage('p-13')],
    color: 'Champagne',
    season: 'Fall',
    variants: makeVariants('p-13', 'Champagne', 325, ['XS', 'S', 'M', 'L'], 'CRP-JKT-CHP', [
      [0, 1, 2, 1],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-05',
    updatedAt: '2025-03-10',
  },
  // === PANTS ===
  {
    id: 'p-14',
    title: 'Wide-Leg Trousers',
    description: 'High-waisted wide-leg trousers with front pleats. Elegant drape.',
    productType: 'Pants',
    vendor: 'Atelier Collection',
    tags: ['wide-leg', 'trousers', 'workwear', 'high-waist'],
    collections: ['Spring 2025', 'Office Essentials'],
    images: [productImage('p-14')],
    color: 'Navy',
    season: 'All Season',
    variants: makeVariants('p-14', 'Navy', 165, ['XS', 'S', 'M', 'L', 'XL'], 'WDL-TRS-NVY', [
      [1, 3, 4, 2, 1],
      [0, 2, 3, 2, 0],
      [1, 1, 2, 1, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-22',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-15',
    title: 'Slim Ankle Pants',
    description: 'Modern slim ankle pants with stretch. Zipper closure.',
    productType: 'Pants',
    vendor: 'Atelier Collection',
    tags: ['slim', 'ankle', 'workwear', 'stretch'],
    collections: ['Spring 2025', 'Office Essentials', 'Basics'],
    images: [productImage('p-15')],
    color: 'Black',
    season: 'All Season',
    variants: makeVariants('p-15', 'Black', 125, ['XS', 'S', 'M', 'L', 'XL'], 'SLM-ANK-BLK', [
      [2, 5, 6, 4, 2],
      [1, 3, 5, 3, 1],
      [1, 2, 3, 2, 1],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-05',
    updatedAt: '2025-03-01',
  },
  // === ACCESSORIES ===
  {
    id: 'p-16',
    title: 'Silk Scarf — Abstract Print',
    description: 'Hand-finished silk scarf with exclusive abstract print.',
    productType: 'Scarf',
    vendor: 'Atelier Collection',
    tags: ['scarf', 'silk', 'accessory', 'print'],
    collections: ['Accessories', 'Spring 2025'],
    images: [productImage('p-16')],
    color: 'Coral',
    season: 'Spring',
    variants: makeVariants('p-16', 'Coral', 85, ['OS'], 'SLK-SCF-CRL', [
      [5],
      [3],
      [2],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-20',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-17',
    title: 'Leather Statement Belt',
    description: 'Italian leather belt with brushed gold buckle. 1.5 inch width.',
    productType: 'Belt',
    vendor: 'Accessory Studio',
    tags: ['belt', 'leather', 'gold', 'statement'],
    collections: ['Accessories'],
    images: [productImage('p-17')],
    color: 'Black',
    season: 'All Season',
    variants: makeVariants('p-17', 'Black', 68, ['S', 'M', 'L'], 'LTH-BLT-BLK', [
      [3, 4, 2],
      [2, 3, 1],
      [1, 2, 1],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-15',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-18',
    title: 'Pearl Drop Earrings',
    description: 'Freshwater pearl drop earrings with gold-plated findings.',
    productType: 'Jewelry',
    vendor: 'Accessory Studio',
    tags: ['jewelry', 'earrings', 'pearl', 'classic'],
    collections: ['Accessories', 'Jewelry'],
    images: [productImage('p-18')],
    color: 'Ivory',
    season: 'All Season',
    variants: makeVariants('p-18', 'Ivory', 58, ['OS'], 'PRL-EAR-IVR', [
      [8],
      [6],
      [4],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-10',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-19',
    title: 'Structured Leather Tote',
    description: 'Spacious structured tote in pebbled leather. Interior zip pocket.',
    productType: 'Handbag',
    vendor: 'Accessory Studio',
    tags: ['handbag', 'tote', 'leather', 'workwear'],
    collections: ['Accessories', 'Office Essentials'],
    images: [productImage('p-19')],
    color: 'Camel',
    season: 'All Season',
    variants: makeVariants('p-19', 'Camel', 248, ['OS'], 'STR-TOT-CML', [
      [3],
      [2],
      [1],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-01',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-20',
    title: 'Emerald Wrap Dress',
    description: 'Stunning wrap dress in rich emerald. Jersey fabric with stretch.',
    productType: 'Dress',
    vendor: 'Atelier Collection',
    tags: ['wrap', 'evening', 'statement'],
    collections: ['Spring 2025', 'Date Night'],
    images: [productImage('p-20')],
    color: 'Emerald',
    season: 'Spring',
    variants: makeVariants('p-20', 'Emerald', 225, ['XS', 'S', 'M', 'L'], 'WRP-DRS-EMR', [
      [1, 2, 2, 1],
      [0, 1, 2, 0],
      [0, 1, 1, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-25',
    updatedAt: '2025-03-10',
  },
  {
    id: 'p-21',
    title: 'Navy Blazer',
    description: 'Classic single-breasted blazer in navy. Gold-tone buttons.',
    productType: 'Jacket',
    vendor: 'Atelier Collection',
    tags: ['blazer', 'workwear', 'classic', 'layering'],
    collections: ['Spring 2025', 'Office Essentials'],
    images: [productImage('p-21')],
    color: 'Navy',
    season: 'All Season',
    variants: makeVariants('p-21', 'Navy', 275, ['XS', 'S', 'M', 'L', 'XL'], 'NVY-BLZ-NVY', [
      [1, 2, 3, 2, 1],
      [0, 1, 2, 1, 0],
      [1, 1, 1, 1, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-20',
    updatedAt: '2025-03-05',
  },
  {
    id: 'p-22',
    title: 'Lavender Silk Cami',
    description: 'Delicate silk camisole in soft lavender. Lace trim detail.',
    productType: 'Shell',
    vendor: 'Atelier Collection',
    tags: ['cami', 'silk', 'layering', 'romantic'],
    collections: ['Spring 2025', 'Layering Essentials'],
    images: [productImage('p-22')],
    color: 'Lavender',
    season: 'Spring',
    variants: makeVariants('p-22', 'Lavender', 95, ['XS', 'S', 'M', 'L'], 'SLK-CMI-LAV', [
      [1, 3, 4, 2],
      [0, 2, 3, 1],
      [1, 1, 2, 1],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-10',
    updatedAt: '2025-03-01',
  },
  {
    id: 'p-23',
    title: 'Sage Linen Pants',
    description: 'Relaxed linen pants in sage green. Elastic waist, side pockets.',
    productType: 'Pants',
    vendor: 'Weekend Edit',
    tags: ['linen', 'relaxed', 'casual', 'weekend'],
    collections: ['Spring 2025', 'Weekend'],
    images: [productImage('p-23')],
    color: 'Sage',
    season: 'Spring',
    variants: makeVariants('p-23', 'Sage', 115, ['XS', 'S', 'M', 'L', 'XL'], 'LNN-PNT-SGE', [
      [1, 2, 3, 2, 1],
      [0, 1, 2, 1, 0],
      [0, 1, 1, 0, 0],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-02-28',
    updatedAt: '2025-03-10',
  },
  {
    id: 'p-24',
    title: 'Gold Chain Necklace',
    description: '18k gold-plated layering chain. 18 inch length.',
    productType: 'Jewelry',
    vendor: 'Accessory Studio',
    tags: ['jewelry', 'necklace', 'gold', 'layering'],
    collections: ['Accessories', 'Jewelry'],
    images: [productImage('p-24')],
    color: 'Champagne',
    season: 'All Season',
    variants: makeVariants('p-24', 'Champagne', 45, ['OS'], 'GLD-CHN-GLD', [
      [10],
      [8],
      [6],
    ]),
    isHiddenFromKiosk: false,
    createdAt: '2025-01-05',
    updatedAt: '2025-03-01',
  },
];

// === MATCHING RELATIONSHIPS ===
export const PRODUCT_MATCHES: ProductMatch[] = [
  // Silk Pleated Blouse matches
  { id: 'm-1', productAId: 'p-1', productBId: 'p-6', matchType: 'best_match', isBidirectional: true, sortOrder: 1 },
  { id: 'm-2', productAId: 'p-1', productBId: 'p-7', matchType: 'best_match', isBidirectional: true, sortOrder: 2 },
  { id: 'm-3', productAId: 'p-1', productBId: 'p-14', matchType: 'style_match', isBidirectional: true, sortOrder: 3 },
  { id: 'm-4', productAId: 'p-1', productBId: 'p-15', matchType: 'style_match', isBidirectional: true, sortOrder: 4 },
  { id: 'm-5', productAId: 'p-1', productBId: 'p-18', matchType: 'accessory', isBidirectional: true, sortOrder: 5 },
  { id: 'm-6', productAId: 'p-1', productBId: 'p-19', matchType: 'accessory', isBidirectional: true, sortOrder: 6 },

  // Peplum Top matches
  { id: 'm-7', productAId: 'p-2', productBId: 'p-6', matchType: 'exact_set', isBidirectional: true, sortOrder: 1 },
  { id: 'm-8', productAId: 'p-2', productBId: 'p-7', matchType: 'best_match', isBidirectional: true, sortOrder: 2 },
  { id: 'm-9', productAId: 'p-2', productBId: 'p-15', matchType: 'best_match', isBidirectional: true, sortOrder: 3 },
  { id: 'm-10', productAId: 'p-2', productBId: 'p-17', matchType: 'accessory', isBidirectional: true, sortOrder: 4 },
  { id: 'm-11', productAId: 'p-2', productBId: 'p-24', matchType: 'accessory', isBidirectional: true, sortOrder: 5 },

  // Cashmere Sweater matches
  { id: 'm-12', productAId: 'p-3', productBId: 'p-6', matchType: 'color_match', isBidirectional: true, sortOrder: 1 },
  { id: 'm-13', productAId: 'p-3', productBId: 'p-8', matchType: 'best_match', isBidirectional: true, sortOrder: 2 },
  { id: 'm-14', productAId: 'p-3', productBId: 'p-15', matchType: 'style_match', isBidirectional: true, sortOrder: 3 },
  { id: 'm-15', productAId: 'p-3', productBId: 'p-19', matchType: 'accessory', isBidirectional: true, sortOrder: 4 },

  // Wrap Blouse matches
  { id: 'm-16', productAId: 'p-4', productBId: 'p-6', matchType: 'best_match', isBidirectional: true, sortOrder: 1 },
  { id: 'm-17', productAId: 'p-4', productBId: 'p-7', matchType: 'style_match', isBidirectional: true, sortOrder: 2 },
  { id: 'm-18', productAId: 'p-4', productBId: 'p-15', matchType: 'best_match', isBidirectional: true, sortOrder: 3 },
  { id: 'm-19', productAId: 'p-4', productBId: 'p-18', matchType: 'accessory', isBidirectional: true, sortOrder: 4 },

  // Turtleneck matches
  { id: 'm-20', productAId: 'p-5', productBId: 'p-6', matchType: 'best_match', isBidirectional: true, sortOrder: 1 },
  { id: 'm-21', productAId: 'p-5', productBId: 'p-8', matchType: 'style_match', isBidirectional: true, sortOrder: 2 },
  { id: 'm-22', productAId: 'p-5', productBId: 'p-12', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 3 },
  { id: 'm-23', productAId: 'p-5', productBId: 'p-14', matchType: 'best_match', isBidirectional: true, sortOrder: 4 },

  // Dresses with cardigans/shells
  { id: 'm-24', productAId: 'p-9', productBId: 'p-11', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 1 },
  { id: 'm-25', productAId: 'p-9', productBId: 'p-17', matchType: 'accessory', isBidirectional: true, sortOrder: 2 },
  { id: 'm-26', productAId: 'p-9', productBId: 'p-18', matchType: 'accessory', isBidirectional: true, sortOrder: 3 },
  { id: 'm-27', productAId: 'p-9', productBId: 'p-24', matchType: 'accessory', isBidirectional: true, sortOrder: 4 },

  { id: 'm-28', productAId: 'p-10', productBId: 'p-17', matchType: 'accessory', isBidirectional: true, sortOrder: 1 },
  { id: 'm-29', productAId: 'p-10', productBId: 'p-16', matchType: 'accessory', isBidirectional: true, sortOrder: 2 },
  { id: 'm-30', productAId: 'p-10', productBId: 'p-19', matchType: 'accessory', isBidirectional: true, sortOrder: 3 },

  // Tweed set
  { id: 'm-31', productAId: 'p-8', productBId: 'p-13', matchType: 'exact_set', isBidirectional: true, sortOrder: 1 },
  { id: 'm-32', productAId: 'p-8', productBId: 'p-11', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 2 },
  { id: 'm-33', productAId: 'p-8', productBId: 'p-22', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 3 },

  { id: 'm-34', productAId: 'p-13', productBId: 'p-11', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 1 },
  { id: 'm-35', productAId: 'p-13', productBId: 'p-22', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 2 },
  { id: 'm-36', productAId: 'p-13', productBId: 'p-7', matchType: 'style_match', isBidirectional: true, sortOrder: 3 },

  // Emerald wrap dress
  { id: 'm-37', productAId: 'p-20', productBId: 'p-12', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 1 },
  { id: 'm-38', productAId: 'p-20', productBId: 'p-24', matchType: 'accessory', isBidirectional: true, sortOrder: 2 },
  { id: 'm-39', productAId: 'p-20', productBId: 'p-19', matchType: 'accessory', isBidirectional: true, sortOrder: 3 },

  // Blazer matches
  { id: 'm-40', productAId: 'p-21', productBId: 'p-7', matchType: 'exact_set', isBidirectional: true, sortOrder: 1 },
  { id: 'm-41', productAId: 'p-21', productBId: 'p-11', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 2 },
  { id: 'm-42', productAId: 'p-21', productBId: 'p-22', matchType: 'shell_cardigan', isBidirectional: true, sortOrder: 3 },
  { id: 'm-43', productAId: 'p-21', productBId: 'p-14', matchType: 'best_match', isBidirectional: true, sortOrder: 4 },
  { id: 'm-44', productAId: 'p-21', productBId: 'p-15', matchType: 'best_match', isBidirectional: true, sortOrder: 5 },

  // Lavender cami matches
  { id: 'm-45', productAId: 'p-22', productBId: 'p-23', matchType: 'color_match', isBidirectional: true, sortOrder: 1 },
  { id: 'm-46', productAId: 'p-22', productBId: 'p-14', matchType: 'style_match', isBidirectional: true, sortOrder: 2 },
];

// === OUTFIT GROUPS ===
export const OUTFIT_GROUPS: OutfitGroup[] = [
  {
    id: 'og-1',
    name: 'Classic Office Look',
    description: 'Timeless workwear ensemble perfect for meetings and presentations.',
    productIds: ['p-1', 'p-7', 'p-21', 'p-19'],
    season: 'All Season',
    tags: ['workwear', 'classic'],
    createdAt: '2025-03-01',
  },
  {
    id: 'og-2',
    name: 'French Tweed Set',
    description: 'Parisian-inspired matching tweed jacket and skirt with silk shell.',
    productIds: ['p-13', 'p-8', 'p-11', 'p-18'],
    season: 'Fall',
    tags: ['french', 'set', 'statement'],
    createdAt: '2025-03-05',
  },
  {
    id: 'og-3',
    name: 'Date Night Red',
    description: 'Head-turning red cocktail dress with elegant accessories.',
    productIds: ['p-9', 'p-17', 'p-18', 'p-24'],
    season: 'Spring',
    tags: ['date-night', 'evening'],
    createdAt: '2025-03-08',
  },
  {
    id: 'og-4',
    name: 'Smart Casual Friday',
    description: 'Relaxed but polished look for casual Fridays.',
    productIds: ['p-3', 'p-15', 'p-19', 'p-16'],
    season: 'Fall',
    tags: ['casual', 'workwear', 'friday'],
    createdAt: '2025-03-10',
  },
  {
    id: 'og-5',
    name: 'Spring Lavender',
    description: 'Fresh spring look with soft lavender tones.',
    productIds: ['p-22', 'p-23', 'p-21', 'p-24'],
    season: 'Spring',
    tags: ['spring', 'color-story'],
    createdAt: '2025-03-12',
  },
];
