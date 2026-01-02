import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { PostSkeleton } from '../components/Skeleton';
import Stories from '../components/Stories';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Observer for infinite scroll
    const observer = useRef();
    const lastPostRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            try {
                const limit = 5;
                const { data } = await api.get(`/posts/feed?page=${page}&limit=${limit}`);

                setPosts(prev => {
                    // Filter duplicates based on _id
                    const newPosts = data.filter(p => !prev.some(existing => existing._id === p._id));
                    return [...prev, ...newPosts];
                });

                setHasMore(data.length === limit);
            } catch (error) {
                console.error("Feed fetch failed", error);
            } finally {
                setLoading(false);
            }
        };

        // If it's page 1, we might want to reset or just load. 
        // But strict mode might double call, so we handle duplications in setPosts.
        if (hasMore) fetchFeed();
    }, [page]); // Dependency on page only

    return (
        <div className="max-w-117.5 mx-auto pb-20">
            <Stories />

            {posts.length === 0 && !loading ? (
                <div className="text-center mt-10">
                    <h2 className="text-xl font-semibold mb-2">Welcome to SnapGram</h2>
                    <p className="text-gray-500">Follow people to see their photo updates here.</p>
                </div>
            ) : (
                <>
                    {posts.map((post, index) => {
                        if (posts.length === index + 1) {
                            return <div ref={lastPostRef} key={post._id}><PostCard post={post} /></div>
                        } else {
                            return <PostCard key={post._id} post={post} />
                        }
                    })}
                    {loading && (
                        <div className="pt-4">
                            <PostSkeleton />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
