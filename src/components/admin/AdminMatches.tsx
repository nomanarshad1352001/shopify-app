import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import {
  Search,
  Plus,
  Trash2,
  ArrowLeftRight,
  ArrowRight,
  X,
  Check,
  Link2,
} from 'lucide-react';
import { MatchType, MATCH_TYPE_LABELS, MATCH_TYPE_COLORS } from '../../types';

export function AdminMatches() {
  const {
    products,
    adminSelectedProductId,
    setAdminSelectedProduct,
    getMatchesForProduct,
    addMatch,
    removeMatch,
  } = useStore();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const [addSelectedProduct, setAddSelectedProduct] = useState<string | null>(null);
  const [addMatchType, setAddMatchType] = useState<MatchType>('best_match');
  const [addBidirectional, setAddBidirectional] = useState(true);

  // Selected product and its matches
  const selectedProduct = adminSelectedProductId
    ? products.find((p) => p.id === adminSelectedProductId)
    : null;
  const currentMatches = adminSelectedProductId
    ? getMatchesForProduct(adminSelectedProductId)
    : [];

  // Product search for left panel
  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
    );
  }, [products, search]);

  // Product search for add modal
  const addSearchResults = useMemo(() => {
    if (!addSearch) return [];
    const q = addSearch.toLowerCase();
    return products
      .filter(
        (p) =>
          p.id !== adminSelectedProductId &&
          !currentMatches.some((m) => m.product.id === p.id) &&
          (p.title.toLowerCase().includes(q) ||
            p.productType.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q) ||
            p.variants.some((v) => v.sku.toLowerCase().includes(q)))
      )
      .slice(0, 10);
  }, [addSearch, products, adminSelectedProductId, currentMatches]);

  const handleAddMatch = () => {
    if (adminSelectedProductId && addSelectedProduct) {
      addMatch(adminSelectedProductId, addSelectedProduct, addMatchType, addBidirectional);
      setShowAddModal(false);
      setAddSearch('');
      setAddSelectedProduct(null);
      setAddMatchType('best_match');
      setAddBidirectional(true);
    }
  };

  return (
    <div className="flex h-full">
      {/* Product Selection Panel */}
      <div className="w-72 bg-white border-r border-stone-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-stone-200">
          <h3 className="font-semibold text-stone-800 mb-2">Select Product</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stone-900/10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredProducts.map((product) => {
            const matchCount = getMatchesForProduct(product.id).length;
            return (
              <button
                key={product.id}
                onClick={() => setAdminSelectedProduct(product.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left border-b border-stone-50 transition-colors ${
                  adminSelectedProductId === product.id
                    ? 'bg-stone-900 text-white'
                    : 'hover:bg-stone-50'
                }`}
              >
                <div className="w-8 h-10 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    adminSelectedProductId === product.id ? 'text-white' : 'text-stone-800'
                  }`}>
                    {product.title}
                  </p>
                  <p className={`text-[10px] ${
                    adminSelectedProductId === product.id ? 'text-stone-300' : 'text-stone-400'
                  }`}>
                    {product.productType} • {product.color}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                    adminSelectedProductId === product.id
                      ? 'bg-white/20 text-white'
                      : matchCount === 0
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {matchCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Match Management Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedProduct ? (
          <div className="flex-1 flex items-center justify-center text-stone-400">
            <div className="text-center">
              <Link2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium text-stone-500">Select a product</p>
              <p className="text-sm mt-1">Choose a product from the left panel to manage its matches</p>
            </div>
          </div>
        ) : (
          <>
            {/* Product Header */}
            <div className="bg-white border-b border-stone-200 p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-18 rounded-lg overflow-hidden bg-stone-100">
                  <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-stone-900">{selectedProduct.title}</h2>
                  <p className="text-sm text-stone-500">
                    {selectedProduct.productType} • {selectedProduct.color} • {selectedProduct.vendor}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Match
                </button>
              </div>
            </div>

            {/* Current Matches */}
            <div className="flex-1 overflow-y-auto p-5">
              {currentMatches.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <Link2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-stone-500 font-medium">No matches yet</p>
                  <p className="text-sm mt-1">Click "Add Match" to connect this product with others</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                    {currentMatches.length} Matching Product{currentMatches.length !== 1 ? 's' : ''}
                  </p>
                  {currentMatches.map(({ match, product: matchedProduct }) => (
                    <div
                      key={match.id}
                      className="flex items-center gap-3 bg-white rounded-xl border border-stone-200 p-3 hover:border-stone-300 transition-all"
                    >
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        <img src={matchedProduct.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800">{matchedProduct.title}</p>
                        <p className="text-xs text-stone-500">
                          {matchedProduct.productType} • {matchedProduct.color}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                            MATCH_TYPE_COLORS[match.matchType]
                          }`}
                        >
                          {MATCH_TYPE_LABELS[match.matchType]}
                        </span>
                        {match.isBidirectional ? (
                          <span title="Bidirectional"><ArrowLeftRight className="w-3.5 h-3.5 text-stone-400" /></span>
                        ) : (
                          <span title="One-way"><ArrowRight className="w-3.5 h-3.5 text-stone-400" /></span>
                        )}
                        <button
                          onClick={() => removeMatch(match.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove match"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Match Modal */}
      {showAddModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900">Add Match</h3>
                <p className="text-sm text-stone-500">
                  Add a matching product for {selectedProduct.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddSearch('');
                  setAddSelectedProduct(null);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {/* Search for product */}
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Search Product
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  placeholder="Type product name, SKU, or color..."
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  autoFocus
                />
              </div>

              {/* Search Results */}
              {addSearch && (
                <div className="space-y-1 mb-5 max-h-48 overflow-y-auto">
                  {addSearchResults.length === 0 ? (
                    <p className="text-sm text-stone-400 text-center py-4">No products found</p>
                  ) : (
                    addSearchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setAddSelectedProduct(p.id)}
                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all ${
                          addSelectedProduct === p.id
                            ? 'bg-stone-900 text-white'
                            : 'hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-8 h-10 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            addSelectedProduct === p.id ? 'text-white' : 'text-stone-800'
                          }`}>
                            {p.title}
                          </p>
                          <p className={`text-xs ${
                            addSelectedProduct === p.id ? 'text-stone-300' : 'text-stone-400'
                          }`}>
                            {p.productType} • {p.color}
                          </p>
                        </div>
                        {addSelectedProduct === p.id && (
                          <Check className="w-4 h-4 text-white flex-shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Match Type */}
              {addSelectedProduct && (
                <>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                    Match Type
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    {(Object.entries(MATCH_TYPE_LABELS) as [MatchType, string][]).map(
                      ([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setAddMatchType(key)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            addMatchType === key
                              ? MATCH_TYPE_COLORS[key]
                                  .replace('bg-', 'bg-')
                                  .replace('text-', 'text-') +
                                ' ring-2 ring-offset-1 ring-stone-300'
                              : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>

                  {/* Bidirectional Toggle */}
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-stone-800">Bidirectional</p>
                      <p className="text-xs text-stone-500">
                        {addBidirectional
                          ? 'Both products will show each other as matches'
                          : 'Only this product will show the match'}
                      </p>
                    </div>
                    <button
                      onClick={() => setAddBidirectional(!addBidirectional)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        addBidirectional ? 'bg-stone-900' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          addBidirectional ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="p-5 border-t border-stone-200 flex gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddSearch('');
                  setAddSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMatch}
                disabled={!addSelectedProduct}
                className="flex-1 px-4 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
