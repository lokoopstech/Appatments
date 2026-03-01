import { useState, useEffect } from 'react';
import {
  Building2, CalendarCheck, Users, DollarSign,
  Mail, MessageSquare, TrendingUp, TrendingDown,
  Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';
import './Dashboard.css';

const mockStats = {
  totalUsers: 142,
  totalApartments: 38,
  totalBookings: 284,
  pendingBookings: 12,
  totalBlogs: 27,
  totalSubscribers: 531,
  newContacts: 8,
  totalRevenue: 184600,
};

function StatCard({ label, value, icon: Icon, color, bgColor, change, changeType }) {
  return (
    <div className="stat-card">
      <div className="stat-card__content">
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">{value}</div>
        {change && (
          <div className={`stat-card__change stat-card__change--${changeType}`}>
            {changeType === 'up' ? <TrendingUp size={13} /> : changeType === 'down' ? <TrendingDown size={13} /> : null}
            {change}
          </div>
        )}
      </div>
      <div className="stat-card__icon" style={{ background: bgColor }}>
        <Icon size={22} color={color} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch {
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const s = stats || mockStats;

  const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;
  const fmtMoney = (n) => `$${n >= 1000 ? `${(n/1000).toFixed(1)}k` : n}`;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Dashboard</h1>
          <p className="page-header__sub">Welcome back — here's what's happening today</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard label="Total Revenue"    value={fmtMoney(s.totalRevenue)}  icon={DollarSign}    color="#16a34a" bgColor="#dcfce7" change="+12.4% this month" changeType="up" />
        <StatCard label="Total Bookings"   value={fmt(s.totalBookings)}      icon={CalendarCheck} color="#2563eb" bgColor="#dbeafe" change="+8 this week" changeType="up" />
        <StatCard label="Pending Bookings" value={s.pendingBookings}          icon={Clock}         color="#ca8a04" bgColor="#fef9c3" change="Needs review" changeType="neutral" />
        <StatCard label="Apartments"       value={s.totalApartments}          icon={Building2}     color="#7c3aed" bgColor="#ede9fe" change="3 added this month" changeType="up" />
        <StatCard label="Registered Users" value={fmt(s.totalUsers)}          icon={Users}         color="#0891b2" bgColor="#cffafe" change="+23 this week" changeType="up" />
        <StatCard label="Subscribers"      value={fmt(s.totalSubscribers)}    icon={Mail}          color="#ea580c" bgColor="#ffedd5" change="+47 new" changeType="up" />
        <StatCard label="New Inquiries"    value={s.newContacts}              icon={MessageSquare} color="#dc2626" bgColor="#fee2e2" change="Awaiting response" changeType="neutral" />
        <StatCard label="Blog Posts"       value={s.totalBlogs}              icon={CheckCircle}   color="#16a34a" bgColor="#dcfce7" change="2 drafts" changeType="neutral" />
      </div>

      {/* Two-col content */}
      <div className="grid-2" style={{ gap: 20 }}>
        {/* Recent bookings */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Recent Bookings</h3>
            <span className="badge badge--orange">{s.pendingBookings} pending</span>
          </div>
          <div className="card__body">
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Apartment</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { guest: 'John M.',    apt: 'Ocean View 2BHK', status: 'confirmed', amount: '$1,200' },
                    { guest: 'Sarah K.',   apt: 'Downtown Studio',  status: 'pending',   amount: '$650'  },
                    { guest: 'Mike L.',    apt: 'Garden 1BHK',      status: 'completed', amount: '$890'  },
                    { guest: 'Anna B.',    apt: 'Penthouse Suite',   status: 'pending',   amount: '$3,400' },
                    { guest: 'Carlos R.',  apt: 'Riverside 3BHK',   status: 'cancelled', amount: '$2,100' },
                  ].map((b, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{b.guest}</td>
                      <td>{b.apt}</td>
                      <td>
                        <span className={`badge badge--${
                          b.status === 'confirmed' ? 'success'
                          : b.status === 'pending' ? 'warning'
                          : b.status === 'completed' ? 'blue'
                          : 'danger'
                        }`}>{b.status}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{b.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Booking Status</h3>
            </div>
            <div className="card__body">
              {[
                { label: 'Confirmed', count: 43, color: 'var(--success)',  pct: 60 },
                { label: 'Pending',   count: 12, color: 'var(--warning)',  pct: 17 },
                { label: 'Completed', count: 18, color: 'var(--blue-500)', pct: 25 },
                { label: 'Cancelled', count: 7,  color: 'var(--danger)',   pct: 10 },
              ].map(r => (
                <div key={r.label} className="booking-bar">
                  <div className="booking-bar__top">
                    <span className="booking-bar__label">{r.label}</span>
                    <span className="booking-bar__count">{r.count}</span>
                  </div>
                  <div className="booking-bar__track">
                    <div className="booking-bar__fill" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Quick Actions</h3>
            </div>
            <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Add New Apartment',   icon: Building2,    color: 'var(--blue-600)' },
                { label: 'Review Inquiries',    icon: MessageSquare,color: 'var(--orange-500)' },
                { label: 'Manage Subscribers',  icon: Mail,         color: 'var(--success)' },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.label} className="quick-action-btn">
                    <Icon size={15} color={a.color} />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
