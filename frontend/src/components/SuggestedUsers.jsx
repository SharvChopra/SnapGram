import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SuggestedUsers = () => {
    const [users, setUsers] = useState([]);
    const userAuth = useAuth();

    useEffect(() => {
        const fetchSuggested = async () => {
            try {
                const { data } = await api.get('/users/suggested');
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
            }
        };
        fetchSuggested();
    }, []);

    if (users.length === 0) return null;

    return (
        <div className="w-full pl-4">
            {/* Current User Summary */}
            <div className="flex items-center justify-between mb-6">
                <Link to={`/p/${userAuth?.user?.username}`} className="flex items-center gap-3">
                    <img
                        src={userAuth?.user?.profilePic || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                        alt="My Profile"
                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-900">{userAuth?.user?.username}</span>
                        <span className="text-gray-500 text-sm">{userAuth?.user?.fullName}</span>
                    </div>
                </Link>
                <button
                    onClick={userAuth?.logout}
                    className="text-xs font-semibold text-blue-500 hover:text-blue-700"
                >
                    Switch
                </button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-semibold text-sm">Suggested for you</span>
                <Link to="/explore" className="text-xs font-semibold text-gray-900 hover:text-gray-600">See All</Link>
            </div>

            <div className="flex flex-col gap-3">
                {users.map(user => (
                    <div key={user._id} className="flex items-center justify-between">
                        <Link to={`/p/${user.username}`} className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-300"></div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold group-hover:text-gray-600">{user.username}</span>
                                <span className="text-xs text-gray-500 truncate max-w-[150px]">Suggested for you</span>
                            </div>
                        </Link>
                        <button className="text-xs font-bold text-blue-500 hover:text-blue-700">Follow</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedUsers;
