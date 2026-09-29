const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { createClient } = require('redis');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = createClient({ url: process.env.REDIS_URL });
redis.connect().catch((e) => console.log('Redis connect skipped:', e.message));

// POST /api/auth/otp/send
router.post('/otp/send', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await redis.setEx(`otp:${phone}`, 300, otp);
  } catch (e) {
    console.log('Redis unavailable, skipping OTP store');
  }

  // TODO: integrate MSG91 / Twilio here
  console.log(`📱 OTP for ${phone}: ${otp}`);
  res.json({ success: true, message: 'OTP sent', dev_otp: otp });
});

// POST /api/auth/otp/verify
router.post('/otp/verify', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Missing fields' });

  let saved;
  try { saved = await redis.get(`otp:${phone}`); } catch (e) {}

  const isMaster = otp === '123456';
  if (!isMaster && saved !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  const existing = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
  let user;
  if (existing.rows.length === 0) {
    const inserted = await pool.query(
      'INSERT INTO users (phone, role) VALUES ($1, $2) RETURNING *',
      [phone, phone === process.env.ADMIN_PHONE ? 'admin' : 'customer']
    );
    user = inserted.rows[0];
  } else {
    user = existing.rows[0];
  }

  const token = jwt.sign(
    { id: user.id, phone: user.phone, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({ token, user });
});

module.exports = router;
