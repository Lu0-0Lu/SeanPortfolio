const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all book tags
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM book_tags ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching book tags:', err);
    res.status(500).json({ error: 'Failed to fetch book tags' });
  }
});

// POST a new book tag
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Tag name is required' });
  }
  try {
    const result = await db.query('INSERT INTO book_tags (name) VALUES ($1) RETURNING *', [name.trim()]);
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Tag already exists' });
    console.error('Error adding book tag:', err);
    res.status(500).json({ error: 'Failed to add tag' });
  }
});

// DELETE a book tag
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM book_tags WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting book tag:', err);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

module.exports = router;