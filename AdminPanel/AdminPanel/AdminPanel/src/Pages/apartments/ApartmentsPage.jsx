import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Trash2, Star, Eye, MapPin,
  BedDouble, Bath, Maximize2, X, Building2
} from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';

const TYPES = ['conference', 'residential', 'event', 'guest-house', 'premium-suite']
const EMPTY = { title:'', type:'studio', price:'', bedrooms:'', bathrooms:'', area:'', description:'',
  'location.address':'','location.city':'','location.state':'', amenities:'', isAvailable: true, featured: false };

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = async () => {
    try {
      const res = await api.get('/apartments?limit=50');
      setApartments(res.data || []);
    } catch { toast.error('Failed to load apartments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (apt) => {
    setForm({
      ...apt,
      amenities: (apt.amenities || []).join(', '),
      'location.address': apt.location?.address || '',
      'location.city': apt.location?.city || '',
      'location.state': apt.location?.state || '',
    });
    setModal('edit');
  };

  const closeModal = () => setModal(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
        location: {
          address: form['location.address'],
          city: form['location.city'],
          state: form['location.state'],
        },
      };
      if (modal === 'add') {
        await api.post('/apartments', payload);
        toast.success('Apartment created!');
      } else {
        await api.put(`/apartments/${form._id}`, payload);
        toast.success('Apartment updated!');
      }
      closeModal();
      load();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this apartment?')) return;
    try {
      await api.delete(`/apartments/${id}`);
      toast.success('Apartment deleted');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = apartments.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.location?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Apartments</h1>
          <p className="page-header__sub">{apartments.length} listings total</p>
        </div>
        <button className="btn btn--accent" onClick={openAdd}>
          <Plus size={16} /> Add Apartment
        </button>
      </div>

      <div className="card">
        <div className="card__header" style={{ paddingBottom: 16 }}>
          <div className="filter-bar" style={{ marginBottom: 0, flex: 1 }}>
            <div className="search-wrap">
              <span className="search-wrap__icon"><Search size={15} /></span>
              <input className="search-input" placeholder="Search apartments…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="card__body" style={{ padding: 0 }}>
          {loading ? (
            <div className="page-loading"><div className="spinner" /> Loading apartments…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon"><Building2 size={24} /></div>
              <div className="empty-state__title">No apartments found</div>
              <div className="empty-state__desc">Add your first apartment listing to get started.</div>
              <button className="btn btn--primary" onClick={openAdd}><Plus size={15} /> Add Apartment</button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr>
                  <th>Title</th><th>Type</th><th>Location</th>
                  <th>Price</th><th>Beds/Bath</th><th>Status</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {filtered.map(apt => (
                    <tr key={apt._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{apt.title}</div>
                        {apt.featured && <span className="badge badge--orange" style={{ marginTop: 3 }}>⭐ Featured</span>}
                      </td>
                      <td><span className="badge badge--blue">{apt.type}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} color="var(--gray-400)" />
                          <span>{apt.location?.city || '—'}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>${apt.price?.toLocaleString()}/mo</td>
                      <td>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '.8rem' }}>
                            <BedDouble size={13} color="var(--gray-400)" />{apt.bedrooms}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '.8rem' }}>
                            <Bath size={13} color="var(--gray-400)" />{apt.bathrooms}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge--${apt.isAvailable ? 'success' : 'danger'}`}>
                          {apt.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn--ghost btn--icon btn--sm" onClick={() => openEdit(apt)}><Edit2 size={14} /></button>
                          <button className="btn btn--danger btn--icon btn--sm" onClick={() => handleDelete(apt._id)}><Trash2 size={14} /></button>
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

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal modal--lg" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{modal === 'add' ? 'Add Apartment' : 'Edit Apartment'}</h3>
              <button className="modal__close" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal__body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input className="form-input" value={form.title}
                      onChange={e => setForm(p => ({...p, title: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select className="form-select" value={form.type}
                      onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price/month ($) *</label>
                    <input className="form-input" type="number" value={form.price}
                      onChange={e => setForm(p => ({...p, price: e.target.value}))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area (sq ft)</label>
                    <input className="form-input" type="number" value={form.area}
                      onChange={e => setForm(p => ({...p, area: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bedrooms</label>
                    <input className="form-input" type="number" min="0" value={form.bedrooms}
                      onChange={e => setForm(p => ({...p, bedrooms: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bathrooms</label>
                    <input className="form-input" type="number" min="0" value={form.bathrooms}
                      onChange={e => setForm(p => ({...p, bathrooms: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" value={form['location.city']}
                      onChange={e => setForm(p => ({...p, 'location.city': e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" value={form['location.state']}
                      onChange={e => setForm(p => ({...p, 'location.state': e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input className="form-input" value={form['location.address']}
                    onChange={e => setForm(p => ({...p, 'location.address': e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Amenities (comma-separated)</label>
                  <input className="form-input" placeholder="wifi, parking, gym, pool"
                    value={form.amenities}
                    onChange={e => setForm(p => ({...p, amenities: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={3} value={form.description}
                    onChange={e => setForm(p => ({...p, description: e.target.value}))} />
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.875rem', fontWeight: 600 }}>
                    <input type="checkbox" checked={form.isAvailable}
                      onChange={e => setForm(p => ({...p, isAvailable: e.target.checked}))} />
                    Available
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.875rem', fontWeight: 600 }}>
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(p => ({...p, featured: e.target.checked}))} />
                    Featured
                  </label>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : modal === 'add' ? 'Create Apartment' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
