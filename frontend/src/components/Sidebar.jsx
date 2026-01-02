import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Search,
    Heart,
    PlusSquare,
    User,
    LogOut,
    Compass,
    Video,
    MessageCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ onCreateClick }) => {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();

    const sidebarItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Search, label: "Search", path: "/search" },
        { icon: Compass, label: "Explore", path: "/explore" },
        { icon: Video, label: "Reels", path: "/reels" },
        { icon: MessageCircle, label: "Messages", path: "/messages" },
        { icon: Heart, label: "Notifications", path: "/notifications" },
        { icon: PlusSquare, label: "Create", action: "create" },
        { icon: User, label: "Profile", path: `/p/${user?.username}` },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 h-screen px-4 border-r border-gray-200 fixed left-0 top-0 bg-white z-50 pt-8 pb-5">
            <div className="px-2 mb-8">
                {/* Logo */}
                <h1
                    className="text-2xl font-bold select-none cursor-pointer tracking-tight"
                    style={{ fontFamily: 'billabong, cursive', fontSize: '2rem' }}
                >
                    SnapGram
                </h1>
            </div>

            <div className="flex flex-col gap-2 grow">
                {sidebarItems.map((item, index) => {
                    // Check if active: either exact match or profile subpath
                    const isActive = item.path === "/"
                        ? pathname === "/"
                        : item.path && pathname.startsWith(item.path);

                    if (item.path) {
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-gray-100 font-bold" : "hover:bg-gray-50 font-medium text-gray-700"
                                    }`}
                            >
                                <div className="group-hover:scale-105 transition-transform duration-200">
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-black" : "text-black"} />
                                </div>
                                <span className={`text-base select-none ${isActive ? "text-black" : "text-gray-900"}`}>{item.label}</span>
                            </Link>
                        );
                    } else {
                        return (
                            <button
                                key={index}
                                onClick={item.action === "create" ? onCreateClick : undefined}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group w-full text-left font-medium text-gray-700 hover:bg-gray-50`}
                            >
                                <div className="group-hover:scale-105 transition-transform duration-200">
                                    <item.icon size={24} strokeWidth={2} />
                                </div>
                                <span className="text-base select-none">{item.label}</span>
                            </button>
                        );
                    }
                })}
            </div>

            <div className="mb-2">
                <button
                    onClick={logout}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 w-full text-left transition-all duration-200 group font-medium text-gray-700"
                >
                    <div className="group-hover:scale-105 transition-transform duration-200">
                        <LogOut size={24} />
                    </div>
                    <span className="text-base select-none">Log out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
