const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../inkshelf.db');
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'reader',
    mpesaPhone TEXT,
    walletBalance REAL DEFAULT 0,
    profilePic TEXT,
    bio TEXT,
    isVerified INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    authorId INTEGER NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    coverImage TEXT,
    pdfUrl TEXT,
    genre TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    avgRating REAL DEFAULT 0,
    totalSales INTEGER DEFAULT 0,
    totalRevenue REAL DEFAULT 0,
    previewPages INTEGER DEFAULT 10,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    amount REAL NOT NULL,
    mpesaTransactionCode TEXT,
    status TEXT DEFAULT 'pending',
    downloadCount INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookId) REFERENCES books(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bookId) REFERENCES books(id),
    FOREIGN KEY (userId) REFERENCES users(id),
    UNIQUE(bookId, userId)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS withdrawals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    authorId INTEGER NOT NULL,
    amount REAL NOT NULL,
    mpesaPhone TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES users(id)
  )`);

  console.log('✅ SQLite database initialized');
});

module.exports = db;