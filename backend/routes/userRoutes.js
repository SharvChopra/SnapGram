const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware').default;

router.get('/:username', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.put('/block/:id', protect, blockUser);
router.put('/unblock/:id', protect, unblockUser);

module.exports = router;
