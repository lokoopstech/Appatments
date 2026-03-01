import { useState } from "react";
import facebookIcon from '../../assets/Facebook_Logo_Primary.png';
import instagram from '../../assets/Instagram_Glyph_Gradient.svg';
import whatsapp from '../../assets/Digital_Glyph_Green0001.svg';
import x from '../../assets/logo-black.png';
import './ContactUs.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Something went wrong. Please try again.');
            }

            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-us-main-container">
            {/* Hero Section */}
            <div className="contact-hero">
                <div className="hero-orbit hero-orbit-1"></div>
                <div className="hero-orbit hero-orbit-2"></div>
                <div className="hero-orbit hero-orbit-3"></div>
                <div className="hero-content">
                    <span className="hero-label">Get In Touch</span>
                    <h1 className="hero-title">Contact <span className="highlight">SpaceHub</span></h1>
                    <p className="hero-subtitle">Have a question or a mission to discuss? We're ready for launch.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="contact-body">
                {/* Info Cards */}
                <div className="contact-info-section">
                    <h2 className="section-label">Reach Us Directly</h2>

                    <div className="info-cards">
                        <div className="info-card">
                            <div className="info-icon email-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                            </div>
                            <div className="info-text">
                                <span className="info-label">Email</span>
                                <a href="mailto:spacehub@gmail.com" className="info-value">spacehub@gmail.com</a>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon phone-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.45-1.45a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                                </svg>
                            </div>
                            <div className="info-text">
                                <span className="info-label">Phone</span>
                                <a href="tel:0718315313" className="info-value">0718 315 313</a>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon location-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <div className="info-text">
                                <span className="info-label">Location</span>
                                <span className="info-value">Nairobi, Kenya</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="social-section">
                        <h3 className="social-label">Find Us On</h3>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <img src={facebookIcon} alt="Facebook" />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <img src={instagram} alt="Instagram" />
                            </a>
                            <a href="#" className="social-link" aria-label="WhatsApp">
                                <img src={whatsapp} alt="WhatsApp" />
                            </a>
                            <a href="#" className="social-link x-link" aria-label="X (Twitter)">
                                <img src={x} alt="X" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Message Form */}
                <div className="contact-form-section">
                    <h2 className="section-label">Send a Message</h2>

                    {submitted ? (
                        <div className="success-card">
                            <div className="success-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </div>
                            <h3>Message Sent!</h3>
                            <p>We'll get back to you shortly. Stay tuned to your orbit.</p>
                            <button className="btn-reset" onClick={() => setSubmitted(false)}>Send Another</button>
                        </div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            {error && (
                                <div className="form-error-banner">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Your Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number <span className="optional">(optional)</span></label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="0700 000 000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        id="subject"
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What's this about?"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your query or idea..."
                                    rows="6"
                                    required
                                />
                            </div>

                            <button type="submit" className={`btn-submit ${loading ? 'loading' : ''}`} disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Launching...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13"/>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;