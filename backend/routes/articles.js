const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all articles
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM articles ORDER BY order_index ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch articles' }); }
});

// POST a new article
router.post('/', auth, async (req, res) => {
  const { title, date, content, sources, is_featured } = req.body;
  try {
    if (is_featured) await db.query('UPDATE articles SET is_featured = false');
    const result = await db.query(
      'INSERT INTO articles (title, date, content, sources, is_featured) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, date, content, sources || null, is_featured || false]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed to add article' }); }
});

// PATCH to reorder or set featured
router.patch('/:id', auth, async (req, res) => {
  const { order_index, is_featured } = req.body;
  try {
    if (is_featured) await db.query('UPDATE articles SET is_featured = false');
    const result = await db.query(
      'UPDATE articles SET order_index = COALESCE($1, order_index), is_featured = COALESCE($2, is_featured) WHERE id = $3 RETURNING *',
      [order_index, is_featured, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed to update article' }); }
});

// DELETE an article
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM articles WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;