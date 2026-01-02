const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user.id;

        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            text
        });

        await message.save();

        // Emit socket event for real-time delivery
        // The io instance is attached to req in server.js
        if (req.io) {
            req.io.to(recipientId).emit('receive_message', message);
            // Optionally emit back to sender (if using multiple tabs)
            // req.io.to(senderId).emit('receive_message', message);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get conversation between current user and another
// @route   GET /api/messages/:userId
// @access  Private
const getConversation = async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: otherUserId },
                { sender: otherUserId, recipient: currentUserId }
            ]
        }).sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get recent conversations list
// @route   GET /api/messages
// @access  Private
const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all messages involving the current user
        // Then aggregate to find unique conversation partners and the last message
        // Optimized approach: find recent messages

        // Using aggregation to group by conversation partner
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(currentUserId) },
                        { recipient: new mongoose.Types.ObjectId(currentUserId) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", new mongoose.Types.ObjectId(currentUserId)] },
                            "$recipient",
                            "$sender"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "participant"
                }
            },
            {
                $unwind: "$participant"
            },
            {
                $project: {
                    _id: 1,
                    lastMessage: 1,
                    "participant.username": 1,
                    "participant.profilePic": 1,
                    "participant._id": 1
                }
            },
            {
                $sort: { "lastMessage.createdAt": -1 }
            }
        ]);

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const mongoose = require('mongoose');

module.exports = {
    sendMessage,
    getConversation,
    getConversations
};
