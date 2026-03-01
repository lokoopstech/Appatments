// src/pages/bookNow/BookNow.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../../Context/ApartmenContextt';
import NewsletterBanner from '../NewsLetter/NewsLetter';
import './BookNow.css';

// Fallback images for apartment types (used when backend has no image)
import apartment  from '../../assets/apart15.jpg';
import guestHouse from '../../assets/apart1.avif';
import conference from '../../assets/apart14.jpg';
import event      from '../../assets/apart2.avif';

const TYPE_FALLBACK = {
  studio:    guestHouse,
  '1BHK':    guestHouse,
  '2BHK':    apartment,
  '3BHK':    apartment,
  penthouse: apartment,
};

const TYPE_ICON = {
  studio:    conference,
  '1BHK':    guestHouse,
  '2BHK':    apartment,
  '3BHK':    apartment,
  penthouse: event,
};

const BookNow = () => {
  const navigate = useNavigate();
  const {
    apartments,
    apartmentsLoading,
    apartmentsError,
    selectedApartment,
    setSelectedApartment,
    checkAvailability,
    submitBooking,
  } = useBooking();

  const [step, setStep]           = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availabilityMsg, setAvailabilityMsg] = useState('');
  const [checkingAvail, setCheckingAvail]     = useState(false);
  const [error, setError]         = useState('');
  const [createdBooking, setCreatedBooking]   = useState(null);

  const [form, setForm] = useState({
    guestfirstName:    '',
    guestlastName: '',
    guestEmail:   '',
    guestPhone:   '',
    checkInDate:  '',
    checkOutDate: '',
    numberOfGuests: '1',
    specialRequests: '',
  });

  // If navigated here from Apartments page with a pre-selected apartment, auto-scroll to form
  useEffect(() => {
    if (selectedApartment) {
      document.querySelector('.bn-form-wrapper')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedApartment]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear availability message when dates change
    if (e.target.name === 'checkInDate' || e.target.name === 'checkOutDate') {
      setAvailabilityMsg('');
    }
  };

  const handleSelectApartment = (apt) => {
    setSelectedApartment(apt);
    setAvailabilityMsg('');
  };

  // Step 1 → Step 2: validate personal info, then check availability
  const handleNext = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedApartment) {
      setError('Please select a space before continuing.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When both dates are filled, auto-check availability
  const handleCheckAvailability = async () => {
    if (!form.checkInDate || !form.checkOutDate || !selectedApartment) return;
    setCheckingAvail(true);
    setAvailabilityMsg('');
    try {
      const available = await checkAvailability(
        selectedApartment._id,
        form.checkInDate,
        form.checkOutDate
      );
      setAvailabilityMsg(available
        ? '✅ This space is available for your selected dates!'
        : '❌ Sorry, this space is not available for those dates. Please choose different dates.'
      );
    } catch (err) {
      setAvailabilityMsg('⚠️ Could not check availability. Please try again.');
    } finally {
      setCheckingAvail(false);
    }
  };

  // Final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedApartment) {
      setError('No space selected. Please go back and select a space.');
      return;
    }

    if (availabilityMsg.startsWith('❌')) {
      setError('Please select available dates before confirming.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        apartmentId:     selectedApartment._id,
        guestFirstName:  form.firstName,
        guestLastName:   form.lastName,
        guestEmail:      form.guestEmail,
        guestPhone:      form.guestPhone,
        checkInDate:     form.checkInDate,
        checkOutDate:    form.checkOutDate,
        numberOfGuests:  Number(form.numberOfGuests),
        specialRequests: form.specialRequests,
      };

      const booking = await submitBooking(payload);
      setCreatedBooking(booking);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    setError('');
    setAvailabilityMsg('');
    setCreatedBooking(null);
    setForm({
      firstName: '', lastName: '', guestEmail: '', guestPhone: '',
      checkInDate: '', checkOutDate: '', numberOfGuests: '1', specialRequests: '',
    });
    setSelectedApartment(null);
  };

  // Calculate nights & estimated total
  const nights = form.checkInDate && form.checkOutDate
    ? Math.max(0, Math.ceil((new Date(form.checkOutDate) - new Date(form.checkInDate)) / (1000 * 60 * 60 * 24)))
    : 0;
  const estimatedTotal = selectedApartment && nights > 0
    ? `KES ${(selectedApartment.price * nights).toLocaleString()}`
    : null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bn-page">

      {/* ── Hero Banner ── */}
      <div className="bn-banner">
        <div className="bn-banner__overlay" />
        <div className="bn-banner__content">
          <p className="bn-banner__eyebrow">
            <span className="bn-dot" /> SpaceHub Reservations
          </p>
          <h1 className="bn-banner__title">Book Your Space</h1>
          <div className="bn-breadcrumb">
            <Link to="/home" className="bn-breadcrumb__link">Home</Link>
            <span className="bn-breadcrumb__sep">/</span>
            <span className="bn-breadcrumb__current">Book Now</span>
          </div>
        </div>
        <div className="bn-banner__shape" />
      </div>

      {/* ── Main Body ── */}
      <div className="bn-body">

        {/* ── Space Selector ── */}
        <div className="bn-services">
          <p className="bn-section-label">Select a Space</p>

          {apartmentsLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-400)' }}>
              Loading available spaces…
            </div>
          )}

          {apartmentsError && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#ef4444' }}>
              {apartmentsError}
            </div>
          )}

          {!apartmentsLoading && !apartmentsError && apartments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-400)' }}>
              No spaces available at the moment. Please check back soon.
            </div>
          )}

          {!apartmentsLoading && apartments.length > 0 && (
            <div className="bn-service-grid">
              {apartments.map(apt => {
                const imgSrc = apt.images?.[0] || TYPE_ICON[apt.type] || apartment;
                const isActive = selectedApartment?._id === apt._id;
                return (
                  <button
                    key={apt._id}
                    className={`bn-service-card ${isActive ? 'bn-service-card--active' : ''}`}
                    onClick={() => handleSelectApartment(apt)}
                    type="button"
                  >
                    <span className="bn-service-icon">
                      <img
                        style={{ objectFit: 'cover', width: '200px', height: '200px' }}
                        src={imgSrc}
                        alt={apt.title}
                        onError={e => { e.target.src = TYPE_FALLBACK[apt.type] || apartment; }}
                      />
                    </span>
                    <span className="bn-service-label">{apt.title}</span>
                    <span className="bn-service-desc">
                      {apt.type} · KES {apt.price?.toLocaleString()} / night
                    </span>
                    {apt.location?.city && (
                      <span className="bn-service-desc" style={{ fontSize: '.75rem' }}>
                        📍 {apt.location.city}
                      </span>
                    )}
                    {isActive && <span className="bn-service-check">✓</span>}
                  </button>
                );
              })}
            </div>
          )}

          {error && step === 1 && (
            <p style={{ color: '#ef4444', marginTop: 12, fontSize: '.875rem', textAlign: 'center' }}>{error}</p>
          )}
        </div>

        {/* ── Form Area ── */}
        {!submitted ? (
          <div className="bn-form-wrapper">

            {/* Step Indicator */}
            <div className="bn-steps">
              <div className={`bn-step ${step >= 1 ? 'bn-step--done' : ''}`}>
                <div className="bn-step__circle">{step > 1 ? '✓' : '1'}</div>
                <span>Your Details</span>
              </div>
              <div className="bn-step__line" />
              <div className={`bn-step ${step >= 2 ? 'bn-step--done' : ''}`}>
                <div className="bn-step__circle">2</div>
                <span>Reservation Info</span>
              </div>
            </div>

            {/* Step 1 – Personal Info */}
            {step === 1 && (
              <form className="bn-form" onSubmit={handleNext}>
                <h2 className="bn-form__title">Personal Details</h2>
                <p className="bn-form__subtitle">Tell us a little about yourself</p>

                <div className="bn-form__row">
                  <div className="bn-field">
                    <label className="bn-label">First Name</label>
                    <input className="bn-input" type="text" name="firstName"
                      placeholder="e.g. James" value={form.firstName}
                      onChange={handleChange} required />
                  </div>
                  <div className="bn-field">
                    <label className="bn-label">Last Name</label>
                    <input className="bn-input" type="text" name="lastName"
                      placeholder="e.g. Mwangi" value={form.lastName}
                      onChange={handleChange} required />
                  </div>
                </div>

                <div className="bn-form__row">
                  <div className="bn-field">
                    <label className="bn-label">Email Address</label>
                    <input className="bn-input" type="email" name="guestEmail"
                      placeholder="you@email.com" value={form.guestEmail}
                      onChange={handleChange} required />
                  </div>
                  <div className="bn-field">
                    <label className="bn-label">Phone Number</label>
                    <input className="bn-input" type="tel" name="guestPhone"
                      placeholder="+254 700 000 000" value={form.guestPhone}
                      onChange={handleChange} required />
                  </div>
                </div>

                <button className="bn-btn bn-btn--primary" type="submit">
                  Continue to Reservation
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}

            {/* Step 2 – Reservation Info */}
            {step === 2 && (
              <form className="bn-form" onSubmit={handleSubmit}>
                <h2 className="bn-form__title">Reservation Details</h2>
                <p className="bn-form__subtitle">
                  Booking: <strong>{selectedApartment?.title || '—'}</strong>
                  {selectedApartment?.price && (
                    <span style={{ marginLeft: 8, color: 'var(--gray-400)', fontWeight: 400 }}>
                      · KES {selectedApartment.price.toLocaleString()} / night
                    </span>
                  )}
                </p>

                <div className="bn-form__row">
                  <div className="bn-field">
                    <label className="bn-label">Check-In Date</label>
                    <input className="bn-input" type="date" name="checkInDate"
                      value={form.checkInDate} onChange={handleChange}
                      min={today} required />
                  </div>
                  <div className="bn-field">
                    <label className="bn-label">Check-Out Date</label>
                    <input className="bn-input" type="date" name="checkOutDate"
                      value={form.checkOutDate} onChange={handleChange}
                      min={form.checkInDate || today} required />
                  </div>
                </div>

                {/* Availability checker */}
                <div style={{ marginBottom: 16 }}>
                  <button
                    type="button"
                    className="bn-btn bn-btn--ghost"
                    style={{ fontSize: '.85rem', padding: '8px 16px' }}
                    onClick={handleCheckAvailability}
                    disabled={!form.checkInDate || !form.checkOutDate || checkingAvail}
                  >
                    {checkingAvail ? 'Checking…' : '🔍 Check Availability'}
                  </button>
                  {availabilityMsg && (
                    <p style={{
                      marginTop: 8, fontSize: '.875rem',
                      color: availabilityMsg.startsWith('✅') ? '#16a34a' : '#ef4444'
                    }}>
                      {availabilityMsg}
                    </p>
                  )}
                </div>

                <div className="bn-form__row">
                  <div className="bn-field">
                    <label className="bn-label">Number of Guests</label>
                    <select className="bn-input bn-select" name="numberOfGuests"
                      value={form.numberOfGuests} onChange={handleChange}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bn-field" style={{ visibility: 'hidden' }} />
                </div>

                <div className="bn-field bn-field--full">
                  <label className="bn-label">
                    Special Requests <span className="bn-optional">(Optional)</span>
                  </label>
                  <textarea className="bn-input bn-textarea" name="specialRequests"
                    placeholder="Any specific requirements, preferences, or questions..."
                    value={form.specialRequests} onChange={handleChange} rows={4} />
                </div>

                {/* Summary card */}
                <div className="bn-summary">
                  <p className="bn-summary__title">Booking Summary</p>
                  <div className="bn-summary__row">
                    <span>Guest</span>
                    <strong>{form.firstName} {form.lastName}</strong>
                  </div>
                  <div className="bn-summary__row">
                    <span>Space</span>
                    <strong>{selectedApartment?.title || '—'}</strong>
                  </div>
                  <div className="bn-summary__row">
                    <span>Type</span>
                    <strong style={{ textTransform: 'capitalize' }}>{selectedApartment?.type || '—'}</strong>
                  </div>
                  {form.checkInDate && (
                    <div className="bn-summary__row">
                      <span>Check-In</span>
                      <strong>{new Date(form.checkInDate).toDateString()}</strong>
                    </div>
                  )}
                  {form.checkOutDate && (
                    <div className="bn-summary__row">
                      <span>Check-Out</span>
                      <strong>{new Date(form.checkOutDate).toDateString()}</strong>
                    </div>
                  )}
                  {nights > 0 && (
                    <div className="bn-summary__row">
                      <span>Nights</span>
                      <strong>{nights}</strong>
                    </div>
                  )}
                  <div className="bn-summary__row">
                    <span>Guests</span>
                    <strong>{form.numberOfGuests}</strong>
                  </div>
                  {estimatedTotal && (
                    <div className="bn-summary__row" style={{ borderTop: '1px solid #e5e7eb', paddingTop: 10, marginTop: 6 }}>
                      <span style={{ fontWeight: 700 }}>Estimated Total</span>
                      <strong style={{ color: '#6366f1', fontSize: '1.05rem' }}>{estimatedTotal}</strong>
                    </div>
                  )}
                </div>

                {error && (
                  <p style={{ color: '#ef4444', fontSize: '.875rem', marginBottom: 12 }}>{error}</p>
                )}

                <div className="bn-form__actions">
                  <button className="bn-btn bn-btn--ghost" type="button" onClick={() => setStep(1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <button
                    className="bn-btn bn-btn--primary"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting…' : 'Confirm Booking'}
                    {!submitting && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ── Success State ── */
          <div className="bn-success">
            <div className="bn-success__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="bn-success__title">Booking Received!</h2>
            <p className="bn-success__msg">
              Thank you, <strong>{form.firstName}</strong>! Your reservation for{' '}
              <strong>{selectedApartment?.title}</strong> has been submitted and is{' '}
              <strong>pending confirmation</strong>. We'll contact you at{' '}
              <strong>{form.guestEmail}</strong> within 24 hours.
            </p>
            {createdBooking?._id && (
              <p style={{ fontSize: '.85rem', color: 'var(--gray-400)', marginTop: 8 }}>
                Booking reference: <strong>#{createdBooking._id.slice(-8).toUpperCase()}</strong>
              </p>
            )}
            <div className="bn-success__actions">
              <button className="bn-btn bn-btn--primary" onClick={handleReset}>
                Make Another Booking
              </button>
              <Link to="/home" className="bn-btn bn-btn--ghost">Back to Home</Link>
            </div>
          </div>
        )}

        {/* ── Info Cards ── */}
        <div className="bn-info-grid">
          {[
            { icon: '📞', title: 'Call Us',   body: '0718 315 313',        sub: 'Mon – Sat, 8am – 8pm' },
            { icon: '📧', title: 'Email Us',  body: 'spacehub@gmail.com',  sub: 'We reply within 2 hours' },
            { icon: '📍', title: 'Visit Us',  body: 'Nairobi, Kenya',      sub: 'Open for walk-ins daily' },
          ].map((card, i) => (
            <div key={i} className="bn-info-card" style={{ animationDelay: `${i * 0.12}s` }}>
              <span className="bn-info-icon">{card.icon}</span>
              <h4 className="bn-info-title">{card.title}</h4>
              <p className="bn-info-body">{card.body}</p>
              <p className="bn-info-sub">{card.sub}</p>
            </div>
          ))}
        </div>
      </div>
    
       <NewsletterBanner source="apartments" />  
    </div>
  );
};

export default BookNow;