const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const caption = req.body.caption || '';
        const hashtags = caption.match(/#[a-z0-9_]+/gi) || [];

        const newPost = new Post({
            user: req.user.id,
            image: req.file.path,
            caption: caption,
            hashtags: hashtags.map(tag => tag.toLowerCase()), // Normalize to lowercase
            location: req.body.location
        });

        const savedPost = await newPost.save();

        // Populate user details for immediate display
        await savedPost.populate('user', 'username profilePic');

        res.status(201).json(savedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get feed posts
// @route   GET /api/posts/feed
// @access  Private
const getFeedPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const currentUser = await User.findById(req.user.id);
        const followingIds = currentUser.following;

        // Get posts from following users + current user
        const posts = await Post.find({
            user: { $in: [...followingIds, req.user.id] }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profilePic')
            .populate({
                path: 'likes',
                select: 'username'
            });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get explore posts (Trending/Random)
// @route   GET /api/posts/explore
// @access  Private
const getExplorePosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12; // Grid format usually needs multiples of 3
        const skip = (page - 1) * limit;

        const currentUser = await User.findById(req.user.id);
        const followingIds = currentUser.following;

        // Exclude posts from users already followed and self
        // Sort by likes count (descending) for "trending" effect
        // Note: Sorting by array length in MongoDB standard query is tricky, 
        // so for MVP we'll sort by createdAt or just random, but here we try a simple aggregate or just standard sort for now.
        // For simplicity in this non-aggregation step: Sort by createdAt -1 (Latest from others)
        // Optimization: In real app, use Aggregation Pipeline to sort by likes size.

        const posts = await Post.find({
            user: { $nin: [...followingIds, req.user.id] }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profilePic')
            .populate('likes', 'username');

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Like/Unlike a post
// @route   PUT /api/posts/like/:id
// @access  Private
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            await post.updateOne({ $pull: { likes: req.user.id } });
            res.json({ message: 'Post unliked', status: 'unliked' });
        } else {
            await post.updateOne({ $push: { likes: req.user.id } });
            res.json({ message: 'Post liked', status: 'liked' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a comment
// @route   POST /api/posts/comment/:id
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text, parentCommentId } = req.body;
        if (!text) return res.status(400).json({ message: 'Text is required' });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = new Comment({
            user: req.user.id,
            post: req.params.id,
            text,
            parentComment: parentCommentId || null
        });

        await comment.save();
        await comment.populate('user', 'username profilePic');

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get comments for a post
// @route   GET /api/posts/comments/:id
// @access  Private
const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .sort({ createdAt: 1 })
            .populate('user', 'username profilePic');

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await post.deleteOne();
        await Comment.deleteMany({ post: req.params.id });

        res.json({ message: 'Post removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Search posts (by hashtag)
// @route   GET /api/posts/search
// @access  Private
const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        // If query starts with #, search exact tag in hashtags array
        // Else, search in caption
        let searchCriteria;
        if (query.startsWith('#')) {
            searchCriteria = { hashtags: query.toLowerCase() };
        } else {
            searchCriteria = { caption: { $regex: query, $options: 'i' } };
        }

        const posts = await Post.find(searchCriteria)
            .sort({ createdAt: -1 })
            .populate('user', 'username profilePic')
            .populate('likes', 'username');

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get trending hashtags
// @route   GET /api/posts/trending
// @access  Private
const getTrendingTags = async (req, res) => {
    try {
        // Aggregate tags from posts in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const tags = await Post.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $unwind: "$hashtags" },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user posts
// @route   GET /api/posts/user/:username
// @access  Public
const getUserPosts = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate('likes', 'username');

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createPost,
    getFeedPosts,
    getExplorePosts,
    getUserPosts, // Exporting
    likePost,
    addComment,
    getPostComments,
    deletePost,
    searchPosts,
    getTrendingTags
};
