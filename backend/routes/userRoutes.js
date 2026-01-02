const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    uploadProfilePhoto,
    followUser,
    acceptFollowRequest,
    rejectFollowRequest,
    getSuggestedUsers,
    getPendingRequests,
    savePost,
    unsavePost,
    getSavedPosts,
    unfollowUser,
    blockUser,
    unblockUser,
    searchUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/suggested', protect, getSuggestedUsers);
router.get('/requests', protect, getPendingRequests);
router.get('/search', protect, searchUsers); // Must be before /:username
router.put('/save/:id', protect, savePost);
router.put('/unsave/:id', protect, unsavePost);
router.get('/saved', protect, getSavedPosts);
router.get('/:username', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/profile-photo', protect, upload.single('photo'), uploadProfilePhoto);
router.put('/follow/:id', protect, followUser);
router.put('/request/accept/:id', protect, acceptFollowRequest);
router.put('/request/reject/:id', protect, rejectFollowRequest);
router.put('/unfollow/:id', protect, unfollowUser);
router.put('/block/:id', protect, blockUser);
router.put('/unblock/:id', protect, unblockUser);

module.exports = router;
