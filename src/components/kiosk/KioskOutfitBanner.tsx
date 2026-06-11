import { useStore } from '../../store/useStore';
import { Sparkles, ChevronRight } from 'lucide-react';

interface KioskOutfitBannerProps {
  onProductSelect: (productId: string) => void;
}

export function KioskOutfitBanner({ onProductSelect }: KioskOutfitBannerProps) {
  const { outfitGroups, getProduct } = useStore();

  if (outfitGroups.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4.5 h-4.5 text-stone-600" />
        <h2 className="text-lg font-serif font-bold text-stone-800">Curated Outfits</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {outfitGroups.map((group) => (
          <div
            key={group.id}
            className="flex-shrink-0 w-80 bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Product image strip */}
            <div className="flex h-32">
              {group.productIds.slice(0, 4).map((pid) => {
                const p = getProduct(pid);
                if (!p) return null;
                return (
                  <div
                    key={pid}
                    className="flex-1 bg-stone-100 border-r border-white last:border-r-0 overflow-hidden cursor-pointer"
                    onClick={() => onProductSelect(pid)}
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                );
              })}
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-800">{group.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {group.productIds.length} pieces • {group.season}
                  </p>
                </div>
                <button
                  onClick={() => onProductSelect(group.productIds[0])}
                  className="flex items-center gap-0.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
                >
                  View
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
