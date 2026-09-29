CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(80),
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(40) NOT NULL,
  description TEXT,
  price_small NUMERIC(10,2) NOT NULL,
  price_regular NUMERIC(10,2) NOT NULL,
  price_large NUMERIC(10,2),
  image_url TEXT,
  is_eggless BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'placed',
  address TEXT,
  payment_method VARCHAR(20),
  payment_id VARCHAR(80),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  size VARCHAR(20),
  qty INT NOT NULL,
  price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(40) UNIQUE NOT NULL,
  discount_type VARCHAR(20) DEFAULT 'percent',
  discount_value NUMERIC(10,2) NOT NULL,
  min_order NUMERIC(10,2) DEFAULT 0,
  max_discount NUMERIC(10,2),
  valid_till TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
