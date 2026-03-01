import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './About.css';

const stats = [
  { value: '500+', label: 'Happy Guests' },
  { value: '12+',  label: 'Years Experience' },
  { value: '80+',  label: 'Premium Units' },
  { value: '4.9★', label: 'Average Rating' },
];

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Home-Like Comfort',
    desc: 'Every space we manage is curated to feel lived-in, warm, and genuinely welcoming — not just a room with a key.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Seamless Experience',
    desc: 'From inquiry to check-out, we handle every detail so you can focus on what matters most to you.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Trust & Transparency',
    desc: 'No hidden fees, no surprises. What you see is what you get — clear pricing and honest communication.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Community First',
    desc: 'We build relationships — with guests, property owners, and the communities we operate in.',
  },
];

const team = [
  { name: 'Amara Osei',    role: 'Founder & CEO',         initial: 'AO', color: '#E8451A' },
  { name: 'David Kariuki', role: 'Head of Operations',     initial: 'DK', color: '#1a3fcc' },
  { name: 'Fatima Yusuf',  role: 'Guest Experience Lead',  initial: 'FY', color: '#1a1a4e' },
  { name: 'James Mwenda',  role: 'Property Manager',       initial: 'JM', color: '#E8451A' },
];

/* ── Intersection Observer hook for scroll reveals ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('au-revealed'); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const AboutUs = () => {
  const storyRef  = useReveal();
  const statsRef  = useReveal();
  const valuesRef = useReveal();
  const teamRef   = useReveal();
  const ctaRef    = useReveal();

  return (
    <div className="au-page">

      {/* ── Hero Banner ── */}
      <div className="au-banner">
        <div className="au-banner__bg" />
        <div className="au-banner__overlay" />
        <div className="au-banner__shapes">
          <div className="au-shape au-shape--1" />
          <div className="au-shape au-shape--2" />
          <div className="au-shape au-shape--3" />
        </div>
        <div className="au-banner__content">
          <p className="au-eyebrow"><span className="au-dot" />Our Story</p>
          <h1 className="au-banner__title">
            Built on <em>Trust</em>,<br />Driven by <em>Comfort</em>
          </h1>
          <p className="au-banner__sub">
            SpaceHub is Nairobi's premier property management company — offering
            serviced apartments, guesthouses, conference spaces, and more.
          </p>
          <div className="au-breadcrumb">
            <Link to="/home" className="au-breadcrumb__link">Home</Link>
            <span className="au-breadcrumb__sep">/</span>
            <span className="au-breadcrumb__current">About Us</span>
          </div>
        </div>
      </div>

      {/* ── Story Section ── */}
      <section className="au-story au-reveal" ref={storyRef}>
        <div className="au-story__visual">
          <div className="au-story__img-stack">
            <div className="au-story__img au-story__img--back" />
            <div className="au-story__img au-story__img--front">
              <div className="au-story__badge">
                <span className="au-story__badge-num">12+</span>
                <span className="au-story__badge-txt">Years of<br/>Excellence</span>
              </div>
            </div>
          </div>
          <div className="au-story__accent" />
        </div>
        <div className="au-story__text">
          <p className="au-section-label">Who We Are</p>
          <h2 className="au-section-title">
            A Home for Every <span className="au-highlight">Journey</span>
          </h2>
          <p className="au-story__body">
            SpaceHub was founded with a single belief — that where you stay should
            never be an afterthought. Whether you're a business traveller needing a
            well-equipped conference room, a family looking for a furnished apartment,
            or a couple seeking a cozy guesthouse retreat, we have a space designed
            with you in mind.
          </p>
          <p className="au-story__body">
            Headquartered in Nairobi, Kenya, we manage a growing portfolio of premium
            properties across the city. Our team of dedicated professionals ensures
            every property is impeccably maintained, every booking is effortless, and
            every guest leaves wanting to return.
          </p>
          <div className="au-story__pills">
            <span className="au-pill">🏢 Serviced Apartments</span>
            <span className="au-pill">🏡 Guest Houses</span>
            <span className="au-pill">💼 Conference Rooms</span>
            <span className="au-pill">🎉 Event Spaces</span>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="au-stats au-reveal" ref={statsRef}>
        {stats.map((s, i) => (
          <div key={i} className="au-stat" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="au-stat__value">{s.value}</span>
            <span className="au-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Values ── */}
      <section className="au-values au-reveal" ref={valuesRef}>
        <div className="au-values__header">
          <p className="au-section-label">What Drives Us</p>
          <h2 className="au-section-title">Our Core <span className="au-highlight">Values</span></h2>
          <p className="au-values__sub">
            Every decision we make comes back to these four commitments.
          </p>
        </div>
        <div className="au-values__grid">
          {values.map((v, i) => (
            <div key={i} className="au-value-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="au-value-card__icon">{v.icon}</div>
              <h3 className="au-value-card__title">{v.title}</h3>
              <p className="au-value-card__desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="au-team au-reveal" ref={teamRef}>
        <div className="au-team__header">
          <p className="au-section-label">The People Behind SpaceHub</p>
          <h2 className="au-section-title">Meet Our <span className="au-highlight">Team</span></h2>
        </div>
        <div className="au-team__grid">
          {team.map((member, i) => (
            <div key={i} className="au-team-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="au-team-card__avatar" style={{ background: member.color }}>
                {member.initial}
              </div>
              <div className="au-team-card__info">
                <h4 className="au-team-card__name">{member.name}</h4>
                <p className="au-team-card__role">{member.role}</p>
              </div>
              <div className="au-team-card__bar" style={{ background: member.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="au-cta au-reveal" ref={ctaRef}>
        <div className="au-cta__inner">
          <div className="au-cta__shapes">
            <div className="au-cta__shape au-cta__shape--1" />
            <div className="au-cta__shape au-cta__shape--2" />
          </div>
          <p className="au-section-label au-section-label--light">Ready to Stay?</p>
          <h2 className="au-cta__title">Find Your Perfect Space Today</h2>
          <p className="au-cta__sub">
            Browse our curated properties or talk to our team — we'll match you
            with the ideal space for your needs.
          </p>
          <div className="au-cta__actions">
            <Link to="/book-now"         className="au-btn au-btn--primary">Book Now</Link>
            <Link to="/our-appartments"  className="au-btn au-btn--ghost">View Properties</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;