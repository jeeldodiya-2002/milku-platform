 import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    MessageCircle, 
    Mail, 
    Phone, 
    MapPin, 
    ShieldCheck 
} from 'lucide-react';
import { MASTER_CONFIG } from '../masterConfig';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
    const { settings, getWhatsAppLink, categories } = useSettings();

    return (
        <footer className="bg-milku-secondary text-white pt-10 pb-6 overflow-hidden selection:bg-milku-primary">
            <div className="max-w-[1500px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-white/10">
                    
                    {/* COLUMN 1: BRAND */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-2.5 rounded-2xl shadow-xl">
                                <img src="/logo.jpeg" alt="Milku" className="h-8 w-auto object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black uppercase tracking-tighter leading-none italic">MILKU<span className="text-milku-primary">.</span></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Sweetness of Purity</span>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm font-medium leading-loose max-w-xs uppercase tracking-tight italic">
                            Gujarat's most trusted dairy heritage. Delivering unadulterated purity from our farms to your table.
                        </p>
                        <div className="flex gap-6">
                            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-milku-primary transition-all group shadow-xl">
                                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* COLUMN Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-milku-accent">DIRECTORY</h4>
                        <ul className="space-y-5">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Products', path: '/products' },
                                { name: 'Our Legacy', path: '/about' },
                                { name: 'Trusted By', path: '/trusted-by' },
                                { name: 'Partner', path: '/bulk-order' },
                                { name: 'Contact', path: '/contact' },
                                { name: 'Privacy Policy', path: '/privacy-policy' },
                                { name: 'Terms & Conditions', path: '/terms-conditions' }
                            ].map((link) => (
                                <li key={link.path}>
                                    <NavLink to={link.path} className="text-sm font-bold text-white/70 hover:text-white transition-colors uppercase tracking-widest">{link.name}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMN Collections */}
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-milku-accent">COLLECTIONS</h4>
                        <ul className="space-y-5">
                            {categories.filter(c => c.isMain === true || String(c.isMain) === 'true').slice(0, 5).map((cat) => (
                                <li key={cat._id}>
                                    <NavLink 
                                        to={`/products?category=${cat.name.toLowerCase().replace(/[\s\/]+/g, '-')}`} 
                                        className="text-sm font-bold text-white/70 hover:text-white transition-colors uppercase tracking-widest"
                                    >
                                        {cat.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMN Contact */}
                    <div className="lg:col-span-1 space-y-8">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-milku-accent">OUR PRESENCE</h4>
                        
                        <div className="space-y-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                            {(settings.branches && settings.branches.length > 0 ? settings.branches : []).map((branch, idx) => (
                                <div key={idx} className="space-y-4 border-l-2 border-white/5 pl-6 relative">
                                    {branch.isMain && (
                                        <div className="absolute -left-[2px] top-0 w-[2px] h-8 bg-milku-primary shadow-[0_0_15px_rgba(21,101,192,0.8)]" />
                                    )}
                                    <div>
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/90 flex items-center gap-2">
                                            {branch.name || (branch.isMain ? "Main Branch" : `Branch 0${idx + 1}`)}
                                            {branch.isMain && <span className="bg-milku-primary/20 text-milku-primary text-[7px] px-2 py-0.5 rounded-full border border-milku-primary/30">MAIN</span>}
                                        </h5>
                                    </div>
                                    <ul className="space-y-4">
                                        <li className="flex gap-4 group">
                                            <a href={branch.googleMapsLink || "#"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-milku-primary shrink-0 hover:bg-milku-primary hover:text-white transition-all shadow-lg">
                                                <MapPin size={14} />
                                            </a>
                                            <span className="text-[11px] font-medium text-white/50 leading-relaxed uppercase group-hover:text-white transition-colors tracking-tight italic">
                                                <a href={branch.googleMapsLink || "#"} target="_blank" rel="noopener noreferrer">
                                                    {branch.address}
                                                </a>
                                            </span>
                                        </li>
                                        <div className="flex flex-wrap gap-4">
                                            <li className="flex gap-3 group items-center">
                                                <a href={`mailto:${branch.email}`} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-milku-primary shrink-0 hover:bg-milku-primary hover:text-white transition-all">
                                                    <Mail size={14} />
                                                </a>
                                                <a href={`mailto:${branch.email}`} className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-tighter">{branch.email}</a>
                                            </li>
                                            <li className="flex gap-3 group items-center">
                                                <a href={`tel:${branch.phone}`} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-milku-primary shrink-0 hover:bg-milku-primary hover:text-white transition-all">
                                                    <Phone size={14} />
                                                </a>
                                                <a href={`tel:${branch.phone}`} className="text-[10px] font-bold text-white/70 group-hover:text-white transition-colors">
                                                    +91 {String(branch.phone).replace(/\D/g, '').slice(-10)}
                                                </a>
                                            </li>
                                        </div>
                                        {branch.fssaiNumber && (
                                            <li className="flex items-center gap-3 text-white/30 pt-2 border-t border-white/5">
                                                <ShieldCheck size={16} className="text-milku-accent/50" />
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] font-black tracking-widest uppercase">FSSAI License</span>
                                                    <span className="text-[10px] font-black text-white/60 uppercase">{branch.fssaiNumber}</span>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
                    <p>
                        <NavLink to="/admin-milku-secure-9281/login" className="hover:text-milku-primary transition-colors text-xl inline-block px-2">©</NavLink>
                        {new Date().getFullYear()} Jay Gayatri Dairy Products. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <button 
                            onClick={() => {
                                localStorage.removeItem('milku_cookie_consent');
                                window.location.reload();
                            }}
                            className="hover:text-milku-accent transition-colors"
                        >
                            Cookie Settings
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
