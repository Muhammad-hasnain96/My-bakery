import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const db = new Database('server/bakery.db')

let sql = `-- ==============================================================================
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
`

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL'
  return "'" + String(str).replace(/'/g, "''") + "'"
}

// Branches
const branches = db.prepare('SELECT * FROM branches').all()
sql += '\n-- Seed Branches\n'
branches.forEach(b => {
  sql += `INSERT INTO branches (id, city, name, address, phone, hours, "mapUrl", lat, lng) VALUES (${escapeSql(b.id)}, ${escapeSql(b.city)}, ${escapeSql(b.name)}, ${escapeSql(b.address)}, ${escapeSql(b.phone)}, ${escapeSql(b.hours)}, ${escapeSql(b.mapUrl)}, ${b.lat || 'NULL'}, ${b.lng || 'NULL'}) ON CONFLICT (id) DO NOTHING;\n`
})

// Categories
const categories = db.prepare('SELECT * FROM categories').all()
sql += '\n-- Seed Categories\n'
categories.forEach(c => {
  sql += `INSERT INTO categories (id, name, icon, image) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.icon)}, ${escapeSql(c.image)}) ON CONFLICT (id) DO NOTHING;\n`
})

// Products
const products = db.prepare('SELECT * FROM products').all()
sql += '\n-- Seed Products\n'
products.forEach(p => {
  sql += `INSERT INTO products (id, name, category, price, "originalPrice", image, rating, reviews, badge, "badgeType", description, "isFeatured", "isBestSeller", "isDeal", "branchIds") VALUES (${p.id}, ${escapeSql(p.name)}, ${escapeSql(p.category)}, ${p.price}, ${p.originalPrice || 'NULL'}, ${escapeSql(p.image)}, ${p.rating || 4.5}, ${p.reviews || 0}, ${escapeSql(p.badge)}, ${escapeSql(p.badgeType)}, ${escapeSql(p.description)}, ${p.isFeatured || 0}, ${p.isBestSeller || 0}, ${p.isDeal || 0}, ${escapeSql(p.branchIds)}) ON CONFLICT (id) DO NOTHING;\n`
})

// Users
const users = db.prepare('SELECT * FROM users').all()
sql += '\n-- Seed Users (RBAC Staff & Demo Customers)\n'
users.forEach(u => {
  sql += `INSERT INTO users (name, email, phone, password, role, "branchId", "branchName") VALUES (${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.phone)}, ${escapeSql(u.password)}, ${escapeSql(u.role)}, ${escapeSql(u.branchId)}, ${escapeSql(u.branchName)}) ON CONFLICT (email) DO NOTHING;\n`
})

fs.writeFileSync('supabase-schema.sql', sql, 'utf-8')
console.log('✅ Generated supabase-schema.sql with', branches.length, 'branches,', categories.length, 'categories,', products.length, 'products,', users.length, 'users.')

