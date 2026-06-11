import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import {
  Search,
  Eye,
  EyeOff,
  Package,
  Link2,
  AlertTriangle,
  X,
  Plus,
  Barcode,
  Trash2,
} from 'lucide-react';
import { PRODUCT_TYPES, COLORS } from '../../types';
import { AddProductModal } from './AddProductModal';

export function AdminProducts() {
  const {
    products,
    currentLocationId,
    getTotalInventoryAtLocation,
    getMatchesForProduct,
    toggleProductKioskVisibility,
    setAdminSelectedProduct,
    setAdminTab,
    locations,
    deleteProduct,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterIssue, setFilterIssue] = useState<'no_matches' | 'no_images' | 'out_of_stock' | ''>('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const currentLocation = locations.find((l) => l.id === currentLocationId);

  const filtered = useMemo(() => {
    let result = products;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.productType.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(q) || v.barcode.includes(q))
      );
    }

    if (filterType) result = result.filter((p) => p.productType === filterType);
    if (filterColor) result = result.filter((p) => p.color === filterColor);

    if (filterIssue === 'no_matches') {
      result = result.filter((p) => getMatchesForProduct(p.id).length === 0);
    } else if (filterIssue === 'no_images') {
      result = result.filter((p) => p.images.length === 0);
    } else if (filterIssue === 'out_of_stock') {
      result = result.filter((p) => getTotalInventoryAtLocation(p.id, currentLocationId) === 0);
    }

    return result;
  }, [products, search, filterType, filterColor, filterIssue, currentLocationId, getMatchesForProduct, getTotalInventoryAtLocation]);

  const selectedProductData = selectedProduct ? products.find((p) => p.id === selectedProduct) : null;

  return (
    <div className="flex h-full">
      {/* Product List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-stone-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-stone-900">Products</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-500">{filtered.length} of {products.length} products</span>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, SKU, barcode..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="">All Types</option>
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none"
            >
              <option value="">All Colors</option>
              {COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex gap-1">
              <button
                onClick={() => setFilterIssue(filterIssue === 'no_matches' ? '' : 'no_matches')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  filterIssue === 'no_matches'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                No Matches
              </button>
              <button
                onClick={() => setFilterIssue(filterIssue === 'out_of_stock' ? '' : 'out_of_stock')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  filterIssue === 'out_of_stock'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
              >
                <Package className="w-3 h-3" />
                Out of Stock
              </button>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200 sticky top-0">
              <tr>
                <th className="text-left px-6 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {currentLocation?.name || 'Store'}
                </th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Kiosk
                </th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((product) => {
                const totalQty = getTotalInventoryAtLocation(product.id, currentLocationId);
                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-stone-50 cursor-pointer transition-colors ${
                      selectedProduct === product.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-800">{product.title}</p>
                          <p className="text-xs text-stone-400">
                            {product.variants[0]?.sku} • {product.color}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Barcode className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-xs font-mono text-stone-600">
                          {product.variants[0]?.barcode || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-1 bg-stone-100 text-stone-600 rounded-full">
                        {product.productType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-stone-800">
                        ${product.variants[0]?.price}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`text-sm font-bold ${
                          totalQty === 0
                            ? 'text-red-500'
                            : totalQty <= 3
                            ? 'text-amber-500'
                            : 'text-emerald-600'
                        }`}
                      >
                        {totalQty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProductKioskVisibility(product.id);
                        }}
                        className={`p-1.5 rounded-lg transition-all ${
                          product.isHiddenFromKiosk
                            ? 'text-stone-300 hover:text-stone-500'
                            : 'text-emerald-500 hover:text-emerald-600'
                        }`}
                      >
                        {product.isHiddenFromKiosk ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdminSelectedProduct(product.id);
                          setAdminTab('matches');
                        }}
                        className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1"
                      >
                        <Link2 className="w-3 h-3" />
                        Matches
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Sidebar */}
      {selectedProductData && (
        <div className="w-80 bg-white border-l border-stone-200 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-semibold text-stone-800">Product Details</h3>
            <button onClick={() => setSelectedProduct(null)} className="text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 mb-4">
              <img
                src={selectedProductData.images[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <h4 className="font-bold text-stone-900">{selectedProductData.title}</h4>
            <p className="text-sm text-stone-500 mt-1">{selectedProductData.description}</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Type</span>
                <span className="font-medium text-stone-800">{selectedProductData.productType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Color</span>
                <span className="font-medium text-stone-800">{selectedProductData.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Vendor</span>
                <span className="font-medium text-stone-800">{selectedProductData.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Season</span>
                <span className="font-medium text-stone-800">{selectedProductData.season}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Price</span>
                <span className="font-medium text-stone-800">${selectedProductData.variants[0]?.price}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Inventory by Location
              </p>
              {locations.map((loc) => {
                const locQty = getTotalInventoryAtLocation(selectedProductData.id, loc.id);
                return (
                  <div key={loc.id} className="flex justify-between text-sm py-1">
                    <span className="text-stone-600">{loc.name}</span>
                    <span className={`font-medium ${locQty === 0 ? 'text-red-500' : 'text-stone-800'}`}>
                      {locQty}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Variants & Barcodes
              </p>
              <div className="space-y-1">
                {selectedProductData.variants.map((v) => (
                  <div key={v.id} className="flex items-center justify-between text-xs p-2 bg-stone-50 rounded-lg">
                    <span className="font-medium text-stone-700">{v.size}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 font-mono text-[10px]">{v.barcode}</span>
                      <span className="text-stone-500">{v.inventoryByLocation[currentLocationId] || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedProductData.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setAdminSelectedProduct(selectedProductData.id);
                  setAdminTab('matches');
                }}
                className="flex-1 px-3 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 flex items-center justify-center gap-1.5"
              >
                <Link2 className="w-3.5 h-3.5" />
                Manage Matches
              </button>
            </div>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this product?')) {
                  deleteProduct(selectedProductData.id);
                  setSelectedProduct(null);
                }
              }}
              className="w-full mt-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Product
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
