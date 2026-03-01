import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Settings, User, LogOut, KeyRound, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const PAGE_TITLES = {
  dashboard:     'Dashboard',
  analytics:     'Analytics',
  apartments:    'Apartments',
  bookings:      'Bookings',
  blogs:         'Blog Posts',
  gallery:       'Gallery',
  users:         'Users',
  subscriptions: 'Email Subscriptions',
  contact:       'Contact Inquiries',
  settings:      'Settings',
};

export default function Topbar({ page, onMenuToggle, onNav }) {
  const { admin, getInitials, logout } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="topbar">
      <button className="topbar__icon-btn" onClick={onMenuToggle} style={{ marginRight: 4 }}>
        <Menu size={18} />
      </button>

      <div className="topbar__title">{PAGE_TITLES[page] || page}</div>

      <div className="topbar__actions">
        <button className="topbar__icon-btn">
          <Bell size={17} />
          <span className="topbar__notif-dot" />
        </button>

        <div className="topbar__divider" />

        {/* User menu */}
        <div style={{ position: 'relative' }} ref={dropRef}>
          <button className="topbar__user" onClick={() => setDropOpen(p => !p)}>
            <div className="admin-avatar admin-avatar--topbar">
              {admin?.avatar
                ? <img src={admin.avatar} alt="avatar" />
                : getInitials()
              }
            </div>
            <div className="topbar__user-info">
              <span className="topbar__user-name">{admin?.name || 'Admin'}</span>
              <span className="topbar__user-role">Admin</span>
            </div>
            <ChevronDown size={14} color="var(--gray-400)" />
          </button>

          {dropOpen && (
            <div className="topbar__dropdown">
              <div className="dropdown__header">
                <div className="admin-avatar" style={{ width: 32, height: 32, fontSize: '.75rem', flexShrink: 0 }}>
                  {admin?.avatar ? <img src={admin.avatar} alt="" /> : getInitials()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="dropdown__name">{admin?.name || 'Admin'}</div>
                  <div className="dropdown__email">{admin?.email}</div>
                </div>
              </div>
              <button className="dropdown__item" onClick={() => { onNav('settings'); setDropOpen(false); }}>
                <User size={15} /> My Profile
              </button>
              <button className="dropdown__item" onClick={() => { onNav('settings'); setDropOpen(false); }}>
                <KeyRound size={15} /> Change Password
              </button>
              <button className="dropdown__item" onClick={() => { onNav('settings'); setDropOpen(false); }}>
                <Settings size={15} /> Settings
              </button>
              <div className="dropdown__divider" />
              <button className="dropdown__item dropdown__item--danger" onClick={logout}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
