const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    logoutAll,
    refreshToken,
    logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/logoutall', protect, logoutAll);
router.get('/me', protect, getMe);

module.exports = router;
