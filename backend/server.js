require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

const cookieParser = require('cookie-parser');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true // Allow cookies
}));
app.use(cookieParser());
app.use(express.json());

// Database connection
const connectDB = async () => {
    try {
        // Use local MongoDB if no URI is provided
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/snapgram";
        await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

// Socket.io Middleware to attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/reels', require('./routes/reelRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('SnapGram API is running...');
});

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room named after the user ID to receive direct messages
    socket.on('join_room', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
