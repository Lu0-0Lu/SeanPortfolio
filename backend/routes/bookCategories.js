const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM book_categories ORDER BY order_index ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book categories' });
  }
});

router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO book_categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Category already exists' });
    res.status(500).json({ error: 'Failed to add book category' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'UPDATE book_categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book category' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM book_categories WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book category' });
  }
});

module.exports = router;