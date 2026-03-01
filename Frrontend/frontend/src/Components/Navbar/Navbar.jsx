import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import facebookIcon from '../../assets/Facebook_Logo_Primary.png';
import instagram from '../../assets/Instagram_Glyph_Gradient.svg';
import whatsapp from '../../assets/Digital_Glyph_Green0001.svg';
import x from '../../assets/logo-black.png';
import './Navbar.css';

const navLinks = [
  { to: '/home',            label: 'Home' },
  { to: '/about',           label: 'About Us' },
  { to: '/book-now',        label: 'Book Now' },
  { to: '/visit',           label: 'Visit' },
  { to: '/our-apartments', label: 'Our Apartments' },
  { to: '/services',        label: 'Services' },
  { to: '/gallery',         label: 'Gallery' },
  { to: '/blogs',           label: 'Blogs' },
  { to: '/contact-us',      label: 'Contact Us' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const location                   = useLocation();
  const drawerRef                  = useRef(null);

  /* close drawer on route change */
  useEffect(() => { setMenuOpen(false); }, [location]);

  /* shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`nb-header ${scrolled ? 'nb-header--scrolled' : ''}`}>

      {/* ── Top Bar ── */}
      <div className="nb-topbar">
        <nav className="nb-topbar__links">
          <Link to="/careers"  className="nb-topbar__link">Call +254718315313</Link>
          <Link to="/policies" className="nb-topbar__link">Policy</Link>
          <Link to="/contact"  className="nb-topbar__link">Contact Us</Link>
        </nav>
        <div className="nb-topbar__socials">
          <a href="https://wa.me/" target="_blank" rel="noreferrer" className="nb-social" aria-label="WhatsApp">
            <img src={whatsapp} alt="WhatsApp" />
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer" className="nb-social" aria-label="X / Twitter">
            <img src={x} alt="X" />
          </a>
          <a href="https://facebook.com/" target="_blank" rel="noreferrer" className="nb-social" aria-label="Facebook">
            <img src={facebookIcon} alt="Facebook" />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="nb-social" aria-label="Instagram">
            <img src={instagram} alt="Instagram" />
          </a>
        </div>
      </div>

      {/* ── Main Bar ── */}
      <div className="nb-mainbar">

        {/* Logo */}
        <Link to="/home" className="nb-logo" aria-label="SpaceHub Home">
          SPACE<span className="nb-logo__hub">HUB</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="nb-nav" aria-label="Main navigation">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nb-nav__link ${location.pathname === to ? 'nb-nav__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link to="/book-now" className="nb-cta">Book Now</Link>

        {/* Hamburger */}
        <button
          className={`nb-burger ${menuOpen ? 'nb-burger--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile Overlay ── */}
      <div
        className={`nb-overlay ${menuOpen ? 'nb-overlay--visible' : ''}`}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile Drawer ── */}
      <div
        ref={drawerRef}
        className={`nb-drawer ${menuOpen ? 'nb-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="nb-drawer__head">
          <Link to="/home" className="nb-logo nb-logo--drawer" onClick={() => setMenuOpen(false)}>
            SPACE<span className="nb-logo__hub">HUB</span>
          </Link>
          <button className="nb-drawer__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="nb-drawer__nav">
          {navLinks.map(({ to, label }, i) => (
            <Link
              key={to}
              to={to}
              className={`nb-drawer__link ${location.pathname === to ? 'nb-drawer__link--active' : ''}`}
              style={{ animationDelay: `${i * 0.045}s` }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="nb-drawer__footer">
          <Link to="/book-now" className="nb-cta nb-cta--full" onClick={() => setMenuOpen(false)}>
            Book Now
          </Link>
          <div className="nb-drawer__socials">
            <a href="https://wa.me/"        target="_blank" rel="noreferrer" className="nb-social nb-social--dark"><img src={whatsapp}    alt="WhatsApp"  /></a>
            <a href="https://x.com/"        target="_blank" rel="noreferrer" className="nb-social nb-social--dark"><img src={x}           alt="X"         /></a>
            <a href="https://facebook.com/" target="_blank" rel="noreferrer" className="nb-social nb-social--dark"><img src={facebookIcon} alt="Facebook"  /></a>
            <a href="https://instagram.com/"target="_blank" rel="noreferrer" className="nb-social nb-social--dark"><img src={instagram}    alt="Instagram" /></a>
          </div>
          <div className="nb-drawer__toplinks">
            <Link to="/careers"  onClick={() => setMenuOpen(false)}>Careers</Link>
            <Link to="/policies" onClick={() => setMenuOpen(false)}>Policy</Link>
            <Link to="/contact"  onClick={() => setMenuOpen(false)}>Contact Us</Link>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;