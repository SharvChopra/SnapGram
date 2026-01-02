const Story = require('../models/Story');
const User = require('../models/User');

// @desc    Upload a new story
// @route   POST /api/stories
// @access  Private
const createStory = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No media uploaded' });
        }

        const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';

        const newStory = new Story({
            user: req.user.id,
            image: req.file.path,
            type
        });

        await newStory.save();
        await newStory.populate('user', 'username profilePic');

        res.status(201).json(newStory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get active stories feed (following + self)
// @route   GET /api/stories
// @access  Private
const getStories = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const followingIds = currentUser.following;

        const stories = await Story.find({
            user: { $in: [...followingIds, req.user.id] },
            expiresAt: { $gt: new Date() } // Ensure only active stories are fetched
        })
            .sort({ createdAt: 1 }) // Oldest first (chronological story order)
            .populate('user', 'username profilePic');

        // Group stories by user
        const groupedStories = {};
        stories.forEach(story => {
            const userId = story.user._id.toString();
            if (!groupedStories[userId]) {
                groupedStories[userId] = {
                    user: story.user,
                    stories: []
                };
            }
            groupedStories[userId].stories.push(story);
        });

        res.json(Object.values(groupedStories));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createStory,
    getStories
};
