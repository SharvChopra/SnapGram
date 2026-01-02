const Reel = require('../models/Reel');
const User = require('../models/User');

// @desc    Upload a new reel
// @route   POST /api/reels
// @access  Private
const createReel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video uploaded' });
        }

        const newReel = new Reel({
            user: req.user.id,
            video: req.file.path,
            caption: req.body.caption
        });

        await newReel.save();
        await newReel.populate('user', 'username profilePic');

        res.status(201).json(newReel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get reels feed (Random/Trending)
// @route   GET /api/reels
// @access  Private
const getReels = async (req, res) => {
    try {
        // Simple random sample for discovery
        // In production, use aggregation $sample or sorted by likes
        const reels = await Reel.find()
            .sort({ createdAt: -1 }) // Latest first for now
            .populate('user', 'username profilePic');

        res.json(reels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Like/Unlike a reel
// @route   PUT /api/reels/like/:id
// @access  Private
const likeReel = async (req, res) => {
    try {
        const reel = await Reel.findById(req.params.id);
        if (!reel) return res.status(404).json({ message: 'Reel not found' });

        if (reel.likes.includes(req.user.id)) {
            await reel.updateOne({ $pull: { likes: req.user.id } });
            res.json({ message: 'Reel unliked', status: 'unliked' });
        } else {
            await reel.updateOne({ $push: { likes: req.user.id } });
            res.json({ message: 'Reel liked', status: 'liked' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createReel,
    getReels,
    likeReel
};
