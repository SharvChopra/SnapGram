import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Send, Phone, Video, Info, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Chat = () => {
    const { socket } = useSocket();
    const { user: currentUser } = useAuth();
    const location = useLocation();

    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(location.state?.startChat || null); // State or null
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Fetch conversation list on mount
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await api.get('/messages');
                setConversations(data);

                // If we started a chat from profile, check if it's already in the list
                if (activeChat) {
                    const exists = data.find(c => c.participant._id === activeChat._id);
                    if (!exists) {
                        // Optimistically add empty conversation to list (optional, but helps UI)
                        setConversations(prev => [
                            {
                                _id: activeChat._id,
                                participant: activeChat,
                                lastMessage: { text: 'Start a conversation' }
                            },
                            ...prev
                        ]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            }
        };
        fetchConversations();
    }, []);

    // Listen for incoming messages
    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (message) => {
            // If message belongs to active chat, add to list
            if (activeChat && (message.sender === activeChat._id || message.recipient === activeChat._id)) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();
            }
            // Update conversation list (bring to top or update snippet) - simpler reloading for MVP
            // api.get('/messages').then(res => setConversations(res.data));
        });

        return () => socket.off('receive_message');
    }, [socket, activeChat]);

    // Fetch messages when active chat changes
    useEffect(() => {
        if (activeChat) {
            const fetchMessages = async () => {
                try {
                    const { data } = await api.get(`/messages/${activeChat._id}`);
                    setMessages(data);
                    scrollToBottom();
                } catch (error) {
                    console.error("Failed to fetch messages", error);
                }
            };
            fetchMessages();
        }
    }, [activeChat]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const { data } = await api.post('/messages', {
                recipientId: activeChat._id,
                text: newMessage
            });

            // Add to local list immediately (optimistic UI)
            setMessages(prev => [...prev, data]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error("Send message failed", error);
        }
    };

    return (
        <div className="flex bg-white h-screen max-w-5xl mx-auto border-x border-gray-200">
            {/* Left Sidebar: Conversations */}
            <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-87.5 flex-col border-r`}>
                <div className="p-5 border-b flex justify-between items-center">
                    <h1 className="font-bold text-xl">{currentUser?.username}</h1>
                </div>
                <div className="overflow-y-auto flex-1">
                    {conversations.map(c => (
                        <div
                            key={c._id.toString()} // Group _id is the partner ID
                            onClick={() => setActiveChat(c.participant)}
                            className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
                        >
                            <img src={c.participant.profilePic} className="w-14 h-14 rounded-full object-cover" />
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-medium">{c.participant.username}</h4>
                                <p className="text-gray-500 text-sm truncate">
                                    {c.lastMessage.sender === currentUser._id ? 'You: ' : ''}{c.lastMessage.text}
                                </p>
                            </div>
                        </div>
                    ))}
                    {conversations.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            No messages yet. Send a message locally to start!
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Chat Window */}
            {activeChat ? (
                <div className="flex-1 flex flex-col h-full bg-white w-full">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setActiveChat(null)} className="md:hidden">
                                <ArrowLeft />
                            </button>
                            <img src={activeChat.profilePic} className="w-8 h-8 rounded-full" />
                            <span className="font-semibold">{activeChat.username}</span>
                        </div>
                        <div className="flex gap-4 text-gray-800">
                            <Phone /> <Video /> <Info />
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                        {messages.map((msg, idx) => {
                            const isMe = msg.sender === currentUser._id;
                            return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[70%] px-4 py-2 rounded-2xl wrap-break-word ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
                        <input
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
                        />
                        <button type="submit" disabled={!newMessage.trim()} className="text-blue-500 font-semibold p-2">
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 flex-col items-center justify-center">
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mx-auto mb-4">
                            <Send size={48} className="-ml-1 mt-1" />
                        </div>
                        <h2 className="text-xl font-light">Your Messages</h2>
                        <p className="text-gray-400">Send private photos and messages to a friend.</p>
                        <button className="mt-4 bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold text-sm">
                            Send Message
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
