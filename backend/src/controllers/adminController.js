const db = require('../config/db');

// @desc    Get all pending books
// @route   GET /api/admin/pending-books
exports.getPendingBooks = (req, res) => {
  db.all(
    `SELECT b.*, u.name as authorName, u.email as authorEmail 
     FROM books b 
     JOIN users u ON b.authorId = u.id 
     WHERE b.status = 'pending' 
     ORDER BY b.createdAt DESC`,
    [],
    (err, books) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(books);
    }
  );
};

// @desc    Approve book
// @route   PUT /api/admin/books/:id/approve
exports.approveBook = (req, res) => {
  db.run(
    'UPDATE books SET status = "approved" WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book approved' });
    }
  );
};

// @desc    Reject book
// @route   PUT /api/admin/books/:id/reject
exports.rejectBook = (req, res) => {
  db.run(
    'UPDATE books SET status = "rejected" WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book rejected' });
    }
  );
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = (req, res) => {
  db.all(
    'SELECT id, name, email, role, mpesaPhone, walletBalance, isVerified, createdAt FROM users',
    [],
    (err, users) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(users);
    }
  );
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
exports.updateUserRole = (req, res) => {
  const { role } = req.body;
  db.run(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User role updated' });
    }
  );
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
exports.getStats = (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as count FROM books WHERE status = "approved"', [], (err, result) => {
    stats.totalBooks = result ? result.count : 0;
  });

  db.get('SELECT COUNT(*) as count FROM users', [], (err, result) => {
    stats.totalUsers = result ? result.count : 0;
  });

  db.get('SELECT COUNT(*) as count FROM orders WHERE status = "paid"', [], (err, result) => {
    stats.totalOrders = result ? result.count : 0;
  });

  db.get('SELECT COUNT(*) as count FROM books WHERE status = "pending"', [], (err, result) => {
    stats.pendingBooks = result ? result.count : 0;
    
    // Wait a moment for all queries to finish
    setTimeout(() => {
      res.json(stats);
    }, 100);
  });
};