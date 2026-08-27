const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});