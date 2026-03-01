
const nodemailer = require('nodemailer');

// ── Transporter ──────────────────────────────────────────────
// Uses Gmail + App Password (NOT your regular Gmail password).
// How to get an App Password:
//   1. Go to myaccount.google.com → Security
//   2. Enable 2-Step Verification (required)
//   3. Search "App passwords" → create one for "Mail"
//   4. Copy the 16-character password into your .env
// ─────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Verify connection on startup (logs to console, doesn't crash server)
transporter.verify((err) => {
  if (err) console.error('❌ Mailer not ready:', err.message);
  else     console.log('✅ Mailer ready');
});


// ── Email Templates ──────────────────────────────────────────

const baseTemplate = (content) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <div style="background: #1a1a2e; padding: 24px 32px; border-radius: 8px 8px 0 0;">
      <h2 style="color: #fff; margin: 0; font-size: 1.3rem;">SpaceHub</h2>
      <p style="color: #a5b4fc; margin: 4px 0 0; font-size: .85rem;">Nairobi, Kenya</p>
    </div>
    <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
      ${content}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0 16px;" />
      <p style="margin: 0; font-size: .78rem; color: #9ca3af;">
        SpaceHub · Nairobi, Kenya ·
        <a href="mailto:${process.env.EMAIL_USER}" style="color: #6366f1;">${process.env.EMAIL_USER}</a> ·
        <a href="tel:0718315313" style="color: #6366f1;">0718 315 313</a>
      </p>
    </div>
  </div>
`;


// ── 1. Send admin reply to a customer inquiry ────────────────
const sendInquiryReply = async ({ customerName, customerEmail, originalMessage, subject, replyMessage }) => {
  const html = baseTemplate(`
    <p style="margin: 0 0 16px;">Hi <strong>${customerName}</strong>,</p>
    <p style="margin: 0 0 24px; color: #555;">
      Thank you for reaching out to SpaceHub. Here is our response to your inquiry:
    </p>

    <div style="background: #f9fafb; border-left: 4px solid #6366f1; padding: 16px 20px;
                border-radius: 4px; margin-bottom: 28px; color: #374151; line-height: 1.75;">
      ${replyMessage.replace(/\n/g, '<br/>')}
    </div>

    <p style="margin: 0 0 6px; font-size: .8rem; color: #9ca3af;">Your original message:</p>
    <p style="margin: 0; font-size: .85rem; color: #9ca3af; font-style: italic; line-height: 1.6;">
      "${originalMessage}"
    </p>

    <p style="margin: 24px 0 0; color: #555; font-size: .875rem;">
      Feel free to reply to this email if you have further questions.
    </p>
  `);

  return transporter.sendMail({
    from:    `"SpaceHub" <${process.env.EMAIL_USER}>`,
    to:       customerEmail,
    replyTo:  process.env.EMAIL_USER,
    subject: `Re: ${subject || 'Your Inquiry'} — SpaceHub`,
    html,
  });
};


// ── 2. Booking confirmation to customer ──────────────────────
const sendBookingConfirmation = async ({ customerName, customerEmail, apartment, checkIn, checkOut, guests }) => {
  const fmt = (d) => new Date(d).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  const html = baseTemplate(`
    <p style="margin: 0 0 16px;">Hi <strong>${customerName}</strong>,</p>
    <p style="margin: 0 0 24px; color: #555;">
      Great news! Your booking request has been received and is <strong>pending confirmation</strong>.
      We'll contact you shortly to finalise the details.
    </p>

    <div style="background: #f9fafb; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; font-size: 1rem; color: #1a1a2e;">Booking Summary</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: .875rem;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Apartment</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${apartment || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Check-in</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${fmt(checkIn)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Check-out</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${fmt(checkOut)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Guests</td>
          <td style="padding: 8px 0; font-weight: 600; text-align: right;">${guests || 1}</td>
        </tr>
      </table>
    </div>

    <p style="margin: 0; color: #555; font-size: .875rem;">
      Questions? Reply to this email or reach us directly at
      <a href="mailto:${process.env.EMAIL_USER}" style="color: #6366f1;">${process.env.EMAIL_USER}</a>.
    </p>
  `);

  return transporter.sendMail({
    from:    `"SpaceHub" <${process.env.EMAIL_USER}>`,
    to:       customerEmail,
    subject: `Booking Received – ${apartment || 'SpaceHub'} 🏠`,
    html,
  });
};


// ── 3. New inquiry notification to admin ─────────────────────
const sendAdminInquiryAlert = async ({ name, email, phone, subject, message }) => {
  const html = baseTemplate(`
    <p style="margin: 0 0 4px; font-size: .8rem; color: #6366f1; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;">
      New Contact Inquiry
    </p>
    <h3 style="margin: 0 0 20px; color: #1a1a2e;">${subject || 'General Inquiry'}</h3>

    <div style="background: #f9fafb; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse; font-size: .875rem;">
        <tr>
          <td style="padding: 7px 0; color: #6b7280; width: 90px;">Name</td>
          <td style="padding: 7px 0; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; color: #6b7280;">Email</td>
          <td style="padding: 7px 0; font-weight: 600;">
            <a href="mailto:${email}" style="color: #6366f1;">${email}</a>
          </td>
        </tr>
        ${phone ? `<tr>
          <td style="padding: 7px 0; color: #6b7280;">Phone</td>
          <td style="padding: 7px 0; font-weight: 600;">${phone}</td>
        </tr>` : ''}
      </table>
    </div>

    <p style="margin: 0 0 8px; font-size: .8rem; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: .05em;">
      Message
    </p>
    <div style="background: #f9fafb; border-left: 4px solid #6366f1; padding: 14px 18px;
                border-radius: 4px; color: #374151; line-height: 1.75; font-size: .9rem;">
      ${message.replace(/\n/g, '<br/>')}
    </div>

    <p style="margin: 20px 0 0; font-size: .875rem; color: #555;">
      Log in to the admin panel to reply →
      <a href="${process.env.ADMIN_URL || 'http://localhost:5173'}/contact" style="color: #6366f1; font-weight: 600;">
        Open Admin Panel
      </a>
    </p>
  `);

  return transporter.sendMail({
    from:    `"SpaceHub Notifications" <${process.env.EMAIL_USER}>`,
    to:       process.env.EMAIL_USER,   // notify yourself
    subject: `📬 New Inquiry: ${subject || 'General'} — from ${name}`,
    html,
  });
};



// ── 4. Booking status update to customer ─────────────────────
const sendBookingStatusUpdate = async ({ customerName, customerEmail, apartment, checkIn, checkOut, status, bookingId }) => {
  const fmt = (d) => new Date(d).toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  const STATUS_CONFIG = {
    confirmed: {
      emoji:   '✅',
      heading: 'Booking Confirmed!',
      color:   '#16a34a',
      bgColor: '#f0fdf4',
      message: 'Great news! Your booking has been <strong>confirmed</strong> by our team. We look forward to welcoming you.',
    },
    cancelled: {
      emoji:   '❌',
      heading: 'Booking Cancelled',
      color:   '#dc2626',
      bgColor: '#fef2f2',
      message: 'Your booking has been <strong>cancelled</strong>. If you believe this is a mistake or would like to rebook, please contact us.',
    },
    completed: {
      emoji:   '🏁',
      heading: 'Stay Completed',
      color:   '#6366f1',
      bgColor: '#eef2ff',
      message: 'We hope you had a wonderful stay! Your booking has been marked as <strong>completed</strong>. Thank you for choosing SpaceHub.',
    },
  };

  const cfg = STATUS_CONFIG[status] || {
    emoji: 'ℹ️', heading: 'Booking Update', color: '#6b7280', bgColor: '#f9fafb',
    message: `Your booking status has been updated to <strong>${status}</strong>.`,
  };

  const html = baseTemplate(`
    <div style="background: ${cfg.bgColor}; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; text-align: center;">
      <div style="font-size: 2.5rem; margin-bottom: 8px;">${cfg.emoji}</div>
      <h2 style="margin: 0; color: ${cfg.color}; font-size: 1.3rem;">${cfg.heading}</h2>
    </div>
    <p style="margin: 0 0 20px; color: #555;">Hi <strong>${customerName}</strong>,</p>
    <p style="margin: 0 0 24px; color: #555;">${cfg.message}</p>
    <div style="background: #f9fafb; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 14px; font-size: .95rem; color: #1a1a2e;">Booking Details</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: .875rem;">
        <tr>
          <td style="padding: 7px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Apartment</td>
          <td style="padding: 7px 0; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${apartment}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Check-in</td>
          <td style="padding: 7px 0; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${fmt(checkIn)}</td>
        </tr>
        <tr>
          <td style="padding: 7px 0; color: #6b7280;">Check-out</td>
          <td style="padding: 7px 0; font-weight: 600; text-align: right;">${fmt(checkOut)}</td>
        </tr>
        ${bookingId ? `<tr>
          <td style="padding: 7px 0; color: #6b7280; border-top: 1px solid #e5e7eb;">Reference</td>
          <td style="padding: 7px 0; font-weight: 600; text-align: right; border-top: 1px solid #e5e7eb;">#${bookingId.slice(-8).toUpperCase()}</td>
        </tr>` : ''}
      </table>
    </div>
    <p style="margin: 0; color: #555; font-size: .875rem;">
      Questions? Contact us at
      <a href="mailto:${process.env.EMAIL_USER}" style="color: #6366f1;">${process.env.EMAIL_USER}</a>
      or call <a href="tel:0718315313" style="color: #6366f1;">0718 315 313</a>.
    </p>
  `);

  return transporter.sendMail({
    from:    `"SpaceHub" <${process.env.EMAIL_USER}>`,
    to:       customerEmail,
    replyTo:  process.env.EMAIL_USER,
    subject: `${cfg.emoji} ${cfg.heading} – ${apartment} | SpaceHub`,
    html,
  });
};

module.exports = { sendInquiryReply, sendBookingConfirmation, sendAdminInquiryAlert, sendBookingStatusUpdate };