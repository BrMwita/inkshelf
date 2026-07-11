const db = require('../config/db');

// @desc    Create review
// @route   POST /api/reviews
exports.createReview = (req, res) => {
  const { bookId, rating, comment } = req.body;

  // Check if user has purchased this book
  db.get(
    'SELECT * FROM orders WHERE bookId = ? AND userId = ? AND status = "paid"',
    [bookId, req.user.id],
    (err, order) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!order) {
        return res.status(403).json({ message: 'You must purchase the book to review it' });
      }

      // Check if user already reviewed
      db.get(
        'SELECT * FROM reviews WHERE bookId = ? AND userId = ?',
        [bookId, req.user.id],
        (err, existingReview) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          if (existingReview) {
            return res.status(400).json({ message: 'You already reviewed this book' });
          }

          db.run(
            'INSERT INTO reviews (bookId, userId, rating, comment) VALUES (?, ?, ?, ?)',
            [bookId, req.user.id, rating, comment],
            function(err) {
              if (err) {
                return res.status(500).json({ message: err.message });
              }

              // Update book average rating
              db.get(
                'SELECT AVG(rating) as avgRating FROM reviews WHERE bookId = ?',
                [bookId],
                (err, result) => {
                  if (!err && result) {
                    db.run(
                      'UPDATE books SET avgRating = ? WHERE id = ?',
                      [result.avgRating, bookId]
                    );
                  }
                }
              );

              res.status(201).json({ 
                id: this.lastID,
                bookId,
                userId: req.user.id,
                rating,
                comment
              });
            }
          );
        }
      );
    }
  );
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/book/:bookId
exports.getBookReviews = (req, res) => {
  db.all(
    `SELECT r.*, u.name as userName 
     FROM reviews r 
     JOIN users u ON r.userId = u.id 
     WHERE r.bookId = ? 
     ORDER BY r.createdAt DESC`,
    [req.params.bookId],
    (err, reviews) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(reviews);
    }
  );
};