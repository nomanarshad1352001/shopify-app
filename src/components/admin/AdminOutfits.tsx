import { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import {
  Plus,
  Trash2,
  X,
  Search,
  Layers,
} from 'lucide-react';
import { SEASONS } from '../../types';

export function AdminOutfits() {
  const {
    outfitGroups,
    products,
    getProduct,
    addOutfitGroup,
    removeOutfitGroup,
    addProductToOutfitGroup,
    removeProductFromOutfitGroup,
  } = useStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSeason, setNewSeason] = useState('All Season');
  const [newTags, setNewTags] = useState('');

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [addProductSearch, setAddProductSearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const selectedGroupData = selectedGroup
    ? outfitGroups.find((g) => g.id === selectedGroup)
    : null;

  const productSearchResults = useMemo(() => {
    if (!addProductSearch || !selectedGroupData) return [];
    const q = addProductSearch.toLowerCase();
    return products
      .filter(
        (p) =>
          !selectedGroupData.productIds.includes(p.id) &&
          (p.title.toLowerCase().includes(q) ||
            p.productType.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [addProductSearch, products, selectedGroupData]);

  const handleCreate = () => {
    if (newName.trim()) {
      addOutfitGroup({
        name: newName.trim(),
        description: newDesc.trim(),
        productIds: [],
        season: newSeason,
        tags: newTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setShowCreateModal(false);
      setNewName('');
      setNewDesc('');
      setNewSeason('All Season');
      setNewTags('');
    }
  };

  return (
    <div className="flex h-full">
      {/* Groups List */}
      <div className="w-80 bg-white border-r border-stone-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Outfit Groups</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {outfitGroups.length === 0 ? (
            <div className="p-8 text-center text-stone-400">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No outfit groups yet</p>
            </div>
          ) : (
            outfitGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`w-full text-left p-4 border-b border-stone-100 transition-colors ${
                  selectedGroup === group.id ? 'bg-stone-900 text-white' : 'hover:bg-stone-50'
                }`}
              >
                <p className={`text-sm font-semibold ${
                  selectedGroup === group.id ? 'text-white' : 'text-stone-800'
                }`}>
                  {group.name}
                </p>
                <p className={`text-xs mt-0.5 ${
                  selectedGroup === group.id ? 'text-stone-300' : 'text-stone-500'
                }`}>
                  {group.productIds.length} items • {group.season}
                </p>
                {/* Mini product previews */}
                <div className="flex -space-x-1 mt-2">
                  {group.productIds.slice(0, 5).map((pid) => {
                    const p = getProduct(pid);
                    return p ? (
                      <div
                        key={pid}
                        className="w-7 h-7 rounded-md overflow-hidden border-2 border-white bg-stone-100"
                      >
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : null;
                  })}
                  {group.productIds.length > 5 && (
                    <div className="w-7 h-7 rounded-md bg-stone-200 border-2 border-white flex items-center justify-center">
                      <span className="text-[9px] font-bold text-stone-500">
                        +{group.productIds.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Group Detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedGroupData ? (
          <div className="flex-1 flex items-center justify-center text-stone-400">
            <div className="text-center">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium text-stone-500">Select an outfit group</p>
              <p className="text-sm mt-1">Or create a new one to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b border-stone-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">{selectedGroupData.name}</h2>
                  <p className="text-sm text-stone-500 mt-0.5">{selectedGroupData.description}</p>
                  <div className="flex gap-1.5 mt-2">
                    <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                      {selectedGroupData.season}
                    </span>
                    {selectedGroupData.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="px-3 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                  <button
                    onClick={() => {
                      removeOutfitGroup(selectedGroupData.id);
                      setSelectedGroup(null);
                    }}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Group
                  </button>
                </div>
              </div>
            </div>

            {/* Products in Group */}
            <div className="flex-1 overflow-y-auto p-5">
              {selectedGroupData.productIds.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <p className="text-stone-500 font-medium">No products in this group</p>
                  <p className="text-sm mt-1">Add products to build this outfit</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedGroupData.productIds.map((pid) => {
                    const product = getProduct(pid);
                    if (!product) return null;
                    return (
                      <div
                        key={pid}
                        className="bg-white rounded-xl border border-stone-200 overflow-hidden group relative"
                      >
                        <div className="aspect-[3/4] bg-stone-100">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-stone-400 uppercase">
                            {product.productType}
                          </p>
                          <p className="text-sm font-semibold text-stone-800 mt-0.5">
                            {product.title}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {product.color} • ${product.variants[0]?.price}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeProductFromOutfitGroup(selectedGroupData.id, pid)
                          }
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Create Outfit Group</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Classic Office Look"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe this outfit..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 resize-none h-20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Season
                </label>
                <select
                  value={newSeason}
                  onChange={(e) => setNewSeason(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none"
                >
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g., workwear, classic, statement"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="flex-1 px-4 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product to Group Modal */}
      {showAddProduct && selectedGroupData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[70vh] flex flex-col">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-bold text-stone-900">Add Product to Group</h3>
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setAddProductSearch('');
                }}
                className="p-1.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={addProductSearch}
                  onChange={(e) => setAddProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              {productSearchResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    addProductToOutfitGroup(selectedGroupData.id, p.id);
                    setAddProductSearch('');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="w-8 h-10 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{p.title}</p>
                    <p className="text-xs text-stone-400">
                      {p.productType} • {p.color}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-stone-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
