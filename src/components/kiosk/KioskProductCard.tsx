import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { getInventoryStatus, getInventoryStatusLabel, getInventoryStatusColor } from '../../types';
import { Package, Plus, Check, ShoppingBag } from 'lucide-react';

interface KioskProductCardProps {
  productId: string;
  onClick: () => void;
  compact?: boolean;
  matchLabel?: string;
  matchLabelClass?: string;
}

export function KioskProductCard({
  productId,
  onClick,
  compact = false,
  matchLabel,
  matchLabelClass,
}: KioskProductCardProps) {
  const { getProduct, getTotalInventoryAtLocation, currentLocationId, getMatchesForProduct, addToCart, cart } = useStore();
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const product = getProduct(productId);
  if (!product) return null;

  const totalQty = getTotalInventoryAtLocation(productId, currentLocationId);
  const status = getInventoryStatus(totalQty);
  const statusLabel = getInventoryStatusLabel(status);
  const statusColor = getInventoryStatusColor(status);
  const matchCount = getMatchesForProduct(productId).length;

  // Check if any variant is in cart
  const inCartCount = cart.reduce((acc, item) => {
    if (item.productId === productId) {
      return acc + item.quantity;
    }
    return acc;
  }, 0);

  const handleQuickAdd = (e: React.MouseEvent, variantId: string, size: string) => {
    e.stopPropagation();
    addToCart(productId, variantId, 1);
    setAddedSize(size);
    setTimeout(() => {
      setAddedSize(null);
      setShowSizeSelector(false);
    }, 1000);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSizeSelector(!showSizeSelector);
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={onClick}
          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all text-left w-full group"
        >
          <div className="w-16 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 relative">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {inCartCount > 0 && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{inCartCount}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-800 truncate group-hover:text-stone-900">
              {product.title}
            </p>
            <p className="text-xs text-stone-500">
              {product.color} • {product.productType}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium ${statusColor}`}>
                {statusLabel}
              </span>
              {matchLabel && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${matchLabelClass}`}>
                  {matchLabel}
                </span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-stone-800">
              ${product.variants[0]?.price}
            </p>
          </div>
        </button>

        {/* Quick Add Button for Compact */}
        {totalQty > 0 && (
          <button
            onClick={handleAddClick}
            className="absolute -right-2 -bottom-2 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-stone-800 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {/* Size Selector Popup */}
        {showSizeSelector && (
          <div 
            className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-stone-200 p-3 z-20 min-w-[200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold text-stone-500 mb-2">Quick Add - Select Size</p>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v) => {
                const qty = v.inventoryByLocation[currentLocationId] || 0;
                const isAdded = addedSize === v.size;
                return (
                  <button
                    key={v.id}
                    onClick={(e) => qty > 0 && handleQuickAdd(e, v.id, v.size)}
                    disabled={qty === 0}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isAdded
                        ? 'bg-emerald-500 text-white'
                        : qty > 0
                        ? 'bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white'
                        : 'bg-stone-50 text-stone-300 cursor-not-allowed'
                    }`}
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-stone-300 transition-all text-left w-full"
      >
        {/* Image */}
        <div className="aspect-[3/4] bg-stone-100 relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                status === 'available'
                  ? 'bg-emerald-500/90 text-white'
                  : status === 'low_stock'
                  ? 'bg-amber-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }`}
            >
              {statusLabel}
            </span>
          </div>
          {/* Cart Badge */}
          {inCartCount > 0 && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
                <ShoppingBag className="w-3 h-3" />
                {inCartCount} in list
              </span>
            </div>
          )}
          {/* Match Count Badge */}
          {matchCount > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 flex items-center gap-1">
                <Package className="w-3 h-3" />
                {matchCount} match{matchCount !== 1 ? 'es' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {product.productType} • {product.color}
          </p>
          <h3 className="text-base font-semibold text-stone-800 mt-1 leading-tight">
            {product.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-lg font-bold text-stone-900">
              ${product.variants[0]?.price}
            </p>
            <p className="text-xs text-stone-400">
              {totalQty} in store
            </p>
          </div>
          {/* Size dots */}
          <div className="flex gap-1 mt-2">
            {product.variants.map((v) => {
              const qty = v.inventoryByLocation[currentLocationId] || 0;
              return (
                <span
                  key={v.id}
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    qty > 0
                      ? 'bg-stone-100 text-stone-600'
                      : 'bg-stone-50 text-stone-300 line-through'
                  }`}
                >
                  {v.size}
                </span>
              );
            })}
          </div>
        </div>
      </button>

      {/* Add to Cart Button - Shows on hover */}
      {totalQty > 0 && (
        <div className="absolute bottom-[140px] left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddClick}
            className="w-full py-2.5 bg-stone-900/95 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-stone-800 backdrop-blur-sm shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add to List
          </button>
        </div>
      )}

      {/* Size Selector Popup */}
      {showSizeSelector && (
        <div 
          className="absolute left-3 right-3 bottom-[180px] bg-white rounded-xl shadow-2xl border border-stone-200 p-4 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-stone-800">Select Size</p>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSizeSelector(false); }}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.variants.map((v) => {
              const qty = v.inventoryByLocation[currentLocationId] || 0;
              const isAdded = addedSize === v.size;
              return (
                <button
                  key={v.id}
                  onClick={(e) => qty > 0 && handleQuickAdd(e, v.id, v.size)}
                  disabled={qty === 0}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    isAdded
                      ? 'bg-emerald-500 text-white'
                      : qty > 0
                      ? 'bg-stone-100 text-stone-700 hover:bg-stone-900 hover:text-white'
                      : 'bg-stone-50 text-stone-300 cursor-not-allowed'
                  }`}
                >
                  {isAdded ? <Check className="w-4 h-4 mx-auto" /> : v.size}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-stone-400 text-center mt-2">
            Tap size to add 1 item to your list
          </p>
        </div>
      )}
    </div>
  );
}
