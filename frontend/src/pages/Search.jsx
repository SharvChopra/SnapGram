import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Search as SearchIcon, Hash, User } from 'lucide-react';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' or 'tags'
    const [results, setResults] = useState([]);
    const [trendingTags, setTrendingTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch trending tags on mount
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const { data } = await api.get('/posts/trending');
                setTrendingTags(data);
            } catch (error) {
                console.error("Failed to fetch trending tags");
            }
        };
        fetchTrending();
    }, []);

    // Perform search when query or tab changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (!query.trim()) {
                    if (activeTab === 'accounts') {
                        // Fetch suggestions if empty query
                        const { data } = await api.get('/users/suggested');
                        setResults(data);
                    } else {
                        setResults([]);
                    }
                    setLoading(false);
                    return;
                }

                if (activeTab === 'accounts') {
                    const { data } = await api.get(`/users/search?query=${query}`);
                    setResults(data);
                } else {
                    // For tags, we search for posts with that tag or caption
                    const { data } = await api.get(`/posts/search?query=${query}`);
                    setResults(data);
                }
            } catch (error) {
                console.error("Search failed", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(fetchData, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, activeTab]);

    const handleTagClick = (tag) => {
        // When clicking a trending tag, fill search or go to explore
        setQuery(tag);
        setActiveTab('tags');
    };

    return (
        <div className="max-w-2xl mx-auto p-4 min-h-screen pb-20">
            <div className="relative mb-6">
                <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-100 rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-1 focus:ring-gray-300"
                />
            </div>

            <div className="flex border-b mb-4">
                <button
                    onClick={() => setActiveTab('accounts')}
                    className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'accounts' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                >
                    Accounts
                </button>
                <button
                    onClick={() => setActiveTab('tags')}
                    className={`flex-1 pb-3 text-sm font-semibold transition-colors ${activeTab === 'tags' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                >
                    Tags
                </button>
            </div>

            {loading && <div className="text-center py-4 text-gray-500">Searching...</div>}

            {!loading && activeTab === 'accounts' && (
                <div className="space-y-4">
                    {query ? (
                        results.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">No users found.</div>
                        ) : (
                            results.map(user => (
                                <Link to={`/p/${user.username}`} key={user._id} className="flex items-center gap-3">
                                    <img src={user.profilePic} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <div className="font-semibold text-sm">{user.username}</div>
                                        <div className="text-gray-500 text-sm">{user.fullName}</div>
                                    </div>
                                </Link>
                            ))
                        )
                    ) : (
                        // Show Suggested Users if no query
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Suggested for you</h3>
                            {results.length === 0 && <div className="text-gray-500 text-sm">Loading suggestions...</div>}
                            {results.map(user => (
                                <div key={user._id} className="flex items-center justify-between">
                                    <Link to={`/p/${user.username}`} className="flex items-center gap-3">
                                        <img src={user.profilePic || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <div className="font-semibold text-sm">{user.username}</div>
                                            <div className="text-gray-500 text-sm">{user.fullName || 'Suggested for you'}</div>
                                        </div>
                                    </Link>
                                    <button className="text-blue-500 font-semibold text-sm">Follow</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!loading && activeTab === 'tags' && (
                <div>
                    {!query && (
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3 text-gray-900">Trending Hashtags</h3>
                            <div className="flex flex-wrap gap-2">
                                {trendingTags.map(tag => (
                                    <button
                                        key={tag._id}
                                        onClick={() => handleTagClick(tag._id)}
                                        className="px-4 py-1.5 bg-gray-50 border rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        {tag._id} <span className="text-gray-400 text-xs ml-1">{tag.count} posts</span>
                                    </button>
                                ))}
                                {trendingTags.length === 0 && <span className="text-gray-500 text-sm">No trending tags yet.</span>}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-1">
                        {query && results.length === 0 ? (
                            <div className="col-span-3 text-center text-gray-500 mt-10">No posts found.</div>
                        ) : (
                            results.map(post => (
                                <div key={post._id} className="aspect-square bg-gray-100 relative group overflow-hidden">
                                    <img src={post.image} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center text-white text-xs p-1 text-center">
                                        {post.caption?.substring(0, 50)}...
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
