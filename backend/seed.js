const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const Story = require('./models/Story');
const Message = require('./models/Message');

dotenv.config();

const dummyUsers = [
    {
        username: 'alex_adventurer',
        email: 'alex@example.com',
        password: 'password123',
        fullName: 'Alex Explorer',
        bio: 'Traveling the world 🌍 | Photography 📸',
        profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    {
        username: 'sarah_creative',
        email: 'sarah@example.com',
        password: 'password123',
        fullName: 'Sarah Design',
        bio: 'Graphic Designer 🎨 | Coffee Lover ☕',
        profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
        username: 'tech_guru_mike',
        email: 'mike@example.com',
        password: 'password123',
        fullName: 'Mike Tech',
        bio: 'Coding 💻 | Gadgets 📱 | Future 🚀',
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
        username: 'fitness_jess',
        email: 'jess@example.com',
        password: 'password123',
        fullName: 'Jessica Fit',
        bio: 'Health is Wealth 💪 | Yoga 🧘‍♀️',
        profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
        username: 'foodie_sam',
        email: 'sam@example.com',
        password: 'password123',
        fullName: 'Sam Cooks',
        bio: 'Chef 👨‍🍳 | Food Blogger 🍔',
        profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    }
];

const dummyPosts = [
    {
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&fit=crop',
        caption: 'Mountain views are the best views! 🏔️ #nature #travel #mountains',
        location: 'Swiss Alps'
    },
    {
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&fit=crop',
        caption: 'Delicious pizza night 🍕 #food #foodie #pizza',
        location: 'Naples, Italy'
    },
    {
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&fit=crop',
        caption: 'Coding away... 💻 #tech #coding #workspace',
        location: 'San Francisco, CA'
    },
    {
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&fit=crop',
        caption: 'Morning yoga session 🧘‍♀️ #fitness #health #yoga',
        location: 'Central Park'
    },
    {
        image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&fit=crop',
        caption: 'Abstract art work in progress 🎨 #art #creative #design',
        location: 'Art Studio'
    },
    {
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&fit=crop',
        caption: 'Exploring the unknown 🌲 #adventure #nature #forest',
        location: 'Black Forest'
    },
    {
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&fit=crop',
        caption: 'Cheers to the weekend! 🍹 #drinks #weekend #fun',
        location: 'Rooftop Bar'
    },
    {
        image: 'https://images.unsplash.com/photo-1593642532744-9f770c418043?w=800&fit=crop',
        caption: 'New gadget unboxing! 📦 #tech #unboxing #gadgets',
        location: 'Home Studio'
    },
    {
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop',
        caption: 'Shoe collection update 👟 #fashion #shoes #style',
        location: 'Closet'
    },
    {
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&fit=crop',
        caption: 'Gym grind never stops 💥 #gym #motivation #fitness',
        location: 'Gold\'s Gym'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Find or Create Dummy Users
        const createdUsers = [];
        for (const u of dummyUsers) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = await User.create(u);
                console.log(`Created user: ${u.username}`);
            } else {
                console.log(`User exists: ${u.username}`);
            }
            createdUsers.push(user);
        }

        // 2. Find Main User (to interact with)
        // Try to find the user from the screenshot 'sharvchopra12@gmail.com' or fallback to first user
        let mainUser = await User.findOne({ email: { $regex: 'sharv', $options: 'i' } });
        if (!mainUser) {
            console.log('Main user not found, using first user in DB as main.');
            mainUser = (await User.findOne()) || createdUsers[0];
        }
        console.log(`Targeting Main User: ${mainUser.username}`);

        // 3. Create Posts
        console.log('Seeding Posts...');
        for (let i = 0; i < dummyPosts.length; i++) {
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const postData = dummyPosts[i];

            // Extract hashtags logic (simplified from controller)
            const hashtags = postData.caption.match(/#[a-z0-9_]+/gi) || [];

            await Post.create({
                user: randomUser._id,
                image: postData.image,
                caption: postData.caption,
                location: postData.location,
                hashtags: hashtags.map(tag => tag.toLowerCase())
            });
        }

        // 4. Create Stories
        console.log('Seeding Stories...');
        for (const user of createdUsers) {
            await Story.create({
                user: user._id,
                image: 'https://images.unsplash.com/photo-1695653422287-7313a2169643?w=400&h=800&fit=crop', // Vertical image
                type: 'image',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
            });
        }

        // 5. Create Follows (Main User follows Dummies to see content)
        console.log('Seeding Follows...');
        for (const user of createdUsers) {
            if (!mainUser.following.includes(user._id)) {
                await mainUser.updateOne({ $push: { following: user._id } });
                await user.updateOne({ $push: { followers: mainUser._id } });
            }
        }

        // 6. Create Messages (Dummies send msgs to Main User)
        console.log('Seeding Messages...');
        const messages = [
            "Hey! How's it going?",
            "Loved your recent post! 🔥",
            "Are you coming to the event?",
            "Check out this new song 🎵",
            "Let's catch up soon!"
        ];

        for (const user of createdUsers) {
            await Message.create({
                sender: user._id,
                recipient: mainUser._id,
                text: messages[Math.floor(Math.random() * messages.length)],
                isRead: false
            });
            // Also add a reply from main user for one of them
            if (Math.random() > 0.5) {
                await Message.create({
                    sender: mainUser._id,
                    recipient: user._id,
                    text: "Hey! Doing good, thanks!",
                    isRead: true
                });
            }
        }

        console.log('✅ Data Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
