const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const username = 'Sharv_12';
        const email = 'sharv_12@example.com';
        const password = 'password123';

        const userExists = await User.findOne({ username });
        if (userExists) {
            console.log('User already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            username,
            email,
            password: hashedPassword,
            fullName: 'Sharv Chopra',
            bio: 'New user'
        });

        console.log(`Created user: ${username} with password: ${password}`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createUser();
