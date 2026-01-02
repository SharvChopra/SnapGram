import { useState, useRef } from "react";
import { X, Upload, Camera } from "lucide-react";
import api from "../api/axios";

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [bio, setBio] = useState(user.bio || "");
  const [isPrivate, setIsPrivate] = useState(user.isPrivate || false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      setLoading(true);
      const { data } = await api.post("/users/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpdate({ profilePic: data.profilePic });
    } catch (error) {
      console.error("Photo upload failed", error);
      alert("Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", {
        bio,
        isPrivate,
      });
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error("Profile update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Edit Profile</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-3 relative group cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Camera size={32} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 hidden group-hover:flex items-center justify-center text-white">
                <Upload size={20} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="text-blue-500 font-semibold text-sm hover:text-blue-700"
            >
              Change Profile Photo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-gray-300 outline-none resize-none h-24"
                placeholder="Write something about yourself..."
                maxLength={150}
              />
              <div className="text-right text-xs text-gray-400">
                {bio.length}/150
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Private Account</h3>
                <p className="text-sm text-gray-500">
                  Only people you approve can see your photos and videos.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Done"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
