import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Ideally this would be a dedicated endpoint, but for now we'll fetch 'me' with population
                // Or let's assume we created a dedicated endpoint or update getMe to populate requests
                // Wait, 'getMe' doesn't populate requests in my implementation. 
                // I should add a route to get requests or update getMe. 
                // Let's stick to updating getMe in controller to populate requests for simplicity, 
                // OR add a specific endpoint. 
                // Given modularity request, let's add a specific endpoint to userController/routes quickly? 
                // Or just use the fact that I can fetch my own profile? GET /users/:myusername 
                // But getUserProfile excludes tokenVersion/password but might not populate requests deep enough.

                // Let's blindly try to fetch current user profile populated
                if (user) {
                    // Hack: Fetch 'me' again but we need requests populated. 
                    // Let's implement a simple getRequests endpoint in backend for cleanliness.
                    // But for now, to save tool calls, I'll rely on a new endpoint I'll add or just fetch profile if it includes them.
                    // Actually, I didn't add population of requests in getUserProfile. 
                    // I will add a `getPendingRequests` controller method.
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user]);

    // Placeholder UI until I add the backend endpoint in next step
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            <div className="space-y-4">
                <p className="text-gray-500 text-center">No new notifications</p>
            </div>
        </div>
    );
};

export default Notifications;
