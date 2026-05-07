import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const WAIcon = () => (
    <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="#25D366"/>
        <path d="M35.2 12.7C32.5 10 29 8.5 25.2 8.5c-8 0-14.5 6.5-14.5 14.5 0 2.6.7 5.1 2 7.3L10.5 38l8-2.1c2.1 1.1 4.4 1.7 6.8 1.7h.1c8 0 14.5-6.5 14.5-14.5-.1-3.9-1.6-7.5-4.7-10.4zm-10 22.3h-.1c-2.2 0-4.3-.6-6.2-1.7l-.4-.3-4.7 1.2 1.3-4.6-.3-.5c-1.2-2-1.9-4.2-1.9-6.6 0-6.6 5.4-12 12-12 3.2 0 6.2 1.3 8.5 3.5 2.3 2.3 3.5 5.3 3.5 8.5-.1 6.7-5.5 12.1-12 12.5h.3zm6.6-9c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.5-.6c.2-.2.2-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.3 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.2 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.2-.2-.4-.3-.8-.4z" fill="white"/>
    </svg>
);

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { getWhatsAppLink } = useSettings();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    const links = [
        { name: 'Home',         path: '/' },
        { name: 'Products',     path: '/products' },
        { name: 'Trusted By',   path: '/trusted-by' },
        { name: 'Partner',      path: '/bulk-order' },
        { 
            name: 'COMPANY', 
            path: '#', 
            dropdown: [
                { name: 'Our Legacy', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Reviews', path: '/reviews' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms & Conditions', path: '/terms-conditions' }
            ] 
        }
    ];

    const isCompanyActive = ['/about', '/contact', '/reviews', '/privacy-policy', '/terms-conditions'].includes(location.pathname);

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'py-0.5' : 'py-1.5 md:py-2'}`}>
                <div className="max-w-[1500px] mx-auto px-3 md:px-8">
                    <div className={`flex items-center justify-between px-3 md:px-6 py-2 md:py-2.5 rounded-2xl bg-white/97 backdrop-blur-xl border border-slate-100 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>

                        {/* LOGO + BRAND */}
                        <NavLink to="/" className="flex items-center gap-2 group flex-shrink-0">
                            <img src="/logo.jpeg" alt="Milku" className="h-8 md:h-11 w-auto flex-shrink-0 mix-blend-multiply rounded-md" />
                            <div className="flex flex-col leading-none">
                                <span className="text-[18px] md:text-[20px] font-black uppercase tracking-tighter text-milku-secondary">MILKU</span>
                                <span className="text-[8px] font-black uppercase tracking-[2.5px] text-milku-primary mt-0.5">Jay Gayatri Dairy</span>
                            </div>
                        </NavLink>

                        {/* DESKTOP NAV LINKS */}
                        <div className="hidden lg:flex items-center gap-7">
                            {links.map((link) => (
                                <div key={link.name} className="relative group/nav-item">
                                    {link.dropdown ? (
                                        <>
                                            <button className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-[1.5px] transition-colors ${isCompanyActive ? 'text-milku-primary' : 'text-milku-secondary hover:text-milku-primary'}`}>
                                                {link.name}
                                                <ChevronDown size={12} className="group-hover/nav-item:rotate-180 transition-transform duration-300" />
                                            </button>
                                            
                                            {/* Dropdown Menu */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/nav-item:opacity-100 group-hover/nav-item:visible transition-all duration-300 translate-y-2 group-hover/nav-item:translate-y-0">
                                                <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-2 min-w-[160px]">
                                                    {link.dropdown.map((sub) => (
                                                        <Link
                                                            key={sub.path}
                                                            to={sub.path}
                                                            className={`block px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${location.pathname === sub.path ? 'bg-milku-primary/5 text-milku-primary' : 'text-milku-secondary hover:bg-slate-50'}`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <NavLink
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `text-[11px] font-black uppercase tracking-[1.5px] relative group transition-colors ${isActive ? 'text-milku-primary' : 'text-milku-secondary hover:text-milku-primary'}`
                                            }
                                        >
                                            {link.name}
                                            <span className={`absolute -bottom-1 left-0 h-[2px] bg-milku-primary transition-all duration-400 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                        </NavLink>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2 md:gap-3">
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
                                    <span className="text-milku-primary text-[9px] font-black uppercase tracking-[3px] mt-0.5">Jay Gayatri Dairy</span>
                                </div>
                            </div>
                            <button onClick={() => setMobileOpen(false)} className="text-milku-secondary p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close menu">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            <div className="flex flex-col gap-2">
                                {links.map((link, i) => (
                                    <div key={i} className="flex flex-col">
                                        {link.dropdown ? (
                                            <>
                                                <div className="text-[1.3rem] font-black uppercase tracking-tighter py-2 text-milku-primary/40">
                                                    {link.name}
                                                </div>
                                                <div className="pl-6 flex flex-col gap-1 border-l-2 border-slate-50">
                                                    {link.dropdown.map((sub) => (
                                                        <NavLink
                                                            key={sub.path}
                                                            to={sub.path}
                                                            onClick={() => setMobileOpen(false)}
                                                            className={({ isActive }) =>
                                                                `text-[1.1rem] font-black uppercase tracking-tighter py-1.5 transition-colors ${isActive ? 'text-milku-primary' : 'text-milku-secondary hover:text-milku-primary'}`
                                                            }
                                                        >
                                                            {sub.name}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <NavLink
                                                to={link.path}
                                                onClick={() => setMobileOpen(false)}
                                                className={({ isActive }) =>
                                                    `text-[1.8rem] font-black uppercase tracking-tighter py-2 border-b border-slate-50 transition-colors ${isActive ? 'text-milku-primary' : 'text-milku-secondary hover:text-milku-primary'}`
                                                }
                                            >
                                                {link.name}
                                            </NavLink>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="px-8 pb-12 space-y-3">
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-[#25D366] text-white font-black uppercase tracking-[3px] text-[11px] shadow-xl shadow-[#25D366]/30"
                            >
                                <WAIcon /> WHATSAPP US
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

