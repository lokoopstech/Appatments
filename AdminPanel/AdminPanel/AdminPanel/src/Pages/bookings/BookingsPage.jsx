import { useState, useEffect } from 'react';
import { Search, CalendarCheck, Eye, X, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';

const STATUS_MAP = {
  pending:   { label: 'Pending',   badge: 'warning' },
  confirmed: { label: 'Confirmed', badge: 'success' },
  cancelled: { label: 'Cancelled', badge: 'danger'  },
  completed: { label: 'Completed', badge: 'blue'    },
};

export default function BookingsPage() {
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected]         = useState(null);
  const toast = useToast();

  const load = async () => {
    try {
      const res = await api.get(`/bookings?limit=100${statusFilter ? `&status=${statusFilter}` : ''}`);
      setBookings(res.data || []);
    } catch { toast.error('Failed to load bookings'); }
    finally   { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}`, { status });
      toast.success(`Booking marked as ${status} — customer notified by email`);
      load();
      setSelected(null);
    } catch (err) { toast.error(err.message); }
  };

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  // Support both guestName (old) and guestFirstName+guestLastName (new model)
  const fullName = (b) =>
    b.guestFirstName
      ? `${b.guestFirstName} ${b.guestLastName || ''}`.trim()
      : b.guestName || '—';

  const filtered = bookings.filter(b => {
    const name = fullName(b).toLowerCase();
    const q    = search.toLowerCase();
    return name.includes(q) || b.guestEmail?.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Bookings</h1>
          <p className="page-header__sub">{bookings.length} total · {bookings.filter(b => b.status === 'pending').length} pending</p>
        </div>
      </div>

      <div className="card">
        <div className="card__header" style={{ paddingBottom: 16 }}>
          <div className="filter-bar" style={{ marginBottom: 0, flex: 1 }}>
            <div className="search-wrap">
              <span className="search-wrap__icon"><Search size={15} /></span>
              <input className="search-input" placeholder="Search by guest name or email…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 160 }}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              {Object.entries(STATUS_MAP).map(([v, { label }]) => (
                <option key={v} value={v}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card__body" style={{ padding: 0 }}>
          {loading ? (
            <div className="page-loading"><div className="spinner" /> Loading bookings…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon"><CalendarCheck size={24} /></div>
              <div className="empty-state__title">No bookings found</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Apartment</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{fullName(b)}</div>
                        <div style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>{b.guestEmail}</div>
                        {b.guestPhone && (
                          <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>{b.guestPhone}</div>
                        )}
                      </td>
                      <td>{b.apartmentId?.title || 'N/A'}</td>
                      <td>{fmt(b.checkInDate)}</td>
                      <td>{fmt(b.checkOutDate)}</td>
                      <td style={{ fontWeight: 700 }}>
                        {b.totalPrice ? `KES ${b.totalPrice.toLocaleString()}` : '—'}
                      </td>
                      <td>
                        <span className={`badge badge--${STATUS_MAP[b.status]?.badge || 'gray'}`}>
                          {STATUS_MAP[b.status]?.label || b.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge--${
                          b.paymentStatus === 'paid'     ? 'success' :
                          b.paymentStatus === 'refunded' ? 'warning' : 'gray'
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setSelected(b)}>
                          <Eye size={14} />
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

      {/* ── Detail + Actions Modal ── */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal modal--lg" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <div>
                <h3 className="modal__title">Booking Details</h3>
                <span className={`badge badge--${STATUS_MAP[selected.status]?.badge || 'gray'}`} style={{ marginTop: 4 }}>
                  {STATUS_MAP[selected.status]?.label || selected.status}
                </span>
              </div>
              <button className="modal__close" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>

            <div className="modal__body">
              <div className="grid-2" style={{ gap: 14, marginBottom: 16 }}>
                {[
                  ['Guest Name',   fullName(selected)],
                  ['Email',        selected.guestEmail],
                  ['Phone',        selected.guestPhone],
                  ['Guests',       selected.numberOfGuests],
                  ['Check In',     fmt(selected.checkInDate)],
                  ['Check Out',    fmt(selected.checkOutDate)],
                  ['Total Price',  selected.totalPrice ? `KES ${selected.totalPrice.toLocaleString()}` : '—'],
                  ['Payment',      selected.paymentStatus],
                  ['Apartment',    selected.apartmentId?.title || 'N/A'],
                  ['Ref',          `#${selected._id?.slice(-8).toUpperCase()}`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{
                      fontSize: '.72rem', fontWeight: 700, color: 'var(--gray-400)',
                      textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3
                    }}>{k}</div>
                    <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{v || '—'}</div>
                  </div>
                ))}
              </div>

              {selected.specialRequests && (
                <div style={{
                  background: 'var(--gray-50)', borderRadius: 'var(--radius)',
                  padding: '12px 14px', fontSize: '.875rem', color: 'var(--gray-600)',
                  borderLeft: '3px solid var(--primary)'
                }}>
                  <strong>Special Requests:</strong> {selected.specialRequests}
                </div>
              )}

              {/* Email notification notice */}
              {(selected.status === 'pending' || selected.status === 'confirmed') && (
                <div style={{
                  marginTop: 16, background: '#eff6ff', borderRadius: 'var(--radius)',
                  padding: '10px 14px', fontSize: '.8rem', color: '#1d4ed8', display: 'flex', gap: 8
                }}>
                  <span>📧</span>
                  <span>Changing the status will automatically send an email notification to <strong>{selected.guestEmail}</strong></span>
                </div>
              )}
            </div>

            <div className="modal__footer">
              {selected.status === 'pending' && (
                <>
                  <button className="btn btn--danger btn--sm"
                    onClick={() => updateStatus(selected._id, 'cancelled')}>
                    <XCircle size={14} /> Cancel Booking
                  </button>
                  <button className="btn btn--primary btn--sm"
                    onClick={() => updateStatus(selected._id, 'confirmed')}>
                    <CheckCircle size={14} /> Confirm Booking
                  </button>
                </>
              )}
              {selected.status === 'confirmed' && (
                <>
                  <button className="btn btn--danger btn--sm"
                    onClick={() => updateStatus(selected._id, 'cancelled')}>
                    <XCircle size={14} /> Cancel
                  </button>
                  <button className="btn btn--secondary btn--sm"
                    onClick={() => updateStatus(selected._id, 'completed')}>
                    <CheckCircle size={14} /> Mark Completed
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}