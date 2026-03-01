import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Visit.css';

/* ── Data ───────────────────────────────────── */
const HOURS = [
  { day: 'Monday – Friday',   time: '7:00 AM – 10:00 PM', open: true },
  { day: 'Saturday',          time: '8:00 AM – 11:00 PM', open: true },
  { day: 'Sunday',            time: '9:00 AM – 8:00 PM',  open: true },
  { day: 'Public Holidays',   time: '10:00 AM – 6:00 PM', open: true },
];

const LANDMARKS = [
  { icon: '✈️', name: 'JKIA Airport',         distance: '18 km',  dir: 'South-East' },
  { icon: '🏥', name: 'Nairobi Hospital',      distance: '3.2 km', dir: 'West'       },
  { icon: '🛍️', name: 'The Hub Karen Mall',    distance: '5 km',   dir: 'South'      },
  { icon: '🏛️', name: 'CBD Nairobi',           distance: '8 km',   dir: 'North-East' },
  { icon: '🌿', name: 'Karura Forest',         distance: '6 km',   dir: 'North'      },
  { icon: '🚌', name: 'Westlands Bus Stage',   distance: '2.4 km', dir: 'North-West' },
];

const TRANSPORT = [
  {
    mode: 'By Car',
    icon: '🚗',
    steps: [
      'From CBD: Take Uhuru Highway towards Upper Hill.',
      'Turn onto Ngong Road heading south-west.',
      'Follow signs to SpaceHub — ample parking on arrival.',
    ],
  },
  {
    mode: 'By Matatu',
    icon: '🚌',
    steps: [
      'Board Route 111 or 126 from GPO, CBD.',
      'Alight at the Total Petrol Station stop on Ngong Rd.',
      'Walk 200m south — SpaceHub is on your right.',
    ],
  },
  {
    mode: 'By Boda / Taxi',
    icon: '🛵',
    steps: [
      'Use Bolt, Uber, or Little app.',
      'Search "SpaceHub Nairobi" as your destination.',
      'Drop-off point is directly at the main gate.',
    ],
  },
];

const FAQS = [
  { q: 'Is parking free for guests?', a: 'Yes — we offer complimentary secure parking for all guests and visitors during their stay or event.' },
  { q: 'Can I visit before making a booking?', a: 'Absolutely! We welcome walk-in tours between 9 AM and 5 PM Monday to Saturday. No appointment needed.' },
  { q: 'Do you have disability access?', a: 'SpaceHub is fully wheelchair accessible, with ramps, wide corridors, and accessible restrooms throughout.' },
  { q: 'Is there public Wi-Fi on the grounds?', a: 'Yes, we provide complimentary high-speed fiber Wi-Fi across all common areas and spaces.' },
];

/* ── Component ──────────────────────────────── */
const Visit = () => {
  const [openFaq, setOpenFaq]     = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="vt-root">

      {/* ── HERO ── */}
      <section className="vt-hero">
        <div className="vt-hero__map-bg">
          {/* Decorative grid lines */}
          <div className="vt-grid-lines">
            {[...Array(8)].map((_, i) => <div key={i} className="vt-line vt-line--h" style={{ top: `${i * 14}%` }} />)}
            {[...Array(8)].map((_, i) => <div key={i} className="vt-line vt-line--v" style={{ left: `${i * 14}%` }} />)}
          </div>
          {/* Pulse rings */}
          <div className="vt-pulse-wrap">
            <div className="vt-pulse vt-pulse--1" />
            <div className="vt-pulse vt-pulse--2" />
            <div className="vt-pulse vt-pulse--3" />
            <div className="vt-pin">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
          </div>
        </div>

        <div className="vt-hero__content">
          <nav className="vt-breadcrumb">
            <Link to="/home">Home</Link>
            <span>/</span>
            <span>Visit Us</span>
          </nav>
          <p className="vt-eyebrow">Find Us in Nairobi</p>
          <h1 className="vt-hero__title">
            Come Experience <br />
            <span className="vt-hero__accent">SpaceHub</span> in Person
          </h1>
          <p className="vt-hero__sub">
            We're nestled in the heart of Nairobi — easy to reach, impossible to forget.
            Step in, look around, and let the spaces speak for themselves.
          </p>
          <div className="vt-hero__ctas">
            <a
              href="https://maps.google.com/?q=Nairobi,Kenya"
              target="_blank"
              rel="noreferrer"
              className="vt-btn vt-btn--primary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Open in Google Maps
            </a>
            <a href="tel:0718315313" className="vt-btn vt-btn--ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.45-1.45a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ── ADDRESS STRIP ── */}
      <section className="vt-address-strip">
        <div className="vt-address-strip__inner">
          <div className="vt-address-item">
            <div className="vt-address-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <strong>Our Address</strong>
              <span>Ngong Road, Nairobi, Kenya</span>
            </div>
          </div>
          <div className="vt-strip-divider" />
          <div className="vt-address-item">
            <div className="vt-address-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <strong>Today's Hours</strong>
              <span>7:00 AM – 10:00 PM</span>
            </div>
          </div>
          <div className="vt-strip-divider" />
          <div className="vt-address-item">
            <div className="vt-address-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.45-1.45a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
            </div>
            <div>
              <strong>Phone</strong>
              <span>0718 315 313</span>
            </div>
          </div>
          <div className="vt-strip-divider" />
          <div className="vt-address-item">
            <div className="vt-address-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <strong>Email</strong>
              <span>spacehub@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP + HOURS ── */}
      <section className="vt-map-section">
        <div className="vt-map-section__inner">

          {/* Map Embed */}
          <div className="vt-map-wrap">
            <div className="vt-map-label">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              SpaceHub — Nairobi, Kenya
            </div>
            <iframe
              title="SpaceHub Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.277444357272!2d36.7734!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664ae3f71%3A0x9b1c6e6e6e6e6e6e!2sNgong%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://maps.google.com/?q=Ngong+Road+Nairobi+Kenya"
              target="_blank"
              rel="noreferrer"
              className="vt-map-cta"
            >
              Get Full Directions →
            </a>
          </div>

          {/* Hours */}
          <div className="vt-hours-wrap">
            <div className="vt-section-badge">Operating Hours</div>
            <h2 className="vt-hours-title">When to Visit Us</h2>
            <p className="vt-hours-sub">We're open most days of the week. Walk-in tours welcome — no booking required.</p>

            <div className="vt-hours-list">
              {HOURS.map((h, i) => (
                <div className="vt-hours-row" key={i}>
                  <span className="vt-hours-day">{h.day}</span>
                  <div className="vt-hours-dots" />
                  <span className="vt-hours-time">
                    <span className={`vt-open-dot ${h.open ? 'vt-open-dot--open' : 'vt-open-dot--closed'}`} />
                    {h.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="vt-hours-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Need after-hours access? Call us to arrange a private showing.
            </div>

            <div className="vt-hours-ctas">
              <Link to="/book-now" className="vt-btn vt-btn--primary">Book a Space</Link>
              <Link to="/contact-us" className="vt-btn vt-btn--outline">Enquire Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── LANDMARKS ── */}
      <section className="vt-landmarks">
        <div className="vt-section-head">
          <span className="vt-eyebrow">Getting Here</span>
          <h2>Nearby Landmarks</h2>
          <p>SpaceHub is centrally located with major city landmarks and amenities just minutes away.</p>
        </div>
        <div className="vt-landmarks__grid">
          {LANDMARKS.map((l, i) => (
            <div className="vt-landmark-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="vt-landmark-icon">{l.icon}</span>
              <div className="vt-landmark-info">
                <strong>{l.name}</strong>
                <span>{l.dir}</span>
              </div>
              <div className="vt-landmark-dist">{l.distance}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW TO GET HERE (tabs) ── */}
      <section className="vt-transport">
        <div className="vt-section-head vt-section-head--dark">
          <span className="vt-eyebrow vt-eyebrow--light">Directions</span>
          <h2>How to Get Here</h2>
        </div>
        <div className="vt-tabs">
          {TRANSPORT.map((t, i) => (
            <button
              key={i}
              className={`vt-tab ${activeTab === i ? 'vt-tab--active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              <span>{t.icon}</span> {t.mode}
            </button>
          ))}
        </div>
        <div className="vt-tab-content">
          <h3>{TRANSPORT[activeTab].icon} {TRANSPORT[activeTab].mode}</h3>
          <ol className="vt-steps-list">
            {TRANSPORT[activeTab].steps.map((s, i) => (
              <li key={i}>
                <span className="vt-step-num">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <a
            href="https://maps.google.com/?q=Ngong+Road+Nairobi+Kenya"
            target="_blank"
            rel="noreferrer"
            className="vt-btn vt-btn--primary vt-btn--sm"
          >
            Open Google Maps
          </a>
        </div>
      </section>

      {/* ── PARKING ── */}
      <section className="vt-parking">
        <div className="vt-parking__inner">
          <div className="vt-parking__icon">🅿️</div>
          <div className="vt-parking__copy">
            <h3>Free & Secure Parking On-Site</h3>
            <p>SpaceHub provides complimentary parking for all guests, residents, and event attendees. Our lot is monitored 24/7 with CCTV and manned security — your vehicle is always safe with us.</p>
          </div>
          <div className="vt-parking__badges">
            <span className="vt-badge">🔒 CCTV Monitored</span>
            <span className="vt-badge">✅ Free of Charge</span>
            <span className="vt-badge">🌙 24/7 Access</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="vt-faq">
        <div className="vt-section-head">
          <span className="vt-eyebrow">Quick Answers</span>
          <h2>Visitor FAQs</h2>
        </div>
        <div className="vt-faq__list">
          {FAQS.map((f, i) => (
            <div key={i} className={`vt-faq-item ${openFaq === i ? 'vt-faq-item--open' : ''}`}>
              <button className="vt-faq-q" onClick={() => toggleFaq(i)}>
                {f.q}
                <svg className="vt-faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className="vt-faq-a">
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="vt-final-cta">
        <div className="vt-final-cta__inner">
          <div className="vt-cta-deco vt-cta-deco--1" />
          <div className="vt-cta-deco vt-cta-deco--2" />
          <span className="vt-eyebrow vt-eyebrow--light">We'd Love to See You</span>
          <h2>Plan Your Visit Today</h2>
          <p>Whether it's a quick look around or a booked stay — our doors are always open. Come see why SpaceHub is Nairobi's most loved space.</p>
          <div className="vt-final-cta__btns">
            <Link to="/book-now" className="vt-btn vt-btn--primary vt-btn--lg">Reserve a Space</Link>
            <a href="tel:0718315313" className="vt-btn vt-btn--ghost vt-btn--lg">📞 0718 315 313</a>
            <Link to="/contact-us" className="vt-btn vt-btn--ghost vt-btn--lg">✉️ Send a Message</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Visit;