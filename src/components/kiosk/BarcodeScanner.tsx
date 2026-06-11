import { useState, useEffect, useRef } from 'react';
import { X, ScanLine, Search, AlertCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [barcode, setBarcode] = useState('');
  const [isListening, setIsListening] = useState(true);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scanBufferRef = useRef('');
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus the input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle hardware barcode scanner input (rapid keystrokes)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // If input is focused, let it handle the input
      if (document.activeElement === inputRef.current) {
        return;
      }

      // Clear previous timeout
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      // Enter key completes the scan
      if (e.key === 'Enter') {
        if (scanBufferRef.current.length >= 6) {
          handleSubmit(scanBufferRef.current);
        }
        scanBufferRef.current = '';
        return;
      }

      // Add to buffer
      if (e.key.length === 1) {
        scanBufferRef.current += e.key;
        setIsListening(true);
      }

      // Clear buffer after 100ms of no input
      scanTimeoutRef.current = setTimeout(() => {
        if (scanBufferRef.current.length >= 6) {
          handleSubmit(scanBufferRef.current);
        }
        scanBufferRef.current = '';
      }, 150);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (code?: string) => {
    const barcodeToSearch = code || barcode.trim();
    if (barcodeToSearch.length >= 4) {
      setError('');
      onScan(barcodeToSearch);
    } else {
      setError('Please enter at least 4 characters');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
    setError('');
    setIsListening(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Find Product</h2>
              <p className="text-sm text-white/70">Scan or enter barcode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white transition-colors rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner Animation */}
        <div className="p-6">
          <div className="relative w-40 h-40 mx-auto mb-6">
            {/* Border frame */}
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-2xl" />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-600 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-600 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-600 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-600 rounded-br-xl" />
            
            {/* Scanning line */}
            {isListening && (
              <div 
                className="absolute left-4 right-4 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"
                style={{
                  animation: 'scanLine 1.5s ease-in-out infinite',
                  top: '50%',
                }}
              />
            )}
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-center transition-all ${isListening ? 'animate-pulse' : ''}`}>
                <ScanLine className="w-12 h-12 text-indigo-400 mx-auto mb-1" />
                <p className="text-xs text-indigo-500 font-medium">
                  {isListening ? 'Listening...' : 'Ready'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center mb-4">
            <p className="text-sm text-stone-600">
              📱 Point your <strong>barcode scanner</strong> at the product tag
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Or type the barcode number below
            </p>
          </div>

          {/* Manual Input */}
          <div className="space-y-3">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={barcode}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter barcode or SKU..."
                className="w-full px-4 py-4 pr-12 text-lg font-mono text-center tracking-wider border-2 border-stone-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                autoComplete="off"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-stone-400" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm justify-center">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={() => handleSubmit()}
              disabled={barcode.trim().length < 4}
              className="w-full px-4 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find Product
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700">Where to find the barcode?</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Look for the price tag on the garment. The barcode is the number below the stripes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for scan animation */}
      <style>{`
        @keyframes scanLine {
          0%, 100% { transform: translateY(-50px); opacity: 0.3; }
          50% { transform: translateY(50px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
