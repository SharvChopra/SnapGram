import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';
import { Heart, MessageCircle } from 'lucide-react';
import { ProfileSkeleton } from '../components/Skeleton'; // Reusing skeleton (can optimize later)

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    const lastPostRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchExplore = async () => {
            setLoading(true);
            try {
                const limit = 9; // Grid multiple
                const { data } = await api.get(`/posts/explore?page=${page}&limit=${limit}`);

                setPosts(prev => {
                    const newPosts = data.filter(p => !prev.some(existing => existing._id === p._id));
                    return [...prev, ...newPosts];
                });
                setHasMore(data.length === limit);
            } catch (error) {
                console.error("Explore fetch failed", error);
            } finally {
                setLoading(false);
            }
        };

        if (hasMore) fetchExplore();
    }, [page]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-light mb-6">Explore</h2>

            <div className="grid grid-cols-3 gap-1 md:gap-7">
                {posts.map((post, index) => {
                    const isLast = posts.length === index + 1;
                    return (
                        <div
                            key={post._id}
                            ref={isLast ? lastPostRef : null}
                            className="aspect-square bg-gray-100 relative group cursor-pointer"
                        >
                            <img src={post.image} alt="Explore" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 hidden group-hover:flex flex-col items-center justify-center text-white font-bold gap-2">
                                <span className="flex items-center gap-1"><Heart size={20} fill="white" /> {post.likes?.length || 0}</span>
                                <span className="flex items-center gap-1"><MessageCircle size={20} fill="white" /> 0</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div className="mt-8">
                    <ProfileSkeleton />
                    {/* Temporarily reuse ProfileSkeleton for grid loading effect */}
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className="text-center py-10 text-gray-400 text-sm uppercase tracking-widest">
                    You've seen it all
                </div>
            )}
        </div>
    );
};

export default Explore;
