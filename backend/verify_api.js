const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testAuthFlow = async () => {
    try {
        console.log('--- Starting Verification ---');

        // 1. Register User
        const uniqueId = Date.now();
        const userData = {
            username: `user_${uniqueId}`,
            email: `user_${uniqueId}@example.com`,
            password: 'password123'
        };

        console.log(`1. Registering user: ${userData.username}...`);
        const registerRes = await axios.post(`${API_URL}/auth/register`, userData);
        console.log('   Users Registered! Token received.');
        const token = registerRes.data.token;

        // 2. Login User
        console.log(`2. Logging in with email...`);
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            emailOrUsername: userData.email,
            password: userData.password
        });
        console.log('   Login Successful!');

        // 3. Get Profile (Me)
        console.log(`3. Fetching own profile...`);
        const meRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`   Fetched: ${meRes.data.username}`);

        // 4. Update Profile
        console.log(`4. Updating profile bio...`);
        const updateRes = await axios.put(`${API_URL}/users/profile`, {
            bio: 'Hello World! This is a test bio.'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`   Bio Updated: ${updateRes.data.bio}`);

        // 5. Public Profile Fetch
        console.log(`5. Fetching public profile...`);
        const profileRes = await axios.get(`${API_URL}/users/${userData.username}`);
        console.log(`   Public Profile Fetched for: ${profileRes.data.username}`);

        console.log('--- Verification Complete: SUCCESS ---');

    } catch (error) {
        console.error('--- Verification Failed ---');
        console.error(error.response ? error.response.data : error.message);
    }
};

testAuthFlow();
