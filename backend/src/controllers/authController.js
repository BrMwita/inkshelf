const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
exports.register = async (req, res) => {
  console.log('📝 Registration request received:', req.body);
  
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('❌ Database query error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (user) {
        console.log('⚠️ User already exists:', email);
        return res.status(400).json({ message: 'User already exists' });
      }

      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        db.run(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, role || 'reader'],
          function(err) {
            if (err) {
              console.error('❌ Insert error:', err);
              return res.status(500).json({ message: 'Failed to create user' });
            }

            console.log('✅ User created successfully:', { id: this.lastID, email });
            
            const token = generateToken(this.lastID);
            
            res.status(201).json({
              _id: this.lastID,
              name,
              email,
              role: role || 'reader',
              token
            });
          }
        );
      } catch (hashError) {
        console.error('❌ Password hashing error:', hashError);
        res.status(500).json({ message: 'Server error' });
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
exports.login = async (req, res) => {
  console.log('📝 Login request received:', req.body.email);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!user) {
        console.log('⚠️ User not found:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log('⚠️ Invalid password for:', email);
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('✅ Login successful:', email);
        
        res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletBalance: user.wallet_balance || 0,
          token: generateToken(user.id)
        });
      } catch (compareError) {
        console.error('❌ Password comparison error:', compareError);
        res.status(500).json({ message: 'Server error' });
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
exports.getProfile = (req, res) => {
  db.get(
    'SELECT id, name, email, role, mpesa_phone, wallet_balance, profile_pic, bio, is_verified FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        console.error('❌ Profile error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    }
  );
};

// @desc    Create admin user (temporary)
exports.createAdmin = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};