import { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Image, Trash2, Edit2, X,
  Upload, Star, Eye, Calendar, MapPin, Users,
  Hash, ToggleLeft, ToggleRight, SortAsc, Building2
} from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';
import './Gallery.css';

const TYPES = ['event', 'apartment', 'amenity', 'community', 'neighborhood', 'renovation', 'testimonial'];

const EMPTY = {
  title: '',
  description: '',
  type: 'apartment',
  apartmentId: '',
  images: [],           // array of base64 or URLs
  imageUrls: '',        // raw URL input string
  tags: '',
  isFeatured: false,
  isPublished: true,
  order: 0,
  'eventDetails.eventName': '',
  'eventDetails.eventDate': '',
  'eventDetails.location': '',
  'eventDetails.attendees': '',
};

// Convert file to base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [previewImages, setPreviewImages] = useState([]); // local previews
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // ── Load gallery items ──────────────────────
  const load = async () => {
    try {
      const q = typeFilter ? `&type=${typeFilter}` : '';
      const res = await api.get(`/gallery?limit=100${q}`);
      setItems(res.data || []);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [typeFilter]);

  // ── Open modals ─────────────────────────────
  const openAdd = () => {
    setForm(EMPTY);
    setPreviewImages([]);
    setModal('add');
  };

  const openEdit = (item) => {
    setForm({
      ...EMPTY,
      ...item,
      tags: (item.tags || []).join(', '),
      imageUrls: (item.images || []).join(', '),
      images: [],
      'eventDetails.eventName': item.eventDetails?.eventName || '',
      'eventDetails.eventDate': item.eventDetails?.eventDate
        ? new Date(item.eventDetails.eventDate).toISOString().split('T')[0]
        : '',
      'eventDetails.location': item.eventDetails?.location || '',
      'eventDetails.attendees': item.eventDetails?.attendees || '',
    });
    // Show existing images as previews
    setPreviewImages((item.images || []).map(url => ({ src: url, isExisting: true })));
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setPreviewImages([]);
    setForm(EMPTY);
  };

  // ── Image handling ──────────────────────────
  const handleFiles = async (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!valid.length) return;

    const newPreviews = [];
    const newBase64s = [];

    for (const file of valid) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is over 5MB — skipped`);
        continue;
      }
      const b64 = await fileToBase64(file);
      newBase64s.push(b64);
      newPreviews.push({ src: b64, name: file.name, isExisting: false });
    }

    setPreviewImages(prev => [...prev, ...newPreviews]);
    setForm(prev => ({ ...prev, images: [...(prev.images || []), ...newBase64s] }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePreview = (index) => {
    const removed = previewImages[index];
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    if (!removed.isExisting) {
      setForm(prev => {
        const newImages = [...(prev.images || [])];
        // Remove the corresponding base64 entry
        const b64Index = previewImages.slice(0, index).filter(p => !p.isExisting).length;
        newImages.splice(b64Index, 1);
        return { ...prev, images: newImages };
      });
    } else {
      // Remove from imageUrls
      setForm(prev => {
        const urls = prev.imageUrls.split(',').map(s => s.trim()).filter(Boolean);
        urls.splice(index, 1);
        return { ...prev, imageUrls: urls.join(', ') };
      });
    }
  };

  // ── Save ────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Combine uploaded images + manually entered URLs
      const urlImages = form.imageUrls
        ? form.imageUrls.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const uploadedImages = form.images || [];
      const allImages = [...urlImages, ...uploadedImages];

      if (!allImages.length && modal === 'add') {
        toast.error('Please add at least one image');
        setSaving(false);
        return;
      }

      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        images: allImages,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
        order: Number(form.order) || 0,
        ...(form.apartmentId && { apartmentId: form.apartmentId }),
        ...(form.type === 'event' && {
          eventDetails: {
            eventName: form['eventDetails.eventName'],
            eventDate: form['eventDetails.eventDate'] || undefined,
            location: form['eventDetails.location'],
            attendees: form['eventDetails.attendees']
              ? Number(form['eventDetails.attendees'])
              : undefined,
          },
        }),
      };

      if (modal === 'add') {
        await api.post('/gallery', payload);
        toast.success('Gallery item created!');
      } else {
        await api.put(`/gallery/${form._id}`, payload);
        toast.success('Gallery item updated!');
      }

      closeModal();
      load();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Gallery item deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered = items.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.type?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ──────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Gallery</h1>
          <p className="page-header__sub">{items.length} items across {TYPES.length} categories</p>
        </div>
        <button className="btn btn--accent" onClick={openAdd}>
          <Plus size={16} /> Add Gallery Item
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-wrap__icon"><Search size={15} /></span>
          <input
            className="search-input"
            placeholder="Search gallery…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ width: 180 }}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {TYPES.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="page-loading"><div className="spinner" /> Loading gallery…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon"><Image size={28} /></div>
          <div className="empty-state__title">No gallery items found</div>
          <div className="empty-state__desc">
            Upload photos of apartments, events, amenities and more.
          </div>
          <button className="btn btn--primary" onClick={openAdd}>
            <Plus size={15} /> Add First Item
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {filtered.map(item => (
            <div key={item._id} className="gallery-card">
              <div className="gallery-card__img">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="gallery-card__placeholder">
                    <Image size={36} color="var(--gray-300)" />
                  </div>
                )}
                <div className="gallery-card__overlay">
                  <span className="badge badge--blue">{item.type}</span>
                  {item.isFeatured && <span className="badge badge--orange">⭐ Featured</span>}
                  {!item.isPublished && <span className="badge badge--gray">Draft</span>}
                </div>
                {item.images?.length > 1 && (
                  <div className="gallery-card__count">
                    <Image size={11} /> {item.images.length}
                  </div>
                )}
              </div>
              <div className="gallery-card__body">
                <div className="gallery-card__title">{item.title}</div>
                <div className="gallery-card__desc">
                  {item.description?.slice(0, 75)}{item.description?.length > 75 ? '…' : ''}
                </div>
                {item.type === 'event' && item.eventDetails?.eventDate && (
                  <div className="gallery-card__meta">
                    <Calendar size={12} />
                    {new Date(item.eventDetails.eventDate).toLocaleDateString()}
                    {item.eventDetails?.attendees && (
                      <><Users size={12} style={{ marginLeft: 8 }} /> {item.eventDetails.attendees}</>
                    )}
                  </div>
                )}
                {item.tags?.length > 0 && (
                  <div className="gallery-card__tags">
                    {item.tags.slice(0, 3).map(t => (
                      <span key={t} className="gallery-tag">#{t}</span>
                    ))}
                  </div>
                )}
                <div className="gallery-card__footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Eye size={12} color="var(--gray-400)" />
                    <span style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>{item.viewCount || 0} views</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn--ghost btn--icon btn--sm" title="Edit" onClick={() => openEdit(item)}>
                      <Edit2 size={13} />
                    </button>
                    <button className="btn btn--danger btn--icon btn--sm" title="Delete" onClick={() => handleDelete(item._id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal modal--lg gallery-modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                {modal === 'add' ? 'Add Gallery Item' : 'Edit Gallery Item'}
              </h3>
              <button className="modal__close" onClick={closeModal}><X size={16} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body gallery-modal__body">

                {/* ── Section: Basic Info ── */}
                <div className="form-section">
                  <div className="form-section__title">Basic Information</div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input
                        className="form-input"
                        placeholder="e.g. Annual Conference 2024"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type *</label>
                      <select
                        className="form-select"
                        value={form.type}
                        onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                      >
                        {TYPES.map(t => (
                          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="Describe this gallery item…"
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <Building2 size={13} style={{ display:'inline', marginRight:5 }} />
                        Apartment ID (optional)
                      </label>
                      <input
                        className="form-input"
                        placeholder="Link to an apartment (MongoDB ID)"
                        value={form.apartmentId}
                        onChange={e => setForm(p => ({ ...p, apartmentId: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <SortAsc size={13} style={{ display:'inline', marginRight:5 }} />
                        Display Order
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={form.order}
                        onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section: Event Details ── */}
                {form.type === 'event' && (
                  <div className="form-section form-section--event">
                    <div className="form-section__title">
                      <Calendar size={14} /> Event Details
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Event Name</label>
                        <input
                          className="form-input"
                          placeholder="e.g. Annual Property Conference"
                          value={form['eventDetails.eventName']}
                          onChange={e => setForm(p => ({ ...p, 'eventDetails.eventName': e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Event Date</label>
                        <input
                          className="form-input"
                          type="date"
                          value={form['eventDetails.eventDate']}
                          onChange={e => setForm(p => ({ ...p, 'eventDetails.eventDate': e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          <MapPin size={13} style={{ display:'inline', marginRight:4 }} />
                          Event Location
                        </label>
                        <input
                          className="form-input"
                          placeholder="e.g. Grand Hall, Downtown"
                          value={form['eventDetails.location']}
                          onChange={e => setForm(p => ({ ...p, 'eventDetails.location': e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          <Users size={13} style={{ display:'inline', marginRight:4 }} />
                          Number of Attendees
                        </label>
                        <input
                          className="form-input"
                          type="number"
                          min="0"
                          placeholder="e.g. 150"
                          value={form['eventDetails.attendees']}
                          onChange={e => setForm(p => ({ ...p, 'eventDetails.attendees': e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Section: Images ── */}
                <div className="form-section">
                  <div className="form-section__title">
                    <Image size={14} /> Images
                  </div>

                  {/* Drag & Drop Upload Zone */}
                  <div
                    className={`upload-zone ${dragOver ? 'upload-zone--active' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={e => handleFiles(e.target.files)}
                    />
                    <Upload size={28} color="var(--blue-400)" />
                    <div className="upload-zone__text">
                      <strong>Click to upload</strong> or drag & drop images here
                    </div>
                    <div className="upload-zone__hint">PNG, JPG, WEBP up to 5MB each</div>
                  </div>

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="img-preview-grid">
                      {previewImages.map((img, i) => (
                        <div key={i} className="img-preview">
                          <img src={img.src} alt={img.name || `image-${i}`} />
                          {img.isExisting && (
                            <span className="img-preview__badge">Existing</span>
                          )}
                          <button
                            type="button"
                            className="img-preview__remove"
                            onClick={() => removePreview(i)}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual URL input */}
                  <div className="form-group" style={{ marginTop: 14 }}>
                    <label className="form-label">Or paste image URLs (comma-separated)</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="https://cloudinary.com/img1.jpg, https://cloudinary.com/img2.jpg"
                      value={form.imageUrls}
                      onChange={e => setForm(p => ({ ...p, imageUrls: e.target.value }))}
                    />
                  </div>
                </div>

                {/* ── Section: Tags & Settings ── */}
                <div className="form-section">
                  <div className="form-section__title">
                    <Hash size={14} /> Tags & Settings
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags (comma-separated)</label>
                    <input
                      className="form-input"
                      placeholder="conference, networking, 2024"
                      value={form.tags}
                      onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                    />
                  </div>
                  <div className="toggle-row">
                    <label className="toggle-label">
                      <button
                        type="button"
                        className={`toggle-btn ${form.isFeatured ? 'toggle-btn--on' : ''}`}
                        onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
                      >
                        {form.isFeatured ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                      </button>
                      <div>
                        <div className="toggle-label__title">Featured</div>
                        <div className="toggle-label__sub">Show on homepage highlights</div>
                      </div>
                    </label>
                    <label className="toggle-label">
                      <button
                        type="button"
                        className={`toggle-btn ${form.isPublished ? 'toggle-btn--on' : ''}`}
                        onClick={() => setForm(p => ({ ...p, isPublished: !p.isPublished }))}
                      >
                        {form.isPublished ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                      </button>
                      <div>
                        <div className="toggle-label__title">Published</div>
                        <div className="toggle-label__sub">Visible on the public site</div>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : modal === 'add' ? 'Create Gallery Item' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}