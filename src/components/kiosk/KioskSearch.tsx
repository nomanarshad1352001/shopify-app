import { Search, X, SlidersHorizontal } from 'lucide-react';
import { PRODUCT_TYPES, COLORS } from '../../types';
import { useState } from 'react';

interface KioskSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  filterCategory: string;
  onCategoryChange: (c: string) => void;
  filterColor: string;
  onColorChange: (c: string) => void;
  filterAvailableOnly: boolean;
  onAvailableOnlyChange: (v: boolean) => void;
}

export function KioskSearch({
  query,
  onQueryChange,
  filterCategory,
  onCategoryChange,
  filterColor,
  onColorChange,
  filterAvailableOnly,
  onAvailableOnlyChange,
}: KioskSearchProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filterCategory || filterColor || filterAvailableOnly;

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by style name, SKU, barcode, color, or category..."
            className="w-full pl-12 pr-10 py-4 bg-white border border-stone-200 rounded-xl text-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-stone-200 text-stone-500 hover:bg-stone-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-5 py-4 rounded-xl border transition-all flex items-center gap-2 text-base font-medium ${
            showFilters || hasActiveFilters
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 flex items-center justify-center bg-white text-stone-900 rounded-full text-xs font-bold">
              {[filterCategory, filterColor, filterAvailableOnly].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Row */}
      {showFilters && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
              >
                <option value="">All Categories</option>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Filter */}
            <div className="flex-1 min-w-48">
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Color
              </label>
              <select
                value={filterColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
              >
                <option value="">All Colors</option>
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Only */}
            <div className="flex items-end pb-0.5">
              <button
                onClick={() => onAvailableOnlyChange(!filterAvailableOnly)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  filterAvailableOnly
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                {filterAvailableOnly ? '✓ ' : ''}In Stock Only
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                onCategoryChange('');
                onColorChange('');
                onAvailableOnlyChange(false);
              }}
              className="text-xs text-stone-500 underline hover:text-stone-700"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Quick Category Pills */}
      {!showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['All', 'Top', 'Blouse', 'Skirt', 'Dress', 'Pants', 'Shell', 'Cardigan', 'Jacket', 'Accessory'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  (cat === 'All' && !filterCategory) || filterCategory === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
              >
                {cat === 'Accessory' ? 'Accessories' : cat === 'All' ? 'All Items' : `${cat}s`}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
