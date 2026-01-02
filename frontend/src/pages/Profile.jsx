import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/users/${username}`);
                setProfile(data);
                setIsFollowing(data.followers.some(follower => follower._id === currentUser._id));
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchProfile();
    }, [username, currentUser]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await api.put(`/users/unfollow/${profile._id}`);
            } else {
                await api.put(`/users/follow/${profile._id}`);
            }
            setIsFollowing(!isFollowing);
            // Optimistically update counts
            setProfile(prev => ({
                ...prev,
                followers: isFollowing
                    ? prev.followers.filter(f => f._id !== currentUser._id)
                    : [...prev.followers, { _id: currentUser._id }]
            }));

        } catch (error) {
            console.error("Follow action failed", error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>User not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
                        {profile.profilePic ? (
                            <img src={profile.profilePic} alt={profile.username} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl text-gray-400">?</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4 w-full">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h2 className="text-2xl font-light">{profile.username}</h2>
                        {currentUser?.username === profile.username ? (
                            <button className="px-4 py-1.5 bg-gray-100 font-semibold rounded text-sm">Edit Profile</button>
                        ) : (
                            <button
                                onClick={handleFollow}
                                className={`px-6 py-1.5 rounded text-sm font-semibold ${isFollowing ? 'bg-gray-100 text-black' : 'bg-blue-500 text-white'}`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </div>

                    <div className="flex justify-around md:justify-start md:gap-10 text-center md:text-left border-t md:border-none py-4 md:py-0">
                        <span><span className="font-bold">0</span> posts</span>
                        <span><span className="font-bold">{profile.followers?.length || 0}</span> followers</span>
                        <span><span className="font-bold">{profile.following?.length || 0}</span> following</span>
                    </div>

                    <div className="px-4 md:px-0">
                        <h3 className="font-bold">{profile.username}</h3>
                        <p className="whitespace-pre-wrap">{profile.bio}</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-300">
                {/* Posts Grid would go here */}
                <div className="flex justify-center p-8 text-gray-500 text-sm">
                    <span className="uppercase font-semibold tracking-widest text-xs">Posts</span>
                </div>
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {/* Placeholder for posts */}
                    <div className="aspect-square bg-gray-100 hover:bg-gray-200 cursor-pointer"></div>
                    <div className="aspect-square bg-gray-100 hover:bg-gray-200 cursor-pointer"></div>
                    <div className="aspect-square bg-gray-100 hover:bg-gray-200 cursor-pointer"></div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
