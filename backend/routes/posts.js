const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all posts (Sorted by order_index, then latest first)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM posts ORDER BY order_index ASC, published_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST a new post (Book review or poetry)
router.post('/', auth, async (req, res) => {
  const { post_type, title, content, author, rating } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO posts (post_type, title, content, author, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [post_type, title, content, author || null, rating || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add post' });
  }
});

// PATCH to reorder posts
router.patch('/:id', auth, async (req, res) => {
  const { order_index } = req.body;
  try {
    const result = await db.query(
      'UPDATE posts SET order_index = COALESCE($1, order_index) WHERE id = $2 RETURNING *',
      [order_index, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post order' });
  }
});

// DELETE a post
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;