const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/:userId', protect, getConversation);
router.get('/', protect, getConversations);

module.exports = router;
