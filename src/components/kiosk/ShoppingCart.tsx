import { useStore } from '../../store/useStore';
import { X, Trash2, ShoppingBag, Minus, Plus, Receipt } from 'lucide-react';

interface ShoppingCartProps {
  onClose: () => void;
  onProductSelect: (productId: string) => void;
}

export function ShoppingCart({ onClose, onProductSelect }: ShoppingCartProps) {
  const {
    cart,
    getProduct,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
  } = useStore();

  const { items, subtotal } = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Shopping List</h2>
                <p className="text-sm text-white/70">Your selected items</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-stone-300" />
            </div>
            <p className="text-xl font-semibold text-stone-800">Your list is empty</p>
            <p className="text-sm text-stone-500 mt-2 max-w-xs mx-auto">
              Tap the <strong>+ Add to List</strong> button on any product to start building your outfit
            </p>
          </div>
          
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-4 bg-stone-900 text-white rounded-2xl font-semibold text-lg hover:bg-stone-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Shopping List</h2>
              <p className="text-sm text-white/70">{items} item{items !== 1 ? 's' : ''} selected</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map((item) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            const variant = product.variants.find((v) => v.id === item.variantId);
            if (!variant) return null;
            const itemTotal = variant.price * item.quantity;

            return (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl"
              >
                {/* Product Image */}
                <button
                  onClick={() => {
                    onProductSelect(item.productId);
                    onClose();
                  }}
                  className="w-20 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-stone-800 truncate">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium px-2 py-0.5 bg-stone-200 text-stone-600 rounded-full">
                      Size: {variant.size}
                    </span>
                    <span className="text-xs text-stone-500">{product.color}</span>
                  </div>
                  
                  {/* Price per item */}
                  <p className="text-sm text-stone-500 mt-2">
                    ${variant.price} each
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeFromCart(item.productId, item.variantId);
                        } else {
                          updateCartQuantity(item.productId, item.variantId, item.quantity - 1);
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-stone-600" />
                    </button>
                    <span className="w-8 text-center text-lg font-bold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item.productId, item.variantId, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-stone-600" />
                    </button>
                  </div>
                </div>

                {/* Item Total & Remove */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-stone-900">
                    ${itemTotal.toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1 justify-end"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Summary */}
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-medium text-stone-500">Price Summary</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Items ({items})</span>
              <span className="text-stone-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Tax (estimated)</span>
              <span className="text-stone-800">${(subtotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t border-stone-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-stone-800">Estimated Total</span>
                <span className="text-2xl font-bold text-stone-900">
                  ${(subtotal * 1.08).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-100 flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={clearCart}
              className="px-4 py-3 bg-stone-100 text-stone-600 rounded-xl font-medium hover:bg-stone-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors text-lg"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-emerald-800 text-center">
              📋 Show this list to a staff member at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
