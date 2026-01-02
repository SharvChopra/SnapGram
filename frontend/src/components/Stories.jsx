import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StoryViewer from './StoryViewer';

const Stories = () => {
    const { user: currentUser } = useAuth();
    const [storyGroups, setStoryGroups] = useState([]);
    const [viewingGroup, setViewingGroup] = useState(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const { data } = await api.get('/stories');
                setStoryGroups(data);
            } catch (error) {
                console.error("Failed to fetch stories", error);
            }
        };
        fetchStories();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            await api.post('/stories', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh stories (or optimistically update)
            const { data } = await api.get('/stories');
            setStoryGroups(data);
            alert("Story added!");
        } catch (error) {
            console.error("Story upload failed", error);
            alert("Failed to upload story");
        }
    };

    return (
        <div className="mb-6 overflow-x-auto scrollbar-hide py-2">
            <div className="flex gap-4">
                {/* My Story (Add) */}
                <div className="flex flex-col items-center gap-1 min-w-16 cursor-pointer relative group">
                    <div className="w-16 h-16 rounded-full p-0.5 border-2 border-gray-200 relative group-hover:scale-105 transition-transform">
                        {currentUser?.profilePic ? (
                            <img
                                src={currentUser?.profilePic}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gray-200" />
                        )}

                        <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 text-white border-2 border-white cursor-pointer hover:bg-blue-600">
                            <input type="file" className="hidden" onChange={handleUpload} accept="image/*,video/*" />
                            <Plus size={14} strokeWidth={3} />
                        </label>
                    </div>
                    <span className="text-xs truncate w-16 text-center text-gray-500">Your story</span>
                </div>

                {/* Other Stories */}
                {storyGroups.map((group, idx) => (
                    <div
                        key={group.user._id}
                        className="flex flex-col items-center gap-1 min-w-16 cursor-pointer group"
                        onClick={() => setViewingGroup(group)}
                    >
                        <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 group-hover:scale-105 transition-transform">
                            <div className="w-full h-full bg-white rounded-full p-0.5">
                                <img
                                    src={group.user.profilePic}
                                    className="w-full h-full rounded-full object-cover"
                                    alt={group.user.username}
                                />
                            </div>
                        </div>
                        <span className="text-xs truncate w-16 text-center">{group.user.username}</span>
                    </div>
                ))}
            </div>

            {viewingGroup && (
                <StoryViewer
                    stories={viewingGroup.stories}
                    onClose={() => setViewingGroup(null)}
                />
            )}
        </div>
    );
};

export default Stories;
