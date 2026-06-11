import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { KioskSearch } from './KioskSearch';
import { KioskProductGrid } from './KioskProductGrid';
import { KioskProductDetail } from './KioskProductDetail';
import { KioskOutfitBanner } from './KioskOutfitBanner';
import { KioskWelcome } from './KioskWelcome';
import { BarcodeScanner } from './BarcodeScanner';
import { ShoppingCart } from './ShoppingCart';
import { MapPin, RefreshCw, UserCog, ChevronDown, Check, Store, ScanLine, ShoppingBag } from 'lucide-react';

export function KioskLayout() {
  const {
    currentLocationId,
    locations,
    kioskSelectedProductId,
    setCurrentView,
    setKioskSelectedProduct,
    setCurrentLocation,
    getProductByBarcode,
    getCartTotal,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const locationPickerRef = useRef<HTMLDivElement>(null);

  const currentLocation = locations.find((l) => l.id === currentLocationId);
  const { items: cartItems } = getCartTotal();

  // Secret admin access: tap logo 5 times
  useEffect(() => {
    if (adminTapCount >= 5) {
      setCurrentView('admin');
      setAdminTapCount(0);
    }
  }, [adminTapCount, setCurrentView]);

  // Simulate periodic sync
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 30 * 60 * 1000); // 30 min
    return () => clearInterval(interval);
  }, []);

  // Close location picker when clicking outside
  useEffect(() => {
    if (!showLocationPicker) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (locationPickerRef.current && !locationPickerRef.current.contains(e.target as Node)) {
        setShowLocationPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showLocationPicker]);

  // Auto-return to welcome after 3 minutes of inactivity
  useEffect(() => {
    if (showWelcome) return;
    let timeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowWelcome(true);
        setKioskSelectedProduct(null);
        setSearchQuery('');
        setFilterCategory('');
        setFilterColor('');
        setFilterAvailableOnly(false);
      }, 3 * 60 * 1000);
    };
    resetTimer();
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('click', resetTimer);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [showWelcome, setKioskSelectedProduct]);

  // Handle barcode scan
  const handleBarcodeScan = (barcode: string) => {
    const product = getProductByBarcode(barcode);
    if (product) {
      setKioskSelectedProduct(product.id);
      setShowBarcodeScanner(false);
    } else {
      alert(`No product found for barcode: ${barcode}`);
    }
  };

  if (showWelcome) {
    return <KioskWelcome onTapToStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-stone-50 overflow-hidden select-none" style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}>
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAdminTapCount((c) => c + 1)}
              className="focus:outline-none"
            >
              <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                ✦ ATELIER
              </h1>
            </button>
            <div className="h-8 w-px bg-stone-200" />
            <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">
              Style Finder
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-stone-500">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Synced {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Barcode Scan Button */}
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
            >
              <ScanLine className="w-4 h-4" />
              <span className="text-sm font-medium">Scan</span>
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => setShowCart(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium">List</span>
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-emerald-600 text-white text-xs font-bold rounded-full">
                  {cartItems}
                </span>
              )}
            </button>

            {/* Location Picker */}
            <div className="relative" ref={locationPickerRef}>
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all ${
                  showLocationPicker
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentLocation?.name || 'Unknown'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLocationPicker ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showLocationPicker && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in">
                  <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Switch Store Location
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Inventory updates to match the selected store
                    </p>
                  </div>

                  <div className="px-2 pb-2">
                    {locations.map((location) => {
                      const isActive = location.id === currentLocationId;
                      return (
                        <button
                          key={location.id}
                          onClick={() => {
                            setCurrentLocation(location.id);
                            setShowLocationPicker(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                            isActive
                              ? 'bg-emerald-50 border border-emerald-200'
                              : 'hover:bg-stone-50 border border-transparent'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-emerald-100' : 'bg-stone-100'
                          }`}>
                            <Store className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${isActive ? 'text-emerald-900' : 'text-stone-800'}`}>
                              {location.name}
                            </p>
                            <p className="text-[11px] text-stone-400 truncate">
                              {location.address}
                            </p>
                          </div>
                          {isActive && (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-4 py-3 bg-stone-50 border-t border-stone-100">
                    <p className="text-[11px] text-stone-400 text-center">
                      📦 All inventory counts reflect the selected location
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentView('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
              title="Staff Login"
            >
              <UserCog className="w-4 h-4" />
              <span className="text-sm font-medium">Staff</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {kioskSelectedProductId ? (
          <KioskProductDetail
            productId={kioskSelectedProductId}
            onBack={() => setKioskSelectedProduct(null)}
          />
        ) : (
          <div className="h-full flex flex-col">
            {/* Search Bar */}
            <div className="px-6 pt-5 pb-3">
              <KioskSearch
                query={searchQuery}
                onQueryChange={setSearchQuery}
                filterCategory={filterCategory}
                onCategoryChange={setFilterCategory}
                filterColor={filterColor}
                onColorChange={setFilterColor}
                filterAvailableOnly={filterAvailableOnly}
                onAvailableOnlyChange={setFilterAvailableOnly}
              />
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Show outfit banner when no search is active */}
              {!searchQuery && !filterCategory && !filterColor && (
                <KioskOutfitBanner onProductSelect={(id) => setKioskSelectedProduct(id)} />
              )}
              <KioskProductGrid
                searchQuery={searchQuery}
                filterCategory={filterCategory}
                filterColor={filterColor}
                filterAvailableOnly={filterAvailableOnly}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>Find your perfect outfit • Ask staff for assistance</span>
          <span>📍 Current Location: {currentLocation?.name} | 🔄 Inventory Synced: 2 mins ago</span>
        </div>
      </footer>

      {/* Floating Cart Button - Shows when items in cart */}
      {cartItems > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-20 right-6 flex items-center gap-3 px-5 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl hover:bg-emerald-700 transition-all z-40 animate-in"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-emerald-600 text-xs font-bold rounded-full flex items-center justify-center">
              {cartItems}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">View Shopping List</p>
            <p className="text-xs text-emerald-100">{cartItems} item{cartItems !== 1 ? 's' : ''} • Tap to view</p>
          </div>
        </button>
      )}

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Shopping Cart Modal */}
      {showCart && (
        <ShoppingCart
          onClose={() => setShowCart(false)}
          onProductSelect={(id) => {
            setKioskSelectedProduct(id);
            setShowCart(false);
          }}
        />
      )}
    </div>
  );
}
