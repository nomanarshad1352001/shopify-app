import { useStore } from './store/useStore';
import { KioskLayout } from './components/kiosk/KioskLayout';
import { AdminLayout } from './components/admin/AdminLayout';

function App() {
  const { currentView } = useStore();

  return currentView === 'admin' ? <AdminLayout /> : <KioskLayout />;
}

export default App;
