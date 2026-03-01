require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ── Middleware ───────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Routes ───────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/apartments',    require('./routes/apartments'));
app.use('/api/bookings',      require('./routes/bookings'));
app.use('/api/blogs',         require('./routes/blogs'));
app.use('/api/gallery',       require('./routes/gallery'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/analytics',     require('./routes/analytics'));
app.use('/api/contact',       require('./routes/contact'));

// ── Health check ─────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// ── 404 handler ──────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Global error handler ─────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server error' });
});

// ── MongoDB + Start ───────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
