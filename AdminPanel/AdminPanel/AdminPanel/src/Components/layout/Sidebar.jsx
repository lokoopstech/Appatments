import {
  LayoutDashboard, Building2, CalendarCheck, FileText,
  Image, Mail, Users, BarChart3, MessageSquare,
  Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const NAV = [
  { label: 'Main', items: [
    { id: 'dashboard',     icon: LayoutDashboard, text: 'Dashboard' },
    { id: 'analytics',     icon: BarChart3,        text: 'Analytics' },
  ]},
  { label: 'Management', items: [
    { id: 'apartments',    icon: Building2,    text: 'Apartments' },
    { id: 'bookings',      icon: CalendarCheck, text: 'Bookings',   badge: true },
    { id: 'blogs',         icon: FileText,     text: 'Blog Posts' },
    { id: 'gallery',       icon: Image,        text: 'Gallery' },
  ]},
  { label: 'Users & Comms', items: [
    { id: 'users',         icon: Users,        text: 'Users' },
    { id: 'subscriptions', icon: Mail,         text: 'Subscriptions' },
    { id: 'contact',       icon: MessageSquare, text: 'Inquiries',  badge: true },
  ]},
  { label: 'System', items: [
    { id: 'settings',      icon: Settings,     text: 'Settings' },
  ]},
];

export default function Sidebar({ active, onNav, isOpen, onClose, pendingCounts = {} }) {
  const { admin, getInitials, logout } = useAuth();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__logo-icon">
            <Building2 size={20} color="white" />
          </div>
          <div>
            <div className="sidebar__logo-text">ApartAdmin</div>
            <div className="sidebar__logo-sub">MANAGEMENT SUITE</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {NAV.map(section => (
            <div key={section.label}>
              <div className="sidebar__section-label">{section.label}</div>
              {section.items.map(item => {
                const Icon = item.icon;
                const count = pendingCounts[item.id];
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${active === item.id ? 'nav-item--active' : ''}`}
                    onClick={() => { onNav(item.id); onClose(); }}
                  >
                    <span className="nav-item__icon"><Icon size={16} /></span>
                    {item.text}
                    {item.badge && count > 0 && (
                      <span className="nav-item__badge">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <div className="sidebar__admin" onClick={() => onNav('settings')}>
            <div className="admin-avatar">
              {admin?.avatar
                ? <img src={admin.avatar} alt="avatar" />
                : getInitials()
              }
            </div>
            <div className="sidebar__admin-info">
              <div className="sidebar__admin-name">{admin?.name || admin?.email}</div>
              <div className="sidebar__admin-role">Administrator</div>
            </div>
            <ChevronRight size={14} color="rgba(255,255,255,.3)" />
          </div>
        </div>
      </aside>
    </>
  );
}
