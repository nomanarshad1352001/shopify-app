import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { KioskProductCard } from './KioskProductCard';
import {
  ArrowLeft,
  MapPin,
  Layers,
  Sparkles,
  Tag,
  Store,
  Gem,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Barcode,
} from 'lucide-react';
import {
  getInventoryStatus,
  getInventoryStatusLabel,
  getInventoryStatusColor,
  MATCH_TYPE_LABELS,
  MATCH_TYPE_COLORS,
  MatchType,
} from '../../types';

interface KioskProductDetailProps {
  productId: string;
  onBack: () => void;
}

// Define which match types go in each category
const RECOMMENDED_SETS_TYPES: MatchType[] = ['exact_set', 'best_match', 'color_match', 'style_match', 'shell_cardigan'];
const ACCESSORIES_TYPES: MatchType[] = ['accessory', 'recommended_addon'];

export function KioskProductDetail({ productId, onBack }: KioskProductDetailProps) {
  const {
    getProduct,
    getMatchesForProduct,
    getOutfitGroupsForProduct,
    getProductInventoryAtLocation,
    currentLocationId,
    locations,
    setKioskSelectedProduct,
    addToCart,
    cart,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'matches' | 'outfits'>('matches');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = getProduct(productId);
  if (!product) return null;

  const matches = getMatchesForProduct(productId);
  const outfitGroups = getOutfitGroupsForProduct(productId);
  const currentLocation = locations.find((l) => l.id === currentLocationId);
  const inventoryHere = getProductInventoryAtLocation(productId, currentLocationId);
  const totalHere = Object.values(inventoryHere).reduce((s, q) => s + q, 0);
  const status = getInventoryStatus(totalHere);

  // Get other locations
  const otherLocations = locations.filter((l) => l.id !== currentLocationId);

  // Group matches into two categories
  const recommendedSets = matches.filter((m) => RECOMMENDED_SETS_TYPES.includes(m.match.matchType));
  const accessoryMatches = matches.filter((m) => ACCESSORIES_TYPES.includes(m.match.matchType));

  // Selected variant info
  const selectedVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId)
    : null;
  const selectedVariantStock = selectedVariant
    ? selectedVariant.inventoryByLocation[currentLocationId] || 0
    : 0;

  const handleAddToCart = () => {
    if (selectedVariantId && quantity > 0) {
      addToCart(productId, selectedVariantId, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  // Check if variant is in cart
  const getCartQuantity = (variantId: string) => {
    const item = cart.find((c) => c.productId === productId && c.variantId === variantId);
    return item?.quantity || 0;
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-sm px-6 py-3 border-b border-stone-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors text-base font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to All Items
        </button>
      </div>

      <div className="px-6 py-6">
        {/* Product Hero */}
        <div className="flex gap-8 mb-8">
          {/* Image */}
          <div className="w-80 flex-shrink-0">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-lg">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 py-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                {product.productType}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-sm text-stone-500">{product.vendor}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">
              {product.title}
            </h2>
            <p className="text-stone-600 text-base leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Price */}
            <p className="text-2xl font-bold text-stone-900 mb-3">
              ${product.variants[0]?.price}
            </p>

            {/* Barcode Info */}
            <div className="flex items-center gap-2 mb-3 text-sm text-stone-500">
              <Barcode className="w-4 h-4" />
              <span className="font-mono">
                {selectedVariant?.barcode || product.variants[0]?.barcode}
              </span>
            </div>

            {/* Color */}
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-medium text-stone-600">Color: {product.color}</span>
            </div>

            {/* Size Selection with Add to Cart */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-stone-800">Select Size</span>
                <span className={`text-sm font-semibold ${getInventoryStatusColor(status)}`}>
                  {getInventoryStatusLabel(status)} in {currentLocation?.name}
                </span>
              </div>

              {/* Size Grid - Selectable */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
                {product.variants.map((v) => {
                  const qty = v.inventoryByLocation[currentLocationId] || 0;
                  const isSelected = selectedVariantId === v.id;
                  const inCart = getCartQuantity(v.id);
                  const sizeStatus = getInventoryStatus(qty);
                  const isAvailable = qty > 0;

                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedVariantId(v.id);
                          setQuantity(1);
                        }
                      }}
                      disabled={!isAvailable}
                      className={`text-center p-2.5 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-stone-900 border-stone-900 ring-2 ring-stone-900/20'
                          : sizeStatus === 'available'
                          ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
                          : sizeStatus === 'low_stock'
                          ? 'bg-amber-50 border-amber-200 hover:border-amber-400'
                          : 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                        {v.size}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          isSelected
                            ? 'text-white'
                            : sizeStatus === 'available'
                            ? 'text-emerald-600'
                            : sizeStatus === 'low_stock'
                            ? 'text-amber-600'
                            : 'text-stone-300'
                        }`}
                      >
                        {qty}
                      </p>
                      {inCart > 0 && (
                        <p className="text-[10px] text-emerald-600 font-medium">
                          {inCart} in list
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector & Add to Cart */}
              {selectedVariantId && (
                <div className="flex items-center gap-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-stone-600 mr-2">Qty:</span>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-stone-600" />
                    </button>
                    <span className="w-12 text-center text-xl font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariantStock, quantity + 1))}
                      disabled={quantity >= selectedVariantStock}
                      className="w-10 h-10 flex items-center justify-center bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4 text-stone-600" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-base font-semibold transition-all ${
                      addedToCart
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Shopping List!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Add to Shopping List
                      </>
                    )}
                  </button>
                </div>
              )}

              {!selectedVariantId && (
                <p className="text-sm text-stone-500 text-center pt-2">
                  👆 Select a size above to add to your shopping list
                </p>
              )}
            </div>

            {/* Availability in Other Stores */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-stone-800">
                  Availability in Other Stores
                </span>
              </div>

              <div className="space-y-3">
                {otherLocations.map((location) => {
                  const locInv = getProductInventoryAtLocation(productId, location.id);
                  const locTotal = Object.values(locInv).reduce((s, q) => s + q, 0);
                  const locStatus = getInventoryStatus(locTotal);

                  return (
                    <div key={location.id} className="bg-white rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-base font-semibold text-stone-800">
                            {location.name}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
                            locStatus === 'available'
                              ? 'bg-emerald-100 text-emerald-700'
                              : locStatus === 'low_stock'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {locTotal > 0 ? `${locTotal} Available` : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v) => {
                          const qty = v.inventoryByLocation[location.id] || 0;
                          return (
                            <div
                              key={v.id}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                qty > 0
                                  ? 'bg-stone-100 text-stone-700'
                                  : 'bg-stone-50 text-stone-300'
                              }`}
                            >
                              <span className="font-bold">{v.size}</span>
                              <span className={qty > 0 ? 'text-emerald-600' : 'text-stone-300'}>
                                {qty}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {locTotal > 0 && (
                        <p className="text-xs text-blue-600 mt-2">
                          Ask a staff member about store transfer
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Matches & Outfits Tabs */}
        {(matches.length > 0 || outfitGroups.length > 0) && (
          <div className="mb-8">
            {/* Tab Headers */}
            <div className="flex gap-1 bg-stone-200 rounded-xl p-1 mb-5 w-fit">
              <button
                onClick={() => setActiveTab('matches')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'matches'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Matches With ({matches.length})
              </button>
              {outfitGroups.length > 0 && (
                <button
                  onClick={() => setActiveTab('outfits')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === 'outfits'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Complete Outfits ({outfitGroups.length})
                </button>
              )}
            </div>

            {/* Matches Tab */}
            {activeTab === 'matches' && (
              <div className="space-y-8">
                {/* Recommended Sets Row */}
                {recommendedSets.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="text-base font-bold text-purple-900">
                          Recommended Sets
                        </h3>
                      </div>
                      <p className="text-sm text-stone-500">
                        Complete the look with these coordinating pieces
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {recommendedSets.map(({ product: matchedProduct, match }) => (
                        <KioskProductCard
                          key={matchedProduct.id}
                          productId={matchedProduct.id}
                          onClick={() => setKioskSelectedProduct(matchedProduct.id)}
                          compact
                          matchLabel={MATCH_TYPE_LABELS[match.matchType]}
                          matchLabelClass={MATCH_TYPE_COLORS[match.matchType]}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Style with Accessories Row */}
                {accessoryMatches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-xl">
                        <Gem className="w-5 h-5 text-teal-600" />
                        <h3 className="text-base font-bold text-teal-900">
                          Style with Accessories
                        </h3>
                      </div>
                      <p className="text-sm text-stone-500">
                        Add the finishing touches to your outfit
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {accessoryMatches.map(({ product: matchedProduct, match }) => (
                        <KioskProductCard
                          key={matchedProduct.id}
                          productId={matchedProduct.id}
                          onClick={() => setKioskSelectedProduct(matchedProduct.id)}
                          compact
                          matchLabel={MATCH_TYPE_LABELS[match.matchType]}
                          matchLabelClass={MATCH_TYPE_COLORS[match.matchType]}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {recommendedSets.length === 0 && accessoryMatches.length === 0 && (
                  <div className="text-center py-8 text-stone-400">
                    <p>No matches found for this item</p>
                  </div>
                )}
              </div>
            )}

            {/* Outfits Tab */}
            {activeTab === 'outfits' && (
              <div className="space-y-6">
                {outfitGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-stone-900">
                        {group.name}
                      </h3>
                      <p className="text-sm text-stone-500 mt-0.5">
                        {group.description}
                      </p>
                      <div className="flex gap-1.5 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                          {group.season}
                        </span>
                        {group.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {group.productIds.map((pid) => (
                        <KioskProductCard
                          key={pid}
                          productId={pid}
                          onClick={() => setKioskSelectedProduct(pid)}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
