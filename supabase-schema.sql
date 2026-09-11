-- ==============================================================================
-- 🥐 MY BAKERY — SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- ==============================================================================
-- Run this in your Supabase Project:
-- Dashboard -> SQL Editor -> New Query -> Paste this entire file -> Click Run (Ctrl+Enter)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop old tables if re-running
DROP TABLE IF EXISTS branch_inventory CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS otps CASCADE;

-- 1. Branches Table
CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL,
  "mapUrl" TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
);

-- 2. Categories Table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  image TEXT
);

-- 3. Products Table
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  "originalPrice" INTEGER,
  image TEXT,
  rating NUMERIC,
  reviews INTEGER,
  badge TEXT,
  "badgeType" TEXT,
  description TEXT,
  "isFeatured" INTEGER DEFAULT 0,
  "isBestSeller" INTEGER DEFAULT 0,
  "isDeal" INTEGER DEFAULT 0,
  "branchIds" TEXT
);

-- 4. Orders Table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  "orderNumber" TEXT UNIQUE NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT,
  "customerPhone" TEXT NOT NULL,
  "customerAddress" TEXT,
  "customerCity" TEXT NOT NULL,
  "orderType" TEXT NOT NULL,
  "branchId" TEXT NOT NULL,
  "branchName" TEXT NOT NULL,
  "branchAddress" TEXT,
  "itemsJson" TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  "deliveryFee" INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  "paymentStatus" TEXT DEFAULT 'Pending',
  "orderStatus" TEXT DEFAULT 'Received',
  "distanceKm" NUMERIC,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Users Table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  "branchId" TEXT,
  "branchName" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 6. OTP Verification Table
CREATE TABLE otps (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  "expiresAt" BIGINT NOT NULL,
  attempts INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Branch Inventory Table
CREATE TABLE branch_inventory (
  "branchId" TEXT NOT NULL,
  "productId" BIGINT NOT NULL,
  "isAvailable" INTEGER DEFAULT 1,
  "stockCount" INTEGER DEFAULT 50,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY ("branchId", "productId")
);

-- Row Level Security & Public Policies
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on branches" ON branches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on otps" ON otps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on branch_inventory" ON branch_inventory FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE branch_inventory;

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- Seed Branches
INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES ('fsd-kohinoor', 'Faisalabad', 'My Bakery — Kohinoor City Branch', 'Kohinoor City, Jaranwala Road, Faisalabad', '+92 41 8555 9999', 'Mon–Sun: 8:30 AM – 12:00 AM', 'https://maps.google.com/?q=Kohinoor+City+Faisalabad', 31.4116, 73.1118) ON CONFLICT (id) DO NOTHING;
INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES ('lhr-dha', 'Lahore', 'My Bakery — DHA Branch', '123 Commercial Avenue, DHA Phase 5, Lahore', '+92 42 1234 5678', 'Mon–Sun: 8:00 AM – 12:00 AM', 'https://maps.google.com/?q=DHA+Phase+5+Lahore', 31.4697, 74.4108) ON CONFLICT (id) DO NOTHING;
INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES ('lhr-gulberg', 'Lahore', 'My Bakery — Gulberg Branch', '456 MM Alam Road, Gulberg III, Lahore', '+92 42 8765 4321', 'Mon–Sun: 9:00 AM – 1:00 AM', 'https://maps.google.com/?q=MM+Alam+Road+Gulberg+Lahore', 31.5144, 74.3404) ON CONFLICT (id) DO NOTHING;
INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES ('lhr-johar', 'Lahore', 'My Bakery — Johar Town Branch', '78 Khayaban-e-Firdausi, Johar Town, Lahore', '+92 42 3333 4444', 'Mon–Sun: 8:00 AM – 11:00 PM', 'https://maps.google.com/?q=Johar+Town+Lahore', 31.4744, 74.2777) ON CONFLICT (id) DO NOTHING;
INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES ('khi-clifton', 'Karachi', 'My Bakery — Clifton Branch', '789 Block 4, Clifton, Karachi', '+92 21 1111 2222', 'Mon–Sun: 8:00 AM – 11:00 PM', 'https://maps.google.com/?q=Clifton+Block+4+Karachi', 24.8125, 67.0302) ON CONFLICT (id) DO NOTHING;
INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES ('khi-defence', 'Karachi', 'My Bakery — Defence Branch', '34 Khayaban-e-Ittehad, DHA Phase 6, Karachi', '+92 21 5555 6666', 'Mon–Sun: 9:00 AM – 12:00 AM', 'https://maps.google.com/?q=DHA+Karachi', 24.7955, 67.0622) ON CONFLICT (id) DO NOTHING;
INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES ('isb-f7', 'Islamabad', 'My Bakery — F-7 Branch', '12 F-7 Markaz, Islamabad', '+92 51 9876 5432', 'Mon–Sun: 9:00 AM – 11:00 PM', 'https://maps.google.com/?q=F7+Markaz+Islamabad', 33.7141, 73.0617) ON CONFLICT (id) DO NOTHING;
INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES ('rwp-bahria', 'Rawalpindi', 'My Bakery — Bahria Town Branch', 'Phase 8, Bahria Town, Rawalpindi', '+92 51 2222 3333', 'Mon–Sun: 9:00 AM – 11:00 PM', 'https://maps.google.com/?q=Bahria+Town+Rawalpindi', 33.5416, 73.2001) ON CONFLICT (id) DO NOTHING;

-- Seed Categories
INSERT INTO categories (id, name, icon, image) VALUES ('all', 'All Items', '🍽️', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, icon, image) VALUES ('cakes', 'Cakes', '🎂', 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&q=80') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, icon, image) VALUES ('pastries', 'Pastries', '🥐', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, icon, image) VALUES ('desserts', 'Desserts', '🍮', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, icon, image) VALUES ('beverages', 'Beverages', '☕', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, icon, image) VALUES ('custom', 'Custom Orders', '✨', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name, icon, image) VALUES ('deals', 'Deals', '🔥', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&q=80') ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (1, 'Chocolate Truffle Cake', 'cakes', 2800, 3200, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', 4.8, 124, 'Best Seller', 'badge-gold', 'Rich dark chocolate cake layered with smooth truffle cream and chocolate ganache. Made with premium Belgian chocolate.', 1, 1, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (2, 'Red Velvet Cake', 'cakes', 2600, NULL, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80', 4.7, 89, 'Popular', 'badge-red', 'Classic red velvet sponge with smooth cream cheese frosting and a velvety crumb.', 1, 1, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (3, 'Strawberry Dream Cake', 'cakes', 2500, 2800, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80', 4.6, 67, 'New', 'badge-green', 'Light vanilla sponge with layers of fresh strawberry cream and strawberry compote.', 1, 0, 1, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton","isb-f7"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (4, 'German Black Forest', 'cakes', 3000, 3400, 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=500&q=80', 4.9, 201, 'Top Rated', 'badge-gold', 'Traditional Black Forest cake with cherries, fresh whipped cream and chocolate shavings.', 1, 1, 1, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (5, 'Lotus Biscoff Cake', 'cakes', 3200, 3600, 'https://images.unsplash.com/photo-1629385701021-fcd568a743ba?w=500&q=80', 4.9, 167, 'Trending', 'badge-orange', 'Indulgent Lotus Biscoff cake with caramelised biscuit cream and crushed Biscoff.', 1, 1, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton","isb-f7"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (6, 'Tres Leches Cake', 'cakes', 2400, NULL, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80', 4.7, 98, 'Special', 'badge-purple', 'Light sponge soaked in three milks, topped with fluffy whipped cream.', 0, 1, 0, '["fsd-kohinoor","lhr-dha","lhr-johar","khi-clifton","isb-f7"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (7, 'Tiramisu Cake', 'cakes', 2900, 3200, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80', 4.8, 76, 'Special', 'badge-purple', 'Authentic Italian tiramisu flavour in cake form with espresso-soaked layers.', 1, 0, 1, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (8, 'Mango Tango Cake', 'cakes', 2700, NULL, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80', 4.5, 54, 'Seasonal', 'badge-orange', 'Fresh mango mousse layered with light sponge and mango glaze.', 0, 0, 0, '["lhr-dha","lhr-gulberg","khi-clifton"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (9, 'Butter Croissant', 'pastries', 350, NULL, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80', 4.5, 45, NULL, NULL, 'Flaky, buttery croissant baked fresh every morning.', 0, 1, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (10, 'Pain au Chocolat', 'pastries', 420, NULL, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&q=80', 4.6, 38, 'Popular', 'badge-red', 'Buttery pastry filled with premium dark chocolate — a Parisian classic.', 0, 0, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton","isb-f7"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (11, 'French Macarons (6 pcs)', 'pastries', 900, 1100, 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=500&q=80', 4.6, 54, 'Gift Box', 'badge-pink', 'Assorted French macarons in 6 premium flavors — perfect for gifting.', 1, 0, 1, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (12, 'Chocolate Eclairs', 'pastries', 550, NULL, 'https://images.unsplash.com/photo-1590080874088-eec64895b423?w=500&q=80', 4.4, 29, NULL, NULL, 'Choux pastry filled with vanilla cream and topped with chocolate glaze.', 0, 0, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (13, 'Cinnamon Danish', 'pastries', 380, NULL, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&q=80', 4.5, 33, NULL, NULL, 'Warm, flaky Danish pastry with cinnamon sugar swirl and vanilla glaze.', 0, 0, 0, '["fsd-kohinoor","lhr-dha","lhr-johar","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (14, 'New York Cheesecake', 'desserts', 1500, NULL, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80', 4.8, 93, 'Best Seller', 'badge-gold', 'Creamy, dense New York-style cheesecake on a buttery graham cracker crust.', 1, 1, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (15, 'Classic Tiramisu', 'desserts', 1200, 1400, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80', 4.7, 76, 'Special', 'badge-purple', 'Authentic Italian tiramisu with espresso-soaked ladyfingers and mascarpone.', 1, 0, 1, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton","isb-f7"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (16, 'Fudge Brownies', 'desserts', 800, NULL, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80', 4.5, 112, 'Fan Fav', 'badge-red', 'Gooey dark chocolate brownies loaded with walnuts and chocolate chips.', 0, 1, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (17, 'Crème Brûlée', 'desserts', 950, NULL, 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=500&q=80', 4.6, 41, NULL, NULL, 'Classic French crème brûlée with a perfectly caramelised sugar crust.', 0, 0, 0, '["lhr-dha","lhr-gulberg","khi-clifton","isb-f7"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (18, 'Signature Espresso', 'beverages', 280, NULL, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80', 4.5, 88, NULL, NULL, 'Single or double espresso shot, rich and aromatic.', 0, 0, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (19, 'Vanilla Latte', 'beverages', 450, NULL, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80', 4.6, 62, 'Popular', 'badge-red', 'Creamy steamed milk with espresso and a hint of vanilla syrup.', 0, 0, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton","isb-f7"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (20, 'Belgian Hot Chocolate', 'beverages', 380, NULL, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&q=80', 4.7, 74, NULL, NULL, 'Decadent hot chocolate made with premium Belgian cocoa and steamed milk.', 0, 1, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (21, 'Iced Caramel Latte', 'beverages', 500, 550, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80', 4.7, 55, 'Deal', 'badge-green', 'Chilled espresso with caramel syrup and cold milk over ice.', 0, 0, 1, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (22, 'Custom Birthday Cake', 'custom', 3500, NULL, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', 5, 230, 'Customisable', 'badge-purple', 'Your dream cake, made to order. Choose flavour, size, and design.', 1, 0, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","lhr-johar","khi-clifton","khi-defence","isb-f7","rwp-bahria"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (23, 'Wedding Tier Cake', 'custom', 12000, NULL, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&q=80', 5, 85, 'Premium', 'badge-gold', 'Exquisite multi-tier wedding cake crafted to match your vision.', 1, 0, 0, '["fsd-kohinoor","lhr-dha","lhr-gulberg","khi-clifton","isb-f7"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (24, 'Faisalabad Special Rabri Cake', 'cakes', 3100, 3500, 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=500&q=80', 5, 42, 'Kohinoor Exclusive', 'badge-gold', 'Special traditional fusion cake infused with authentic rich Faisalabad rabri and roasted pistachios. Exclusive to our Kohinoor branch.', 1, 1, 1, '["fsd-kohinoor"]') ON CONFLICT (id) DO NOTHING;

-- Seed Users (RBAC Staff & Demo Customers)
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Sara Ahmed', 'demo@bakery.pk', '0300-1234567', 'password123', 'customer', NULL, NULL) ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Ali Khan', 'ali@bakery.pk', '0311-9876543', 'password123', 'customer', NULL, NULL) ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Muhammad Hasnain (CEO)', 'admin@bakery.pk', '0300-8888888', 'admin123', 'superadmin', NULL, 'All Branches (Nationwide)') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Ahtisham Hussain (Operations)', 'ahtisham@bakery.pk', '0300-7777777', 'ops123', 'superadmin', NULL, 'All Branches (Nationwide)') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Faisalabad Kitchen Manager', 'fsd@bakery.pk', '041-8723456', 'fsd123', 'branch_manager', 'fsd-kohinoor', 'My Bakery — Kohinoor City, Faisalabad') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Lahore Kitchen Manager', 'lahore@bakery.pk', '042-3571234', 'lhr123', 'branch_manager', 'lhr-gulberg', 'My Bakery — Gulberg III, Lahore') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Karachi Kitchen Manager', 'karachi@bakery.pk', '021-3581234', 'khi123', 'branch_manager', 'khi-clifton', 'My Bakery — Clifton Block 4, Karachi') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Islamabad Kitchen Manager', 'islamabad@bakery.pk', '051-2651234', 'isb123', 'branch_manager', 'isb-f7', 'My Bakery — F-7 Markaz, Islamabad') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('Rawalpindi Kitchen Manager', 'pindi@bakery.pk', '051-5401234', 'pindi123', 'branch_manager', 'rwp-bahria', 'My Bakery — Bahria Town Phase 7, Rawalpindi') ON CONFLICT (email) DO NOTHING;
INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES ('محمد حسنین', 'mh.hasnain.96@gmail.com', '03091816043', 'Hasnain123', 'customer', NULL, NULL) ON CONFLICT (email) DO NOTHING;
