import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const StoryViewer = ({ stories, initialStoryIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
    const [progress, setProgress] = useState(0);

    const currentStory = stories[currentIndex];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + 1; // Approx 5s for 100 steps
            });
        }, 50); // 50ms * 100 = 5000ms = 5s

        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        }
    };

    if (!currentStory) return null;

    return (
        <div className="fixed inset-0 bg-black z-60 flex items-center justify-center">
            <button onClick={onClose} className="absolute top-4 right-4 text-white z-20">
                <X size={32} />
            </button>

            {/* Progress Bar */}
            <div className="absolute top-2 left-0 right-0 flex gap-1 px-2 z-10">
                {stories.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-gray-600 rounded overflow-hidden">
                        <div
                            className={`h-full bg-white transition-all duration-75 ease-linear ${idx === currentIndex ? 'w-[--prog]' : idx < currentIndex ? 'w-full' : 'w-0'}`}
                            style={{ '--prog': `${progress}%` }}
                        ></div>
                    </div>
                ))}
            </div>

            {/* Story Content */}
            <div className="relative w-full h-full md:w-96 md:h-[80vh] md:rounded-xl overflow-hidden bg-gray-900">
                <img
                    src={currentStory.image}
                    alt="Story"
                    className="w-full h-full object-contain"
                />

                {/* User Info */}
                <div className="absolute top-6 left-4 flex items-center gap-2 text-white">
                    <img src={currentStory.user.profilePic} className="w-8 h-8 rounded-full border border-white" />
                    <span className="font-semibold text-sm">{currentStory.user.username}</span>
                    <span className="text-gray-300 text-xs">• {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Tap Zones */}
                <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={handlePrev}></div>
                <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={handleNext}></div>
            </div>
        </div>
    );
};

export default StoryViewer;
