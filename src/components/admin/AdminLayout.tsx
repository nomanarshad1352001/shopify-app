import { useStore } from '../../store/useStore';
import { AdminLogin } from './AdminLogin';
import { AdminProducts } from './AdminProducts';
import { AdminMatches } from './AdminMatches';
import { AdminOutfits } from './AdminOutfits';
import { AdminSettings } from './AdminSettings';
import { AdminReports } from './AdminReports';
import {
  Package,
  Link2,
  Layers,
  Settings,
  BarChart3,
  Monitor,
  LogOut,
} from 'lucide-react';

export function AdminLayout() {
  const {
    adminAuthenticated,
    adminTab,
    setAdminTab,
    setCurrentView,
    setAdminAuthenticated,
    currentLocationId,
    locations,
  } = useStore();

  if (!adminAuthenticated) {
    return <AdminLogin />;
  }

  const currentLocation = locations.find((l) => l.id === currentLocationId);

  const tabs = [
    { key: 'products' as const, label: 'Products', icon: Package },
    { key: 'matches' as const, label: 'Matches', icon: Link2 },
    { key: 'outfits' as const, label: 'Outfit Groups', icon: Layers },
    { key: 'reports' as const, label: 'Reports', icon: BarChart3 },
    { key: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="h-screen flex bg-stone-100">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-stone-700">
          <h1 className="text-lg font-serif font-bold">✦ ATELIER</h1>
          <p className="text-xs text-stone-400 mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAdminTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                adminTab === tab.key
                  ? 'bg-white/10 text-white'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4.5 h-4.5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-3 space-y-1 border-t border-stone-700">
          <button
            onClick={() => {
              setCurrentView('kiosk');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Monitor className="w-4.5 h-4.5" />
            Kiosk View
          </button>
          <button
            onClick={() => {
              setAdminAuthenticated(false);
              setCurrentView('kiosk');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
            Log Out
          </button>
        </div>

        <div className="p-4 bg-stone-800/50 text-xs text-stone-500">
          <p>Location: {currentLocation?.name}</p>
          <p className="mt-0.5">Shopify Sync: Active</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'matches' && <AdminMatches />}
        {adminTab === 'outfits' && <AdminOutfits />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'reports' && <AdminReports />}
      </main>
    </div>
  );
}
