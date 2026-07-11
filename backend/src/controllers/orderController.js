const db = require('../config/db');

// @desc    Create order (Purchase book)
// @route   POST /api/orders
exports.createOrder = (req, res) => {
  const { bookId, mpesaTransactionCode } = req.body;

  // Check if book exists
  db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, book) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already owns this book
    db.get(
      'SELECT * FROM orders WHERE bookId = ? AND userId = ? AND status = "paid"',
      [bookId, req.user.id],
      (err, existingOrder) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        if (existingOrder) {
          return res.status(400).json({ message: 'You already own this book' });
        }

        db.run(
          'INSERT INTO orders (bookId, userId, amount, mpesaTransactionCode, status) VALUES (?, ?, ?, ?, ?)',
          [bookId, req.user.id, book.price, mpesaTransactionCode, 'pending'],
          function(err) {
            if (err) {
              return res.status(500).json({ message: err.message });
            }
            res.status(201).json({ 
              id: this.lastID,
              bookId,
              userId: req.user.id,
              amount: book.price,
              status: 'pending'
            });
          }
        );
      }
    );
  });
};

// @desc    Get user's orders
// @route   GET /api/orders
exports.getUserOrders = (req, res) => {
  db.all(
    `SELECT o.*, b.title, b.coverImage, b.authorId, u.name as authorName 
     FROM orders o 
     JOIN books b ON o.bookId = b.id 
     JOIN users u ON b.authorId = u.id 
     WHERE o.userId = ? 
     ORDER BY o.createdAt DESC`,
    [req.user.id],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(orders);
    }
  );
};

// @desc    Confirm payment (Admin only)
// @route   PUT /api/orders/:id/confirm
exports.confirmPayment = (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    db.run(
      'UPDATE orders SET status = "paid" WHERE id = ?',
      [req.params.id],
      function(err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        // Update author's wallet balance
        db.get('SELECT authorId FROM books WHERE id = ?', [order.bookId], (err, book) => {
          if (!err && book) {
            const amount = order.amount * 0.85;
            db.run(
              'UPDATE users SET walletBalance = walletBalance + ? WHERE id = ?',
              [amount, book.authorId]
            );
            
            // Update book sales
            db.run(
              'UPDATE books SET totalSales = totalSales + 1, totalRevenue = totalRevenue + ? WHERE id = ?',
              [order.amount, order.bookId]
            );
          }
        });

        res.json({ message: 'Payment confirmed' });
      }
    );
  });
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
exports.getAllOrders = (req, res) => {
  db.all(
    `SELECT o.*, b.title as bookTitle, u.name as userName, u.email as userEmail 
     FROM orders o 
     JOIN books b ON o.bookId = b.id 
     JOIN users u ON o.userId = u.id 
     ORDER BY o.createdAt DESC`,
    [],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(orders);
    }
  );
};