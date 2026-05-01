import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blogs.css';

/* ── API helper ───────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-spacehub.onrender.com/api';

const fetchBlogs = async ({ category, search, page = 1, limit = 100 } = {}) => {
  const params = new URLSearchParams({ page, limit, published: 'true' });
  if (category && category !== 'All') params.set('category', slugifyCategory(category));
  const res = await fetch(`${API_BASE}/blogs?${params}`);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
};

// Map display category → backend enum value
const slugifyCategory = (cat) => {
  const map = {
    'Travel Tips':    'travel-tips',
    'Events':         'news',
    'Lifestyle':      'lifestyle',
    'Nairobi Guide':  'nairobi-guides',
    'Hospitality':    'hospitality',
  };
  return map[cat] || cat.toLowerCase().replace(/\s+/g, '-');
};

// Map backend enum → display label
const displayCategory = (cat) => {
  const map = {
    'travel-tips':   'Travel Tips',
    'news':          'Events',
    'lifestyle':     'Lifestyle',
    'nairobi-guides':'Nairobi Guide',
    'hospitality':   'Hospitality',
  };
  return map[cat] || cat;
};

// Get author initials from name or email
const getInitials = (author) => {
  if (!author) return 'SH';
  const name = author.name || author;
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

// Format date
const fmtDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Estimate read time
const readTime = (content) => {
  if (!content) return '3 min read';
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

/* ── Constants ────────────────────────────── */
const CATEGORIES = ['All', 'Travel Tips', 'Events', 'Lifestyle', 'Nairobi Guide', 'Hospitality'];

/* ── Skeleton loader ──────────────────────── */
const SkeletonCard = () => (
  <div className="bl-card bl-card--skeleton">
    <div className="bl-card__img-wrap bl-skeleton-img" />
    <div className="bl-card__body">
      <div className="bl-skeleton-line bl-skeleton-line--sm" />
      <div className="bl-skeleton-line" />
      <div className="bl-skeleton-line bl-skeleton-line--lg" />
      <div className="bl-skeleton-line bl-skeleton-line--md" />
    </div>
  </div>
);

/* ── Main Component ───────────────────────── */
const Blogs = () => {
  const [allBlogs, setAllBlogs]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery]   = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  /* ── Fetch all published blogs once ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchBlogs({ limit: 200 });
        setAllBlogs(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Derived data ── */
  const featuredPost = allBlogs.find(p => p.isFeatured) || allBlogs[0] || null;
  const regularPosts = allBlogs.filter(p => p._id !== featuredPost?._id);

  const filtered = regularPosts.filter(post => {
    const matchCat = activeCategory === 'All' ||
      displayCategory(post.category) === activeCategory;
    const matchQ = !searchQuery ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Category counts from real data
  const catCount = (cat) =>
    allBlogs.filter(p => displayCategory(p.category) === cat).length;

  // Trending = top 4 by views
  const trending = [...allBlogs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  /* ── Render ── */
  return (
    <div className="main-blogs-container-section">

      {/* ── HERO ── */}
      <section className="bl-hero">
        <div className="bl-hero__bg">
          <div className="bl-hero__stripe bl-hero__stripe--1" />
          <div className="bl-hero__stripe bl-hero__stripe--2" />
          <div className="bl-hero__stripe bl-hero__stripe--3" />
          <div className="bl-hero__dots" />
        </div>
        <div className="bl-hero__content">
          <nav className="bl-breadcrumb">
            <Link to="/home">Home</Link>
            <span>/</span>
            <span>Blogs</span>
          </nav>
          <span className="bl-eyebrow">Stories & Insights</span>
          <h1 className="bl-hero__title">
            The SpaceHub <br />
            <span className="bl-hero__accent">Journal</span>
          </h1>
          <p className="bl-hero__sub">
            Travel tips, event inspiration, Nairobi guides, and behind-the-scenes
            stories from the heart of Kenya's premier hospitality hub.
          </p>

          {/* Search */}
          <div className="bl-search-wrap">
            <div className="bl-search">
              <svg className="bl-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setVisibleCount(6); }}
              />
              {searchQuery && (
                <button className="bl-search__clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bl-hero__stats">
          <div className="bl-hero__stat">
            <strong>{loading ? '…' : allBlogs.length}</strong>
            <span>Articles</span>
          </div>
          <div className="bl-hero__stat-div" />
          <div className="bl-hero__stat">
            <strong>{CATEGORIES.length - 1}</strong>
            <span>Categories</span>
          </div>
          <div className="bl-hero__stat-div" />
          <div className="bl-hero__stat"><strong>Weekly</strong><span>New Posts</span></div>
        </div>
      </section>

      {/* ── ERROR STATE ── */}
      {error && (
        <div className="bl-error-banner">
          <span>⚠️</span>
          <span>Could not load articles — {error}</span>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* ── FEATURED POST ── */}
      {!loading && !error && featuredPost && !searchQuery && (
        <section className="bl-featured">
          <div className="bl-featured__inner">
            <div className="bl-featured__img-wrap">
              {featuredPost.featuredImage ? (
                <img src={featuredPost.featuredImage} alt={featuredPost.title} />
              ) : (
                <div className="bl-featured__img-placeholder">
                  <span>✍️</span>
                </div>
              )}
              <div className="bl-featured__img-overlay" />
              <span className="bl-featured__badge">✦ Featured Story</span>
            </div>
            <div className="bl-featured__copy">
              <div className="bl-featured__meta-row">
                <span className="bl-cat-pill bl-cat-pill--orange">
                  {displayCategory(featuredPost.category)}
                </span>
                <span className="bl-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {readTime(featuredPost.content)}
                </span>
                <span className="bl-meta-item">{fmtDate(featuredPost.publishedAt || featuredPost.createdAt)}</span>
              </div>
              <h2 className="bl-featured__title">{featuredPost.title}</h2>
              <p className="bl-featured__excerpt">
                {featuredPost.excerpt || featuredPost.content?.slice(0, 180) + '…'}
              </p>
              <div className="bl-featured__author">
                <div className="bl-avatar">
                  {featuredPost.author?.avatar
                    ? <img src={featuredPost.author.avatar} alt="" />
                    : getInitials(featuredPost.author)
                  }
                </div>
                <div>
                  <strong>By {featuredPost.author?.name || 'SpaceHub Team'}</strong>
                  <span>SpaceHub Editorial Team</span>
                </div>
              </div>
              <Link to={`/blogs/${featuredPost.slug || featuredPost._id}`} className="bl-btn bl-btn--primary">
                Read Full Article
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="bl-main">

        {/* Left: Posts */}
        <div className="bl-posts-col">

          {/* Category filter */}
          <div className="bl-filters">
            <div className="bl-filter-scroll">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`bl-filter-btn ${activeCategory === cat ? 'bl-filter-btn--active' : ''}`}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                >
                  {cat}
                  {cat !== 'All' && !loading && (
                    <span className="bl-filter-count">{catCount(cat)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Results bar */}
          {!loading && (
            <div className="bl-results-bar">
              <span>
                {searchQuery
                  ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchQuery}"`
                  : activeCategory === 'All'
                    ? `All Articles (${filtered.length})`
                    : `${activeCategory} (${filtered.length})`}
              </span>
              {(searchQuery || activeCategory !== 'All') && (
                <button
                  className="bl-clear-filters"
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                >
                  Clear filters ✕
                </button>
              )}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="bl-grid">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Posts grid */}
          {!loading && visible.length > 0 && (
            <div className="bl-grid">
              {visible.map((post, i) => (
                <article
                  key={post._id}
                  className="bl-card"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="bl-card__img-wrap">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div
                      className="bl-card__img-placeholder"
                      style={{ display: post.featuredImage ? 'none' : 'flex' }}
                    >
                      <span>📝</span>
                    </div>
                    <div className="bl-card__img-overlay" />
                    {/* tag based on recency */}
                    {(() => {
                      const daysSince = (Date.now() - new Date(post.publishedAt || post.createdAt)) / 86400000;
                      if (daysSince < 7) return <span className="bl-card__tag bl-card__tag--green">New</span>;
                      if ((post.views || 0) > 100) return <span className="bl-card__tag bl-card__tag--orange">Popular</span>;
                      return null;
                    })()}
                    <span className="bl-card__cat">{displayCategory(post.category)}</span>
                  </div>
                  <div className="bl-card__body">
                    <div className="bl-card__meta">
                      <span>{fmtDate(post.publishedAt || post.createdAt)}</span>
                      <span className="bl-card__meta-dot" />
                      <span>{readTime(post.content)}</span>
                    </div>
                    <h3 className="bl-card__title">{post.title}</h3>
                    <p className="bl-card__excerpt">
                      {post.excerpt || post.content?.slice(0, 120) + '…'}
                    </p>
                    <div className="bl-card__footer">
                      <div className="bl-card__author">
                        <div className="bl-avatar bl-avatar--sm">
                          {post.author?.avatar
                            ? <img src={post.author.avatar} alt="" />
                            : getInitials(post.author)
                          }
                        </div>
                        <span>{post.author?.name || 'SpaceHub Team'}</span>
                      </div>
                      <Link
                        to={`/blogs/${post.slug || post._id}`}
                        className="bl-card__read-link"
                        onClick={() => {
                          // increment view count silently
                          fetch(`${API_BASE}/blogs/${post._id}/increment-view`).catch(() => {});
                        }}
                      >
                        Read more
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && visible.length === 0 && (
            <div className="bl-empty">
              <span>📭</span>
              <h3>No articles found</h3>
              <p>Try a different search term or category.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="bl-btn bl-btn--outline"
              >
                View All Posts
              </button>
            </div>
          )}

          {/* Load more */}
          {hasMore && !loading && (
            <div className="bl-load-more">
              <button
                className="bl-btn bl-btn--load"
                onClick={() => setVisibleCount(v => v + 3)}
              >
                Load More Articles
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="bl-sidebar">

          {/* Trending */}
          <div className="bl-sidebar__widget">
            <h3 className="bl-sidebar__widget-title">
              <span className="bl-widget-line" />
              Trending Now
            </h3>
            {loading ? (
              <div className="bl-trending-list">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bl-trending-item bl-trending-item--skeleton">
                    <div className="bl-skeleton-line bl-skeleton-line--sm" />
                    <div className="bl-skeleton-line" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bl-trending-list">
                {trending.length > 0 ? trending.map((post, i) => (
                  <Link
                    to={`/blogs/${post.slug || post._id}`}
                    key={post._id}
                    className="bl-trending-item"
                  >
                    <span className="bl-trending-num">{String(i + 1).padStart(2, '0')}</span>
                    <div className="bl-trending-info">
                      <span className="bl-trending-cat">{displayCategory(post.category)}</span>
                      <p>{post.title}</p>
                      <span className="bl-trending-read">{readTime(post.content)}</span>
                    </div>
                  </Link>
                )) : (
                  <p style={{ fontSize: '.875rem', color: '#999', padding: '8px 0' }}>
                    No posts yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="bl-sidebar__widget">
            <h3 className="bl-sidebar__widget-title">
              <span className="bl-widget-line" />
              Browse by Category
            </h3>
            <div className="bl-cat-list">
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <button
                  key={cat}
                  className={`bl-cat-item ${activeCategory === cat ? 'bl-cat-item--active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6);
                    document.querySelector('.bl-filters')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>{cat}</span>
                  <span className="bl-cat-count">
                    {loading ? '…' : catCount(cat)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bl-sidebar__widget bl-sidebar__widget--dark">
            <span className="bl-widget-eyebrow">Stay Updated</span>
            <h3>Get Fresh Stories in Your Inbox</h3>
            <p>Subscribe to the SpaceHub Journal and never miss a new article, travel tip, or special offer.</p>
            <NewsletterWidget />
          </div>

          {/* CTA */}
          <div className="bl-sidebar__widget bl-sidebar__widget--cta">
            <span className="bl-cta-emoji">🏠</span>
            <h3>Ready to Experience SpaceHub?</h3>
            <p>See why Nairobi's travellers and corporates choose us for stays and events.</p>
            <Link to="/booking" className="bl-btn bl-btn--primary bl-btn--full">Book Your Space</Link>
            <Link to="/apartments" className="bl-btn bl-btn--outline bl-btn--full">View Apartments</Link>
          </div>
        </aside>
      </div>

      {/* ── BOTTOM CTA ── */}
      <section className="bl-cta">
        <div className="bl-cta__glow bl-cta__glow--1" />
        <div className="bl-cta__glow bl-cta__glow--2" />
        <div className="bl-cta__inner">
          <span className="bl-eyebrow bl-eyebrow--light">Never Miss a Story</span>
          <h2>Subscribe to the SpaceHub Journal</h2>
          <p>Weekly travel tips, event guides, and exclusive SpaceHub stories delivered straight to your inbox — completely free.</p>
          <NewsletterWidget large />
        </div>
      </section>
    </div>
  );
};

/* ── Newsletter sub-component ─────────────── */
const NewsletterWidget = ({ large = false }) => {
  const [email, setEmail]  = useState('');
  const [done, setDone]    = useState(false);
  const [loading, setLoad] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoad(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${API_BASE}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setDone(true);
      setEmail('');
    } catch {
      // Fallback: still show success for UX
      setDone(true);
      setEmail('');
    } finally {
      setLoad(false);
    }
  };

  if (done) return (
    <div className="bl-sub-success">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>You're subscribed! 🎉</span>
    </div>
  );

  return (
    <form className={`bl-newsletter-form ${large ? 'bl-newsletter-form--large' : ''}`} onSubmit={submit}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? <span className="bl-spinner" /> : large ? 'Subscribe Free →' : 'Subscribe →'}
      </button>
    </form>
  );
};

export default Blogs;
