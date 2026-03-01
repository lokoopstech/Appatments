import { useState, useEffect } from 'react';
import { Search, Users, Trash2, Shield } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  const load = async () => {
    try {
      const res = await api.get('/admin/users?limit=100');
      setUsers(res.data || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Users</h1>
          <p className="page-header__sub">{users.length} registered users</p>
        </div>
      </div>

      <div className="card">
        <div className="card__header" style={{ paddingBottom: 16 }}>
          <div className="search-wrap" style={{ maxWidth: 340 }}>
            <span className="search-wrap__icon"><Search size={15} /></span>
            <input className="search-input" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          {loading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon"><Users size={24} /></div>
              <div className="empty-state__title">No users found</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>User</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="admin-avatar" style={{ width: 32, height: 32, fontSize: '.75rem', flexShrink: 0 }}>
                            {u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.name || '—'}</div>
                            <div style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.phone || '—'}</td>
                      <td>
                        <span className={`badge badge--${u.role === 'admin' ? 'orange' : 'blue'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '.8rem', color: 'var(--gray-500)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button className="btn btn--danger btn--icon btn--sm" onClick={() => handleDelete(u._id)}>
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
