import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Faq.css';

/* ── Data ─────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',           label: 'All Questions', icon: '✦' },
  { id: 'bookings',      label: 'Bookings',       icon: '📅' },
  { id: 'stays',         label: 'Guest Stays',    icon: '🏠' },
  { id: 'events',        label: 'Events',         icon: '🎉' },
  { id: 'payments',      label: 'Payments',       icon: '💳' },
  { id: 'facilities',    label: 'Facilities',     icon: '🏢' },
  { id: 'policies',      label: 'Policies',       icon: '📋' },
];

const FAQS = [
  // Bookings
  {
    id: 1, cat: 'bookings',
    q: 'How do I make a booking at SpaceHub?',
    a: 'You can book directly through our website using the "Book Now" button, call us on 0718 315 313, or email us at spacehub@gmail.com. Our team will confirm availability and send you a booking confirmation with payment details within the hour.',
  },
  {
    id: 2, cat: 'bookings',
    q: 'How far in advance should I book?',
    a: 'We recommend booking at least 3–7 days in advance for guest stays, and 2–4 weeks ahead for events and conference rooms to guarantee your preferred dates. However, we do accept last-minute bookings subject to availability — just call us directly.',
  },
  {
    id: 3, cat: 'bookings',
    q: 'Can I modify or change my booking after confirmation?',
    a: 'Yes! Booking modifications are welcome up to 48 hours before your check-in date at no charge. Changes within 48 hours may be subject to availability and a small administrative fee. Contact our front desk team and we\'ll do our best to accommodate your needs.',
  },
  {
    id: 4, cat: 'bookings',
    q: 'Do you accept walk-in bookings?',
    a: 'Yes, walk-ins are welcome! We encourage you to call ahead to check availability, but our team is always happy to help guests who arrive in person. Walk-in tours are available Monday–Saturday between 9AM and 5PM.',
  },
  {
    id: 5, cat: 'bookings',
    q: 'Can I book on behalf of a group or company?',
    a: 'Absolutely. We frequently host corporate groups, delegations, and events. For group bookings of 10+ persons, please contact us directly to discuss tailored packages, group rates, and a dedicated booking agreement.',
  },

  // Stays
  {
    id: 6, cat: 'stays',
    q: 'What time is check-in and check-out?',
    a: 'Standard check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in from 10:00 AM and late check-out until 2:00 PM can be arranged subject to availability — please request this at the time of booking or contact the front desk.',
  },
  {
    id: 7, cat: 'stays',
    q: 'What is included in a guest room stay?',
    a: 'Every guest stay includes: complimentary high-speed Wi-Fi, daily housekeeping, fresh towels and linens, air conditioning, Smart TV, en-suite bathroom, and 24/7 security. Some room types also include a mini kitchen, balcony, and breakfast options — check the specific room listing for details.',
  },
  {
    id: 8, cat: 'stays',
    q: 'Do you allow long-term stays?',
    a: 'Yes, SpaceHub welcomes extended stays. We offer special weekly and monthly rates for guests staying 7 nights or more. Long-term guests enjoy all standard amenities plus additional perks. Contact us for a custom quote tailored to your duration and needs.',
  },
  {
    id: 9, cat: 'stays',
    q: 'Are pets allowed at SpaceHub?',
    a: 'Pets are not permitted in guest rooms by default. However, we understand that some guests travel with small, well-behaved pets. In such cases, please contact us in advance to request a pet-friendly arrangement — we\'ll do our best to accommodate on a case-by-case basis.',
  },
  {
    id: 10, cat: 'stays',
    q: 'Is breakfast included with my stay?',
    a: 'Breakfast is included with our Premium Suite bookings. For other room types, breakfast can be added to your package at an additional cost. Our on-site café also serves breakfast daily from 7:00 AM, and guests can order à la carte.',
  },

  // Events
  {
    id: 11, cat: 'events',
    q: 'What types of events can SpaceHub host?',
    a: 'We host a wide range of events including corporate conferences, team retreats, workshops, seminars, product launches, private dinners, birthday celebrations, cocktail parties, networking events, and more. Our versatile spaces can be configured to suit almost any occasion.',
  },
  {
    id: 12, cat: 'events',
    q: 'What is the maximum capacity for events?',
    a: 'Our event hall can comfortably accommodate up to 200 guests for a cocktail-style event or up to 120 guests for a seated dinner. The conference room seats up to 40 delegates in boardroom layout. For specific configuration options and capacities, please contact our events team.',
  },
  {
    id: 13, cat: 'events',
    q: 'Do you provide event coordination services?',
    a: 'Yes! Every event booking at SpaceHub comes with a dedicated event coordinator who works with you from planning to execution. We handle logistics, vendor coordination, setup, and on-the-day management so you can focus entirely on your guests.',
  },
  {
    id: 14, cat: 'events',
    q: 'Can I bring my own catering or external vendors?',
    a: 'We prefer guests to use our in-house catering team, which delivers exceptional quality. However, if you have specific requirements, we may consider approved external caterers on a case-by-case basis. External AV vendors and decorators are generally welcome — just notify us in advance.',
  },

  // Payments
  {
    id: 15, cat: 'payments',
    q: 'What payment methods do you accept?',
    a: 'We accept M-Pesa (Paybill and Till), Visa and Mastercard (debit & credit), bank transfer, and cash in Kenya Shillings. For international guests, USD and GBP are also accepted via card. All prices are inclusive of VAT unless otherwise stated.',
  },
  {
    id: 16, cat: 'payments',
    q: 'Is a deposit required to confirm a booking?',
    a: 'Yes. A deposit of 50% of the total booking value is required to confirm your reservation. The remaining balance is due on check-in for guest stays, or 48 hours before the event date for conference and event bookings. Your booking is not confirmed until the deposit is received.',
  },
  {
    id: 17, cat: 'payments',
    q: 'What is your cancellation and refund policy?',
    a: 'Cancellations 7+ days before: full refund of deposit. Cancellations 3–6 days before: 50% refund. Cancellations less than 48 hours before: no refund. No-shows are charged the full booking amount. If SpaceHub cancels your booking, a full refund is issued within 7 business days.',
  },
  {
    id: 18, cat: 'payments',
    q: 'Do you offer invoices for corporate bookings?',
    a: 'Yes, we issue official VAT invoices for all corporate bookings. We also support LPO (Local Purchase Order) arrangements for pre-approved corporate clients. Please request an invoice at the time of booking and provide your company\'s KRA PIN for VAT compliance.',
  },

  // Facilities
  {
    id: 19, cat: 'facilities',
    q: 'Is parking available at SpaceHub?',
    a: 'Yes! We offer complimentary, secure on-site parking for all guests, residents, and event attendees. Our parking lot is monitored 24/7 by CCTV and manned security. Overflow parking is also available nearby for large events.',
  },
  {
    id: 20, cat: 'facilities',
    q: 'Is SpaceHub accessible for guests with disabilities?',
    a: 'SpaceHub is designed to be fully accessible. We have ramp access at all main entrances, wide corridors, accessible restrooms on every floor, and a lift for multi-level access. If you have specific accessibility requirements, please inform us in advance so we can prepare accordingly.',
  },
  {
    id: 21, cat: 'facilities',
    q: 'Is there Wi-Fi available throughout the property?',
    a: 'Yes — high-speed fiber optic Wi-Fi is available throughout the entire SpaceHub property, including guest rooms, the conference room, event hall, café, and all common areas. The Wi-Fi is complimentary for all guests and visitors.',
  },
  {
    id: 22, cat: 'facilities',
    q: 'Do you have backup power in case of outages?',
    a: 'Absolutely. SpaceHub is equipped with a standby generator that provides seamless power backup across the entire property. Power outages will not disrupt your stay, event, or meeting — we guarantee uninterrupted operations.',
  },

  // Policies
  {
    id: 23, cat: 'policies',
    q: 'What are the quiet hours at SpaceHub?',
    a: 'Quiet hours are observed between 10:00 PM and 7:00 AM. During these hours, guests are asked to keep noise levels to a minimum out of respect for other residents. Events with amplified sound must conclude by 10:00 PM unless a special extension has been approved in writing by management.',
  },
  {
    id: 24, cat: 'policies',
    q: 'Is smoking permitted on the premises?',
    a: 'Smoking is strictly prohibited inside all guest rooms, the conference room, event hall, café, and all indoor areas. Designated outdoor smoking areas are available on the grounds. Guests found smoking in non-designated areas may be subject to a cleaning fee.',
  },
  {
    id: 25, cat: 'policies',
    q: 'How does SpaceHub handle guest privacy and data?',
    a: 'Guest privacy is a top priority at SpaceHub. All personal information collected during booking and check-in is handled in strict accordance with Kenya\'s Data Protection Act (2019). We do not share your information with third parties except as required by law. Please review our full Privacy Policy for complete details.',
  },
  {
    id: 26, cat: 'policies',
    q: 'What is your policy on visitor access for in-house guests?',
    a: 'Registered guests may receive visitors in common areas such as the lobby and café. Visitors are not permitted in guest rooms between 10:00 PM and 7:00 AM. All visitors must be signed in at the front desk. Unregistered overnight guests are not permitted without prior approval.',
  },
];

const CONTACT_OPTIONS = [
  { icon: '📞', label: 'Call Us',        value: '0718 315 313',        href: 'tel:0718315313' },
  { icon: '✉️', label: 'Email Us',       value: 'spacehub@gmail.com',  href: 'mailto:spacehub@gmail.com' },
  { icon: '📍', label: 'Visit Us',       value: 'Nairobi, Kenya',      href: '/visit' },
];

/* ── Component ─────────────────────────────── */
const Faq = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId]                 = useState(null);
  const [search, setSearch]                 = useState('');

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));

  const filtered = FAQS.filter(faq => {
    const matchCat = activeCategory === 'all' || faq.cat === activeCategory;
    const matchQ   = faq.q.toLowerCase().includes(search.toLowerCase()) ||
                     faq.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const currentCatLabel = CATEGORIES.find(c => c.id === activeCategory)?.label;

  return (
    <div className="main-faq-container-section">

      {/* ── HERO ── */}
      <section className="fq-hero">
        <div className="fq-hero__bg">
          <div className="fq-hero__arc fq-hero__arc--1" />
          <div className="fq-hero__arc fq-hero__arc--2" />
          <div className="fq-hero__arc fq-hero__arc--3" />
          <div className="fq-hero__dots" />
        </div>

        <div className="fq-hero__content">
          <nav className="fq-breadcrumb">
            <Link to="/home">Home</Link>
            <span>/</span>
            <span>FAQs</span>
          </nav>
          <span className="fq-eyebrow">Help & Support</span>
          <h1 className="fq-hero__title">
            Frequently Asked <br />
            <span className="fq-hero__accent">Questions</span>
          </h1>
          <p className="fq-hero__sub">
            Everything you need to know about staying, booking events, and experiencing
            SpaceHub — answered clearly and honestly.
          </p>

          {/* Search */}
          <div className="fq-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search any question…"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory('all'); }}
            />
            {search && (
              <button className="fq-search__clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Quick stats */}
          <div className="fq-hero__chips">
            <span className="fq-chip">{FAQS.length} questions answered</span>
            <span className="fq-chip">{CATEGORIES.length - 1} categories</span>
            <span className="fq-chip">Updated 2025</span>
          </div>
        </div>

        {/* Floating question bubbles */}
        <div className="fq-bubbles" aria-hidden="true">
          {['Bookings?', 'Check-in?', 'Payments?', 'Events?', 'Parking?'].map((b, i) => (
            <span key={i} className={`fq-bubble fq-bubble--${i + 1}`}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="fq-body">

        {/* Sidebar categories */}
        <aside className="fq-sidebar">
          <div className="fq-sidebar__card">
            <h3 className="fq-sidebar__title">Browse by Topic</h3>
            <nav className="fq-cat-nav">
              {CATEGORIES.map(cat => {
                const count = cat.id === 'all'
                  ? FAQS.length
                  : FAQS.filter(f => f.cat === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    className={`fq-cat-btn ${activeCategory === cat.id ? 'fq-cat-btn--active' : ''}`}
                    onClick={() => { setActiveCategory(cat.id); setSearch(''); setOpenId(null); }}
                  >
                    <span className="fq-cat-btn__icon">{cat.icon}</span>
                    <span className="fq-cat-btn__label">{cat.label}</span>
                    <span className="fq-cat-btn__count">{count}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Still need help */}
          <div className="fq-help-card">
            <div className="fq-help-card__top">
              <span className="fq-help-icon">🤝</span>
              <div>
                <h4>Still need help?</h4>
                <p>Our team is available 7 days a week.</p>
              </div>
            </div>
            <div className="fq-help-contacts">
              {CONTACT_OPTIONS.map((c, i) => (
                <a key={i} href={c.href} className="fq-help-contact">
                  <span className="fq-help-contact__icon">{c.icon}</span>
                  <div>
                    <span className="fq-help-contact__label">{c.label}</span>
                    <span className="fq-help-contact__value">{c.value}</span>
                  </div>
                </a>
              ))}
            </div>
            <Link to="/contact" className="fq-btn fq-btn--primary fq-btn--full">
              Send a Message
            </Link>
          </div>
        </aside>

        {/* FAQ accordion column */}
        <main className="fq-main">

          {/* Header row */}
          <div className="fq-main__head">
            <div>
              <h2 className="fq-main__title">
                {search
                  ? `Results for "${search}"`
                  : currentCatLabel === 'All Questions'
                    ? 'All Frequently Asked Questions'
                    : currentCatLabel
                }
              </h2>
              <p className="fq-main__count">
                {filtered.length} question{filtered.length !== 1 ? 's' : ''}
                {(search || activeCategory !== 'all') && (
                  <button className="fq-clear" onClick={() => { setSearch(''); setActiveCategory('all'); setOpenId(null); }}>
                    Clear ✕
                  </button>
                )}
              </p>
            </div>
            <div className="fq-expand-row">
              <button className="fq-action-btn" onClick={() => {
                const ids = {};
                filtered.forEach(f => { ids[f.id] = true; });
                setOpenId('__all__');
              }}>
                Expand All
              </button>
            </div>
          </div>

          {/* Accordion */}
          {filtered.length > 0 ? (
            <div className="fq-accordion">
              {filtered.map((faq, i) => {
                const isOpen = openId === faq.id || openId === '__all__';
                return (
                  <div
                    key={faq.id}
                    className={`fq-item ${isOpen ? 'fq-item--open' : ''}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <button className="fq-item__trigger" onClick={() => toggle(faq.id)}>
                      <div className="fq-item__trigger-left">
                        <span className="fq-item__num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="fq-item__q">{faq.q}</span>
                      </div>
                      <div className={`fq-item__icon ${isOpen ? 'fq-item__icon--open' : ''}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12" className="fq-icon-h" />
                        </svg>
                      </div>
                    </button>
                    <div className="fq-item__body">
                      <div className="fq-item__body-inner">
                        <p>{faq.a}</p>
                        <div className="fq-item__tags">
                          <span className={`fq-tag fq-tag--${faq.cat}`}>
                            {CATEGORIES.find(c => c.id === faq.cat)?.icon}{' '}
                            {CATEGORIES.find(c => c.id === faq.cat)?.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="fq-empty">
              <span>🔍</span>
              <h3>No results found</h3>
              <p>We couldn't find a match for "{search}". Try different keywords or browse by category.</p>
              <button className="fq-btn fq-btn--outline" onClick={() => { setSearch(''); setActiveCategory('all'); }}>
                View All FAQs
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── POPULAR TOPICS strip ── */}
      <section className="fq-topics">
        <div className="fq-topics__inner">
          <h3 className="fq-topics__title">Jump to a Topic</h3>
          <div className="fq-topics__pills">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                className={`fq-topic-pill ${activeCategory === cat.id ? 'fq-topic-pill--active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id); setSearch(''); setOpenId(null);
                  document.querySelector('.fq-body')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="fq-cta">
        <div className="fq-cta__glow fq-cta__glow--1" />
        <div className="fq-cta__glow fq-cta__glow--2" />
        <div className="fq-cta__inner">
          <span className="fq-eyebrow fq-eyebrow--light">We're Here to Help</span>
          <h2>Didn't Find Your Answer?</h2>
          <p>Our friendly team is available 7 days a week to answer any question — big or small. Reach out and we'll get back to you promptly.</p>
          <div className="fq-cta__contact-cards">
            {CONTACT_OPTIONS.map((c, i) => (
              <a key={i} href={c.href} className="fq-cta__card">
                <span className="fq-cta__card-icon">{c.icon}</span>
                <strong>{c.label}</strong>
                <span>{c.value}</span>
              </a>
            ))}
          </div>
          <div className="fq-cta__btns">
            <Link to="/contact" className="fq-btn fq-btn--primary fq-btn--lg">Send Us a Message</Link>
            <Link to="/booking" className="fq-btn fq-btn--ghost fq-btn--lg">Book a Space</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Faq;