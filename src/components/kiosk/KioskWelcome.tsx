import { Search, Sparkles } from 'lucide-react';

interface KioskWelcomeProps {
  onTapToStart: () => void;
}

export function KioskWelcome({ onTapToStart }: KioskWelcomeProps) {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
      onClick={onTapToStart}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/images/hero-pattern.jpg"
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-stone-900/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium text-stone-400 uppercase tracking-[0.2em]">
            Style Finder
          </span>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>

        <h1 className="text-6xl font-serif font-bold text-white mb-4 tracking-tight">
          ✦ ATELIER
        </h1>

        <p className="text-xl text-stone-300 mb-2">
          Find Your Perfect Outfit
        </p>
        <p className="text-base text-stone-400 max-w-md">
          Search any item to discover matching pieces, complete outfits,
          and see what's available in-store right now.
        </p>

        <button className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-2xl text-lg font-semibold hover:bg-stone-100 transition-all shadow-2xl shadow-black/30 active:scale-95">
          <Search className="w-5 h-5" />
          Tap to Start Shopping
        </button>

        <p className="mt-6 text-xs text-stone-500 animate-pulse">
          Tap anywhere to begin
        </p>
      </div>

      {/* Decorative bottom */}
      <div className="absolute bottom-6 text-center">
        <p className="text-xs text-stone-600">
          Need assistance? Ask any of our style consultants
        </p>
      </div>
    </div>
  );
}
