const db = require('../config/db');

// @desc    Create a book (Author only)
// @route   POST /api/books
exports.createBook = (req, res) => {
  const { title, description, price, genre, coverImage, pdfUrl, previewPages } = req.body;

  db.run(
    `INSERT INTO books 
     (title, description, price, genre, authorId, coverImage, pdfUrl, previewPages) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      price,
      genre,
      req.user.id,
      coverImage || 'https://via.placeholder.com/400x600/1A1A1A/D96C2B?text=Book+Cover',
      pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      previewPages || 10
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(201).json({ 
        id: this.lastID,
        title,
        description,
        price,
        genre,
        authorId: req.user.id
      });
    }
  );
};

// @desc    Get all approved books
// @route   GET /api/books
exports.getBooks = (req, res) => {
  db.all(
    `SELECT b.*, u.name as authorName 
     FROM books b 
     JOIN users u ON b.authorId = u.id 
     WHERE b.status = 'approved' 
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

// @desc    Get single book
// @route   GET /api/books/:id
exports.getBookById = (req, res) => {
  db.get(
    `SELECT b.*, u.name as authorName, u.bio as authorBio 
     FROM books b 
     JOIN users u ON b.authorId = u.id 
     WHERE b.id = ?`,
    [req.params.id],
    (err, book) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    }
  );
};

// @desc    Get books by author
// @route   GET /api/books/author/:authorId
exports.getBooksByAuthor = (req, res) => {
  db.all(
    'SELECT * FROM books WHERE authorId = ? AND status = "approved" ORDER BY createdAt DESC',
    [req.params.authorId],
    (err, books) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.json(books);
    }
  );
};