import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useNotifications } from '../context/NotificationContext';
import { LayoutDashboard, CheckSquare, LogOut, User, Menu, X, Users, MessageSquare, CheckCircle2, Search, Bell, Layout as AppLogo, Terminal, Folder } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../utils/animations';
import LoaderOverlay from './LoaderOverlay';
import UserProfileModal from './UserProfileModal';
import EmailModal from './EmailModal';


const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const { searchQuery, setSearchQuery } = useProjects();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsSidebarHovered(true);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsSidebarHovered(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Folder, label: 'Projects', path: '/projects' },
        { icon: Terminal, label: 'Workspace', path: '/workspaces' },
        { icon: MessageSquare, label: 'Messages', path: '/messages' },
        { icon: Users, label: 'Members', path: '/team' },
    ];

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Trigger exit animation (open iris) on mount
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Short delay to ensure mount happens then animate out
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
            <LoaderOverlay isLoading={isLoading} />
            {/* Top Header - Full Width */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-30 relative">
                <div className="flex items-center gap-2">
                    <AppLogo className="h-8 w-8 text-primary-600" />
                    <span className="font-bold text-xl text-slate-900">TaskDock</span>
                </div>

                {/* Search, Notifications, Profile */}
                <div className="flex items-center space-x-4 hidden md:flex">
                    <div className="relative group">
                        <Search size={18} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-500 w-64 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsEmailModalOpen(true)}
                        className="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-primary-600 rounded-xl transition-all relative border border-transparent hover:border-slate-200"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                    <motion.button
                        layoutId="profile-pop"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsProfileModalOpen(true)}
                        className="w-10 h-10 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center font-bold text-sm border-2 border-primary-50 shadow-sm overflow-hidden relative group/profile"
                    >
                        {user?.avatar ? (
                            <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                        )}
                        <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover/profile:opacity-100 transition-opacity"></div>
                    </motion.button>
                </div>


                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Content Wrapper */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar Desktop */}
                <motion.aside
                    initial={{ width: 68 }}
                    animate={{ width: isSidebarHovered ? 240 : 68 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="hidden md:flex flex-col h-full bg-white border-r border-slate-200 overflow-hidden relative z-20"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative flex items-center h-10 px-3 rounded-xl transition-colors duration-200 group ${isActive
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="relative z-10 flex items-center justify-center w-8 shrink-0">
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            animate={{
                                                scale: isActive ? 1.1 : 1,
                                                color: isActive ? '#059669' : '#6b7280'
                                            }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <Icon
                                                size={20}
                                                strokeWidth={isActive ? 2.5 : 2}
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{
                                            opacity: isSidebarHovered ? 1 : 0,
                                            x: isSidebarHovered ? 0 : -10
                                        }}
                                        transition={{ duration: 0.2 }}
                                        className="ml-3 font-semibold text-sm whitespace-nowrap overflow-hidden absolute left-10"
                                    >
                                        {item.label}
                                    </motion.span>

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 w-1 h-5 bg-primary-600 rounded-r-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User / Footer */}
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex items-center px-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative z-10">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-slate-400" />
                                )}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isSidebarHovered ? 1 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-3 overflow-hidden whitespace-nowrap absolute left-14"
                            >
                                <p className="text-sm font-bold text-slate-900 truncate max-w-[140px]">{user?.name || 'User'}</p>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 mt-0.5"
                                >
                                    <LogOut size={10} /> Logout
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.aside>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-16 left-0 bottom-0 w-3/4 max-w-sm bg-white z-50 md:hidden shadow-2xl border-r border-slate-100 flex flex-col"
                            >
                                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center p-3 rounded-xl transition-all ${isActive
                                                    ? 'bg-primary-50 text-primary-600'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Icon size={20} className={isActive ? 'text-primary-600' : 'text-slate-400'} />
                                                </motion.div>
                                                <span className="ml-3 font-semibold">{item.label}</span>
                                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />}
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <div className="p-4 border-t border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="User" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user?.name || 'User'}</p>
                                            <p className="text-xs text-slate-500">{user?.role || 'Member'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-6 custom-scrollbar relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Email Pop Page / Modal */}
            <AnimatePresence>
                {isEmailModalOpen && (
                    <EmailModal
                        onClose={() => setIsEmailModalOpen(false)}
                        user={user}
                    />
                )}
            </AnimatePresence>

            {/* Profile Pop Page / Modal */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <UserProfileModal
                        onClose={() => setIsProfileModalOpen(false)}
                        user={user}
                        onLogout={handleLogout}
                    />
                )}
            </AnimatePresence>
        </div>

    );
};

export default Layout;
