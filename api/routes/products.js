const router = require('express').Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let q = 'SELECT * FROM products WHERE is_active = TRUE';
    const params = [];
    if (category) {
      q += ' AND category = $1';
      params.push(category);
    }
    q += ' ORDER BY id';
    const { rows } = await pool.query(q, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
