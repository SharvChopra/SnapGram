const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, logoutAll } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware').default;

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logoutall', protect, logoutAll);
router.get('/me', protect, getMe);

module.exports = router;
