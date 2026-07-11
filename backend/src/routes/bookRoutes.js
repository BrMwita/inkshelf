const express = require('express');
const router = express.Router();
const {
  createBook,
  getBooks,
  getBookById,
  getBooksByAuthor,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.get('/author/:authorId', getBooksByAuthor);
router.get('/:id', getBookById);

module.exports = router;