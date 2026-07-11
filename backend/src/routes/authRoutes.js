const express = require('express');
const router = express.Router();
const { register, login, getProfile, createAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', createAdmin);
router.get('/profile', protect, getProfile);

module.exports = router;