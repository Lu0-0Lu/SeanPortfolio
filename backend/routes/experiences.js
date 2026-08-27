const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all experiences (Sorted by order_index)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM experiences ORDER BY order_index ASC, id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// POST a new experience
router.post('/', auth, async (req, res) => {
  const { role, company, location, period, bullets } = req.body;
  try {
    const bulletsJson = JSON.stringify(bullets || []);
    const result = await db.query(
      'INSERT INTO experiences (role, company, location, period, bullets) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [role, company, location, period, bulletsJson]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add experience' });
  }
});

// PATCH to reorder experiences
router.patch('/:id', auth, async (req, res) => {
  const { order_index } = req.body;
  try {
    const result = await db.query(
      'UPDATE experiences SET order_index = COALESCE($1, order_index) WHERE id = $2 RETURNING *',
      [order_index, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience order' });
  }
});

// PUT to update an existing experience
router.put('/:id', auth, async (req, res) => {
  const { role, company, location, period, bullets } = req.body;
  const expId = req.params.id;

  try {
    // FIX: We must stringify the bullets array just like we do in the POST route!
    const bulletsJson = JSON.stringify(bullets || []);
    
    const result = await db.query(
      `UPDATE experiences 
       SET role = $1, company = $2, location = $3, period = $4, bullets = $5
       WHERE id = $6 RETURNING *`,
      [role, company, location, period, bulletsJson, expId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

// DELETE an experience
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM experiences WHERE id = $1', [req.params.id]);
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

module.exports = router;