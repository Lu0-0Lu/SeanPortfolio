const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all books
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY order_index ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch books' }); }
});

// POST a new book
router.post('/', auth, async (req, res) => {
  const { title, author, cover_image, synopsis, review, rating } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO books (title, author, cover_image, synopsis, review, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, author, cover_image || null, synopsis, review, rating]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed to add book' }); }
});

// PATCH to reorder
router.patch('/:id', auth, async (req, res) => {
  const { order_index } = req.body;
  try {
    const result = await db.query(
      'UPDATE books SET order_index = COALESCE($1, order_index) WHERE id = $2 RETURNING *',
      [order_index, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'Failed to update book order' }); }
});

// DELETE a book
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: 'Failed to delete' }); }
});

module.exports = router;