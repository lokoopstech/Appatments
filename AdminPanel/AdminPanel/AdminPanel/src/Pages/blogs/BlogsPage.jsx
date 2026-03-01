import { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, Globe,
  FileText, X, Upload, Image, Tag, BookOpen,
  ToggleLeft, ToggleRight, Calendar, Hash
} from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import '../../components/ui/UI.css';
import './Blogs.css';

const CATS = ['travel-tips', 'news', 'nairobi-guides', 'hospitality', 'lifestyle'];

const EMPTY = {
  title: '',
  content: '',
  excerpt: '',
  category: 'travel-tips',
  tags: '',
  published: false,
  featuredImage: null,      // base64 or URL string
  featuredImageUrl: '',     // manual URL input
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // ── Fetch ALL blogs (not just published) ───
const load = async () => {
  setLoading(true);
  try {
    // ✅ Try admin endpoint first — returns ALL blogs including drafts
    const res = await api.get('/blogs/admin/all');
    setBlogs(res.data || []);   // ← only sets once, no fallback runs
  } catch {
    // ✅ Only runs if the above actually throws an error
    try {
      const res = await api.get('/blogs?limit=200');
      setBlogs(res.data || []);
    } catch {
      toast.error('Failed to load blogs');
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { load(); }, []);

  // ── Open modals ─────────────────────────────
  const openAdd = () => {
    setForm(EMPTY);
    setImgPreview(null);
    setModal('add');
  };

  const openEdit = (b) => {
    setForm({
      ...EMPTY,
      ...b,
      tags: (b.tags || []).join(', '),
      featuredImageUrl: b.featuredImage || '',
      featuredImage: null,
    });
    setImgPreview(b.featuredImage || null);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setImgPreview(null);
    setForm(EMPTY);
  };

  // ── Image handling ──────────────────────────
  const handleImageFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    const b64 = await fileToBase64(file);
    setImgPreview(b64);
    setForm(p => ({ ...p, featuredImage: b64, featuredImageUrl: '' }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const removeImage = () => {
    setImgPreview(null);
    setForm(p => ({ ...p, featuredImage: null, featuredImageUrl: '' }));
  };

  // ── Save ────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const finalImage = form.featuredImage || form.featuredImageUrl || undefined;
      const payload = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        category: form.category,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        published: form.published,
        featuredImage: finalImage,
      };

      if (modal === 'add') {
        await api.post('/blogs', payload);
        toast.success('Blog post created!');
      } else {
        await api.put(`/blogs/${form._id}`, payload);
        toast.success('Blog post updated!');
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post permanently?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog post deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Toggle publish ──────────────────────────
  const togglePublish = async (blog) => {
    try {
      await api.put(`/blogs/${blog._id}/publish`);
      toast.success(blog.published ? 'Moved to drafts' : 'Blog published!');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Filter ──────────────────────────────────
  const filtered = blogs.filter(b => {
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter ? b.category === catFilter : true;
    return matchSearch && matchCat;
  });

  const publishedCount = blogs.filter(b => b.published).length;
  const draftCount = blogs.filter(b => !b.published).length;

  // ── Render ──────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Blog Posts</h1>
          <p className="page-header__sub">
            {publishedCount} published · {draftCount} drafts
          </p>
        </div>
        <button className="btn btn--accent" onClick={openAdd}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Stats row */}
      <div className="blog-stats-row">
        {[
          { label: 'Total Posts',  value: blogs.length,    color: 'var(--blue-600)',  bg: 'var(--blue-50)' },
          { label: 'Published',    value: publishedCount,  color: 'var(--success)',   bg: 'var(--success-bg)' },
          { label: 'Drafts',       value: draftCount,      color: 'var(--warning)',   bg: 'var(--warning-bg)' },
          { label: 'Total Views',  value: blogs.reduce((s, b) => s + (b.views || 0), 0), color: 'var(--orange-500)', bg: 'var(--orange-50)' },
        ].map(s => (
          <div key={s.label} className="blog-stat-chip" style={{ background: s.bg }}>
            <span className="blog-stat-chip__value" style={{ color: s.color }}>{s.value}</span>
            <span className="blog-stat-chip__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="card">
        <div className="card__header" style={{ paddingBottom: 16 }}>
          <div className="filter-bar" style={{ marginBottom: 0, flex: 1 }}>
            <div className="search-wrap">
              <span className="search-wrap__icon"><Search size={15} /></span>
              <input
                className="search-input"
                placeholder="Search posts by title or excerpt…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ width: 180 }}
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATS.map(c => (
                <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card__body" style={{ padding: 0 }}>
          {loading ? (
            <div className="page-loading"><div className="spinner" /> Loading posts…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon"><FileText size={26} /></div>
              <div className="empty-state__title">No blog posts found</div>
              <div className="empty-state__desc">
                Start writing content to attract visitors.
              </div>
              <button className="btn btn--primary" onClick={openAdd}>
                <Plus size={15} /> Create First Post
              </button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>Category</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b._id}>
                      <td>
                        <div className="blog-row">
                          {b.featuredImage ? (
                            <img
                              src={b.featuredImage}
                              alt={b.title}
                              className="blog-row__thumb"
                              onError={e => e.target.style.display = 'none'}
                            />
                          ) : (
                            <div className="blog-row__thumb blog-row__thumb--empty">
                              <FileText size={14} color="var(--gray-300)" />
                            </div>
                          )}
                          <div>
                            <div className="blog-row__title">{b.title}</div>
                            <div className="blog-row__excerpt">
                              {b.excerpt?.slice(0, 65) || b.slug || '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge--blue" style={{ textTransform: 'capitalize' }}>
                          {b.category?.replace(/-/g, ' ') || '—'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={13} color="var(--gray-400)" />
                          <span>{b.views || 0}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge--${b.published ? 'success' : 'warning'}`}>
                          {b.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td style={{ fontSize: '.8rem', color: 'var(--gray-500)' }}>
                        {b.publishedAt
                          ? new Date(b.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button
                            className="btn btn--ghost btn--icon btn--sm"
                            title={b.published ? 'Unpublish' : 'Publish'}
                            onClick={() => togglePublish(b)}
                          >
                            <Globe size={14} color={b.published ? 'var(--success)' : 'var(--gray-300)'} />
                          </button>
                          <button
                            className="btn btn--ghost btn--icon btn--sm"
                            title="Edit"
                            onClick={() => openEdit(b)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="btn btn--danger btn--icon btn--sm"
                            title="Delete"
                            onClick={() => handleDelete(b._id)}
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

      {/* ── Modal ── */}
      {modal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal blog-modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                {modal === 'add' ? '✍️ New Blog Post' : '✏️ Edit Blog Post'}
              </h3>
              <button className="modal__close" onClick={closeModal}><X size={16} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body blog-modal__body">

                {/* Section: Featured Image */}
                <div className="blog-section">
                  <div className="blog-section__title">
                    <Image size={14} /> Featured Image
                  </div>

                  {imgPreview ? (
                    <div className="blog-img-preview">
                      <img src={imgPreview} alt="preview" />
                      <button type="button" className="blog-img-preview__remove" onClick={removeImage}>
                        <X size={14} /> Remove
                      </button>
                    </div>
                  ) : (
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
                        style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && handleImageFile(e.target.files[0])}
                      />
                      <Upload size={26} color="var(--blue-400)" />
                      <div className="upload-zone__text">
                        <strong>Click to upload</strong> or drag & drop
                      </div>
                      <div className="upload-zone__hint">PNG, JPG, WEBP — max 5MB</div>
                    </div>
                  )}

                  {/* URL fallback */}
                  {!imgPreview && (
                    <div className="form-group" style={{ marginTop: 12 }}>
                      <label className="form-label">Or paste image URL</label>
                      <input
                        className="form-input"
                        placeholder="https://cloudinary.com/your-image.jpg"
                        value={form.featuredImageUrl}
                        onChange={e => {
                          setForm(p => ({ ...p, featuredImageUrl: e.target.value, featuredImage: null }));
                          setImgPreview(e.target.value || null);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Section: Post Details */}
                <div className="blog-section">
                  <div className="blog-section__title">
                    <BookOpen size={14} /> Post Details
                  </div>

                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input
                      className="form-input"
                      placeholder="Write a compelling title…"
                      value={form.title}
                      onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      >
                        {CATS.map(c => (
                          <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        <Hash size={12} style={{ display: 'inline', marginRight: 4 }} />
                        Tags (comma-separated)
                      </label>
                      <input
                        className="form-input"
                        placeholder="nairobi, apartments, tips"
                        value={form.tags}
                        onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Excerpt / Summary</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="A short summary shown in previews and search results…"
                      value={form.excerpt}
                      onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Section: Content */}
                <div className="blog-section">
                  <div className="blog-section__title">
                    <FileText size={14} /> Content *
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <textarea
                      className="form-textarea blog-content-area"
                      rows={12}
                      placeholder="Write your full blog post here…"
                      value={form.content}
                      onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                      required
                    />
                    <div className="blog-content-count">
                      {form.content.length} characters
                      {form.content.length > 0 && (
                        <span> · ~{Math.ceil(form.content.split(/\s+/).length / 200)} min read</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Publish */}
                <div className="blog-section">
                  <div className="blog-section__title">
                    <Globe size={14} /> Publishing
                  </div>
                  <div className="blog-publish-toggle">
                    <button
                      type="button"
                      className={`toggle-btn ${form.published ? 'toggle-btn--on' : ''}`}
                      onClick={() => setForm(p => ({ ...p, published: !p.published }))}
                    >
                      {form.published ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                    <div>
                      <div className="toggle-label__title">
                        {form.published ? 'Publish immediately' : 'Save as draft'}
                      </div>
                      <div className="toggle-label__sub">
                        {form.published
                          ? 'This post will be visible on the public site'
                          : 'Only visible to admins — not yet public'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving
                    ? 'Saving…'
                    : modal === 'add'
                      ? (form.published ? 'Publish Post' : 'Save Draft')
                      : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}