const express = require('express');
const router = express.Router();
const { createReel, getReels, likeReel } = require('../controllers/reelController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('video'), createReel);
router.get('/', protect, getReels);
router.put('/like/:id', protect, likeReel);

module.exports = router;
