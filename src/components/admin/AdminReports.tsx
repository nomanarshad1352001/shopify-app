import { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import {
  AlertTriangle,
  Package,
  Link2,
  TrendingUp,
  Eye,
  ShoppingBag,
} from 'lucide-react';

export function AdminReports() {
  const {
    products,
    matches,
    outfitGroups,
    currentLocationId,
    locations,
    getTotalInventoryAtLocation,
    getMatchesForProduct,
  } = useStore();

  const currentLocation = locations.find((l) => l.id === currentLocationId);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const productsWithMatches = products.filter(
      (p) => getMatchesForProduct(p.id).length > 0
    ).length;
    const productsWithoutMatches = totalProducts - productsWithMatches;
    const hiddenFromKiosk = products.filter((p) => p.isHiddenFromKiosk).length;
    const outOfStockHere = products.filter(
      (p) => getTotalInventoryAtLocation(p.id, currentLocationId) === 0
    ).length;
    const lowStockHere = products.filter((p) => {
      const qty = getTotalInventoryAtLocation(p.id, currentLocationId);
      return qty > 0 && qty <= 3;
    }).length;

    // Products by type
    const byType: Record<string, number> = {};
    products.forEach((p) => {
      byType[p.productType] = (byType[p.productType] || 0) + 1;
    });

    // Products by color
    const byColor: Record<string, number> = {};
    products.forEach((p) => {
      byColor[p.color] = (byColor[p.color] || 0) + 1;
    });

    // Total inventory at current location
    let totalInventory = 0;
    products.forEach((p) => {
      totalInventory += getTotalInventoryAtLocation(p.id, currentLocationId);
    });

    return {
      totalProducts,
      productsWithMatches,
      productsWithoutMatches,
      hiddenFromKiosk,
      outOfStockHere,
      lowStockHere,
      totalMatches: matches.length,
      totalOutfitGroups: outfitGroups.length,
      totalInventory,
      byType: Object.entries(byType).sort((a, b) => b[1] - a[1]),
      byColor: Object.entries(byColor).sort((a, b) => b[1] - a[1]),
    };
  }, [products, matches, outfitGroups, currentLocationId, getMatchesForProduct, getTotalInventoryAtLocation]);

  const unmatched = useMemo(
    () => products.filter((p) => getMatchesForProduct(p.id).length === 0),
    [products, getMatchesForProduct]
  );

  const outOfStock = useMemo(
    () => products.filter((p) => getTotalInventoryAtLocation(p.id, currentLocationId) === 0),
    [products, currentLocationId, getTotalInventoryAtLocation]
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h2 className="text-xl font-bold text-stone-900">Reports & Analytics</h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Products
              </span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{stats.totalProducts}</p>
            <p className="text-xs text-stone-400 mt-1">In catalog</p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Matches
              </span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{stats.totalMatches}</p>
            <p className="text-xs text-stone-400 mt-1">Total relationships</p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {currentLocation?.name} Stock
              </span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{stats.totalInventory}</p>
            <p className="text-xs text-stone-400 mt-1">Total units</p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Match Rate
              </span>
            </div>
            <p className="text-3xl font-bold text-stone-900">
              {stats.totalProducts > 0
                ? Math.round((stats.productsWithMatches / stats.totalProducts) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-stone-400 mt-1">Products with matches</p>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">No Matches</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{stats.productsWithoutMatches}</p>
            <p className="text-xs text-amber-600">Products need matching</p>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-800">Out of Stock</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{stats.outOfStockHere}</p>
            <p className="text-xs text-red-600">At {currentLocation?.name}</p>
          </div>

          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-stone-500" />
              <span className="text-sm font-semibold text-stone-700">Hidden</span>
            </div>
            <p className="text-2xl font-bold text-stone-900">{stats.hiddenFromKiosk}</p>
            <p className="text-xs text-stone-500">Hidden from kiosk</p>
          </div>
        </div>

        {/* Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* By Type */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-800 mb-4">Products by Category</h3>
            <div className="space-y-2">
              {stats.byType.map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-sm text-stone-600 w-24">{type}</span>
                  <div className="flex-1 bg-stone-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-stone-700 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.max(
                          (count / stats.totalProducts) * 100,
                          10
                        )}%`,
                      }}
                    >
                      <span className="text-[10px] font-bold text-white">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Color */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-800 mb-4">Products by Color</h3>
            <div className="space-y-2">
              {stats.byColor.map(([color, count]) => (
                <div key={color} className="flex items-center gap-3">
                  <span className="text-sm text-stone-600 w-24">{color}</span>
                  <div className="flex-1 bg-stone-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-stone-500 rounded-full flex items-center justify-end pr-2"
                      style={{
                        width: `${Math.max(
                          (count / stats.totalProducts) * 100,
                          10
                        )}%`,
                      }}
                    >
                      <span className="text-[10px] font-bold text-white">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unmatched Products */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200">
            <h3 className="font-semibold text-stone-800">
              Products Without Matches ({unmatched.length})
            </h3>
            <p className="text-sm text-stone-500">These products need matching attention</p>
          </div>
          <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
            {unmatched.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-10 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{p.title}</p>
                  <p className="text-xs text-stone-400">
                    {p.productType} • {p.color}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-600 rounded-full font-medium">
                  Needs Matches
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200">
            <h3 className="font-semibold text-stone-800">
              Out of Stock at {currentLocation?.name} ({outOfStock.length})
            </h3>
          </div>
          <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
            {outOfStock.map((p) => {
              // Check if available elsewhere
              const otherLocs = locations
                .filter((l) => l.id !== currentLocationId)
                .filter((l) => getTotalInventoryAtLocation(p.id, l.id) > 0);
              return (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-10 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{p.title}</p>
                    <p className="text-xs text-stone-400">
                      {p.productType} • {p.color}
                    </p>
                  </div>
                  {otherLocs.length > 0 ? (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                      Available in {otherLocs.map((l) => l.name).join(', ')}
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                      Out Everywhere
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
