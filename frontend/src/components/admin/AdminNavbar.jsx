import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, Layers, LogOut, ExternalLink, Users, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { handleLogout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const ADMIN_PATH = "/admin-milku-secure-9281";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    const links = [
        { name: 'Dashboard', path: `${ADMIN_PATH}/dashboard`, icon: LayoutDashboard },
        { name: 'Catalog', path: `${ADMIN_PATH}/manage-categories`, icon: Layers },
        { name: 'Network', path: `${ADMIN_PATH}/manage-customers`, icon: Users },
        { name: 'Reviews', path: `${ADMIN_PATH}/manage-reviews`, icon: MessageSquare },
        { name: 'Settings', path: `${ADMIN_PATH}/settings`, icon: Settings }
    ];

    const onLogout = () => {
        handleLogout();
        navigate(`${ADMIN_PATH}/login`);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-[10001] transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'}`}>
                <div className="max-w-[1500px] mx-auto px-3 md:px-8">
                    <div className={`flex items-center justify-between px-4 md:px-6 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>

                        {/* LOGO + ADMIN TAG */}
                        <div className="flex items-center gap-2.5 group flex-shrink-0">
                            <img src="/logo.jpeg" alt="Milku" className="h-9 md:h-10 w-auto flex-shrink-0 mix-blend-multiply rounded-md" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[16px] md:text-[18px] font-black uppercase tracking-tighter text-milku-secondary">MILKU</span>
                                <span className="text-[8px] font-black uppercase tracking-[2px] text-[#1565C0] mt-0.5">Admin Hub</span>
                            </div>
                        </div>

                        {/* DESKTOP NAV LINKS */}
                        <div className="hidden lg:flex items-center gap-7">
                            {links.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-[10px] font-black uppercase tracking-[1.5px] flex items-center gap-2 relative group transition-colors ${isActive ? 'text-[#1565C0]' : 'text-milku-secondary hover:text-[#1565C0]'}`
                                    }
                                >
                                    <link.icon size={14} strokeWidth={3} />
                                    {link.name}
                                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#1565C0] transition-all duration-400 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                </NavLink>
                            ))}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 hover:text-[#1565C0] rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                <ExternalLink size={12} /> Live Site
                            </a>
                            <button
                                onClick={onLogout}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-400 hover:bg-red-400 hover:text-white rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-red-100"
                            >
                                <LogOut size={12} /> Logout
                            </button>
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden p-2 text-milku-secondary"
                                aria-label="Open menu"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MOBILE FULLSCREEN DRAWER */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[10000] bg-white flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-10 pb-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <img src="/logo.jpeg" alt="Milku" className="h-10 w-auto mix-blend-multiply rounded-md" />
                                <div className="flex flex-col leading-none">
                                    <span className="text-milku-secondary text-xl font-black uppercase tracking-tighter">MILKU</span>
                                    <span className="text-[#1565C0] text-[9px] font-black uppercase tracking-[3px] mt-0.5">Admin Terminal</span>
                                </div>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="text-milku-secondary p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close menu">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 flex flex-col justify-center px-8 gap-4">
                            {links.map((link, i) => (
                                <NavLink
                                    key={i}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `text-[2rem] font-black uppercase tracking-tighter py-3 flex items-center gap-4 transition-colors ${isActive ? 'text-[#1565C0]' : 'text-milku-secondary hover:text-[#1565C0]'}`
                                    }
                                >
                                    <link.icon size={28} strokeWidth={3} />
                                    {link.name}
                                </NavLink>
                            ))}
                            <a
                                href="/"
                                target="_blank"
                                className="text-[2rem] font-black uppercase tracking-tighter py-3 flex items-center gap-4 text-slate-400"
                            >
                                <ExternalLink size={28} strokeWidth={3} />
                                Live Site
                            </a>
                        </div>

                        {/* Footer Logout */}
                        <div className="px-8 pb-12">
                            <button
                                onClick={onLogout}
                                className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-red-400 text-white font-black uppercase tracking-[3px] text-[11px] shadow-xl shadow-red-400/30"
                            >
                                <LogOut size={20} /> Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminNavbar;
