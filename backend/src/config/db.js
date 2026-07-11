const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use /tmp for Render (writable directory), local for development
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/inkshelf.db' 
  : path.join(__dirname, '../../inkshelf.db');

console.log(`📦 Database path: ${dbPath}`);

const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'reader',
      mpesa_phone TEXT,
      wallet_balance REAL DEFAULT 0,
      profile_pic TEXT,
      bio TEXT,
      is_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Books table
  db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      cover_image TEXT,
      pdf_url TEXT,
      genre TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      avg_rating REAL DEFAULT 0,
      total_sales INTEGER DEFAULT 0,
      total_revenue REAL DEFAULT 0,
      preview_pages INTEGER DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `);

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      mpesa_transaction_code TEXT,
      status TEXT DEFAULT 'pending',
      download_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(book_id, user_id)
    )
  `);

  // Withdrawals table
  db.run(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      mpesa_phone TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `);

  console.log('✅ SQLite database initialized');
});

module.exports = db;