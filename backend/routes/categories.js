const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all categories (Sorted by order_index)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY order_index ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST a new category
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    // Catch unique constraint violation (if you try to make two "Tech" categories)
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// PUT to edit an existing category
router.put('/:id', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// PATCH to reorder categories
router.patch('/:id', auth, async (req, res) => {
  const { order_index } = req.body;
  try {
    const result = await db.query(
      'UPDATE categories SET order_index = COALESCE($1, order_index) WHERE id = $2 RETURNING *',
      [order_index, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE a category
router.delete('/:id', auth, async (req, res) => {
  try {
    // Because we used "ON DELETE SET NULL" in our SQL, deleting a category 
    // won't delete the articles inside it. They will just lose their category!
    await db.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;