import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Hero_Images from "../../assets/HeroSection";
import './HeroSection.css';



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

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadedSlides, setLoadedSlides] = useState(new Set([0]));
  const intervalRef = useRef(null);

  // ── Stable next-slide reference so the interval never re-creates ──
  const currentSlideRef = useRef(currentSlide);
  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => { currentSlideRef.current = currentSlide; }, [currentSlide]);
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);

  const goToSlide = useCallback((index) => {
    if (isAnimatingRef.current || index === currentSlideRef.current) return;
    setIsAnimating(true);
    setPrevSlide(currentSlideRef.current);
    setCurrentSlide(index);

    // Pre-load next slide image when navigating
    setLoadedSlides(prev => new Set([...prev, index]));

    setTimeout(() => {
      setPrevSlide(null);
      setIsAnimating(false);
    }, 1000);
  }, []);

  const nextSlide = useCallback(() => {
    const next = (currentSlideRef.current + 1) % Hero_Images.length;
    goToSlide(next);
    // Preload the slide AFTER next so it's ready
    const afterNext = (next + 1) % Hero_Images.length;
    setLoadedSlides(prev => new Set([...prev, afterNext]));
  }, [goToSlide]);

  const prevSlideHandler = useCallback(() => {
    const prev = (currentSlideRef.current - 1 + Hero_Images.length) % Hero_Images.length;
    goToSlide(prev);
  }, [goToSlide]);

  // ── Single interval that never re-creates on slide change ──
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 5000);
    return () => clearInterval(intervalRef.current);
  }, [nextSlide]); // nextSlide is stable (useCallback with no deps that change)

  const resetInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 5000);
  }, [nextSlide]);

  return (
    <section className="hero-section-main-container" aria-label="Hero slideshow">
{/*       
          {loading && (
            <div className="bl-grid">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )} */}

      {/* ── Background slides ── */}
      <div className="slides-wrapper" aria-hidden="true">
        {Hero_Images.map((H, I) => {
          const shouldRender = loadedSlides.has(I);
          return (
            <div
              key={I}
              className={`slide ${I === currentSlide ? 'slide--active' : ''} ${I === prevSlide ? 'slide--prev' : ''}`}
            >
              {shouldRender && (
                <img
                  src={H.image}
                  alt=""                          /* decorative — real alt on h1 */
                  className="slide__image"
                  /* First slide: eager + high priority for LCP */
                  loading={I === 0 ? "eager" : "lazy"}
                  fetchpriority={I === 0 ? "high" : "low"}
                  decoding={I === 0 ? "sync" : "async"}
                  width="1920"
                  height="1080"
                />
              )}
              <div className="slide__overlay" />
            </div>
          );
        })}
      </div>

      {/* ── Text content ── */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" aria-hidden="true" />
          Premium Properties
        </div>

        <h1 className="hero-tagline" key={`tag-${currentSlide}`}>
          {Hero_Images[currentSlide].taggline.split(' ').map((word, i) => (
            <span key={i} className="word-reveal" style={{ animationDelay: `${i * 0.08}s` }}>
              {word}&nbsp;
            </span>
          ))}
        </h1>

        <p className="hero-subtagline" key={`sub-${currentSlide}`}>
          {Hero_Images[currentSlide].subtaggline}
        </p>

        <div className="hero-actions">
          <Link to="/our-apartments" className="btn btn--primary">
            Explore Properties
          </Link>
          {/* Fixed: <li> inside <Link> is invalid HTML — use <span> or just style the Link */}
          <Link to="/book-now" className="btn btn--ghost">
            Book Now
          </Link>
        </div>
      </div>

      {/* ── Navigation arrows ── */}
      <button
        className="nav-arrow nav-arrow--prev"
        onClick={() => { prevSlideHandler(); resetInterval(); }}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        className="nav-arrow nav-arrow--next"
        onClick={() => { nextSlide(); resetInterval(); }}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* ── Dot indicators ── */}
      <div className="hero-dots" role="tablist" aria-label="Slide indicators">
        {Hero_Images.map((_, I) => (
          <button
            key={I}
            role="tab"
            aria-selected={I === currentSlide}
            className={`dot ${I === currentSlide ? 'dot--active' : ''}`}
            onClick={() => { goToSlide(I); resetInterval(); }}
            aria-label={`Go to slide ${I + 1}`}
          />
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="slide-counter" aria-hidden="true">
        <span className="counter-current">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="counter-divider" />
        <span className="counter-total">{String(Hero_Images.length).padStart(2, '0')}</span>
      </div>

      {/* ── Progress bar ── */}
      <div className="progress-bar" aria-hidden="true" key={currentSlide}>
        <div className="progress-bar__fill" />
      </div>

    </section>
  );
};

export default HeroSection;