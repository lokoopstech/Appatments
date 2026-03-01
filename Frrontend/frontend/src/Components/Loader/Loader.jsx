import './Loader.css';

const Loader = ({ exiting = false }) => {
  return (
    <div className={`ld-root${exiting ? ' ld-exit' : ''}`}>

      {/* Background */}
      <div className="ld-bg">
        <div className="ld-bg__warm" />
        <div className="ld-bg__vignette" />
      </div>

      {/* Animated building silhouette */}
      <div className="ld-building" aria-hidden="true">
        {/* Windows grid */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="ld-window"
            style={{ animationDelay: `${(i * 0.18) % 2.4}s` }}
          />
        ))}
        {/* Building facade lines */}
        <div className="ld-facade ld-facade--1" />
        <div className="ld-facade ld-facade--2" />
        <div className="ld-facade ld-facade--3" />
      </div>

      {/* Center card */}
      <div className="ld-card">

        {/* Door icon */}
        <div className="ld-door-wrap">
          <div className="ld-door">
            <div className="ld-door__panel ld-door__panel--left" />
            <div className="ld-door__panel ld-door__panel--right" />
            <div className="ld-door__knob" />
            <div className="ld-door__light" />
          </div>
        </div>

        {/* Logo */}
        <div className="ld-logo">
          <span className="ld-logo__space">SPACE</span>
          <span className="ld-logo__hub">HUB</span>
        </div>

        {/* Subtitle */}
        <p className="ld-subtitle">Premium Apartments & Spaces</p>

        {/* Divider */}
        <div className="ld-divider">
          <div className="ld-divider__line" />
          <span className="ld-divider__icon">🏠</span>
          <div className="ld-divider__line" />
        </div>

        {/* Tagline */}
        <p className="ld-tagline">Nairobi, Kenya</p>

        {/* Progress */}
        <div className="ld-progress-wrap">
          <div className="ld-progress-track">
            <div className="ld-progress-fill" />
            <div className="ld-progress-shine" />
          </div>
          <div className="ld-progress-row">
            <span className="ld-progress-text">Preparing your experience</span>
            <span className="ld-progress-dots">
              <span /><span /><span />
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Loader;