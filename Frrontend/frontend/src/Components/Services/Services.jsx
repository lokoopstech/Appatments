import { useState } from 'react';
import { Link } from 'react-router-dom';
import SERVICES from '../../assets/Service';
import './Services.css';



const STATS = [
  { value: '6+',    label: 'Core Services' },
  { value: '1,200+', label: 'Happy Clients' },
  { value: '4.9★',  label: 'Average Rating' },
  { value: '5 yrs', label: 'In Business' },
];

const PROCESS = [
  { num: '01', icon: '📋', title: 'Choose a Service', desc: 'Browse our full range and select the service that best fits your needs.' },
  { num: '02', icon: '📞', title: 'Get in Touch',     desc: 'Call, email, or fill in our online form — we\'ll respond within the hour.' },
  { num: '03', icon: '✅', title: 'Confirm & Pay',    desc: 'Agree on the details, secure your booking with a simple deposit.' },
  { num: '04', icon: '⭐', title: 'Experience SpaceHub', desc: 'Relax and enjoy — our team handles everything from here.' },
];

const TESTIMONIALS = [
  { name: 'Amina Ochieng',   role: 'Marketing Manager, Safaricom',     text: 'The conference facilities were outstanding — everything ran perfectly. Our team was impressed, and we\'ve already booked again.',    avatar: 'AO' },
  { name: 'David Kariuki',   role: 'CEO, Greenfield Solutions',         text: 'The airport transfer and concierge services were seamless. It made our international clients feel genuinely welcomed in Nairobi.',    avatar: 'DK' },
  { name: 'Grace Muthoni',   role: 'Events Director, Pendo Weddings',   text: 'SpaceHub\'s event team went above and beyond. The catering was incredible, the décor was exactly what we wanted — truly 5-star.',      avatar: 'GM' },
];

/* ── Component ──────────────────────────────── */
const Services = () => {
  const [activeService, setActiveService] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="sv-root">

      {/* ── HERO ── */}
      <section className="sv-hero">
        <div className="sv-hero__bg">
          {/* Geometric accent shapes */}
          <div className="sv-shape sv-shape--1" />
          <div className="sv-shape sv-shape--2" />
          <div className="sv-shape sv-shape--3" />
          <div className="sv-hero__gradient" />
        </div>

        <div className="sv-hero__content">
          <nav className="sv-breadcrumb">
            <Link to="/home">Home</Link>
            <span>/</span>
            <span>Services</span>
          </nav>
          <p className="sv-eyebrow">What We Offer</p>
          <h1 className="sv-hero__title">
            Premium Services <br />
            <span className="sv-hero__accent">Tailored for You</span>
          </h1>
          <p className="sv-hero__sub">
            From world-class accommodation to seamless event planning — SpaceHub delivers
            a full suite of hospitality services designed around your comfort and success.
          </p>
          <div className="sv-hero__ctas">
            <a href="#services" className="sv-btn sv-btn--primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Explore Services
            </a>
            <Link to="/contact-us" className="sv-btn sv-btn--ghost">Get a Custom Quote</Link>
          </div>
        </div>

        {/* Floating stat chips */}
        <div className="sv-hero__floaters">
          {STATS.map((s, i) => (
            <div key={i} className="sv-stat-chip" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="sv-services" id="services">
        <div className="sv-section-head">
          <span className="sv-eyebrow">Full Service Offering</span>
          <h2>Everything Under One Roof</h2>
          <p>SpaceHub is more than a place to stay — it's a complete hospitality ecosystem built to support your every need.</p>
        </div>

        <div className="sv-grid">
          {SERVICES.map((s, i) => (
            <div
              key={s.id}
              className={`sv-card sv-card--${s.color} ${activeService === s.id ? 'sv-card--active' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
              onMouseEnter={() => setActiveService(s.id)}
              onMouseLeave={() => setActiveService(null)}
            >
              {/* Top accent bar */}
              <div className="sv-card__bar" />

              <div className="sv-card__head">
                <span className="sv-card__icon">{s.icon}</span>
                <span className="sv-card__category">{s.category}</span>
              </div>

              <h3 className="sv-card__title">{s.title}</h3>
              <p className="sv-card__tagline">{s.tagline}</p>
              <p className="sv-card__desc">{s.desc}</p>

              <ul className="sv-card__features">
                {s.features.map((f, fi) => (
                  <li key={fi}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="sv-card__footer">
                <span className="sv-card__price">{s.price}</span>
                <Link to="/book-now" className="sv-card__cta">{s.cta} →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY SPACEHUB STRIP ── */}
      <section className="sv-why">
        <div className="sv-why__inner">
          <div className="sv-why__copy">
            <span className="sv-eyebrow sv-eyebrow--light">Why Choose SpaceHub?</span>
            <h2>Hospitality at its Finest, <span>Right Here in Nairobi</span></h2>
            <p>We don't just offer spaces and services — we curate experiences. Every interaction at SpaceHub is handled by trained professionals who are passionate about delivering excellence.</p>
            <p>Our integrated approach means your accommodation, dining, transport, and events are all coordinated seamlessly — no juggling multiple vendors.</p>
            <div className="sv-why__bullets">
              {[
                '✔ All services under one roof',
                '✔ Experienced, professional team',
                '✔ Flexible packages for any budget',
                '✔ Central Nairobi location',
                '✔ 24/7 guest support',
                '✔ 5-star rated by our clients',
              ].map((b, i) => <span key={i} className="sv-bullet">{b}</span>)}
            </div>
            <div className="sv-why__ctas">
              <Link to="/book-now" className="sv-btn sv-btn--primary">Make a Booking</Link>
              <Link to="/contact-now" className="sv-btn sv-btn--outline-light">Contact Us</Link>
            </div>
          </div>
          <div className="sv-why__visual">
            <div className="sv-why__ring sv-why__ring--1" />
            <div className="sv-why__ring sv-why__ring--2" />
            <div className="sv-why__ring sv-why__ring--3" />
            <div className="sv-why__center">
              <span className="sv-why__big-icon">🏆</span>
              <strong>Nairobi's Top Rated</strong>
              <span>Hospitality Hub</span>
            </div>
            <div className="sv-orbit-item sv-orbit-item--1">🏠 Stays</div>
            <div className="sv-orbit-item sv-orbit-item--2">🎉 Events</div>
            <div className="sv-orbit-item sv-orbit-item--3">🍽️ Dining</div>
            <div className="sv-orbit-item sv-orbit-item--4">🚗 Transport</div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="sv-process">
        <div className="sv-section-head">
          <span className="sv-eyebrow">Simple Steps</span>
          <h2>How It Works</h2>
          <p>Getting started with any SpaceHub service is quick, easy, and always supported by our friendly team.</p>
        </div>
        <div className="sv-process__steps">
          {PROCESS.map((p, i) => (
            <div className="sv-process-step" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="sv-process-step__num">{p.num}</div>
              {i < PROCESS.length - 1 && <div className="sv-process-step__connector" />}
              <div className="sv-process-step__icon">{p.icon}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="sv-testimonials">
        <div className="sv-section-head sv-section-head--dark">
          <span className="sv-eyebrow sv-eyebrow--light">Client Stories</span>
          <h2>What Our Clients Say</h2>
        </div>

        <div className="sv-testi-carousel">
          <div className="sv-testi-card">
            <div className="sv-testi-quote">"</div>
            <p className="sv-testi-text">{TESTIMONIALS[activeTestimonial].text}</p>
            <div className="sv-testi-author">
              <div className="sv-testi-avatar">{TESTIMONIALS[activeTestimonial].avatar}</div>
              <div>
                <strong>{TESTIMONIALS[activeTestimonial].name}</strong>
                <span>{TESTIMONIALS[activeTestimonial].role}</span>
              </div>
            </div>
            <div className="sv-testi-stars">★★★★★</div>
          </div>

          <div className="sv-testi-dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`sv-testi-dot ${activeTestimonial === i ? 'sv-testi-dot--active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
              />
            ))}
          </div>

          <div className="sv-testi-nav">
            <button
              className="sv-testi-btn"
              onClick={() => setActiveTestimonial(p => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            >
              ← Prev
            </button>
            <button
              className="sv-testi-btn sv-testi-btn--active"
              onClick={() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length)}
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* ── PRICING CTA BANNER ── */}
      <section className="sv-pricing-banner">
        <div className="sv-pricing-banner__inner">
          <div className="sv-pricing-banner__copy">
            <h3>Need a Custom Package?</h3>
            <p>We understand every client is different. Talk to us and we'll craft a bespoke service bundle that perfectly fits your needs and budget.</p>
          </div>
          <div className="sv-pricing-banner__ctas">
            <a href="tel:0718315313" className="sv-btn sv-btn--primary">📞 0718 315 313</a>
            <a href="mailto:spacehub@gmail.com" className="sv-btn sv-btn--outline">✉️ Email Us</a>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="sv-final-cta">
        <div className="sv-final-cta__deco sv-final-cta__deco--1" />
        <div className="sv-final-cta__deco sv-final-cta__deco--2" />
        <div className="sv-final-cta__inner">
          <span className="sv-eyebrow sv-eyebrow--light">Ready to Get Started?</span>
          <h2>Experience SpaceHub Services Today</h2>
          <p>Join over 1,200 happy guests and clients who trust SpaceHub for their stays, meetings, and events in Nairobi.</p>
          <div className="sv-final-cta__btns">
            <Link to="/book-now"  className="sv-btn sv-btn--primary sv-btn--lg">Reserve a Space</Link>
            <Link to="/our-apartments" className="sv-btn sv-btn--ghost sv-btn--lg">View Apartments</Link>
            <Link to="/contact-us"  className="sv-btn sv-btn--ghost sv-btn--lg">Contact Us</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;