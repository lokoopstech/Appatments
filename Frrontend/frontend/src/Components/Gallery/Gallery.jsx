import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css';

/* ── API ──────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchGallery = async ({ type = '', page = 1, limit = 50 } = {}) => {
  const params = new URLSearchParams({ page, limit, isPublished: 'true' });
  if (type && type !== 'all') params.set('type', type);
  const res = await fetch(`${API_BASE}/gallery?${params}`);
  if (!res.ok) throw new Error('Failed to load gallery');
  return res.json();
};

const incrementView = (id) =>
  fetch(`${API_BASE}/gallery/${id}/view`).catch(() => {});

/* ── Helpers ──────────────────────────────── */
const TYPE_LABELS = {
  all:          'All',
  apartment:    'Apartments',
  event:        'Events',
  amenity:      'Amenities',
  community:    'Community',
  neighborhood: 'Neighbourhood',
  renovation:   'Renovations',
  testimonial:  'Testimonials',
};

const TYPE_ICONS = {
  all:          '✦',
  apartment:    '🏢',
  event:        '🎉',
  amenity:      '✨',
  community:    '🤝',
  neighborhood: '🗺️',
  renovation:   '🔨',
  testimonial:  '💬',
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

/* ── Skeleton ─────────────────────────────── */
const Skeleton = ({ wide }) => (
  <div className={`gl-skeleton ${wide ? 'gl-skeleton--wide' : ''}`}>
    <div className="gl-skeleton__img" />
    <div className="gl-skeleton__body">
      <div className="gl-skeleton__line gl-skeleton__line--sm" />
      <div className="gl-skeleton__line" />
      <div className="gl-skeleton__line gl-skeleton__line--md" />
    </div>
  </div>
);

/* ── Lightbox ─────────────────────────────── */
const Lightbox = ({ item, imgIndex, onClose, onPrev, onNext }) => {
  const images = item?.images || [];
  const current = images[imgIndex] || '';

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div className="gl-lightbox" onClick={onClose}>
      <div className="gl-lightbox__backdrop" />

      {/* Close */}
      <button className="gl-lightbox__close" onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button className="gl-lightbox__nav gl-lightbox__nav--prev"
          onClick={e => { e.stopPropagation(); onPrev(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      )}

      {/* Image */}
      <div className="gl-lightbox__stage" onClick={e => e.stopPropagation()}>
        <img
          src={current}
          alt={item.title}
          className="gl-lightbox__img"
          key={current}
        />

        {/* Info panel */}
        <div className="gl-lightbox__info">
          <div className="gl-lightbox__meta">
            <span className="gl-type-chip gl-type-chip--sm">
              {TYPE_ICONS[item.type]} {TYPE_LABELS[item.type] || item.type}
            </span>
            {item.isFeatured && <span className="gl-featured-chip">⭐ Featured</span>}
          </div>
          <h3 className="gl-lightbox__title">{item.title}</h3>
          <p className="gl-lightbox__desc">{item.description}</p>

          {/* Event details */}
          {item.type === 'event' && item.eventDetails && (
            <div className="gl-lightbox__event">
              {item.eventDetails.eventName && (
                <span>🎪 {item.eventDetails.eventName}</span>
              )}
              {item.eventDetails.eventDate && (
                <span>📅 {fmtDate(item.eventDetails.eventDate)}</span>
              )}
              {item.eventDetails.location && (
                <span>📍 {item.eventDetails.location}</span>
              )}
              {item.eventDetails.attendees && (
                <span>👥 {item.eventDetails.attendees.toLocaleString()} attendees</span>
              )}
            </div>
          )}

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="gl-lightbox__tags">
              {item.tags.map(t => (
                <span key={t} className="gl-tag">#{t}</span>
              ))}
            </div>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="gl-lightbox__counter">
              {imgIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button className="gl-lightbox__nav gl-lightbox__nav--next"
          onClick={e => { e.stopPropagation(); onNext(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="gl-lightbox__thumbs" onClick={e => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              className={`gl-lightbox__thumb ${i === imgIndex ? 'gl-lightbox__thumb--active' : ''}`}
              onClick={() => onPrev(i - imgIndex)}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Gallery Component ───────────────── */
const Gallery = () => {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeType, setActiveType] = useState('all');
  const [search, setSearch]         = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightbox, setLightbox]     = useState(null); // { item, imgIndex }
  const filterRef = useRef(null);

  /* ── Fetch ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchGallery({ limit: 200 });
        setItems(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Filter ── */
  const filtered = items.filter(item => {
    const matchType = activeType === 'all' || item.type === activeType;
    const matchSearch = !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  /* ── Featured items ── */
  const featuredItems = items.filter(i => i.isFeatured).slice(0, 3);

  /* ── Type counts ── */
  const typeCount = (t) =>
    t === 'all' ? items.length : items.filter(i => i.type === t).length;

  /* ── Lightbox handlers ── */
  const openLightbox = (item, imgIndex = 0) => {
    setLightbox({ item, imgIndex });
    incrementView(item._id);
  };

  const closeLightbox = () => setLightbox(null);

  const lbNext = useCallback(() => {
    if (!lightbox) return;
    const imgs = lightbox.item.images || [];
    setLightbox(prev => ({
      ...prev,
      imgIndex: (prev.imgIndex + 1) % imgs.length,
    }));
  }, [lightbox]);

  const lbPrev = useCallback(() => {
    if (!lightbox) return;
    const imgs = lightbox.item.images || [];
    setLightbox(prev => ({
      ...prev,
      imgIndex: (prev.imgIndex - 1 + imgs.length) % imgs.length,
    }));
  }, [lightbox]);

  /* ── Render ── */
  return (
    <div className="gl-root">

      {/* ── HERO ── */}
      <section className="gl-hero">
        <div className="gl-hero__mesh" />
        <div className="gl-hero__orb gl-hero__orb--1" />
        <div className="gl-hero__orb gl-hero__orb--2" />
        <div className="gl-hero__orb gl-hero__orb--3" />

        <div className="gl-hero__inner">
          <nav className="gl-breadcrumb">
            <Link to="/home">Home</Link>
            <span className="gl-breadcrumb__sep">/</span>
            <span>Gallery</span>
          </nav>
          <p className="gl-eyebrow">Visual Stories</p>
          <h1 className="gl-hero__title">
            Our <span className="gl-hero__accent">Spaces</span><br />
            &amp; Moments
          </h1>
          <p className="gl-hero__sub">
            Step inside SpaceHub — explore our apartments, event spaces, amenities,
            and the vibrant community we've built in the heart of Nairobi.
          </p>

          {/* Search */}
          <div className="gl-search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search photos, events, spaces…"
              value={search}
              onChange={e => { setSearch(e.target.value); setVisibleCount(12); }}
            />
            {search && (
              <button className="gl-search__clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Hero stats */}
          <div className="gl-hero__stats">
            <div className="gl-hero__stat">
              <strong>{loading ? '…' : items.length}</strong>
              <span>Photos</span>
            </div>
            <div className="gl-hero__stat-div" />
            <div className="gl-hero__stat">
              <strong>{Object.keys(TYPE_LABELS).length - 1}</strong>
              <span>Categories</span>
            </div>
            <div className="gl-hero__stat-div" />
            <div className="gl-hero__stat">
              <strong>{loading ? '…' : featuredItems.length}</strong>
              <span>Featured</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ERROR ── */}
      {error && (
        <div className="gl-error">
          <span>⚠️</span>
          <span>Could not load gallery — {error}</span>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* ── FEATURED STRIP ── */}
      {!loading && !error && featuredItems.length > 0 && !search && activeType === 'all' && (
        <section className="gl-featured-section">
          <div className="gl-section-header">
            <div className="gl-section-header__line" />
            <h2 className="gl-section-title">
              <span>⭐</span> Featured Highlights
            </h2>
            <div className="gl-section-header__line" />
          </div>
          <div className="gl-featured-strip">
            {featuredItems.map((item, i) => (
              <div
                key={item._id}
                className={`gl-featured-card ${i === 0 ? 'gl-featured-card--hero' : ''}`}
                onClick={() => openLightbox(item, 0)}
              >
                <div className="gl-featured-card__img">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title} />
                  ) : (
                    <div className="gl-img-placeholder">
                      <span>{TYPE_ICONS[item.type] || '🖼️'}</span>
                    </div>
                  )}
                  <div className="gl-featured-card__overlay" />
                  <div className="gl-featured-card__content">
                    <span className="gl-type-chip">
                      {TYPE_ICONS[item.type]} {TYPE_LABELS[item.type] || item.type}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description?.slice(0, 90)}{item.description?.length > 90 ? '…' : ''}</p>
                    {item.images?.length > 1 && (
                      <span className="gl-img-count">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        {item.images.length} photos
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MAIN GALLERY ── */}
      <section className="gl-main" ref={filterRef}>

        {/* Filter tabs */}
        <div className="gl-filter-bar">
          <div className="gl-filter-scroll">
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <button
                key={key}
                className={`gl-filter-btn ${activeType === key ? 'gl-filter-btn--active' : ''}`}
                onClick={() => { setActiveType(key); setVisibleCount(12); setSearch(''); }}
              >
                <span className="gl-filter-btn__icon">{TYPE_ICONS[key]}</span>
                {label}
                {!loading && (
                  <span className="gl-filter-btn__count">{typeCount(key)}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results info */}
        {!loading && (
          <div className="gl-results-bar">
            <span>
              {search
                ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
                : `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length} items`}
            </span>
            {(search || activeType !== 'all') && (
              <button className="gl-clear-btn"
                onClick={() => { setSearch(''); setActiveType('all'); }}>
                Clear filters ✕
              </button>
            )}
          </div>
        )}

        {/* Masonry grid */}
        {loading ? (
          <div className="gl-grid">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} wide={i % 5 === 0} />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="gl-grid">
            {visible.map((item, i) => (
              <GalleryCard
                key={item._id}
                item={item}
                index={i}
                onOpen={(imgIdx) => openLightbox(item, imgIdx)}
              />
            ))}
          </div>
        ) : (
          <div className="gl-empty">
            <div className="gl-empty__icon">🔍</div>
            <h3>No items found</h3>
            <p>Try a different category or search term.</p>
            <button className="gl-btn gl-btn--outline"
              onClick={() => { setSearch(''); setActiveType('all'); }}>
              Browse All
            </button>
          </div>
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="gl-load-more">
            <button
              className="gl-btn gl-btn--load"
              onClick={() => setVisibleCount(v => v + 12)}
            >
              Load More
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        )}
      </section>

      {/* ── EVENTS SPOTLIGHT ── */}
      {!loading && !error && items.filter(i => i.type === 'event').length > 0 && (
        <section className="gl-events-section">
          <div className="gl-section-header">
            <div className="gl-section-header__line" />
            <h2 className="gl-section-title">
              <span>🎉</span> Events at SpaceHub
            </h2>
            <div className="gl-section-header__line" />
          </div>
          <div className="gl-events-grid">
            {items
              .filter(i => i.type === 'event')
              .slice(0, 4)
              .map(item => (
                <div
                  key={item._id}
                  className="gl-event-card"
                  onClick={() => openLightbox(item, 0)}
                >
                  <div className="gl-event-card__img">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.title} />
                    ) : (
                      <div className="gl-img-placeholder"><span>🎉</span></div>
                    )}
                    <div className="gl-event-card__overlay" />
                  </div>
                  <div className="gl-event-card__body">
                    <h4>{item.title}</h4>
                    {item.eventDetails?.eventName && (
                      <p className="gl-event-card__name">🎪 {item.eventDetails.eventName}</p>
                    )}
                    <div className="gl-event-card__details">
                      {item.eventDetails?.eventDate && (
                        <span>📅 {fmtDate(item.eventDetails.eventDate)}</span>
                      )}
                      {item.eventDetails?.location && (
                        <span>📍 {item.eventDetails.location}</span>
                      )}
                      {item.eventDetails?.attendees && (
                        <span>👥 {item.eventDetails.attendees.toLocaleString()}</span>
                      )}
                    </div>
                    {item.tags?.length > 0 && (
                      <div className="gl-event-card__tags">
                        {item.tags.slice(0, 3).map(t => (
                          <span key={t} className="gl-tag">#{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="gl-cta">
        <div className="gl-cta__glow gl-cta__glow--1" />
        <div className="gl-cta__glow gl-cta__glow--2" />
        <div className="gl-cta__inner">
          <p className="gl-eyebrow gl-eyebrow--light">Experience It in Person</p>
          <h2>Book Your Stay or Event Today</h2>
          <p>Everything you see in our gallery is available to you. From stunning apartments to world-class event spaces — SpaceHub is ready for you.</p>
          <div className="gl-cta__btns">
            <Link to="/booking" className="gl-btn gl-btn--primary">Book a Space</Link>
            <Link to="/apartments" className="gl-btn gl-btn--ghost">Explore Apartments</Link>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <Lightbox
          item={lightbox.item}
          imgIndex={lightbox.imgIndex}
          onClose={closeLightbox}
          onNext={lbNext}
          onPrev={lbPrev}
        />
      )}
    </div>
  );
};

/* ── Gallery Card ─────────────────────────── */
const GalleryCard = ({ item, index, onOpen }) => {
  const [hovered, setHovered] = useState(false);
  const isWide = index % 7 === 0 || index % 7 === 4;

  return (
    <div
      className={`gl-card ${isWide ? 'gl-card--wide' : ''}`}
      style={{ animationDelay: `${(index % 6) * 0.07}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(0)}
    >
      {/* Main image */}
      <div className="gl-card__img">
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.title}
            onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="gl-img-placeholder">
            <span>{TYPE_ICONS[item.type] || '🖼️'}</span>
          </div>
        )}
        <div className="gl-card__overlay" />

        {/* Badges */}
        <div className="gl-card__badges">
          <span className="gl-type-chip gl-type-chip--sm">
            {TYPE_ICONS[item.type]} {TYPE_LABELS[item.type] || item.type}
          </span>
          {item.isFeatured && <span className="gl-featured-chip">⭐</span>}
        </div>

        {/* Multi-image indicator */}
        {item.images?.length > 1 && (
          <div className="gl-card__img-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            {item.images.length}
          </div>
        )}

        {/* Hover content */}
        <div className={`gl-card__hover-panel ${hovered ? 'gl-card__hover-panel--visible' : ''}`}>
          <h3 className="gl-card__title">{item.title}</h3>
          <p className="gl-card__desc">
            {item.description?.slice(0, 100)}{item.description?.length > 100 ? '…' : ''}
          </p>

          {item.tags?.length > 0 && (
            <div className="gl-card__tags">
              {item.tags.slice(0, 3).map(t => (
                <span key={t} className="gl-tag gl-tag--light">#{t}</span>
              ))}
            </div>
          )}

          {/* Thumbnail strip for multi-image */}
          {item.images?.length > 1 && (
            <div className="gl-card__thumbs">
              {item.images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  className="gl-card__thumb"
                  style={{ backgroundImage: `url(${img})` }}
                  onClick={e => { e.stopPropagation(); onOpen(i); }}
                />
              ))}
              {item.images.length > 4 && (
                <span className="gl-card__thumb-more">+{item.images.length - 4}</span>
              )}
            </div>
          )}

          <button className="gl-view-btn" onClick={() => onOpen(0)}>
            View Gallery
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;