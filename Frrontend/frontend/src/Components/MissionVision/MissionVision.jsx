import { Link } from 'react-router-dom';
import './MissionVision.css';

/* ── Data ─────────────────────────────────── */
const VALUES = [
  {
    icon: '🤝',
    title: 'Integrity',
    desc: 'We operate with complete transparency — from pricing to policies. Our guests and clients can always trust us to do what we say.',
  },
  {
    icon: '⭐',
    title: 'Excellence',
    desc: 'We set high standards in every detail — from room cleanliness to event execution. Good enough is never our benchmark.',
  },
  {
    icon: '❤️',
    title: 'Hospitality',
    desc: 'We don\'t just host people — we welcome them. Every interaction is warm, personal, and designed to make guests feel truly at home.',
  },
  {
    icon: '🌍',
    title: 'Community',
    desc: 'We are proud to be rooted in Nairobi. We invest in our team, our neighbourhood, and the city that gives us our purpose.',
  },
  {
    icon: '💡',
    title: 'Innovation',
    desc: 'We continuously improve — whether it\'s upgrading our facilities, refining our processes, or finding smarter ways to serve our guests.',
  },
  {
    icon: '♻️',
    title: 'Sustainability',
    desc: 'We are committed to responsible practices that protect our environment — from energy efficiency to mindful sourcing.',
  },
];

const MILESTONES = [
  { year: '2019', title: 'SpaceHub Founded', desc: 'Started with two guest rooms and a vision to redefine hospitality in Nairobi.' },
  { year: '2020', title: 'Conference Room Launched', desc: 'Added our first fully equipped conference facility — serving local businesses through challenging times.' },
  { year: '2021', title: '500 Guests Hosted', desc: 'Reached our first major milestone — 500 happy guests from across Kenya and beyond.' },
  { year: '2022', title: 'Event Hall Opens', desc: 'Expanded with a full-capacity event space, enabling celebrations, launches, and corporate galas.' },
  { year: '2023', title: 'Premium Suite Added', desc: 'Launched our flagship Premium Suite — redefining luxury short-stay accommodation in Nairobi.' },
  { year: '2025', title: '1,200+ Guests & Counting', desc: 'Now one of Nairobi\'s most trusted hospitality hubs, serving guests and corporates across East Africa.' },
];

const STATS = [
  { value: '1,200+', label: 'Guests Hosted' },
  { value: '6+',     label: 'Years in Business' },
  { value: '4.9 ★',  label: 'Average Rating' },
  { value: '50+',    label: 'Spaces & Rooms' },
];

/* ── Component ─────────────────────────────── */
const MissionVision = () => {
  return (
    <div className="mv-root">

      {/* ── HERO ── */}
      <section className="mv-hero">
        <div className="mv-hero__bg">
          <div className="mv-hero__canvas" />
          <div className="mv-hero__glow mv-hero__glow--1" />
          <div className="mv-hero__glow mv-hero__glow--2" />
          <div className="mv-hero__glow mv-hero__glow--3" />
        </div>
        <div className="mv-hero__content">
          <nav className="mv-breadcrumb">
            <Link to="/home">Home</Link>
            <span>/</span>
            <Link to="/about">About</Link>
            <span>/</span>
            <span>Mission & Vision</span>
          </nav>
          <span className="mv-eyebrow">Who We Are & Where We're Going</span>
          <h1 className="mv-hero__title">
            Driven by Purpose. <br />
            <span className="mv-hero__accent">Guided by Vision.</span>
          </h1>
          <p className="mv-hero__sub">
            At SpaceHub, every room we furnish, every event we host, and every guest we welcome
            is a reflection of a deeper commitment — to create spaces that genuinely improve people's lives.
          </p>
          <div className="mv-hero__ctas">
            <Link to="/booking" className="mv-btn mv-btn--primary">Book a Space</Link>
            <Link to="/contact" className="mv-btn mv-btn--ghost">Talk to Us</Link>
          </div>
        </div>

        {/* Floating stat chips */}
        <div className="mv-hero__stats">
          {STATS.map((s, i) => (
            <div key={i} className="mv-stat-chip" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION + VISION split ── */}
      <section className="mv-split">
        {/* Mission */}
        <div className="mv-split__panel mv-split__panel--mission">
          <div className="mv-split__inner">
            <div className="mv-split__icon-wrap">
              <span className="mv-split__icon">🎯</span>
              <div className="mv-split__icon-ring" />
            </div>
            <span className="mv-split__label">Our Mission</span>
            <h2 className="mv-split__heading">
              To Deliver Exceptional Hospitality Experiences — Every Single Day.
            </h2>
            <p className="mv-split__body">
              Our mission is to provide premium, accessible accommodation, event, and lifestyle
              services that exceed expectations — creating environments where our guests feel
              comfortable, productive, and genuinely cared for.
            </p>
            <p className="mv-split__body">
              We exist to bridge the gap between luxury and affordability in Nairobi's hospitality
              landscape, ensuring every person who walks through our doors receives world-class service
              regardless of the occasion or budget.
            </p>
            <div className="mv-split__pillars">
              {['Guest First', 'Quality Always', 'Community Impact'].map((p, i) => (
                <span key={i} className="mv-pillar mv-pillar--blue">{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="mv-split__panel mv-split__panel--vision">
          <div className="mv-split__inner">
            <div className="mv-split__icon-wrap">
              <span className="mv-split__icon">🔭</span>
              <div className="mv-split__icon-ring mv-split__icon-ring--orange" />
            </div>
            <span className="mv-split__label mv-split__label--orange">Our Vision</span>
            <h2 className="mv-split__heading">
              To Become East Africa's Most Trusted Hospitality Destination.
            </h2>
            <p className="mv-split__body">
              We envision a SpaceHub that is synonymous with excellence across East Africa —
              a name that guests, corporates, and event planners trust without hesitation when
              they need a space that works.
            </p>
            <p className="mv-split__body">
              By 2030, we aim to expand our footprint beyond Nairobi, bringing SpaceHub's standard
              of warm, professional hospitality to every major city in the region — while remaining
              deeply connected to the communities we serve.
            </p>
            <div className="mv-split__pillars">
              {['East Africa Reach', 'Trusted Brand', 'Lasting Impact'].map((p, i) => (
                <span key={i} className="mv-pillar mv-pillar--orange">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMISE BANNER ── */}
      <section className="mv-promise">
        <div className="mv-promise__inner">
          <div className="mv-promise__quote-mark">"</div>
          <blockquote className="mv-promise__text">
            We don't just offer rooms and event spaces. We offer a promise — that when you
            choose SpaceHub, you are choosing people who genuinely care about your experience
            from the very first enquiry to long after you leave.
          </blockquote>
          <div className="mv-promise__author">
            <div className="mv-promise__avatar">SM</div>
            <div>
              <strong>SpaceHub Management</strong>
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="mv-values">
        <div className="mv-section-head">
          <span className="mv-eyebrow">What We Stand For</span>
          <h2>Our Core Values</h2>
          <p>
            These are not slogans on a wall — they are the principles that guide every decision
            we make and every service we deliver at SpaceHub.
          </p>
        </div>
        <div className="mv-values__grid">
          {VALUES.map((v, i) => (
            <div key={i} className="mv-value-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="mv-value-card__icon-wrap">
                <span className="mv-value-card__icon">{v.icon}</span>
              </div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
              <div className="mv-value-card__bar" />
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="mv-timeline">
        <div className="mv-timeline__bg" />
        <div className="mv-section-head mv-section-head--dark">
          <span className="mv-eyebrow mv-eyebrow--light">Our Story So Far</span>
          <h2>SpaceHub Milestones</h2>
          <p>From humble beginnings to Nairobi's most trusted hospitality hub — this is our journey.</p>
        </div>

        <div className="mv-timeline__track">
          <div className="mv-timeline__line" />
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              className={`mv-timeline-item ${i % 2 === 0 ? 'mv-timeline-item--left' : 'mv-timeline-item--right'}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mv-timeline-item__card">
                <span className="mv-timeline-item__year">{m.year}</span>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
              <div className="mv-timeline-item__node">
                <div className="mv-timeline-item__dot" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMITMENT STRIP ── */}
      <section className="mv-commitment">
        <div className="mv-commitment__inner">
          <div className="mv-commitment__copy">
            <span className="mv-eyebrow">Our Pledge to You</span>
            <h2>A Commitment That Goes Beyond the Booking</h2>
            <p>
              We believe hospitality is not a transaction — it's a relationship. Every member
              of the SpaceHub team is trained not just to serve, but to connect. To listen.
              To go the extra mile without being asked.
            </p>
            <p>
              Whether you're staying for one night or hosting a 200-person gala, you have
              our word that SpaceHub will deliver — with warmth, professionalism, and pride.
            </p>
            <div className="mv-commitment__checks">
              {[
                'Personalised service for every guest',
                '24/7 support from our team',
                'Transparent, honest pricing',
                'Continuously improving facilities',
                'Rooted in the Nairobi community',
              ].map((c, i) => (
                <div key={i} className="mv-check-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>{c}</span>
                </div>
              ))}
            </div>
            <div className="mv-commitment__ctas">
              <Link to="/services"  className="mv-btn mv-btn--primary">Explore Services</Link>
              <Link to="/apartments" className="mv-btn mv-btn--outline">View Apartments</Link>
            </div>
          </div>

          {/* Decorative visual */}
          <div className="mv-commitment__visual">
            <div className="mv-visual-card mv-visual-card--back" />
            <div className="mv-visual-card mv-visual-card--mid" />
            <div className="mv-visual-card mv-visual-card--front">
              <div className="mv-visual-card__icon">🏆</div>
              <h4>Award-Worthy Hospitality</h4>
              <p>Rated 4.9 stars by over 1,200 guests and counting.</p>
              <div className="mv-visual-card__stars">★★★★★</div>
            </div>
            <div className="mv-visual-badge mv-visual-badge--1">
              <span>🔒</span> Trusted & Secure
            </div>
            <div className="mv-visual-badge mv-visual-badge--2">
              <span>⚡</span> Always Available
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="mv-cta">
        <div className="mv-cta__glow mv-cta__glow--1" />
        <div className="mv-cta__glow mv-cta__glow--2" />
        <div className="mv-cta__inner">
          <span className="mv-eyebrow mv-eyebrow--light">Join Our Story</span>
          <h2>Be Part of the SpaceHub Experience</h2>
          <p>
            Our mission only comes alive through the people we serve. Whether you're a first-time
            visitor or a returning client — you are the reason SpaceHub exists.
          </p>
          <div className="mv-cta__btns">
            <Link to="/booking"    className="mv-btn mv-btn--primary mv-btn--lg">Reserve a Space</Link>
            <Link to="/contact"    className="mv-btn mv-btn--ghost mv-btn--lg">Get in Touch</Link>
            <Link to="/apartments" className="mv-btn mv-btn--ghost mv-btn--lg">View Apartments</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default MissionVision;