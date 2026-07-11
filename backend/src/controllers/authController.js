const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'reader'],
      function(err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(201).json({
          _id: this.lastID,
          name,
          email,
          role: role || 'reader',
          token: generateToken(this.lastID)
        });
      }
    );
  });
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance,
      token: generateToken(user.id)
    });
  });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getProfile = (req, res) => {
  db.get(
    'SELECT id, name, email, role, mpesaPhone, walletBalance, profilePic, bio, isVerified FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    }
  );
};

// @desc    Create admin user (temporary)
// @route   POST /api/auth/create-admin
exports.createAdmin = (req, res) => {
  const { name, email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'admin'],
      function(err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(201).json({
          _id: this.lastID,
          name,
          email,
          role: 'admin',
          token: generateToken(this.lastID)
        });
      }
    );
  });
};