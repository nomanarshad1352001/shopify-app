import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Lock, ArrowLeft } from 'lucide-react';

export function AdminLogin() {
  const { setAdminAuthenticated, setCurrentView } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === '1234') {
            setAdminAuthenticated(true);
          } else {
            setError(true);
            setPin('');
          }
        }, 300);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <button
          onClick={() => setCurrentView('kiosk')}
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Kiosk
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-stone-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-900">Admin Access</h1>
          <p className="text-sm text-stone-500 mt-1">Enter your 4-digit PIN</p>
          <p className="text-xs text-stone-400 mt-1">Demo PIN: 1234</p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all ${
                i < pin.length
                  ? 'bg-stone-900 scale-110'
                  : 'bg-stone-200'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">
            Incorrect PIN. Please try again.
          </p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'].map((digit) => (
            <button
              key={digit || 'empty'}
              onClick={() => {
                if (digit === '←') {
                  setPin((p) => p.slice(0, -1));
                  setError(false);
                } else if (digit) {
                  setError(false);
                  handlePinInput(digit);
                }
              }}
              disabled={!digit}
              className={`h-14 rounded-xl text-xl font-semibold transition-all ${
                !digit
                  ? 'invisible'
                  : digit === '←'
                  ? 'bg-stone-100 text-stone-600 hover:bg-stone-200 text-lg'
                  : 'bg-stone-50 text-stone-800 hover:bg-stone-100 active:bg-stone-200'
              }`}
            >
              {digit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
