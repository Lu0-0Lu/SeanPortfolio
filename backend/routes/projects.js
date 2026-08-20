const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all projects (Sorted by order_index, then latest first)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects ORDER BY order_index ASC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST a new project
router.post('/', auth, async (req, res) => {
  const { title, description, video_url, images, is_featured } = req.body;
  try {
    const imagesJson = JSON.stringify(images || []);
    
    // If this project is set to featured, un-feature all other projects first
    if (is_featured) {
      await db.query('UPDATE projects SET is_featured = false');
    }

    const result = await db.query(
      'INSERT INTO projects (title, description, video_url, images, is_featured) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, video_url || null, imagesJson, is_featured || false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// PATCH to reorder or change featured status
router.patch('/:id', auth, async (req, res) => {
  const { order_index, is_featured } = req.body;
  try {
    if (is_featured) {
      await db.query('UPDATE projects SET is_featured = false');
    }

    const result = await db.query(
      `UPDATE projects 
       SET order_index = COALESCE($1, order_index), 
           is_featured = COALESCE($2, is_featured) 
       WHERE id = $3 RETURNING *`,
      [order_index, is_featured, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project settings' });
  }
});

// DELETE a project
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;