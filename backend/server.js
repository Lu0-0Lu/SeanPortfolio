const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const db = require('./db');

const app = express();

// Trust Azure's proxy so rate limiting identifies users correctly
app.set('trust proxy', 1);

// 1. Security Headers (Top priority)
app.use(helmet());

// 2. Body Parser
app.use(express.json());

// 3. Secure CORS (Only one instance)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173', 
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 4. Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Hour
  max: 5, // 5 login requests per IP
  message: 'Too many login attempts, please try again after an hour'
});
app.use('/api/auth/login', authLimiter);

// --- ROUTES ---

// Test Route
app.get('/api/status', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'API is running!', db_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('Sean\'s Portfolio Backend API is running!');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/certifications', require('./routes/certifications'));

// The New Written Content Routes
app.use('/api/articles', require('./routes/articles'));
app.use('/api/books', require('./routes/books'));
app.use('/api/poetry', require('./routes/poetry'));

// The New Category Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/book-categories', require('./routes/bookCategories'));
app.use('/api/book-tags', require('./routes/bookTags'));

// --- CONTACT ROUTE ---
app.use('/api/contact', require('./routes/contact'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});