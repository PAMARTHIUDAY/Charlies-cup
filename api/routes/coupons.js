const router = require('express').Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/coupons
router.get('/', async (_, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM coupons ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/coupons/validate
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const { rows } = await pool.query(
      'SELECT * FROM coupons WHERE code = $1 AND is_active = TRUE',
      [code]
    );
    if (!rows.length) return res.status(404).json({ error: 'Invalid coupon' });
    const c = rows[0];
    if (subtotal < c.min_order)
      return res.status(400).json({ error: `Minimum order ₹${c.min_order}` });

    const discount = c.discount_type === 'percent'
      ? Math.min(subtotal * c.discount_value / 100, c.max_discount || Infinity)
      : Number(c.discount_value);

    res.json({ valid: true, code: c.code, discount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
