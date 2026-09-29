require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 60_000, max: 200 }));

app.get('/health', (_, res) =>
  res.json({ status: 'ok', app: "charlie's cup", time: new Date() })
);

app.get('/', (_, res) =>
  res.json({
    message: "🐶 Charlie's Cup API",
    tagline: 'Every cup has a story.',
    version: '1.0.0',
  })
);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🐶 Charlie's Cup API running on port ${PORT}`);
  console.log(`   → http://localhost:${PORT}`);
});
