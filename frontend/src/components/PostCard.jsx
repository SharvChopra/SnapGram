import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(post.likes.some(like => like._id === user?._id || like === user?._id));
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [isSaved, setIsSaved] = useState(user?.savedPosts?.includes(post._id));
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const fetchComments = async () => {
        if (showComments) {
            setShowComments(false);
            return;
        }
        try {
            const { data } = await api.get(`/posts/comments/${post._id}`);
            setComments(data);
            setShowComments(true);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    const handleLike = async () => {
        try {
            const { data } = await api.put(`/posts/like/${post._id}`);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            console.error("Like failed", error);
        }
    };

    const handleSave = async () => {
        try {
            if (isSaved) {
                await api.put(`/users/unsave/${post._id}`);
                setIsSaved(false);
            } else {
                await api.put(`/users/save/${post._id}`);
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Save failed", error);
        }
    };

    const [replyingTo, setReplyingTo] = useState(null);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const payload = { text: commentText };
            if (replyingTo) payload.parentCommentId = replyingTo;

            const { data } = await api.post(`/posts/comment/${post._id}`, payload);
            setComments([...comments, data]);
            setCommentText('');
            setReplyingTo(null);
            setShowComments(true);
        } catch (error) {
            console.error("Comment failed", error);
        }
    };

    // Group comments into a tree
    const getCommentTree = (allComments) => {
        const commentMap = {};
        const roots = [];
        allComments.forEach(c => commentMap[c._id] = { ...c, replies: [] });
        allComments.forEach(c => {
            if (c.parentComment && commentMap[c.parentComment]) {
                commentMap[c.parentComment].replies.push(commentMap[c._id]);
            } else {
                roots.push(commentMap[c._id]);
            }
        });
        return roots;
    };

    const renderComments = (commentList, depth = 0) => {
        return commentList.map(c => (
            <div key={c._id} className={`text-sm mb-2 ${depth > 0 ? 'ml-6 border-l-2 border-gray-100 pl-3' : ''}`}>
                <div className="flex gap-2">
                    <span className="font-semibold">{c.user.username}</span>
                    <span>{c.text}</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    <button
                        onClick={() => {
                            setReplyingTo(c._id);
                            setCommentText(`@${c.user.username} `);
                        }}
                        className="font-semibold hover:text-gray-600"
                    >
                        Reply
                    </button>
                </div>
                {c.replies && c.replies.length > 0 && (
                    <div className="mt-1">
                        {renderComments(c.replies, depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    const commentTree = getCommentTree(comments);

    return (
        <div className="bg-white border-b border-gray-200 pb-4 mb-5">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
                <Link to={`/p/${post.user.username}`} className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border">
                        {post.user.profilePic ? (
                            <img src={post.user.profilePic} alt={post.user.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-300"></div>
                        )}
                    </div>
                    <span className="font-semibold text-sm group-hover:opacity-70">{post.user.username}</span>
                </Link>
                <button><MoreHorizontal size={20} /></button>
            </div>

            {/* Image */}
            <div className="w-full bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                <img src={post.image} alt="Post" className="w-full h-full object-cover" />
            </div>

            {/* Actions */}
            <div className="p-3">
                <div className="flex justify-between mb-2">
                    <div className="flex gap-4">
                        <button onClick={handleLike} className="hover:opacity-60 transition-opacity">
                            <Heart size={24} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                        </button>
                        <button onClick={fetchComments} className="hover:opacity-60 transition-opacity">
                            <MessageCircle size={24} />
                        </button>
                        <button className="hover:opacity-60 transition-opacity">
                            <Send size={24} />
                        </button>
                    </div>
                    <button onClick={handleSave} className="hover:opacity-60 transition-opacity">
                        <Bookmark size={24} className={isSaved ? "fill-black text-black" : ""} />
                    </button>
                </div>

                <div className="font-semibold text-sm mb-1">{likesCount} likes</div>

                <div className="text-sm mb-1">
                    <span className="font-semibold mr-2">{post.user.username}</span>
                    <span>{post.caption}</span>
                </div>

                {/* Comments Section */}
                {comments.length > 0 && showComments && (
                    <div className="mt-2 space-y-2">
                        {renderComments(commentTree)}
                    </div>
                )}

                <button
                    onClick={fetchComments}
                    className="text-gray-500 text-sm mt-1 mb-2"
                >
                    {showComments ? 'Hide comments' : 'View all comments'}
                </button>

                <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">
                    {new Date(post.createdAt).toDateString()}
                </div>

                <form onSubmit={handleComment} className="border-t pt-3 flex items-center">
                    <input
                        type="text"
                        placeholder={replyingTo ? "Add a reply..." : "Add a comment..."}
                        className="flex-1 text-sm outline-none"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    {replyingTo && (
                        <button type="button" onClick={() => { setReplyingTo(null); setCommentText(''); }} className="mr-2 text-xs text-gray-400">Cancel</button>
                    )}
                    <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="text-blue-500 font-semibold text-sm disabled:opacity-50 ml-2"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostCard;
