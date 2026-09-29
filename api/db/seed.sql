INSERT INTO products (name, category, description, price_small, price_regular, price_large, image_url, is_eggless)
VALUES
('Charlie''s Chocolate Cup', 'Cups', 'Fudgy brownie + chocolate mousse + choco drizzle', 99, 149, 199, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c', FALSE),
('Charlie''s Red Velvet Cup', 'Cups', 'Red velvet crumble + cream cheese + white choco', 119, 169, 229, 'https://images.unsplash.com/photo-1586985289906-406988974504', FALSE),
('Charlie''s Eggless Red Velvet Cup', 'Cups', 'Eggless red velvet layered cup', 109, 159, 219, 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c', TRUE),
('Charlie''s Triple Layer Cup', 'Cups', 'Dark, milk & white chocolate layered', 129, 179, 239, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587', FALSE),
('Charlie''s Classic Fudge Brownie', 'Brownie', 'Single fudgy brownie', 79, 119, 159, 'https://images.unsplash.com/photo-1607920591413-4ec007e70023', FALSE),
('Charlie''s Walnut Brownie', 'Brownie', 'Fudgy brownie with walnuts', 99, 139, 179, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e', FALSE),
('Charlie''s Brownie Box (6)', 'Brownie', '6 assorted brownies', 279, 279, 279, 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52', FALSE),
('Tiramisu Jar', 'Jar', 'Coffee-soaked layers', 149, 199, 199, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', FALSE),
('Biscoff Jar', 'Jar', 'Biscoff cream layers', 169, 219, 219, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187', FALSE),
('Nutella Jar', 'Jar', 'Nutella mousse layers', 179, 229, 229, 'https://images.unsplash.com/photo-1610450949065-1f2841536c88', FALSE),
('Motichoor Ladoo (6)', 'Indian', 'Fresh motichoor ladoo', 149, 249, 249, 'https://images.unsplash.com/photo-1606471191009-63994c53433b', TRUE),
('Kaju Katli (250g)', 'Indian', 'Premium kaju katli', 249, 399, 399, 'https://images.unsplash.com/photo-1605197161470-5d2a9b0e4d5e', TRUE),
('Mysore Pak (250g)', 'Indian', 'Soft ghee mysore pak', 129, 199, 199, 'https://images.unsplash.com/photo-1589308118162-4c6f9d1e6c4a', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO coupons (code, discount_type, discount_value, min_order, max_discount, is_active)
VALUES
('CHARLIE50', 'percent', 50, 199, 100, TRUE),
('REDVELVET20', 'percent', 20, 149, 80, TRUE),
('WELCOME50', 'percent', 50, 99, 75, TRUE)
ON CONFLICT (code) DO NOTHING;
