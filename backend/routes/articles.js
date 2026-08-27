const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all articles (Joined with categories table to get the name)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, c.name as category 
      FROM articles a 
      LEFT JOIN categories c ON a.category_id = c.id 
      ORDER BY a.order_index ASC, a.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) { 
    res.status(500).json({ error: 'Failed to fetch articles' }); 
  }
});

// GET a single article by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, c.name as category 
      FROM articles a 
      LEFT JOIN categories c ON a.category_id = c.id 
      WHERE a.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// POST a new article
router.post('/', auth, async (req, res) => {
  const { title, content, sources, is_featured, category_id } = req.body;
  try {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const autoDate = new Date().toLocaleDateString('en-US', dateOptions);

    if (is_featured) await db.query('UPDATE articles SET is_featured = false');
    
    // Using category_id instead of category
    const result = await db.query(
      'INSERT INTO articles (title, date, content, sources, is_featured, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, autoDate, content, sources || null, is_featured || false, category_id || 1]
    );
    res.json(result.rows[0]);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Failed to add article' }); 
  }
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
  } catch (err) { 
    res.status(500).json({ error: 'Failed to update article' }); 
  }
});

// PUT to update an existing article
router.put('/:id', auth, async (req, res) => {
  const { title, date, content, sources, is_featured, category_id } = req.body;
  const articleId = req.params.id;

  try {
    if (is_featured) {
      await db.query('UPDATE articles SET is_featured = false');
    }

    // Using category_id instead of category
    const result = await db.query(
      `UPDATE articles 
       SET title = $1, date = $2, content = $3, sources = $4, is_featured = $5, category_id = $6
       WHERE id = $7 RETURNING *`,
      [title, date, content, sources || null, is_featured || false, category_id || 1, articleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// DELETE an article
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM articles WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { 
    res.status(500).json({ error: 'Failed to delete' }); 
  }
});

module.exports = router;