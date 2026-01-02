import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import ReelCard from '../components/ReelCard';
import { Video } from 'lucide-react';

const Reels = () => {
    const [reels, setReels] = useState([]);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const { data } = await api.get('/reels');
                setReels(data);
            } catch (error) {
                console.error("Failed to fetch reels", error);
            }
        };
        fetchReels();
    }, []);

    // Intersection Observer to detect which reel is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Find the index of the intersecting element
                        const index = Number(entry.target.dataset.index);
                        setCurrentReelIndex(index);
                    }
                });
            },
            { threshold: 0.6 } // 60% of the item must be visible
        );

        const container = containerRef.current;
        if (container) {
            Array.from(container.children).forEach((child) => observer.observe(child));
        }

        return () => {
            if (container) {
                Array.from(container.children).forEach((child) => observer.unobserve(child));
            }
        };
    }, [reels]);

    return (
        <div
            ref={containerRef}
            className="h-screen w-full md:w-112.5 mx-auto overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black text-white"
        >
            {reels.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <Video size={48} />
                    <p>No reels yet. Be the first to upload!</p>
                </div>
            ) : (
                reels.map((reel, index) => (
                    <div key={reel._id} data-index={index} className="snap-start h-screen w-full flex justify-center">
                        <ReelCard reel={reel} isActive={index === currentReelIndex} />
                    </div>
                ))
            )}
        </div>
    );
};

export default Reels;
