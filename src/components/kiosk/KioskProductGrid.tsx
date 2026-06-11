import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { KioskProductCard } from './KioskProductCard';
import { SearchX } from 'lucide-react';

interface KioskProductGridProps {
  searchQuery: string;
  filterCategory: string;
  filterColor: string;
  filterAvailableOnly: boolean;
}

export function KioskProductGrid({
  searchQuery,
  filterCategory,
  filterColor,
  filterAvailableOnly,
}: KioskProductGridProps) {
  const { searchProducts, products, getTotalInventoryAtLocation, currentLocationId, setKioskSelectedProduct } =
    useStore();

  const filteredProducts = useMemo(() => {
    let result = searchQuery ? searchProducts(searchQuery) : products;

    // Hide kiosk-hidden products
    result = result.filter((p) => !p.isHiddenFromKiosk);

    if (filterCategory) {
      // Handle "Accessory" to include Scarf, Belt, Jewelry, Handbag
      if (filterCategory === 'Accessory') {
        result = result.filter((p) =>
          ['Scarf', 'Belt', 'Jewelry', 'Handbag', 'Shoes', 'Accessory'].includes(p.productType)
        );
      } else {
        result = result.filter((p) => p.productType === filterCategory);
      }
    }

    if (filterColor) {
      result = result.filter((p) => p.color === filterColor);
    }

    if (filterAvailableOnly) {
      result = result.filter((p) => getTotalInventoryAtLocation(p.id, currentLocationId) > 0);
    }

    return result;
  }, [searchQuery, filterCategory, filterColor, filterAvailableOnly, searchProducts, products, getTotalInventoryAtLocation, currentLocationId]);

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <SearchX className="w-16 h-16 mb-4" />
        <p className="text-xl font-medium text-stone-500">No items found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-stone-500 mb-3">
        {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} found
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <KioskProductCard
            key={product.id}
            productId={product.id}
            onClick={() => setKioskSelectedProduct(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
