import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AuthPage from '../src/Pages/auth/AuthPage';
import Sidebar from '../src/Components/layout/Sidebar';
import Topbar from '../src//Components/layout/Topbar';
import Dashboard from '../src/pages/dashboard/Dashboard';
import ApartmentsPage from '../src/pages/apartments/ApartmentsPage';
import BookingsPage from '../src/pages/bookings/BookingsPage';
import BlogsPage from '../src/pages/blogs/BlogsPage';
import GalleryPage from '../src/pages/gallery/GalleryPage';
import SubscriptionsPage from '../src/pages/subscriptions/SubscriptionsPage';
import UsersPage from '../src/pages/users/UsersPage';
import ContactPage from '../src/pages/contact/ContactPage';
import AnalyticsPage from '../src/pages/analytics/AnalyticsPage';
import SettingsPage from '../src/pages/settings/SettingsPage';
import './index.css';
import '../src/Components/layout/Layout.css';

const PAGES = {
  dashboard:     Dashboard,
  apartments:    ApartmentsPage,
  bookings:      BookingsPage,
  blogs:         BlogsPage,
  gallery:       GalleryPage,
  subscriptions: SubscriptionsPage,
  users:         UsersPage,
  contact:       ContactPage,
  analytics:     AnalyticsPage,
  settings:      SettingsPage,
};

function AdminPanel() {
  const { admin, loading } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: '0 auto 14px' }} />
          <div style={{ color: 'var(--gray-400)', fontSize: '.875rem', fontWeight: 500 }}>Loading ApartAdmin…</div>
        </div>
      </div>
    );
  }

  if (!admin) return <AuthPage />;

  const PageComponent = PAGES[page] || Dashboard;

  return (
    <div className="app-shell">
      <Sidebar
        active={page}
        onNav={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        pendingCounts={{ bookings: 12, contact: 8 }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar
          page={page}
          onMenuToggle={() => setSidebarOpen(p => !p)}
          onNav={setPage}
        />
        <main className="main-content">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminPanel />
      </AuthProvider>
    </ToastProvider>
  );
}
