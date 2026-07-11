const express = require('express');
const router = express.Router();
const {
  getPendingBooks,
  approveBook,
  rejectBook,
  getAllUsers,
  updateUserRole,
  getStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/pending-books', getPendingBooks);
router.get('/users', getAllUsers);
router.get('/stats', getStats);
router.put('/books/:id/approve', approveBook);
router.put('/books/:id/reject', rejectBook);
router.put('/users/:id', updateUserRole);

module.exports = router;