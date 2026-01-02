import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const Layout = () => {
    const { pathname } = useLocation();
    // Hide sidebar on auth pages if needed, though usually handled by routing structure
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return <Outlet />;

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-64 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
