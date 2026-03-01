import { useState, useEffect } from 'react';
import { Search, MessageSquare, Eye, Trash2, X, CheckCircle, Send, Filter } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';

const STATUS_BADGE = { new: 'orange', responded: 'success', closed: 'gray' };
const STATUS_OPTIONS = ['all', 'new', 'responded', 'closed'];

export default function ContactPage() {
  const [inquiries, setInquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [selected, setSelected]     = useState(null);

  // Reply state
  const [replyText, setReplyText]   = useState('');
  const [sending, setSending]       = useState(false);

  const toast = useToast();

  const load = async () => {
    try {
      const res = await api.get('/contact?limit=100');
      setInquiries(res.data || []);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Reset reply when a different inquiry is opened
  const openInquiry = (inquiry) => {
    setSelected(inquiry);
    setReplyText('');
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contact/${id}`, { status });
      toast.success('Status updated');
      load();
      setSelected(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Inquiry deleted');
      load();
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please write a reply before sending.');
      return;
    }
    setSending(true);
    try {
      // Send reply email + update status to 'responded' in one call
      await api.post(`/contact/${selected._id}/reply`, {
        message: replyText.trim(),
      });
      toast.success(`Reply sent to ${selected.email}`);
      setReplyText('');
      load();
      setSelected(null);
    } catch (err) {
      toast.error(err.message || 'Failed to send reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const filtered = inquiries.filter(i => {
    const matchesSearch =
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase()) ||
      i.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    new: inquiries.filter(i => i.status === 'new').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Contact Inquiries</h1>
          <p className="page-header__sub">
            {counts.new > 0
              ? `${counts.new} new ${counts.new === 1 ? 'inquiry' : 'inquiries'} awaiting reply`
              : 'All inquiries are up to date'}
          </p>
        </div>
      </div>

      {/* Summary stat strip */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'New',       value: counts.new,       badge: 'orange'  },
          { label: 'Responded', value: counts.responded, badge: 'success' },
          { label: 'Closed',    value: counts.closed,    badge: 'gray'    },
        ].map(({ label, value, badge }) => (
          <div key={label} className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`badge badge--${badge}`} style={{ fontSize: '1rem', padding: '4px 10px' }}>{value}</span>
            <span style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--gray-600)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card__header" style={{ paddingBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          {/* Search */}
          <div className="search-wrap" style={{ maxWidth: 300, flex: 1 }}>
            <span className="search-wrap__icon"><Search size={15} /></span>
            <input
              className="search-input"
              placeholder="Search by name, email or subject…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter tabs */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Filter size={14} style={{ color: 'var(--gray-400)' }} />
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`btn btn--sm ${statusFilter === s ? 'btn--primary' : 'btn--ghost'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="card__body" style={{ padding: 0 }}>
          {loading ? (
            <div className="page-loading"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon"><MessageSquare size={24} /></div>
              <div className="empty-state__title">No inquiries found</div>
              <div className="empty-state__sub">Try adjusting your search or filter</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(i => (
                    <tr key={i._id} style={{ cursor: 'pointer' }} onClick={() => openInquiry(i)}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{i.name}</div>
                        <div style={{ fontSize: '.8rem', color: 'var(--gray-400)' }}>{i.email}</div>
                        {i.phone && (
                          <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>{i.phone}</div>
                        )}
                      </td>
                      <td>{i.subject || 'General Inquiry'}</td>
                      <td>
                        <span className={`badge badge--${STATUS_BADGE[i.status] || 'gray'}`}>{i.status}</span>
                      </td>
                      <td style={{ fontSize: '.8rem', color: 'var(--gray-500)' }}>
                        {new Date(i.createdAt).toLocaleDateString('en-KE', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                        <div style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>
                          {new Date(i.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button
                            className="btn btn--ghost btn--icon btn--sm"
                            title="View & Reply"
                            onClick={() => openInquiry(i)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn--danger btn--icon btn--sm"
                            title="Delete"
                            onClick={() => handleDelete(i._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Inquiry detail + reply modal ── */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal modal--lg" onClick={e => e.stopPropagation()}>

            <div className="modal__header">
              <div>
                <h3 className="modal__title">Inquiry from {selected.name}</h3>
                <span className={`badge badge--${STATUS_BADGE[selected.status] || 'gray'}`} style={{ marginTop: 4 }}>
                  {selected.status}
                </span>
              </div>
              <button className="modal__close" onClick={() => setSelected(null)}><X size={16} /></button>
            </div>

            <div className="modal__body">
              {/* Customer details */}
              <div className="grid-2" style={{ gap: 14, marginBottom: 20 }}>
                {[
                  ['Name',    selected.name],
                  ['Email',   selected.email],
                  ['Phone',   selected.phone || '—'],
                  ['Subject', selected.subject || 'General'],
                  ['Received', new Date(selected.createdAt).toLocaleString('en-KE')],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{
                      fontSize: '.72rem', fontWeight: 700, color: 'var(--gray-400)',
                      textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3
                    }}>{k}</div>
                    <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Customer message */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: '.72rem', fontWeight: 700, color: 'var(--gray-400)',
                  textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8
                }}>
                  Customer Message
                </div>
                <div style={{
                  background: 'var(--gray-50)', borderRadius: 'var(--radius)',
                  padding: '14px 16px', fontSize: '.875rem',
                  color: 'var(--gray-700)', lineHeight: 1.75,
                  borderLeft: '3px solid var(--primary)'
                }}>
                  {selected.message}
                </div>
              </div>

              {/* Reply box — shown only when not yet closed */}
              {selected.status !== 'closed' && (
                <div>
                  <div style={{
                    fontSize: '.72rem', fontWeight: 700, color: 'var(--gray-400)',
                    textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8
                  }}>
                    Your Reply
                  </div>
                  <textarea
                    className="form-textarea"
                    style={{ width: '100%', minHeight: 130, resize: 'vertical', boxSizing: 'border-box' }}
                    placeholder={`Write your reply to ${selected.name}… This will be sent directly to ${selected.email}`}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    disabled={sending}
                  />
                  <p style={{ fontSize: '.78rem', color: 'var(--gray-400)', marginTop: 6 }}>
                    The reply will be sent via email to <strong>{selected.email}</strong> and the inquiry will be marked as <em>responded</em>.
                  </p>
                </div>
              )}

              {selected.status === 'closed' && (
                <div style={{
                  background: 'var(--gray-100)', borderRadius: 'var(--radius)',
                  padding: '12px 16px', fontSize: '.85rem', color: 'var(--gray-500)', textAlign: 'center'
                }}>
                  This inquiry is closed. Reopen it by setting status to <em>responded</em> if you need to follow up.
                </div>
              )}
            </div>

            <div className="modal__footer" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              {/* Left: status actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                {selected.status === 'responded' && (
                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => updateStatus(selected._id, 'closed')}
                  >
                    <CheckCircle size={14} /> Mark as Closed
                  </button>
                )}
                {selected.status === 'closed' && (
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => updateStatus(selected._id, 'responded')}
                  >
                    Reopen Inquiry
                  </button>
                )}
              </div>

              {/* Right: send reply */}
              {selected.status !== 'closed' && (
                <button
                  className="btn btn--primary btn--sm"
                  onClick={handleReply}
                  disabled={sending || !replyText.trim()}
                >
                  {sending ? (
                    <><span className="spinner" style={{ width: 14, height: 14 }} /> Sending…</>
                  ) : (
                    <><Send size={14} /> Send Reply</>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}