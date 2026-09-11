import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { branches, categories, products } from '../src/data/products.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'bakery.db')

export const db = new Database(dbPath)

// Initialize Database Tables
export function initDatabase() {
  db.pragma('journal_mode = WAL')

  // 1. Branches Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS branches (
      id TEXT PRIMARY KEY,
      city TEXT NOT NULL,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      hours TEXT NOT NULL,
      mapUrl TEXT,
      lat REAL,
      lng REAL
    )
  `)

  // 2. Categories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      image TEXT
    )
  `)

  // 3. Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      originalPrice INTEGER,
      image TEXT,
      rating REAL,
      reviews INTEGER,
      badge TEXT,
      badgeType TEXT,
      description TEXT,
      isFeatured INTEGER DEFAULT 0,
      isBestSeller INTEGER DEFAULT 0,
      isDeal INTEGER DEFAULT 0,
      branchIds TEXT
    )
  `)

  // 4. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderNumber TEXT UNIQUE NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT,
      customerPhone TEXT NOT NULL,
      customerAddress TEXT,
      customerCity TEXT NOT NULL,
      orderType TEXT NOT NULL,
      branchId TEXT NOT NULL,
      branchName TEXT NOT NULL,
      branchAddress TEXT,
      itemsJson TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      deliveryFee INTEGER NOT NULL,
      discount INTEGER DEFAULT 0,
      total INTEGER NOT NULL,
      paymentMethod TEXT NOT NULL,
      paymentStatus TEXT DEFAULT 'Pending',
      orderStatus TEXT DEFAULT 'Received',
      distanceKm REAL,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Safe migration for existing orders table: add customerEmail if missing
  try {
    const columns = db.prepare(`PRAGMA table_info(orders)`).all()
    if (!columns.some(col => col.name === 'customerEmail')) {
      db.exec(`ALTER TABLE orders ADD COLUMN customerEmail TEXT`)
    }
  } catch (err) {
    // Column may already exist
  }

  // 5. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      branchId TEXT,
      branchName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Safe migration for existing users table: add role, branchId, branchName if missing
  try {
    const userCols = db.prepare(`PRAGMA table_info(users)`).all()
    if (!userCols.some(col => col.name === 'role')) {
      db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'`)
    }
    if (!userCols.some(col => col.name === 'branchId')) {
      db.exec(`ALTER TABLE users ADD COLUMN branchId TEXT`)
    }
    if (!userCols.some(col => col.name === 'branchName')) {
      db.exec(`ALTER TABLE users ADD COLUMN branchName TEXT`)
    }
  } catch (err) {
    console.error('Migration error on users:', err.message)
  }

  // 6. Branch Inventory Table (Per-branch product availability / stock)
  db.exec(`
    CREATE TABLE IF NOT EXISTS branch_inventory (
      branchId TEXT NOT NULL,
      productId INTEGER NOT NULL,
      isAvailable INTEGER DEFAULT 1,
      stockCount INTEGER DEFAULT 50,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (branchId, productId)
    )
  `)

  // 7. Order Confirmation Email OTPs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS otps (
      email TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      expiresAt INTEGER NOT NULL,
      attempts INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Seed / Upsert Staff and Demo Users for RBAC
  const staffAccounts = [
    {
      name: 'Muhammad Hasnain (CEO)',
      email: 'admin@bakery.pk',
      phone: '0300-8888888',
      password: 'admin123',
      role: 'superadmin',
      branchId: null,
      branchName: 'All Branches (Nationwide)',
    },
    {
      name: 'Ahtisham Hussain (Operations)',
      email: 'ahtisham@bakery.pk',
      phone: '0300-7777777',
      password: 'ops123',
      role: 'superadmin',
      branchId: null,
      branchName: 'All Branches (Nationwide)',
    },
    {
      name: 'Faisalabad Kitchen Manager',
      email: 'fsd@bakery.pk',
      phone: '041-8723456',
      password: 'fsd123',
      role: 'branch_manager',
      branchId: 'fsd-kohinoor',
      branchName: 'My Bakery — Kohinoor City, Faisalabad',
    },
    {
      name: 'Lahore Kitchen Manager',
      email: 'lahore@bakery.pk',
      phone: '042-3571234',
      password: 'lhr123',
      role: 'branch_manager',
      branchId: 'lhr-gulberg',
      branchName: 'My Bakery — Gulberg III, Lahore',
    },
    {
      name: 'Karachi Kitchen Manager',
      email: 'karachi@bakery.pk',
      phone: '021-3581234',
      password: 'khi123',
      role: 'branch_manager',
      branchId: 'khi-clifton',
      branchName: 'My Bakery — Clifton Block 4, Karachi',
    },
    {
      name: 'Islamabad Kitchen Manager',
      email: 'islamabad@bakery.pk',
      phone: '051-2651234',
      password: 'isb123',
      role: 'branch_manager',
      branchId: 'isb-f7',
      branchName: 'My Bakery — F-7 Markaz, Islamabad',
    },
    {
      name: 'Rawalpindi Kitchen Manager',
      email: 'pindi@bakery.pk',
      phone: '051-5401234',
      password: 'pindi123',
      role: 'branch_manager',
      branchId: 'rwp-bahria',
      branchName: 'My Bakery — Bahria Town Phase 7, Rawalpindi',
    },
    {
      name: 'Sara Ahmed',
      email: 'demo@bakery.pk',
      phone: '0300-1234567',
      password: 'password123',
      role: 'customer',
      branchId: null,
      branchName: null,
    },
  ]

  const checkUserStmt = db.prepare('SELECT id FROM users WHERE lower(email) = ?')
  const insertUserStmt = db.prepare(`
    INSERT INTO users (name, email, phone, password, role, branchId, branchName)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  const updateUserStmt = db.prepare(`
    UPDATE users SET name = ?, phone = ?, password = ?, role = ?, branchId = ?, branchName = ?
    WHERE lower(email) = ?
  `)

  for (const account of staffAccounts) {
    const existing = checkUserStmt.get(account.email.toLowerCase())
    if (!existing) {
      insertUserStmt.run(
        account.name,
        account.email.toLowerCase(),
        account.phone,
        account.password,
        account.role,
        account.branchId,
        account.branchName
      )
    } else {
      updateUserStmt.run(
        account.name,
        account.phone,
        account.password,
        account.role,
        account.branchId,
        account.branchName,
        account.email.toLowerCase()
      )
    }
  }
  console.log('✓ Seeded/Updated RBAC staff accounts (Superadmins & 5 City Branch Managers)')

  // Seed Branches if empty
  const branchCount = db.prepare('SELECT count(*) as count FROM branches').get().count
  if (branchCount === 0) {
    const insertBranch = db.prepare(`
      INSERT INTO branches (id, city, name, address, phone, hours, mapUrl, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    branches.forEach(b => {
      insertBranch.run(b.id, b.city, b.name, b.address, b.phone, b.hours, b.mapUrl, b.coords?.lat, b.coords?.lng)
    })
    console.log(`✓ Seeded ${branches.length} branches into database.`)
  }

  // Seed Categories if empty
  const catCount = db.prepare('SELECT count(*) as count FROM categories').get().count
  if (catCount === 0) {
    const insertCat = db.prepare('INSERT INTO categories (id, name, icon, image) VALUES (?, ?, ?, ?)')
    categories.forEach(c => {
      insertCat.run(c.id, c.name, c.icon, c.image)
    })
    console.log(`✓ Seeded ${categories.length} categories into database.`)
  }

  // Seed Products if empty
  const prodCount = db.prepare('SELECT count(*) as count FROM products').get().count
  if (prodCount === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, name, category, price, originalPrice, image, rating, reviews,
        badge, badgeType, description, isFeatured, isBestSeller, isDeal, branchIds
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    products.forEach(p => {
      insertProd.run(
        p.id,
        p.name,
        p.category,
        p.price,
        p.originalPrice || null,
        p.image,
        p.rating,
        p.reviews,
        p.badge || null,
        p.badgeType || null,
        p.description,
        p.isFeatured ? 1 : 0,
        p.isBestSeller ? 1 : 0,
        p.isDeal ? 1 : 0,
        JSON.stringify(p.branchIds || [])
      )
    })
    console.log(`✓ Seeded ${products.length} products into database.`)
  }
}

