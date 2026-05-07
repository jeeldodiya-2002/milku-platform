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
                    <div className="space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-milku-accent">HEADQUARTERS</h4>
                        <ul className="space-y-8">
                            <li className="flex gap-5 group">
                                <a href={settings.googleMapsLink || "https://maps.app.goo.gl/8pdAN8voMJFbgXNg8"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-milku-primary shrink-0 hover:bg-milku-primary hover:text-white transition-all">
                                    <MapPin size={18} />
                                </a>
                                <span className="text-sm font-medium text-white/60 leading-relaxed uppercase group-hover:text-white transition-colors tracking-tighter italic">
                                    <a href={settings.googleMapsLink || "https://maps.app.goo.gl/8pdAN8voMJFbgXNg8"} target="_blank" rel="noopener noreferrer">
                                        {settings.address}
                                    </a>
                                </span>
                            </li>
                            <li className="flex gap-5 group items-center">
                                <a href={`mailto:${settings.email}`} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-milku-primary shrink-0 hover:bg-milku-primary hover:text-white transition-all">
                                    <Mail size={18} />
                                </a>
                                <a href={`mailto:${settings.email}`} className="text-sm font-bold text-white/80 group-hover:text-white transition-colors uppercase tracking-tight">{settings.email}</a>
                            </li>
                            <li className="flex gap-5 group items-center">
                                <a href={`tel:${settings.whatsappNumber}`} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-milku-primary shrink-0 hover:bg-milku-primary hover:text-white transition-all">
                                    <Phone size={18} />
                                </a>
                                <a href={`tel:${settings.whatsappNumber}`} className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                                    +91 {String(settings.whatsappNumber).replace(/\D/g, '').slice(-10)}
                                </a>
                            </li>
                        </ul>
                        <div className="pt-8 border-t border-white/5">
                             <div className="flex items-center gap-4 text-white/40">
                                <ShieldCheck size={28} className="text-milku-accent" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black tracking-widest uppercase">FSSAI License</span>
                                    <span className="text-sm font-black text-white uppercase">{settings.fssaiNumber}</span>
                                </div>
                             </div>
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
