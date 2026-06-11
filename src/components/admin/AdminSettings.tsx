import { useStore } from '../../store/useStore';
import {
  MapPin,
  Tablet,
  RefreshCw,
  Shield,
  Database,
  CheckCircle2,
  AlertCircle,
  Wifi,
} from 'lucide-react';

export function AdminSettings() {
  const { locations, ipadConfigs, currentLocationId, setCurrentLocation } = useStore();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h2 className="text-xl font-bold text-stone-900">Settings</h2>

        {/* Location Configuration */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-stone-600" />
            <div>
              <h3 className="font-semibold text-stone-800">Store Locations</h3>
              <p className="text-sm text-stone-500">Manage Shopify POS locations</p>
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {locations.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      loc.isActive ? 'bg-emerald-400' : 'bg-stone-300'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-stone-800">{loc.name}</p>
                    <p className="text-xs text-stone-400">{loc.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      currentLocationId === loc.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {currentLocationId === loc.id ? 'Current' : 'Available'}
                  </span>
                  <button
                    onClick={() => setCurrentLocation(loc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      currentLocationId === loc.id
                        ? 'bg-stone-100 text-stone-400 cursor-default'
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                    disabled={currentLocationId === loc.id}
                  >
                    {currentLocationId === loc.id ? 'Active' : 'Switch'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* iPad Configuration */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center gap-3">
            <Tablet className="w-5 h-5 text-stone-600" />
            <div>
              <h3 className="font-semibold text-stone-800">iPad Kiosks</h3>
              <p className="text-sm text-stone-500">Registered iPad devices</p>
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {ipadConfigs.map((ipad) => {
              const loc = locations.find((l) => l.id === ipad.locationId);
              return (
                <div key={ipad.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Tablet className="w-4 h-4 text-stone-400" />
                    <div>
                      <p className="text-sm font-medium text-stone-800">{ipad.name}</p>
                      <p className="text-xs text-stone-400">{loc?.name} location</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ipad.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <Wifi className="w-3 h-3" />
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <AlertCircle className="w-3 h-3" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shopify Sync Status */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-stone-600" />
            <div>
              <h3 className="font-semibold text-stone-800">Shopify Sync</h3>
              <p className="text-sm text-stone-500">Data synchronization status</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Products', lastSync: '2 minutes ago', status: 'healthy' },
              { label: 'Variants', lastSync: '2 minutes ago', status: 'healthy' },
              { label: 'Inventory Levels', lastSync: '5 minutes ago', status: 'healthy' },
              { label: 'Locations', lastSync: '1 hour ago', status: 'healthy' },
              { label: 'Collections', lastSync: '30 minutes ago', status: 'healthy' },
              { label: 'Webhooks', lastSync: 'Active', status: 'healthy' },
            ].map((sync) => (
              <div key={sync.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-stone-700">{sync.label}</span>
                </div>
                <span className="text-xs text-stone-400">Last: {sync.lastSync}</span>
              </div>
            ))}

            <button className="w-full mt-4 px-4 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Force Full Sync
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center gap-3">
            <Shield className="w-5 h-5 text-stone-600" />
            <div>
              <h3 className="font-semibold text-stone-800">Security</h3>
              <p className="text-sm text-stone-500">Admin access settings</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-stone-700">Admin PIN</p>
                <p className="text-xs text-stone-500">Required to access admin panel</p>
              </div>
              <button className="px-3 py-1.5 bg-stone-200 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-300">
                Change PIN
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-stone-700">Kiosk Mode</p>
                <p className="text-xs text-stone-500">Prevent navigation away from the app</p>
              </div>
              <span className="text-xs text-emerald-600 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-stone-700">Auto-Lock Timeout</p>
                <p className="text-xs text-stone-500">Return to kiosk mode after inactivity</p>
              </div>
              <span className="text-xs text-stone-600 font-medium">5 minutes</span>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center gap-3">
            <Database className="w-5 h-5 text-stone-600" />
            <div>
              <h3 className="font-semibold text-stone-800">Data Management</h3>
              <p className="text-sm text-stone-500">Import/Export options</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200">
                Export Matches (CSV)
              </button>
              <button className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200">
                Import Matches (CSV)
              </button>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200">
                Export Outfit Groups
              </button>
              <button className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200">
                Import Outfit Groups
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
