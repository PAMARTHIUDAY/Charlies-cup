const router = require('express').Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// POST /api/orders
router.post('/', async (req, res) => {
  const { user_id, items, address, payment_method, coupon_code } = req.body;
  if (!items || items.length === 0)
    return res.status(400).json({ error: 'No items' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let subtotal = items.reduce((s, i) => s + Number(i.price) * i.qty, 0);
    let discount = 0;

    if (coupon_code) {
      const c = await client.query(
        'SELECT * FROM coupons WHERE code = $1 AND is_active = TRUE',
        [coupon_code]
      );
      if (c.rows.length) {
        const cp = c.rows[0];
        if (subtotal >= cp.min_order) {
          discount = cp.discount_type === 'percent'
            ? Math.min(subtotal * cp.discount_value / 100, cp.max_discount || Infinity)
            : Number(cp.discount_value);
        }
      }
    }

    const delivery = subtotal >= 499 ? 0 : 29;
    const total = subtotal - discount + delivery;

    const o = await client.query(
      `INSERT INTO orders (user_id, total, address, payment_method)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, total, address, payment_method]
    );

    for (const i of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, size, qty, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [o.rows[0].id, i.product_id, i.size, i.qty, i.price]
      );
    }

    await client.query('COMMIT');
    res.json({
      success: true,
      order: o.rows[0],
      subtotal,
      discount,
      delivery,
      total,
    });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 100'
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!order.rows.length) return res.status(404).json({ error: 'Not found' });
    const items = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [req.params.id]
    );
    res.json({ ...order.rows[0], items: items.rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/orders/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { rows } = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
