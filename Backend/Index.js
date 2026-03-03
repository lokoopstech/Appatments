require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ── Allowed Origins ───────────────────────────
const allowedOrigins = [
  // Local development
  'http://localhost:5175',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',  // vite preview
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  https://spacehub-apartments.onrender.com/
  // Add your production domains here
  // 'https://yourdomain.com',
  // 'https://admin.yourdomain.com',
];
if (process.env.EXTRA_ORIGINS) {
  process.env.EXTRA_ORIGINS.split(',').forEach(o => allowedOrigins.push(o.trim()));
}
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} is not allowed`));
    }
  },
  credentials: true,            // allow cookies / auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,                // cache preflight for 24 hours
};

// ── Middleware ────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.options('', cors(corsOptions)); // handle preflight for all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Routes ───────────────────────────────────
app.use('/api/auth',          require('./Routes/auth'));
app.use('/api/apartments',    require('./Routes/apartments'));
app.use('/api/bookings',      require('./Routes/bookings'));
app.use('/api/blogs',         require('./Routes/blogs'));
app.use('/api/gallery',       require('./Routes/gallery'));
app.use('/api/subscriptions', require('./Routes/subscriptions'));
app.use('/api/admin',         require('./Routes/admin'));
app.use('/api/analytics',     require('./Routes/analytics'));
app.use('/api/contact',       require('./Routes/contact'));

// ── Health check ─────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// ── 404 handler ──────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Global error handler ─────────────────────
app.use((err, req, res, next) => {
  // Surface CORS errors clearly
  if (err.message?.startsWith('CORS blocked')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  console.error('FULL ERROR:', err); // ← change this line
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
