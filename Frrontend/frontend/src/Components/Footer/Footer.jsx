import { Link } from "react-router-dom";
import facebookIcon from '../../assets/Facebook_Logo_Primary.png';
import instagram    from '../../assets/Instagram_Glyph_Gradient.svg';
import whatsapp     from '../../assets/Digital_Glyph_Green0001.svg';
import x            from '../../assets/logo-black.png';
import { useSubscribe } from "../../Unsubcribe/Unsubcribe";
import './Footer.css';

const QUICK_LINKS = [
  { label: 'Home',           to: '/home' },
  { label: 'About Us',       to: '/about-us' },
  { label: 'Our Apartments', to: '/our-apartments' },
  { label: 'Services',       to: '/services' },
  { label: 'Visit Us',       to: '/visit' },
  { label: 'Gallery',        to: '/gallery' },
  { label: 'Blogs',          to: '/blogs' },
  { label: 'Book Now',       to: '/book-now' },
  { label: 'FAQ',            to: '/faq' },
];

const SERVICES_LINKS = [
  'Guest House Stays',
  'Conference & Meetings',
  'Event Hosting',
  'Catering & Dining',
  'Airport Transfers',
  'Concierge Services',
];

const SOCIALS = [
  { name: 'Facebook',  href: '#', img: facebookIcon, invert: false },
  { name: 'Instagram', href: '#', img: instagram,    invert: false },
  { name: 'WhatsApp',  href: '#', img: whatsapp,     invert: false },
  { name: 'X',         href: '#', img: x,            invert: true  },
];

const Footer = () => {
  const { email, setEmail, status, error, handleSubscribe } = useSubscribe({ source: 'footer' });
  const year = new Date().getFullYear();

  return (
    <footer className="ft-root">

      {/* ── Glow bar top ── */}
      <div className="ft-glow-bar" />

      {/* ── Main footer body ── */}
      <div className="ft-body">

        {/* ── Col 1: Brand ── */}
        <div className="ft-col ft-col--brand">
          <div className="ft-logo">
            <span className="ft-logo__space">SPACE</span>
            <span className="ft-logo__hub">HUB</span>
          </div>
          <p className="ft-tagline">
            Nairobi's premier hospitality hub — where comfort, style, and
            convenience meet under one roof.
          </p>

          <div className="ft-socials">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} aria-label={s.name}
                className={`ft-social-link ${s.invert ? 'ft-social-link--invert' : ''}`}>
                <img src={s.img} alt={s.name} />
              </a>
            ))}
          </div>

          <div className="ft-contact-pills">
            <a href="tel:0718315313" className="ft-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.45-1.45a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
              </svg>
              0718 315 313
            </a>
            <a href="mailto:spacehub@gmail.com" className="ft-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              spacehub@gmail.com
            </a>
            <span className="ft-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Nairobi, Kenya
            </span>
          </div>
        </div>

        {/* ── Col 2: Quick Links ── */}
        <div className="ft-col">
          <h4 className="ft-col-title">
            <span className="ft-col-title__line" />
            Quick Links
          </h4>
          <ul className="ft-link-list">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="ft-link">
                  <span className="ft-link__arrow">›</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Services ── */}
        <div className="ft-col">
          <h4 className="ft-col-title">
            <span className="ft-col-title__line" />
            Our Services
          </h4>
          <ul className="ft-link-list">
            {SERVICES_LINKS.map((s) => (
              <li key={s}>
                <Link to="/services" className="ft-link">
                  <span className="ft-link__arrow">›</span>
                  {s}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ft-hours-card">
            <div className="ft-hours-card__dot" />
            <div>
              <strong>Open Today</strong>
              <span>Mon – Fri: 7AM – 10PM</span>
              <span>Sat: 8AM – 11PM</span>
              <span>Sun: 9AM – 8PM</span>
            </div>
          </div>
        </div>

        {/* ── Col 4: Newsletter ── */}
        <div className="ft-col ft-col--newsletter">
          <h4 className="ft-col-title">
            <span className="ft-col-title__line" />
            Stay in the Loop
          </h4>
          <p className="ft-newsletter-sub">
            Subscribe for exclusive offers, event updates, and SpaceHub news delivered straight to your inbox.
          </p>

          {/* ── Success state ── */}
          {status === 'success' && (
            <div className="ft-sub-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Check your inbox to verify! 📬</span>
            </div>
          )}

          {/* ── Already subscribed ── */}
          {status === 'already_subscribed' && (
            <div className="ft-sub-success" style={{ background: 'rgba(99,102,241,.12)', color: '#818cf8' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>You're already subscribed!</span>
            </div>
          )}

          {/* ── Form (idle / loading / error) ── */}
          {(status === 'idle' || status === 'loading' || status === 'error') && (
            <>
              <form className="ft-newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                />
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? <span className="ft-spinner" /> : 'Subscribe'}
                </button>
              </form>
              {status === 'error' && (
                <p style={{ color: '#f87171', fontSize: '.78rem', marginTop: 6 }}>{error}</p>
              )}
            </>
          )}

          <div className="ft-book-card">
            <div className="ft-book-card__icon">🏠</div>
            <div className="ft-book-card__copy">
              <strong>Ready to Book?</strong>
              <span>Reserve your space today.</span>
            </div>
            <Link to="/book-now" className="ft-book-card__btn">Book →</Link>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="ft-divider" />

      {/* ── Bottom bar ── */}
      <div className="ft-bottom">
        <span className="ft-copyright">
          © {year} <strong>SpaceHub</strong>. All rights reserved. Nairobi, Kenya. | Designed By LokoopsTech
        </span>
        <div className="ft-bottom-links">
          <a href="/policy&Privacy">Privacy Policy</a>
          <span>·</span>
          <a href="/terms">Terms of Use</a>
          <span>·</span>
          <a href="/cookies">Cookie Policy</a>
        </div>
        <div className="ft-bottom-socials">
          {SOCIALS.map((s) => (
            <a key={s.name} href={s.href} aria-label={s.name}
              className={`ft-bottom-social ${s.invert ? 'ft-bottom-social--invert' : ''}`}>
              <img src={s.img} alt={s.name} />
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
};

export default Footer;