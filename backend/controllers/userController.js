const User = require('../models/User');

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

// @desc    Upload profile photo
// @route   POST /api/users/profile-photo
// @access  Private
const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePic = req.file.path; // Cloudinary URL
        await user.save();

        res.json({
            message: 'Profile photo uploaded',
            profilePic: user.profilePic
        });
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
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.profilePic = req.body.profilePic || user.profilePic;

            if (req.body.isPrivate !== undefined) {
                user.isPrivate = req.body.isPrivate;
            }

            if (req.body.links) {
                try {
                    const links = typeof req.body.links === 'string' ? JSON.parse(req.body.links) : req.body.links;
                    if (Array.isArray(links)) {
                        user.links = links.slice(0, 5); // Max 5 links
                    }
                } catch (e) {
                    console.error("Invalid links format");
                }
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                bio: updatedUser.bio,
                links: updatedUser.links,
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

        // Check if already following or requested
        if (userToFollow.followers.includes(req.user.id)) {
            return res.status(400).json({ message: 'You already follow this user' });
        }
        if (userToFollow.requests.includes(req.user.id)) {
            return res.status(400).json({ message: 'Follow request already sent' });
        }

        if (userToFollow.isPrivate) {
            // Private Account -> Send Request
            await userToFollow.updateOne({ $push: { requests: req.user.id } });
            res.status(200).json({ message: 'Follow request sent', status: 'requested' });
        } else {
            // Public Account -> Follow directly
            await userToFollow.updateOne({ $push: { followers: req.user.id } });
            await currentUser.updateOne({ $push: { following: req.params.id } });
            res.status(200).json({ message: 'User followed', status: 'following' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Accept follow request
// @route   PUT /api/users/request/accept/:id
// @access  Private
const acceptFollowRequest = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const userToAccept = await User.findById(req.params.id);

        if (!userToAccept) return res.status(404).json({ message: 'User not found' });

        if (currentUser.requests.includes(req.params.id)) {
            // Remove from requests
            await currentUser.updateOne({ $pull: { requests: req.params.id } });
            // Add to followers
            await currentUser.updateOne({ $push: { followers: req.params.id } });
            // Add to other user's following
            await userToAccept.updateOne({ $push: { following: req.user.id } });

            res.status(200).json({ message: 'Follow request accepted' });
        } else {
            res.status(400).json({ message: 'No request from this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reject follow request
// @route   PUT /api/users/request/reject/:id
// @access  Private
const rejectFollowRequest = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        if (currentUser.requests.includes(req.params.id)) {
            await currentUser.updateOne({ $pull: { requests: req.params.id } });
            res.status(200).json({ message: 'Follow request rejected' });
        } else {
            res.status(400).json({ message: 'No request from this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get suggested users
// @route   GET /api/users/suggested
// @access  Private
const getSuggestedUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        // Simple algorithm: Users not followed by me, excluding myself
        // Limit to 5 for now
        const users = await User.find({
            _id: { $nin: [...currentUser.following, req.user.id] }
        })
            .select('username fullName profilePic')
            .limit(5);

        res.json(users);
    } catch (error) {
        console.error(error);
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
// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } }
            ]
        })
            .select('username fullName profilePic')
            .limit(20);

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get pending follow requests
// @route   GET /api/users/requests
// @access  Private
const getPendingRequests = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
            .populate('requests', 'username profilePic fullName');

        res.json(currentUser.requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Save a post
// @route   PUT /api/users/save/:id
// @access  Private
const savePost = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.savedPosts.includes(req.params.id)) {
            return res.status(400).json({ message: 'Post already saved' });
        }

        await user.updateOne({ $push: { savedPosts: req.params.id } });
        res.json({ message: 'Post saved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Unsave a post
// @route   PUT /api/users/unsave/:id
// @access  Private
const unsavePost = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        await user.updateOne({ $pull: { savedPosts: req.params.id } });
        res.json({ message: 'Post unsaved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get saved posts
// @route   GET /api/users/saved
// @access  Private
const getSavedPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('savedPosts');
        // We might want to populate user details inside saved posts too if we display them fully
        // But for grid, image is enough. 
        // Let's populate deeply just in case.
        const populatedUser = await User.findById(req.user.id).populate({
            path: 'savedPosts',
            populate: { path: 'likes' } // Populate likes to show count in grid overlay
        });

        res.json(populatedUser.savedPosts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
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
};
