const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all poetry
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM poetry ORDER BY order_index ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) { 
    res.status(500).json({ error: 'Failed to fetch poetry' }); 
  }
});

// POST a new poem
router.post('/', auth, async (req, res) => {
  const { title, content, bg_image_url, is_featured } = req.body;
  try {
    if (is_featured) await db.query('UPDATE poetry SET is_featured = false');
    const result = await db.query(
      'INSERT INTO poetry (title, content, bg_image_url, is_featured) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, bg_image_url || null, is_featured || false]
    );
    res.json(result.rows[0]);
  } catch (err) { 
    res.status(500).json({ error: 'Failed to add poetry' }); 
  }
});

// PATCH to reorder or set featured
router.patch('/:id', auth, async (req, res) => {
  const { order_index, is_featured } = req.body;
  try {
    if (is_featured) await db.query('UPDATE poetry SET is_featured = false');
    const result = await db.query(
      'UPDATE poetry SET order_index = COALESCE($1, order_index), is_featured = COALESCE($2, is_featured) WHERE id = $3 RETURNING *',
      [order_index, is_featured, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { 
    res.status(500).json({ error: 'Failed to update poetry' }); 
  }
});

// PUT to update an existing poem
router.put('/:id', auth, async (req, res) => {
  const { title, content, bg_image_url, is_featured } = req.body;
  const poemId = req.params.id;

  try {
    // Unfeature others if this one is being featured
    if (is_featured) {
      await db.query('UPDATE poetry SET is_featured = false');
    }

    const result = await db.query(
      `UPDATE poetry 
       SET title = $1, content = $2, bg_image_url = $3, is_featured = $4
       WHERE id = $5 RETURNING *`,
      [title, content, bg_image_url || null, is_featured || false, poemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Poem not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update poetry' });
  }
});

// DELETE a poem
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM poetry WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { 
    res.status(500).json({ error: 'Failed to delete' }); 
  }
});

module.exports = router;