const User = require('../models/User').default;

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password -tokenVersion')
            .populate('followers', 'username profilePic')
            .populate('following', 'username profilePic');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Privacy check (if needed later for posts, but profile basic info is usually public)
        // If we want to hide followers/following for private accounts:
        if (user.isPrivate) {
            // Logic to check if req.user is following this user can be added here
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.bio = req.body.bio || user.bio;
            user.profilePic = req.body.profilePic || user.profilePic;
            if (req.body.isPrivate !== undefined) {
                user.isPrivate = req.body.isPrivate;
            }
            // Check for valid bio links if needed

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                bio: updatedUser.bio,
                isPrivate: updatedUser.isPrivate
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Follow a user
// @route   PUT /api/users/follow/:id
// @access  Private
const followUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) return res.status(404).json({ message: 'User not found' });

        if (!userToFollow.followers.includes(req.user.id)) {
            await userToFollow.updateOne({ $push: { followers: req.user.id } });
            await currentUser.updateOne({ $push: { following: req.params.id } });
            res.status(200).json({ message: 'User followed' });
        } else {
            res.status(400).json({ message: 'You already follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Unfollow a user
// @route   PUT /api/users/unfollow/:id
// @access  Private
const unfollowUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow) return res.status(404).json({ message: 'User not found' });

        if (userToUnfollow.followers.includes(req.user.id)) {
            await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json({ message: 'User unfollowed' });
        } else {
            res.status(400).json({ message: 'You dont follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Block a user
// @route   PUT /api/users/block/:id
// @access  Private
const blockUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'You cannot block yourself' });
    }

    try {
        const userToBlock = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToBlock) return res.status(404).json({ message: 'User not found' });

        if (!currentUser.blockedUsers.includes(req.params.id)) {
            // If following, unfollow
            if (userToBlock.followers.includes(req.user.id)) {
                await userToBlock.updateOne({ $pull: { followers: req.user.id } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
            }
            // If they follow us, remove them
            if (currentUser.followers.includes(req.params.id)) {
                await currentUser.updateOne({ $pull: { followers: req.params.id } });
                await userToBlock.updateOne({ $pull: { following: req.user.id } });
            }

            await currentUser.updateOne({ $push: { blockedUsers: req.params.id } });
            res.status(200).json({ message: 'User blocked' });
        } else {
            res.status(400).json({ message: 'You already blocked this user' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Unblock a user
// @route   PUT /api/users/unblock/:id
// @access  Private
const unblockUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        if (currentUser.blockedUsers.includes(req.params.id)) {
            await currentUser.updateOne({ $pull: { blockedUsers: req.params.id } });
            res.status(200).json({ message: 'User unblocked' });
        } else {
            res.status(400).json({ message: 'You have not blocked this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser
};
