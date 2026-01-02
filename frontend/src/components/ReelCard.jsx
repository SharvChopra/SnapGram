import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ReelCard = ({ reel, isActive }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes.length);
  const { user } = useAuth();

  useEffect(() => {
    setIsLiked(reel.likes.includes(user?._id));
  }, [reel, user]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .catch((err) => console.log("Autoplay prevented", err));
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await api.put(`/reels/like/${reel._id}`);
      if (data.status === "liked") {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-20px)] snap-start shrink-0 bg-black flex items-center justify-center overflow-hidden rounded-xl my-4 md:my-0 md:h-screen md:w-96">
      {/* Video Player */}
      <video
        ref={videoRef}
        src={reel.video}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        onClick={togglePlay}
      />

      {/* Overlay UI */}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/60 pointer-events-none flex flex-col justify-end p-4">
        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col gap-6 items-center pointer-events-auto">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <Heart
              size={30}
              className={`transition-transform active:scale-75 ${
                isLiked ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
            <span className="text-white text-xs font-semibold">
              {likesCount}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <MessageCircle size={30} className="text-white" />
            <span className="text-white text-xs font-semibold">
              {reel.comments?.length || 0}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Share2 size={30} className="text-white" />
          </button>

          <button className="flex flex-col items-center gap-1">
            <MoreHorizontal size={30} className="text-white" />
          </button>

          {/* User Avatar Action */}
          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden mt-2">
            <img
              src={reel.user.profilePic}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="flex flex-col gap-2 mb-4 pointer-events-auto">
          <div className="flex items-center gap-2">
            <img
              src={reel.user.profilePic}
              className="w-8 h-8 rounded-full border border-gray-500"
            />
            <span className="text-white font-semibold text-sm hover:underline cursor-pointer">
              {reel.user.username}
            </span>
            <button className="text-white text-xs border border-white/50 px-2 py-1 rounded hover:bg-white/20">
              Follow
            </button>
          </div>
          <p className="text-white text-sm line-clamp-2">{reel.caption}</p>

          {/* Music/Audio placeholder */}
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span>Original Audio - {reel.user.username}</span>
          </div>
        </div>
      </div>

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 text-white bg-black/20 p-2 rounded-full backdrop-blur-sm pointer-events-auto"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};

export default ReelCard;
