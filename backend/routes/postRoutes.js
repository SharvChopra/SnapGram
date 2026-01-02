const express = require('express');
const router = express.Router();
const {
    createPost,
    getFeedPosts,
    getExplorePosts,
    getUserPosts,
    likePost,
    addComment,
    getPostComments,
    deletePost,
    searchPosts,
    getTrendingTags
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), createPost);
router.get('/feed', protect, getFeedPosts);
router.get('/explore', protect, getExplorePosts);
router.get('/search', protect, searchPosts);
router.get('/trending', protect, getTrendingTags);
router.get('/user/:username', getUserPosts); // New route
router.put('/like/:id', protect, likePost);
router.post('/comment/:id', protect, addComment);
router.get('/comments/:id', protect, getPostComments);
router.delete('/:id', protect, deletePost);

module.exports = router;
