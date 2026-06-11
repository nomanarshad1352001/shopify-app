import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Plus, Trash2, Upload, Link, ImageIcon } from 'lucide-react';
import { PRODUCT_TYPES, COLORS, SIZES, SEASONS, Product } from '../../types';

interface AddProductModalProps {
  onClose: () => void;
}

interface VariantInput {
  size: string;
  sku: string;
  barcode: string;
  price: number;
  inventory: Record<string, number>;
}

export function AddProductModal({ onClose }: AddProductModalProps) {
  const { addProduct, locations } = useStore();

  // Basic info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [productType, setProductType] = useState('Top');
  const [vendor, setVendor] = useState('');
  const [color, setColor] = useState('Black');
  const [season, setSeason] = useState('All Season');
  const [tags, setTags] = useState('');
  const [collections, setCollections] = useState('');

  // Image
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Variants
  const [variants, setVariants] = useState<VariantInput[]>([
    {
      size: 'M',
      sku: '',
      barcode: '',
      price: 0,
      inventory: Object.fromEntries(locations.map((l) => [l.id, 0])),
    },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: 'M',
        sku: '',
        barcode: '',
        price: variants[0]?.price || 0,
        inventory: Object.fromEntries(locations.map((l) => [l.id, 0])),
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof VariantInput, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const updateVariantInventory = (index: number, locationId: string, qty: number) => {
    const newVariants = [...variants];
    newVariants[index].inventory[locationId] = qty;
    setVariants(newVariants);
  };

  const generateBarcode = (index: number) => {
    const barcode = `${Date.now()}${index}`.slice(-12);
    updateVariant(index, 'barcode', barcode);
  };

  const generateSku = (index: number) => {
    const typeCode = productType.substring(0, 3).toUpperCase();
    const colorCode = color.substring(0, 3).toUpperCase();
    const sizeCode = variants[index].size;
    const sku = `${typeCode}-${colorCode}-${sizeCode}-${Date.now().toString().slice(-4)}`;
    updateVariant(index, 'sku', sku);
  };

  const handleSubmit = () => {
    if (!title.trim() || !imageUrl) {
      alert('Please fill in product title and add an image');
      return;
    }

    const productVariants: Product['variants'] = variants.map((v, i) => ({
      id: `v-${Date.now()}-${i}`,
      productId: '', // Will be set by store
      sku: v.sku || `SKU-${Date.now()}-${i}`,
      barcode: v.barcode || `${Date.now()}${i}`.slice(-12),
      size: v.size,
      color: color,
      price: v.price,
      inventoryByLocation: v.inventory,
    }));

    addProduct({
      title: title.trim(),
      description: description.trim(),
      productType,
      vendor: vendor.trim() || 'Custom',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      collections: collections.split(',').map((c) => c.trim()).filter(Boolean),
      images: [imageUrl],
      color,
      season,
      variants: productVariants,
      isHiddenFromKiosk: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Add New Product</h2>
            <p className="text-sm text-stone-500">Create a new product with variants and inventory</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Silk Pleated Blouse"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Product Type *
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none"
                  >
                    {PRODUCT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Color *
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none"
                  >
                    {COLORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Vendor
                  </label>
                  <input
                    type="text"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g., Atelier Collection"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Season
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none"
                  >
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., new-arrival, silk, workwear"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Collections (comma-separated)
                </label>
                <input
                  type="text"
                  value={collections}
                  onChange={(e) => setCollections(e.target.value)}
                  placeholder="e.g., Spring 2025, Office Essentials"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                />
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                Product Image *
              </h3>

              {/* Image Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setImageMode('url')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    imageMode === 'url'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Link className="w-4 h-4" />
                  Image URL
                </button>
                <button
                  onClick={() => setImageMode('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    imageMode === 'upload'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>

              {imageMode === 'url' ? (
                <div>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>
              ) : (
                <div>
                  <label className="block w-full cursor-pointer">
                    <div className="w-full px-4 py-8 border-2 border-dashed border-stone-300 rounded-xl text-center hover:border-stone-400 transition-colors">
                      <Upload className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                      <p className="text-sm text-stone-600">Click to upload image</p>
                      <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Image Preview */}
              <div className="aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                Variants & Inventory
              </h3>
              <button
                onClick={addVariant}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800"
              >
                <Plus className="w-4 h-4" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-stone-700">
                      Variant {index + 1}
                    </span>
                    {variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(index)}
                        className="p-1 text-stone-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Size</label>
                      <select
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        className="w-full px-2 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none"
                      >
                        {SIZES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">SKU</label>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          placeholder="Auto-generate"
                          className="flex-1 px-2 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => generateSku(index)}
                          className="px-2 py-1.5 bg-stone-200 text-stone-600 rounded-lg text-xs hover:bg-stone-300"
                          title="Auto-generate SKU"
                        >
                          ⚡
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Barcode</label>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={variant.barcode}
                          onChange={(e) => updateVariant(index, 'barcode', e.target.value)}
                          placeholder="Auto-generate"
                          className="flex-1 px-2 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none font-mono"
                        />
                        <button
                          onClick={() => generateBarcode(index)}
                          className="px-2 py-1.5 bg-stone-200 text-stone-600 rounded-lg text-xs hover:bg-stone-300"
                          title="Auto-generate Barcode"
                        >
                          ⚡
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inventory by Location */}
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-2">
                      Inventory by Location
                    </label>
                    <div className="flex gap-3">
                      {locations.map((loc) => (
                        <div key={loc.id} className="flex-1">
                          <label className="block text-[10px] text-stone-400 mb-0.5">
                            {loc.name}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={variant.inventory[loc.id] || 0}
                            onChange={(e) =>
                              updateVariantInventory(index, loc.id, parseInt(e.target.value) || 0)
                            }
                            className="w-full px-2 py-1.5 border border-stone-200 rounded-lg text-sm focus:outline-none text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
