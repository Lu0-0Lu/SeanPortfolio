const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all certifications (Sorted by order_index)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM certifications ORDER BY order_index ASC, id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
});

// POST a new certification
router.post('/', auth, async (req, res) => {
  const { title, issuer, date_issued, verification_link } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO certifications (title, issuer, date_issued, verification_link) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, issuer, date_issued, verification_link || '#']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add certification' });
  }
});

// PATCH to reorder certifications
router.patch('/:id', auth, async (req, res) => {
  const { order_index } = req.body;
  try {
    const result = await db.query(
      'UPDATE certifications SET order_index = COALESCE($1, order_index) WHERE id = $2 RETURNING *',
      [order_index, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update certification order' });
  }
});

// DELETE a certification
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM certifications WHERE id = $1', [req.params.id]);
    res.json({ message: 'Certification deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete certification' });
  }
});

module.exports = router;