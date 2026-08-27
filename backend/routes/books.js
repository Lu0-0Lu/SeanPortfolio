const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// GET all books (Joined with book_categories table)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, c.name as category,
      COALESCE(
        (SELECT json_agg(t.id) FROM book_tag_relations btr JOIN book_tags t ON btr.tag_id = t.id WHERE btr.book_id = b.id),
        '[]'
      ) as tag_ids
      FROM books b 
      LEFT JOIN book_categories c ON b.book_category_id = c.id 
      ORDER BY b.order_index ASC, b.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' }); 
  }
});

// GET a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT b.*, c.name as category,
      COALESCE(
        (SELECT json_agg(t.id) FROM book_tag_relations btr JOIN book_tags t ON btr.tag_id = t.id WHERE btr.book_id = b.id),
        '[]'
      ) as tag_ids
      FROM books b 
      LEFT JOIN book_categories c ON b.book_category_id = c.id 
      WHERE b.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST a new book
router.post('/', auth, async (req, res) => {
  const { title, author, cover_image_url, synopsis, rating, review, category_id, tag_ids } = req.body;
  try {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      const bookResult = await client.query(
        `INSERT INTO books (title, author, cover_image_url, synopsis, rating, review, book_category_id) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, author, cover_image_url || null, synopsis, rating, review || null, category_id || 1]
      );
      
      const newBook = bookResult.rows[0];

      // Insert tag relations if provided
      if (tag_ids && tag_ids.length > 0) {
        for (const tagId of tag_ids) {
          await client.query(
            'INSERT INTO book_tag_relations (book_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [newBook.id, tagId]
          );
        }
      }

      await client.query('COMMIT');
      res.json(newBook);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Failed to add book' }); 
  }
});

// PATCH to reorder books
router.patch('/:id', auth, async (req, res) => {
  const { order_index } = req.body;
  try {
    const result = await db.query(
      'UPDATE books SET order_index = COALESCE($1, order_index) WHERE id = $2 RETURNING *',
      [order_index, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { 
    res.status(500).json({ error: 'Failed to update book order' }); 
  }
});

// PUT to update an existing book
router.put('/:id', auth, async (req, res) => {
  const { title, author, cover_image_url, synopsis, rating, review, category_id, tag_ids } = req.body;
  const bookId = req.params.id;

  try {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE books 
         SET title = $1, author = $2, cover_image_url = $3, synopsis = $4, rating = $5, review = $6, book_category_id = $7
         WHERE id = $8 RETURNING *`,
        [title, author, cover_image_url || null, synopsis, rating, review || null, category_id || 1, bookId]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Book not found' });
      }

      // Update tags: clear existing and re-insert selected
      await client.query('DELETE FROM book_tag_relations WHERE book_id = $1', [bookId]);
      if (tag_ids && tag_ids.length > 0) {
        for (const tagId of tag_ids) {
          await client.query(
            'INSERT INTO book_tag_relations (book_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [bookId, tagId]
          );
        }
      }

      await client.query('COMMIT');
      res.json(result.rows[0]);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE a book
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) { 
    res.status(500).json({ error: 'Failed to delete' }); 
  }
});

module.exports = router;