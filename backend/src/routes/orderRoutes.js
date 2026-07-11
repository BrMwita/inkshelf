const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  confirmPayment,
  getAllOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, getUserOrders)
  .post(protect, createOrder);

router.get('/admin/all', protect, admin, getAllOrders);
router.put('/:id/confirm', protect, admin, confirmPayment);

module.exports = router;