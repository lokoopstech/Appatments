import { useState, useEffect } from 'react';
import { Search, Mail, Trash2, Download, Send } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const load = async () => {
    try {
      const [res, statsRes] = await Promise.all([
        api.get('/subscriptions?limit=100'),
        api.get('/subscriptions/stats'),
      ]);
      setSubs(res.data || []);
      setStats(statsRes.data);
    } catch { toast.error('Failed to load subscriptions'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      toast.success('Subscriber removed');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = subs.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Email Subscriptions</h1>
          <p className="page-header__sub">{stats?.active || 0} active subscribers</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn--secondary" onClick={() => toast.info('Export feature coming soon')}>
            <Download size={15} /> Export CSV
          </button>
          <button className="btn btn--accent" onClick={() => toast.info('Newsletter sender coming soon')}>
            <Send size={15} /> Send Newsletter
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats-grid" style={{ marginBottom: 20 }}>
          {[
            { label: 'Total', value: stats.total, color: 'var(--blue-600)', bg: 'var(--blue-50)' },
            { label: 'Active', value: stats.active, color: 'var(--success)', bg: 'var(--success-bg)' },
            { label: 'Verified', value: stats.verified, color: 'var(--info)', bg: 'var(--info-bg)' },
            { label: 'Unsubscribed', value: stats.unsubscribed, color: 'var(--danger)', bg: 'var(--danger-bg)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-card__content">
                <div className="stat-card__label">{s.label}</div>
                <div className="stat-card__value" style={{ fontSize: '1.5rem' }}>{s.value}</div>
              </div>
              <div className="stat-card__icon" style={{ background: s.bg }}>
                <Mail size={20} color={s.color} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card__header" style={{ paddingBottom: 16 }}>
          <div className="search-wrap" style={{ maxWidth: 340 }}>
            <span className="search-wrap__icon"><Search size={15} /></span>
            <input className="search-input" placeholder="Search subscribers…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          {loading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Verified</th><th>Interests</th><th>Subscribed</th><th></th></tr></thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 600 }}>{s.email}</td>
                      <td>{s.name || '—'}</td>
                      <td><span className={`badge badge--${s.status === 'active' ? 'success' : 'gray'}`}>{s.status}</span></td>
                      <td><span className={`badge badge--${s.isVerified ? 'success' : 'warning'}`}>{s.isVerified ? 'Verified' : 'Pending'}</span></td>
                      <td style={{ fontSize: '.8rem' }}>{(s.interests || []).join(', ') || '—'}</td>
                      <td style={{ fontSize: '.8rem', color: 'var(--gray-500)' }}>
                        {new Date(s.subscribedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button className="btn btn--danger btn--icon btn--sm" onClick={() => handleDelete(s._id)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
