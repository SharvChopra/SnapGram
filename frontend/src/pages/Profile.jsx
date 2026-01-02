import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import { PostSkeleton, ProfileSkeleton } from '../components/Skeleton';
import { Grid, Bookmark, Tag, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/users/${username}`);
                setProfile(data);
                setIsFollowing(data.followers.some(follower => follower._id === currentUser?._id));

                // Fetch Posts
                const postsRes = await api.get(`/posts/user/${username}`);
                setUserPosts(postsRes.data);
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) fetchProfile();
    }, [username, currentUser]);

    const handleFollow = async () => {
        if (!currentUser) return;

        try {
            if (isFollowing) {
                await api.put(`/users/unfollow/${profile._id}`);
                setIsFollowing(false);
                setProfile(prev => ({
                    ...prev,
                    followers: prev.followers.filter(f => f._id !== currentUser._id)
                }));
            } else {
                const { data } = await api.put(`/users/follow/${profile._id}`);

                if (data.status === 'requested') {
                    alert("Follow request sent");
                } else {
                    setIsFollowing(true);
                    setProfile(prev => ({
                        ...prev,
                        followers: [...prev.followers, { _id: currentUser._id }]
                    }));
                }
            }

        } catch (error) {
            console.error("Follow action failed", error.response?.data?.message);
        }
    };

    const handleUpdateProfile = (updatedData) => {
        setProfile(prev => ({ ...prev, ...updatedData }));
    };

    if (loading) return <ProfileSkeleton />;
    if (!profile) return <div className="text-center mt-10">User not found</div>;

    const isOwnProfile = currentUser?.username === profile.username;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                <div className="shrink-0">
                    <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border border-gray-200 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                            {profile.profilePic ? (
                                <img src={profile.profilePic} alt={profile.username} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl text-gray-300">?</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4 w-full text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                        <h2 className="text-xl md:text-2xl font-light">{profile.username}</h2>

                        <div className="flex gap-2">
                            {isOwnProfile ? (
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 font-semibold rounded-lg text-sm transition-colors"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleFollow}
                                        className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-colors ${isFollowing
                                            ? 'bg-gray-100 text-black hover:bg-gray-200'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                    <button
                                        onClick={() => navigate('/messages', { state: { startChat: profile } })}
                                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 font-semibold rounded-lg text-sm transition-colors"
                                    >
                                        Message
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-start gap-8 md:gap-10 text-base mb-2">
                        <span><span className="font-semibold text-gray-900">0</span> <span className="text-gray-500">posts</span></span>
                        <span><span className="font-semibold text-gray-900">{profile.followers?.length || 0}</span> <span className="text-gray-500">followers</span></span>
                        <span><span className="font-semibold text-gray-900">{profile.following?.length || 0}</span> <span className="text-gray-500">following</span></span>
                    </div>

                    <div className="space-y-1">
                        {profile.fullName && <h3 className="font-semibold">{profile.fullName}</h3>}
                        <p className="whitespace-pre-wrap text-sm text-gray-800">{profile.bio}</p>
                        {profile.links && profile.links.length > 0 && (
                            <div className="flex flex-col gap-0.5 mt-1">
                                {profile.links.map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:underline text-sm font-medium flex items-center gap-1">
                                        🔗 {link.title || link.url}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Tabs */}
            <div className="border-t border-gray-200">
                <div className="flex justify-center gap-12 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                    <button className="h-12 flex items-center gap-2 border-t border-black text-black -mt-px">
                        <Grid size={12} /> Posts
                    </button>
                    <button className="h-12 flex items-center gap-2 hover:text-gray-600 transition-colors">
                        <Bookmark size={12} /> Saved
                    </button>
                    <button className="h-12 flex items-center gap-2 hover:text-gray-600 transition-colors">
                        <Tag size={12} /> Tagged
                    </button>
                </div>

                {/* Posts Placeholder */}
                {profile.isPrivate && !isOwnProfile && !isFollowing ? (
                    <div className="py-20 text-center border bg-white rounded-xl mt-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-black mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h2 className="font-bold text-gray-900 mb-1">This Account is Private</h2>
                        <p className="text-sm text-gray-500">Follow to see their photos and videos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-1 md:gap-7 mt-4">
                        {displayPosts.length === 0 ? (
                            <div className="col-span-3 text-center py-10 text-gray-500">No posts yet</div>
                        ) : (
                            displayPosts.map(post => (
                                <div key={post._id} className="aspect-square bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer relative group">
                                    <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center text-white font-bold gap-4">
                                        <span className="flex items-center gap-1"><Heart size={18} fill="white" /> {post.likes?.length || 0}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {isEditOpen && (
                <EditProfileModal
                    user={profile}
                    onClose={() => setIsEditOpen(false)}
                    onUpdate={handleUpdateProfile}
                />
            )}
        </div>
    );
};

export default Profile;
