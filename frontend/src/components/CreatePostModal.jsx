import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video } from 'lucide-react';
import api from '../api/axios';

const CreatePostModal = ({ onClose, onPostCreated }) => {
    const [mode, setMode] = useState('post'); // 'post' or 'reel'
    const [caption, setCaption] = useState('');
    const [media, setMedia] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!media) return;

        const formData = new FormData();
        // Backend expects 'image' for posts and 'video' for reels (based on our route config)
        // Adjusting logic: use specific field name based on mode
        if (mode === 'post') {
            formData.append('image', media);
        } else {
            formData.append('video', media);
        }
        formData.append('caption', caption);

        try {
            setLoading(true);
            let endpoint = mode === 'post' ? '/posts' : '/reels';

            const { data } = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (mode === 'post') {
                onPostCreated && onPostCreated(data); // Call callback if it exists (for Home feed update)
            } else {
                alert("Reel uploaded! Check the Reels tab.");
            }
            onClose();
        } catch (error) {
            console.error("Creation failed", error);
            alert(`Failed to create ${mode}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <button onClick={onClose} className="absolute top-4 right-4 text-white">
                <X size={32} />
            </button>

            <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full h-[70vh] flex flex-col md:flex-row animate-in zoom-in duration-200">
                {/* Left: Image / Upload Area */}
                <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center relative border-r">
                    {/* Tab Switcher (Only if no media selected yet) */}
                    {!media && (
                        <div className="absolute top-4 flex bg-white rounded-lg p-1 shadow-sm z-10">
                            <button
                                onClick={() => setMode('post')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'post' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
                            >
                                Post
                            </button>
                            <button
                                onClick={() => setMode('reel')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'reel' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
                            >
                                Reel
                            </button>
                        </div>
                    )}

                    {preview ? (
                        mode === 'post' ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <video src={preview} className="w-full h-full object-cover" controls />
                        )
                    ) : (
                        <div className="flex flex-col items-center">
                            {mode === 'post' ? <ImageIcon size={64} className="text-gray-400 mb-4" /> : <Video size={64} className="text-gray-400 mb-4" />}
                            <p className="text-xl font-light mb-4">Drag {mode === 'post' ? 'photos' : 'videos'} here</p>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg font-semibold text-sm"
                            >
                                Select from computer
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept={mode === 'post' ? "image/*" : "video/*"}
                    />
                    {media && (
                        <button onClick={() => { setMedia(null); setPreview(null); }} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={20} /></button>
                    )}
                </div>

                {/* Right: Caption & Sharing */}
                <div className="w-full md:w-80 flex flex-col">
                    <div className="h-12 border-b flex items-center justify-between px-4">
                        <h2 className="font-semibold">Create new {mode}</h2>
                        <button
                            onClick={handleSubmit}
                            disabled={!media || loading}
                            className="text-blue-500 font-bold text-sm disabled:opacity-50"
                        >
                            {loading ? 'Sharing...' : 'Share'}
                        </button>
                    </div>

                    <div className="p-4 flex-1">
                        <div className="flex gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            <span className="font-semibold text-sm mt-1">username</span>
                        </div>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            className="w-full h-40 resize-none outline-none text-sm"
                            maxLength={2200}
                        />
                        <div className="flex justify-between text-gray-400 text-xs">
                            {mode === 'post' ? <ImageIcon size={16} /> : <Video size={16} />}
                            <span>{caption.length}/2,200</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
