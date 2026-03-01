import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Policy.css';

/* ── Data ─────────────────────────────────── */
const POLICIES = [
  {
    id: 'privacy',
    icon: '🔒',
    label: 'Privacy Policy',
    lastUpdated: 'January 15, 2025',
    sections: [
      {
        title: '1. Introduction',
        content: `SpaceHub ("we", "our", or "us") is committed to protecting the privacy and personal information of our guests, clients, and website visitors. This Privacy Policy explains how we collect, use, store, and protect your information when you use our services, visit our premises, or interact with our website. By using our services, you agree to the terms outlined in this policy.`,
      },
      {
        title: '2. Information We Collect',
        content: `We collect the following categories of personal information:\n• Identity Information: Full name, date of birth, national ID or passport number, and photograph (for check-in and security purposes).\n• Contact Information: Email address, phone number, and physical address.\n• Booking Information: Reservation details, room preferences, check-in/check-out dates, and special requests.\n• Payment Information: Billing address and transaction records. We do not store full card numbers — payments are processed by secure third-party providers.\n• Communication Records: Emails, messages, or enquiries submitted via our contact form or social media.\n• Usage Data: IP address, browser type, pages visited, and time spent on our website (collected via cookies).`,
      },
      {
        title: '3. How We Use Your Information',
        content: `We use your personal information for the following purposes:\n• To process and manage your bookings, reservations, and service requests.\n• To communicate booking confirmations, updates, and relevant information.\n• To process payments and issue invoices or receipts.\n• To improve our services, website experience, and facilities based on feedback.\n• To comply with legal and regulatory obligations under Kenyan law.\n• To send you promotional offers and updates — only with your explicit consent.\n• To maintain safety and security across our premises.`,
      },
      {
        title: '4. Data Sharing & Disclosure',
        content: `SpaceHub does not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:\n• Service Providers: Trusted third-party vendors (e.g., payment processors, IT support) who assist us in operating our business, under strict confidentiality agreements.\n• Legal Requirements: When required by Kenyan law, court order, or government authority.\n• Safety: To protect the rights, property, or safety of SpaceHub, our guests, staff, or the public.\n• Business Transfers: In the event of a merger or acquisition, your data may be transferred to the successor entity.`,
      },
      {
        title: '5. Data Retention',
        content: `We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by law. Booking records are typically retained for 7 years for accounting and legal compliance. You may request deletion of your personal data at any time by contacting us, subject to legal retention requirements.`,
      },
      {
        title: '6. Data Security',
        content: `We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These include encrypted data transmission (SSL/TLS), restricted staff access, secure physical filing, and regular security reviews. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
      },
      {
        title: '7. Your Rights',
        content: `Under the Kenya Data Protection Act, 2019, you have the right to:\n• Access the personal data we hold about you.\n• Request correction of inaccurate or incomplete data.\n• Request erasure of your data (subject to legal obligations).\n• Object to or restrict certain processing of your data.\n• Withdraw consent at any time where processing is based on consent.\n• Lodge a complaint with the Office of the Data Protection Commissioner (ODPC) of Kenya.\n\nTo exercise any of these rights, please contact us at spacehub@gmail.com.`,
      },
      {
        title: '8. Children\'s Privacy',
        content: `Our services are not directed at children under the age of 18. We do not knowingly collect personal information from minors without verifiable parental consent. If you believe we have inadvertently collected information from a child, please contact us immediately and we will take steps to delete such information.`,
      },
      {
        title: '9. Changes to This Policy',
        content: `We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting a notice on our website or by email. Your continued use of our services after any changes indicates your acceptance of the updated policy.`,
      },
    ],
  },
  {
    id: 'terms',
    icon: '📋',
    label: 'Terms of Use',
    lastUpdated: 'January 15, 2025',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: `By accessing our website, making a booking, or using any SpaceHub service, you confirm that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you must discontinue use of our services immediately. These terms apply to all guests, clients, event organisers, and visitors.`,
      },
      {
        title: '2. Booking & Reservations',
        content: `• All bookings are subject to availability and confirmed only upon receipt of the required deposit or full payment.\n• A valid government-issued ID must be presented at check-in for all guest stays.\n• SpaceHub reserves the right to refuse service to any individual without prior notice if deemed necessary for the safety or wellbeing of other guests or staff.\n• Group bookings of 10 or more persons require advance notice and a signed booking agreement.\n• Bookings made by third parties on behalf of guests are the full responsibility of the booking party.`,
      },
      {
        title: '3. Payment Terms',
        content: `• Accepted payment methods: M-Pesa, bank transfer, Visa/Mastercard, and cash (Kenya Shillings).\n• A deposit of 50% is required to confirm all bookings; the balance is due on check-in unless otherwise agreed in writing.\n• Event and conference bookings require full payment at least 48 hours before the event date.\n• All rates are quoted in Kenya Shillings (KES) and are inclusive of VAT unless stated otherwise.\n• SpaceHub reserves the right to revise pricing with reasonable notice.`,
      },
      {
        title: '4. Cancellation & Refund Policy',
        content: `• Cancellations made 7 or more days before the booking date: Full refund of deposit.\n• Cancellations made 3–6 days before the booking date: 50% refund of deposit.\n• Cancellations made less than 48 hours before the booking date: No refund.\n• No-shows will be charged the full booking amount.\n• SpaceHub reserves the right to cancel a booking due to unforeseen circumstances. In such cases, a full refund will be issued within 7 business days.\n• Refunds are processed via the original payment method.`,
      },
      {
        title: '5. Guest Conduct & House Rules',
        content: `All guests and visitors are expected to:\n• Treat staff, fellow guests, and property with respect at all times.\n• Observe quiet hours between 10:00 PM and 7:00 AM.\n• Not engage in illegal activities on the premises.\n• Not bring firearms, hazardous substances, or illegal drugs onto the property.\n• Not organise unregistered events or parties without prior written approval from management.\n• Smoking is permitted only in designated outdoor areas.\n• Pets are not permitted on the premises without prior written consent.\n\nViolation of these rules may result in immediate eviction without refund and potential legal action.`,
      },
      {
        title: '6. Liability & Damages',
        content: `• Guests are fully responsible for any damage caused to SpaceHub property during their stay or event. The cost of repairs or replacements will be charged to the guest.\n• SpaceHub is not liable for loss, theft, or damage to personal belongings on the premises. Guests are advised to use in-room safes where available.\n• SpaceHub shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.\n• Our maximum liability to any guest shall not exceed the total amount paid for the booking in question.`,
      },
      {
        title: '7. Intellectual Property',
        content: `All content on the SpaceHub website — including logos, images, text, and design — is the property of SpaceHub and is protected by Kenyan copyright law. You may not reproduce, distribute, or use any content without our prior written permission. Guests grant SpaceHub permission to use any photographs or testimonials provided voluntarily for marketing purposes, unless explicitly withdrawn.`,
      },
      {
        title: '8. Governing Law',
        content: `These Terms of Use are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya. SpaceHub encourages amicable resolution of disputes before legal proceedings are initiated.`,
      },
    ],
  },
  {
    id: 'cookies',
    icon: '🍪',
    label: 'Cookie Policy',
    lastUpdated: 'January 15, 2025',
    sections: [
      {
        title: '1. What Are Cookies?',
        content: `Cookies are small text files placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies do not contain personally identifiable information on their own, but they may be linked to personal data we hold about you.`,
      },
      {
        title: '2. How We Use Cookies',
        content: `SpaceHub uses cookies to:\n• Remember your preferences and settings for a better browsing experience.\n• Understand how visitors use our website through anonymous analytics data.\n• Ensure the website functions correctly and securely.\n• Deliver relevant content and promotions based on your interests.\n• Enable social media sharing features.`,
      },
      {
        title: '3. Types of Cookies We Use',
        content: `• Essential Cookies: Necessary for the website to function. They enable core features such as booking forms and secure page access. These cannot be disabled.\n• Performance Cookies: Collect anonymous information about how visitors use our site (e.g., Google Analytics). This helps us improve the website.\n• Functionality Cookies: Remember your choices (e.g., language preferences) to provide a more personalised experience.\n• Targeting / Marketing Cookies: Used to deliver advertisements relevant to you. These are set by third-party advertising partners.`,
      },
      {
        title: '4. Third-Party Cookies',
        content: `We use trusted third-party services that may also set cookies on your device, including:\n• Google Analytics — for website usage analytics.\n• Google Maps — for our interactive location map.\n• Meta (Facebook/Instagram) — for social sharing and advertising features.\n• Payment processors — for secure transaction processing.\n\nThese third parties have their own privacy policies and cookie practices, which we encourage you to review.`,
      },
      {
        title: '5. Managing Your Cookie Preferences',
        content: `You have the right to accept or decline non-essential cookies. You can manage your cookie preferences in the following ways:\n• Browser Settings: Most web browsers allow you to control cookies through their settings. Refer to your browser's help documentation for instructions.\n• Opt-Out Tools: You can opt out of Google Analytics tracking at tools.google.com/dlpage/gaoptout.\n• Cookie Banner: When you first visit our website, you will be presented with a cookie consent banner where you can choose your preferences.\n\nPlease note that disabling certain cookies may affect the functionality and your experience on our website.`,
      },
      {
        title: '6. Cookie Retention',
        content: `The length of time a cookie remains on your device depends on its type:\n• Session Cookies: Temporary cookies that expire when you close your browser.\n• Persistent Cookies: Remain on your device for a set period (typically 30 days to 2 years) or until you delete them.\n\nWe regularly review and update the cookies we use to ensure they remain necessary and proportionate.`,
      },
      {
        title: '7. Updates to This Policy',
        content: `We may update this Cookie Policy periodically to reflect changes in technology, legislation, or our business practices. We encourage you to review this page regularly. Continued use of our website after any changes constitutes acceptance of the updated Cookie Policy.`,
      },
    ],
  },
];

/* ── Component ─────────────────────────────── */
const Policy = () => {
  const [activePolicy, setActivePolicy] = useState('privacy');
  const [openSections, setOpenSections] = useState({});

  const current = POLICIES.find(p => p.id === activePolicy);

  const toggleSection = (i) =>
    setOpenSections(prev => ({ ...prev, [i]: !prev[i] }));

  const expandAll = () => {
    const all = {};
    current.sections.forEach((_, i) => { all[i] = true; });
    setOpenSections(all);
  };

  const collapseAll = () => setOpenSections({});

  const renderContent = (text) =>
    text.split('\n').map((line, i) => {
      if (!line.trim()) return null;
      if (line.startsWith('•')) {
        return (
          <div key={i} className="pol-bullet">
            <span className="pol-bullet__dot" />
            <span>{line.replace('• ', '')}</span>
          </div>
        );
      }
      return <p key={i}>{line}</p>;
    });

  return (
    <div className="policy-main-container-content-section">

      {/* ── Hero ── */}
      <section className="pol-hero">
        <div className="pol-hero__bg">
          <div className="pol-hero__glow pol-hero__glow--1" />
          <div className="pol-hero__glow pol-hero__glow--2" />
          <div className="pol-hero__grid" />
        </div>
        <div className="pol-hero__content">
          <nav className="pol-breadcrumb">
            <Link to="/home">Home</Link>
            <span>/</span>
            <span>Legal & Policies</span>
          </nav>
          <span className="pol-hero__badge">Legal Documents</span>
          <h1 className="pol-hero__title">
            Our Policies &amp; <br />
            <span className="pol-hero__accent">Your Rights</span>
          </h1>
          <p className="pol-hero__sub">
            At SpaceHub, transparency is fundamental to our relationship with every
            guest and client. These policies outline your rights and our commitments
            to you — clearly and honestly.
          </p>
          <div className="pol-hero__meta">
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Last updated: January 15, 2025
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Governed by Kenyan Law
            </span>
          </div>
        </div>
      </section>

      {/* ── Policy tab switcher ── */}
      <div className="pol-tabs-strip">
        <div className="pol-tabs">
          {POLICIES.map(p => (
            <button
              key={p.id}
              className={`pol-tab ${activePolicy === p.id ? 'pol-tab--active' : ''}`}
              onClick={() => { setActivePolicy(p.id); setOpenSections({}); }}
            >
              <span className="pol-tab__icon">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="pol-layout">

        {/* Sidebar */}
        <aside className="pol-sidebar">
          <div className="pol-sidebar__card">
            <div className="pol-sidebar__card-head">
              <span className="pol-sidebar__policy-icon">{current.icon}</span>
              <div>
                <h3>{current.label}</h3>
                <p>Updated: {current.lastUpdated}</p>
              </div>
            </div>
            <nav className="pol-sidebar__nav">
              {current.sections.map((s, i) => (
                <button
                  key={i}
                  className={`pol-sidebar__link ${openSections[i] ? 'pol-sidebar__link--active' : ''}`}
                  onClick={() => {
                    setOpenSections(prev => ({ ...prev, [i]: true }));
                    setTimeout(() =>
                      document.getElementById(`pol-sec-${i}`)
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    , 60);
                  }}
                >
                  <span className="pol-sidebar__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{s.title.replace(/^\d+\.\s*/, '')}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="pol-help-card">
            <span className="pol-help-card__icon">💬</span>
            <h4>Have questions?</h4>
            <p>We're happy to walk you through any policy in detail.</p>
            <a href="mailto:spacehub@gmail.com" className="pol-help-card__btn">
              Email Us
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="pol-content">

          {/* Content header */}
          <div className="pol-content__head">
            <div className="pol-content__title-row">
              <h2>
                <span>{current.icon}</span>
                {current.label}
              </h2>
              <div className="pol-expand-btns">
                <button onClick={expandAll}>Expand All</button>
                <button onClick={collapseAll}>Collapse All</button>
              </div>
            </div>
            <div className="pol-intro-banner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <p>
                This document was last updated on <strong>{current.lastUpdated}</strong>.
                By using SpaceHub's services, you agree to the terms described herein.
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="pol-accordion">
            {current.sections.map((section, i) => (
              <div
                key={i}
                id={`pol-sec-${i}`}
                className={`pol-accordion-item ${openSections[i] ? 'pol-accordion-item--open' : ''}`}
              >
                <button
                  className="pol-accordion-trigger"
                  onClick={() => toggleSection(i)}
                >
                  <div className="pol-accordion-trigger__left">
                    <span className="pol-accordion-trigger__num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="pol-accordion-trigger__title">
                      {section.title.replace(/^\d+\.\s*/, '')}
                    </span>
                  </div>
                  <svg
                    className="pol-accordion-trigger__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="pol-accordion-body">
                  <div className="pol-accordion-body__inner">
                    {renderContent(section.content)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Agreement notice */}
          <div className="pol-agreement-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>
              By using SpaceHub's services, you confirm that you have read and agree to
              this <strong>{current.label}</strong>. For questions, contact us at{' '}
              <a href="mailto:spacehub@gmail.com">spacehub@gmail.com</a> or call{' '}
              <a href="tel:0718315313">0718 315 313</a>.
            </p>
          </div>
        </main>
      </div>

      {/* ── Bottom CTA ── */}
      <section className="pol-cta">
        <div className="pol-cta__glow" />
        <div className="pol-cta__inner">
          <span className="pol-eyebrow">We're Here for You</span>
          <h2>Questions About Our Policies?</h2>
          <p>
            Our team is available to clarify any aspect of our policies and ensure your
            experience at SpaceHub is fully transparent and comfortable.
          </p>
          <div className="pol-cta__btns">
            <a href="mailto:spacehub@gmail.com" className="pol-btn pol-btn--primary">✉️ Email Us</a>
            <a href="tel:0718315313"             className="pol-btn pol-btn--ghost">📞 0718 315 313</a>
            <Link to="/contact-us"                   className="pol-btn pol-btn--ghost">Contact Form</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Policy;