// src/pages/apartments/Apartments.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../../Context/ApartmenContextt';
import './Apartments.css';

// Fallback images per type
import apartment  from '../../assets/apart15.jpg';
import guestHouse from '../../assets/apart1.avif';
import conference from '../../assets/apart14.jpg';
import event      from '../../assets/apart2.avif';

const TYPE_FALLBACK = {
  studio:    guestHouse,
  '1BHK':    guestHouse,
  '2BHK':    apartment,
  '3BHK':    apartment,
  penthouse: event,
};

const FEATURES = [
  { icon: '🛡️', title: 'Safe & Secure',      desc: 'Round-the-clock CCTV surveillance and manned security at all entry points.' },
  { icon: '⚡', title: 'Reliable Power',      desc: 'Backup generator ensures zero power interruptions, day or night.' },
  { icon: '🌐', title: 'Fiber Internet',      desc: 'Blazing-fast fiber optic Wi-Fi available throughout every space.' },
  { icon: '🅿️', title: 'Ample Parking',      desc: 'Spacious, secure parking lot for guests, residents, and event attendees.' },
  { icon: '🍽️', title: 'Dining Options',     desc: 'On-site café and catering services to keep you fuelled all day long.' },
  { icon: '🧹', title: 'Daily Housekeeping', desc: 'Professional cleaning staff maintain immaculate standards every single day.' },
];

const STEPS = [
  { num: '01', title: 'Browse Spaces',   desc: 'Explore our portfolio and find the perfect space for your need.' },
  { num: '02', title: 'Make a Booking',  desc: 'Reserve online or call us directly — quick and hassle-free.' },
  { num: '03', title: 'Confirm & Pay',   desc: 'Secure your space with a simple deposit payment.' },
  { num: '04', title: 'Check In & Enjoy', desc: 'Arrive, settle in, and experience SpaceHub hospitality.' },
];

const Apartments = () => {
  const navigate = useNavigate();
  const { apartments, apartmentsLoading, apartmentsError, setSelectedApartment } = useBooking();
  const [active, setActive] = useState(null);

  // Clicking "Book Now" on a card pre-selects that apartment then navigates
  const handleBookNow = (apt) => {
    setSelectedApartment(apt);
    navigate('/book-now');
  };

  // Helper: get image src for an apartment
  const getImage = (apt, index = 0) =>
    apt.images?.[index] || TYPE_FALLBACK[apt.type] || apartment;

  // Tag label based on apartment fields
  const getTag = (apt) => {
    if (apt.featured) return 'Featured';
    if (apt.type === 'penthouse') return 'Executive';
    if (apt.type === 'studio') return 'Most Popular';
    return apt.type?.toUpperCase() || 'Available';
  };

  const tagBadge = (apt) => apt.type === 'penthouse' || apt.type === '3BHK' ? 'blue' : 'orange';

  return (
    <div className="ap-root">

      {/* ── HERO ── */}
      <section className="ap-hero">
        <div className="ap-hero__bg">
          <img src={apartment} alt="SpaceHub" className="ap-hero__img" />
          <div className="ap-hero__overlay" />
        </div>
        <div className="ap-hero__noise" />
        <div className="ap-hero__content">
          <nav className="ap-breadcrumb">
            <Link to="/home">Home</Link>
            <span>/</span>
            <span>Our Spaces</span>
          </nav>
          <p className="ap-hero__eyebrow">Nairobi's Premier Space Experience</p>
          <h1 className="ap-hero__title">
            Spaces That <br />
            <span className="ap-hero__accent">Inspire &amp; Elevate</span>
          </h1>
          <p className="ap-hero__sub">
            From intimate guest stays to grand event halls — SpaceHub offers
            thoughtfully designed spaces in the heart of Nairobi.
          </p>
          <div className="ap-hero__actions">
            <a href="#spaces" className="ap-btn ap-btn--primary">Explore Spaces</a>
            <Link to="/book-now" className="ap-btn ap-btn--ghost">Book a Tour</Link>
          </div>
          <div className="ap-hero__stats">
            <div className="ap-stat"><strong>{apartments.length || '50'}+</strong><span>Spaces</span></div>
            <div className="ap-stat-divider" />
            <div className="ap-stat"><strong>1,200+</strong><span>Happy Guests</span></div>
            <div className="ap-stat-divider" />
            <div className="ap-stat"><strong>4.9★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="ap-hero__scroll">
          <div className="ap-scroll-dot" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── LOCATION BANNER ── */}
      <section className="ap-location">
        <div className="ap-location__inner">
          <div className="ap-location__pin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="ap-location__text">
            <strong>We're right in the heart of Nairobi, Kenya</strong>
            <span>Easily accessible by road, with nearby transit links and ample parking on-site.</span>
          </div>
          <a
            href="https://maps.google.com/?q=Nairobi,Kenya"
            target="_blank"
            rel="noreferrer"
            className="ap-btn ap-btn--primary ap-btn--sm"
          >
            Get Directions
          </a>
        </div>
      </section>

      {/* ── SPACES GRID ── */}
      <section className="ap-spaces" id="spaces">
        <div className="ap-section-head">
          <span className="ap-eyebrow">What We Offer</span>
          <h2>Our Signature Spaces</h2>
          <p>Every room, suite, and hall at SpaceHub is crafted with intention — comfort, function, and beauty in perfect balance.</p>
        </div>

        {/* Loading state */}
        {apartmentsLoading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400, #9ca3af)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
            Loading available spaces…
          </div>
        )}

        {/* Error state */}
        {apartmentsError && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
            <p>{apartmentsError}</p>
            <Link to="/contact-us" className="ap-btn ap-btn--primary" style={{ marginTop: 16, display: 'inline-flex' }}>
              Contact Us
            </Link>
          </div>
        )}

        {/* Empty state */}
        {!apartmentsLoading && !apartmentsError && apartments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400, #9ca3af)' }}>
            No spaces available at the moment. Please check back soon.
          </div>
        )}

        {/* Apartments grid */}
        {!apartmentsLoading && apartments.length > 0 && (
          <div className="ap-grid">
            {apartments.map((apt, i) => (
              <div
                key={apt._id}
                className={`ap-card ${active === apt._id ? 'ap-card--flipped' : ''}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="ap-card__inner">

                  {/* ── Front ── */}
                  <div className="ap-card__front">
                    <div className="ap-card__img-wrap">
                      <img
                        src={getImage(apt)}
                        alt={apt.title}
                        onError={e => { e.target.src = TYPE_FALLBACK[apt.type] || apartment; }}
                      />
                      <div className="ap-card__img-fade" />
                      <span className={`ap-card__tag ap-card__tag--${tagBadge(apt)}`}>
                        {getTag(apt)}
                      </span>
                    </div>
                    <div className="ap-card__body">
                      <h3>{apt.title}</h3>
                      <p>{apt.description || `${apt.type?.toUpperCase()} · ${apt.bedrooms} bed · ${apt.bathrooms} bath`}</p>
                      <div className="ap-card__price">
                        <strong>KES {apt.price?.toLocaleString()}</strong>
                        <span>/ night</span>
                      </div>
                      {apt.location?.city && (
                        <p style={{ fontSize: '.8rem', color: 'var(--gray-400, #9ca3af)', marginBottom: 8 }}>
                          📍 {apt.location.address ? `${apt.location.address}, ` : ''}{apt.location.city}
                        </p>
                      )}
                      <div className="ap-card__actions">
                        <button
                          className="ap-btn ap-btn--primary ap-btn--sm"
                          onClick={() => setActive(apt._id)}
                        >
                          View Amenities
                        </button>
                        <button
                          className="ap-btn ap-btn--ghost ap-btn--sm"
                          onClick={() => handleBookNow(apt)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Back ── */}
                  <div className="ap-card__back">
                    <h3>{apt.title} <span>— Amenities</span></h3>
                    {apt.amenities?.length > 0 ? (
                      <ul className="ap-amenity-list">
                        {apt.amenities.map(a => (
                          <li key={a}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {a}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: 'var(--gray-400, #9ca3af)', fontSize: '.875rem' }}>
                        Contact us for amenity details.
                      </p>
                    )}
                    <div className="ap-card__price ap-card__price--back">
                      <strong>KES {apt.price?.toLocaleString()}</strong>
                      <span>/ night</span>
                    </div>
                    <div className="ap-card__actions">
                      <button
                        className="ap-btn ap-btn--primary ap-btn--sm"
                        onClick={() => handleBookNow(apt)}
                      >
                        Reserve This Space
                      </button>
                      <button
                        className="ap-btn ap-btn--ghost ap-btn--sm"
                        onClick={() => setActive(null)}
                      >
                        ← Back
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── EXPERIENCE STRIP ── */}
      <section className="ap-experience">
        <div className="ap-experience__images">
          <img src={guestHouse} alt="Guest" className="ap-exp-img ap-exp-img--1" />
          <img src={event}      alt="Event" className="ap-exp-img ap-exp-img--2" />
          <div className="ap-exp-badge">
            <strong>5★</strong>
            <span>Guest Experience</span>
          </div>
        </div>
        <div className="ap-experience__copy">
          <span className="ap-eyebrow">Why SpaceHub?</span>
          <h2>More Than a Space — <span>An Experience</span></h2>
          <p>We believe every stay, meeting, or event should be memorable. That's why every detail at SpaceHub — from the décor to the service — is meticulously considered for your comfort and success.</p>
          <p>Whether you're here for a night, a day's workshop, or a grand celebration, our team is ready to make it exceptional.</p>
          <div className="ap-experience__ctas">
            <Link to="/book-now" className="ap-btn ap-btn--primary">Reserve Your Space</Link>
            <Link to="/contact-us" className="ap-btn ap-btn--outline">Talk to Us</Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="ap-features">
        <div className="ap-section-head ap-section-head--light">
          <span className="ap-eyebrow ap-eyebrow--light">World-Class Facilities</span>
          <h2>Everything You Need, Under One Roof</h2>
        </div>
        <div className="ap-features__grid">
          {FEATURES.map((f, i) => (
            <div className="ap-feature-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <span className="ap-feature-icon">{f.icon}</span>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="ap-how" id="book">
        <div className="ap-section-head">
          <span className="ap-eyebrow">Simple Process</span>
          <h2>Book in 4 Easy Steps</h2>
        </div>
        <div className="ap-steps">
          {STEPS.map((s, i) => (
            <div className="ap-step" key={i}>
              <div className="ap-step__num">{s.num}</div>
              {i < STEPS.length - 1 && <div className="ap-step__line" />}
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="ap-testimonial">
        <div className="ap-testimonial__inner">
          <div className="ap-quote-mark">"</div>
          <p>SpaceHub completely transformed our corporate retreat. The conference room was impeccable, the team was attentive, and the location in Nairobi couldn't have been more convenient. We'll be back without question.</p>
          <div className="ap-testimonial__author">
            <div className="ap-author-avatar">JM</div>
            <div>
              <strong>James Mutua</strong>
              <span>CEO, Savanna Ventures</span>
            </div>
          </div>
          <div className="ap-stars">★★★★★</div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="ap-cta">
        <div className="ap-cta__bg">
          <img src={conference} alt="CTA" />
          <div className="ap-cta__overlay" />
        </div>
        <div className="ap-cta__content">
          <span className="ap-eyebrow ap-eyebrow--light">Ready to Experience SpaceHub?</span>
          <h2>Your Perfect Space Awaits in Nairobi</h2>
          <p>Book today and discover why hundreds of guests choose SpaceHub for stays, meetings, and events.</p>
          <div className="ap-cta__btns">
            <a href="tel:0718315313" className="ap-btn ap-btn--primary ap-btn--lg">📞 Call Us: 0718 315 313</a>
            <Link to="/contact-us" className="ap-btn ap-btn--ghost ap-btn--lg">Send a Message</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Apartments;