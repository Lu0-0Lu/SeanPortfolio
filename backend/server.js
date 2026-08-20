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
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const experienceRoutes = require('./routes/experiences');
const certRoutes = require('./routes/certifications');
const postRoutes = require('./routes/posts');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/certifications', certRoutes);
app.use('/api/posts', postRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});