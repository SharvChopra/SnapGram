import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import SuggestedUsers from './SuggestedUsers';
import CreatePostModal from './CreatePostModal';

const Layout = () => {
    const location = useLocation();
    // Hide suggested users on messages or maybe profile if we want full width
    const showRightSidebar = location.pathname === '/' || location.pathname.startsWith('/p/');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handlePostCreated = () => {
        setIsCreateOpen(false);
        window.location.reload();
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar onCreateClick={() => setIsCreateOpen(true)} />

            <main className="flex-1 ml-0 md:ml-64 flex justify-center bg-white">
                <div className="flex w-full max-w-[1024px] pt-8 px-4 gap-16">
                    {/* Main Feed Section - Center */}
                    <div className="flex-1 w-full max-w-[630px] mx-auto">
                        <Outlet />
                    </div>

                    {/* Right Sidebar - Suggestions (Desktop Only) */}
                    {showRightSidebar && (
                        <div className="hidden lg:block w-[320px] shrink-0 pt-4">
                            <SuggestedUsers />
                        </div>
                    )}
                </div>
            </main>

            {isCreateOpen && (
                <CreatePostModal
                    onClose={() => setIsCreateOpen(false)}
                    onPostCreated={handlePostCreated}
                />
            )}
        </div>
    );
};

export default Layout;
