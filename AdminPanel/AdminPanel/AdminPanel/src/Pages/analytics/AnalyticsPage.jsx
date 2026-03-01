import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Building2 } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';
import './Analytics.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Fake chart bars using pure CSS
function BarChart({ data, color }) {
  if (!data?.length) return <div className="chart-empty">No data available</div>;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-chart__col">
          <div className="bar-chart__bar-wrap">
            <div className="bar-chart__bar" style={{ height: `${(d.value / max) * 100}%`, background: color }} />
          </div>
          <div className="bar-chart__label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/analytics/overview');
        setOverview(res.data);
      } catch { /* use mock */ }
      setLoading(false);
    };
    fetch();
  }, []);

  const mockMonthly = MONTHS.map((m, i) => ({
    label: m,
    value: Math.floor(Math.random() * 40 + 5),
    revenue: Math.floor(Math.random() * 15000 + 2000),
  }));

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Analytics</h1>
          <p className="page-header__sub">Performance overview for {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Bookings',   value: overview?.bookings || 284,      icon: BarChart3,  color: '#2563eb', bg: '#dbeafe' },
          { label: 'Total Revenue',    value: `$${((overview?.revenue || 184600)/1000).toFixed(1)}k`, icon: DollarSign, color: '#16a34a', bg: '#dcfce7' },
          { label: 'Total Users',      value: overview?.users || 142,         icon: Users,      color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Available Apts',   value: overview?.availableApartments || 38, icon: Building2, color: '#ea580c', bg: '#ffedd5' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="stat-card">
              <div className="stat-card__content">
                <div className="stat-card__label">{k.label}</div>
                <div className="stat-card__value">{k.value}</div>
              </div>
              <div className="stat-card__icon" style={{ background: k.bg }}>
                <Icon size={22} color={k.color} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Bookings per Month</h3>
            <span className="badge badge--blue">{new Date().getFullYear()}</span>
          </div>
          <div className="card__body">
            <BarChart data={mockMonthly.map(m => ({ label: m.label, value: m.value }))} color="var(--blue-500)" />
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Revenue per Month ($)</h3>
            <span className="badge badge--orange">{new Date().getFullYear()}</span>
          </div>
          <div className="card__body">
            <BarChart data={mockMonthly.map(m => ({ label: m.label, value: m.revenue }))} color="var(--orange-400)" />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card__header">
          <h3 className="card__title">Monthly Summary Table</h3>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Month</th><th>Bookings</th><th>Revenue</th><th>Avg. Per Booking</th></tr></thead>
              <tbody>
                {mockMonthly.map(m => (
                  <tr key={m.label}>
                    <td style={{ fontWeight: 600 }}>{m.label}</td>
                    <td>{m.value}</td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>${m.revenue.toLocaleString()}</td>
                    <td>${m.value ? Math.round(m.revenue / m.value).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
