
import { useSubscribe } from '../../Unsubcribe/Unsubcribe';
import './NewsLetter.css';

const NewsletterBanner = ({ source = 'popup' }) => {
  const { email, setEmail, status, error, handleSubscribe } = useSubscribe({ source });

  return (
    <section className="nl-banner">
      <div className="nl-banner__inner">

        <div className="nl-banner__copy">
          <span className="nl-banner__eyebrow">📬 SpaceHub Newsletter</span>
          <h2 className="nl-banner__title">Stay Ahead of the Best Deals</h2>
          <p className="nl-banner__sub">
            Get exclusive offers, new apartment alerts, event previews, and Nairobi lifestyle tips — straight to your inbox.
          </p>
          <div className="nl-banner__perks">
            {['🏠 New listings first', '💸 Members-only rates', '🎪 Event previews', '📝 Lifestyle tips'].map(p => (
              <span key={p} className="nl-perk">{p}</span>
            ))}
          </div>
        </div>

        <div className="nl-banner__form-wrap">
          {status === 'success' ? (
            <div className="nl-success">
              <div className="nl-success__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Almost there!</h3>
              <p>Check your inbox for a verification email from SpaceHub and click the link to confirm your subscription.</p>
            </div>
          ) : status === 'already_subscribed' ? (
            <div className="nl-success" style={{ '--nl-color': '#6366f1' }}>
              <div className="nl-success__icon" style={{ background: 'rgba(99,102,241,.15)', color: '#6366f1' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3>You're already in!</h3>
              <p>This email is already subscribed to SpaceHub updates. Watch your inbox for the latest news.</p>
            </div>
          ) : (
            <form className="nl-form" onSubmit={handleSubscribe}>
              <h3 className="nl-form__title">Join the Community</h3>
              <p className="nl-form__sub">No spam. Unsubscribe anytime.</p>

              <div className="nl-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                />
              </div>

              {status === 'error' && (
                <p className="nl-error">{error}</p>
              )}

              <button type="submit" className="nl-btn" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <><span className="nl-spinner" /> Subscribing…</>
                ) : (
                  <>Subscribe Free →</>
                )}
              </button>

              <p className="nl-disclaimer">
                By subscribing you agree to receive emails from SpaceHub. You can unsubscribe at any time.
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};

export default NewsletterBanner;