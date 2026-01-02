import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();

    const sidebarItems = [
        { icon: <Home size={24} />, label: "Home", route: "/" },
        { icon: <Search size={24} />, label: "Search", route: "/search" },
        { icon: <Compass size={24} />, label: "Explore", route: "/explore" },
        { icon: <MessageCircle size={24} />, label: "Messages", route: "/messages" },
        { icon: <Heart size={24} />, label: "Notifications", route: "/notifications" },
        { icon: <PlusSquare size={24} />, label: "Create", route: "/create" },
        { icon: <User size={24} />, label: "Profile", route: `/p/${user?.username}` },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 h-screen px-4 border-r border-gray-300 fixed left-0 top-0 bg-white z-50">
            <div className="py-8 px-4 mb-4">
                 <h1 className="text-2xl font-serif" style={{ fontFamily: '"Instagram Sans", sans-serif' }}>SnapGram</h1>
            </div>

            <div className="flex flex-col gap-2 flex-grow">
                {sidebarItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.route}
                        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors ${pathname === item.route ? 'font-bold' : ''}`}
                    >
                        {item.icon}
                        <span className="text-base">{item.label}</span>
                    </Link>
                ))}
            </div>

             <div className="mb-8">
                <button 
                    onClick={logout}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 w-full text-left"
                >
                    <Menu size={24} />
                    <span className="text-base">More</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
