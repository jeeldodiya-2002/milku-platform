import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import { Phone, Mail, MapPin, ArrowRight, CheckCircle2, User, MessageSquare, HelpCircle, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import PageReveal from '../../components/PageReveal';
import { TextReveal, ScrollReveal } from '../../components/RevealComponents';
import SEO from '../../components/SEO';

import { trackContactClick, trackWhatsAppClick } from '../../utils/analytics';

const InfoCard = ({ icon: Icon, label, value, href, delay }) => {
    const CardContent = (
        <>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-milku-secondary group-hover:bg-milku-secondary group-hover:text-white transition-colors">
                <Icon size={20} />
            </div>
            <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                <span className="block text-[13px] font-bold text-milku-secondary group-hover:text-milku-primary transition-colors">{value}</span>
            </div>
        </>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className="bg-white/70 backdrop-blur-md p-5 rounded-[30px] border border-white/50 shadow-xl group hover:scale-105 transition-all duration-500 cursor-pointer"
        >
            {href ? (
                <a 
                    href={href} 
                    target={href.startsWith('http') ? "_blank" : undefined} 
                    rel="noopener noreferrer"
                    onClick={() => trackContactClick(label.toLowerCase().includes('call') ? 'phone' : (label.toLowerCase().includes('email') ? 'email' : 'maps'))}
                    className="flex flex-col items-center text-center gap-3 w-full h-full"
                >
                    {CardContent}
                </a>
            ) : (
                <div className="flex flex-col items-center text-center gap-3 w-full h-full">
                    {CardContent}
                </div>
            )}
        </motion.div>
    );
};

const FAQItem = ({ question, answer, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-slate-100"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-[15px] md:text-xl font-black text-milku-secondary uppercase tracking-tighter group-hover:text-milku-primary transition-colors italic pr-6 md:pr-10">
                    {question}
                </span>
                <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180 bg-milku-primary text-white' : 'text-slate-500'}`}>
                    <ChevronDown size={20} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-500 font-medium leading-relaxed max-w-3xl">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Contact = ({ splashFinished }) => {
    const { settings, getWhatsAppLink } = useSettings();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', message: '' });
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const dynamicBackground = useTransform(
        scrollYProgress,
        [0, 0.4, 0.8, 1],
        ["#ffffff", "#E0F2FE", "#FDF2F8", "#1A237E"]
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Refined, more natural WhatsApp message
        const transmissionText = `Hello Milku! 👋\n\nMy name is *${formData.name}*. I'm reaching out from your website regarding:\n\n"${formData.message}"\n\nPlease connect with me!`;
        
        trackWhatsAppClick('Contact Form Submission', 'Contact Page');
        window.open(getWhatsAppLink(transmissionText), '_blank');
        
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
        setFormData({ name: '', message: '' });
    };

    const FAQs = [
        {
            question: "What makes Milku Ghee stand out from others?",
            answer: "Our Ghee is crafted using the traditional Bilona method, where pure A2 Cow milk is curdled, churned manually, and then heated slowly to preserve all vital nutrients and the authentic nutty aroma of Gujarat's heritage."
        },
        {
            question: "How should I store Milku Malai Paneer?",
            answer: "Milku Paneer is ultra-fresh and contains no preservatives. For the best experience, keep it refrigerated at 4°C and consume it within 48-72 hours of opening the vacuum seal for that signature soft texture."
        },
        {
            question: "Are your dairy products 100% natural?",
            answer: "Absolutely. We pride ourselves on 'Sweetness of Purity'. Every batch of milk, ghee, and dahi is tested for purity. We use zero additives, thickeners, or artificial preservatives."
        },
        {
            question: "Do you offer franchise or dealership opportunities?",
            answer: "Yes, we are actively scaling our regional footprint. You can apply through our Partnership Program in the Bulk Order section, and our team will get in touch for site verification."
        },
        {
            question: "Can I schedule a recurring bulk delivery?",
            answer: "Certainly. For restaurants, sweet shops, and institutional needs, we provide zero-lag supply chains with scheduled early-morning deliveries across Surat and neighboring regions."
        }
    ];

    return (
        <motion.div
            ref={containerRef}
            style={{ backgroundColor: dynamicBackground }}
            className="relative min-h-screen selection:bg-milku-primary selection:text-white overflow-hidden transition-colors duration-200"
        >
            <SEO 
                title="MILKU | Contact Us"
                description="Connect with Jay Gayatri Dairy Products. Visit our Surat headquarters, call our support team, or WhatsApp us for bulk enquiries and fresh dairy delivery details."
                keywords="contact milku dairy, dairy surat location, dairy phone number surat, whatsapp dairy order, jay gayatri dairy address, dairy directions surat, dairy mehsana"
                canonical="https://milkudairy.com/contact"
            />
            <PageReveal splashFinished={splashFinished}>
                <CinematicEnvironment chapter={1} />

            <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-12 md:py-24">
                <header className="text-center space-y-4 mb-12">
                    <TextReveal
                        splashFinished={splashFinished}
                        className="text-[clamp(2.5rem,10vw,4.5rem)] font-black text-milku-secondary tracking-tighter leading-none"
                    >
                        Let's Connect.
                    </TextReveal>
                    <div className="space-y-1">
                        <h2 className="text-xl md:text-2xl font-bold text-milku-secondary/80 italic">Communication Hub</h2>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[6px]">Inquiry Terminal</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {(settings.branches && settings.branches.length > 0 ? settings.branches : []).map((branch, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            className={`bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border transition-all duration-500 relative group overflow-hidden ${branch.isMain ? 'border-milku-primary shadow-2xl ring-8 ring-blue-50/50' : 'border-white shadow-xl hover:shadow-2xl'}`}
                        >
                            {branch.isMain && (
                                <div className="absolute top-0 right-0 bg-milku-primary text-white px-6 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                                    Main HQ
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-milku-secondary uppercase italic tracking-tight">{branch.name || "Our Presence"}</h3>
                                    <div className="w-12 h-1 bg-milku-primary/20 rounded-full" />
                                </div>

                                <div className="space-y-5">
                                    <a href={branch.googleMapsLink || "#"} target="_blank" rel="noopener noreferrer" className="flex gap-4 group/item">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-milku-primary shrink-0 group-hover/item:bg-milku-primary group-hover/item:text-white transition-all">
                                            <MapPin size={18} />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-relaxed italic group-hover/item:text-milku-secondary transition-colors">
                                            {branch.address}
                                        </span>
                                    </a>

                                    <div className="grid grid-cols-1 gap-4">
                                        <a href={`mailto:${branch.email}`} className="flex items-center gap-4 group/item">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-milku-primary shrink-0 group-hover/item:bg-milku-primary group-hover/item:text-white transition-all">
                                                <Mail size={18} />
                                            </div>
                                            <span className="text-[12px] font-black text-milku-secondary group-hover/item:text-milku-primary transition-colors tracking-tight uppercase">
                                                {branch.email}
                                            </span>
                                        </a>

                                        <a href={`tel:${branch.phone}`} className="flex items-center gap-4 group/item">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-milku-primary shrink-0 group-hover/item:bg-milku-primary group-hover/item:text-white transition-all">
                                                <Phone size={18} />
                                            </div>
                                            <span className="text-[13px] font-black text-milku-secondary group-hover/item:text-milku-primary transition-colors tracking-tight">
                                                +91 {String(branch.phone).replace(/\D/g, '').slice(-10)}
                                            </span>
                                        </a>
                                    </div>
                                    
                                    {branch.fssaiNumber && (
                                        <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                                            <ShieldCheck size={16} className="text-milku-primary/40" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">FSSAI ID</span>
                                                <span className="text-[11px] font-black text-milku-secondary">{branch.fssaiNumber}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <ScrollReveal
                    direction="up"
                    className="bg-white/80 backdrop-blur-3xl rounded-[40px] shadow-2xl border border-white/60 mb-20 md:mb-24 max-w-5xl mx-auto overflow-hidden"
                >
                    <div className="grid lg:grid-cols-[0.8fr,1.2fr]">

                        <div className="bg-slate-50/50 p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6 border-b lg:border-b-0 lg:border-r border-slate-100">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-48 h-48 bg-white p-6 rounded-[40px] shadow-xl flex items-center justify-center"
                            >
                                <img src="/logo.jpeg" alt="Milku Logo" className="w-full h-auto object-contain mix-blend-multiply" />
                            </motion.div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-milku-secondary uppercase tracking-tighter">MILKU DAIRY</h3>
                                <p className="text-[10px] font-black text-milku-primary uppercase tracking-[4px]">Sweetness of Purity</p>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px] mx-auto italic">
                                    "Gujarat's most trusted dairy heritage delivering unadulterated purity and freshness."
                                </p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="h-full flex flex-col">
                                <AnimatePresence mode="wait">
                                    {isSubmitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex-grow flex flex-col items-center justify-center text-center gap-6 py-12"
                                        >
                                            <div className="w-16 h-16 bg-milku-primary text-white rounded-full flex items-center justify-center shadow-lg">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-milku-secondary uppercase italic">Link Established</h3>
                                                <p className="text-sm font-medium text-slate-500">Transmission successful.</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-6 flex-grow">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-milku-secondary uppercase tracking-widest ml-1">Identity Authentication</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input 
                                                        required 
                                                        type="text" 
                                                        placeholder="Your Name" 
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                        className="w-full h-12 bg-white border border-slate-100 focus:border-milku-primary/30 rounded-xl pl-11 pr-4 transition-all font-bold text-sm outline-none shadow-sm" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-milku-secondary uppercase tracking-widest ml-1">Requisition Data</label>
                                                <div className="relative">
                                                    <MessageSquare className="absolute right-4 top-4 text-slate-400" size={16} />
                                                    <textarea 
                                                        required 
                                                        rows="4" 
                                                        placeholder="Type your message..." 
                                                        value={formData.message}
                                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                                        className="w-full bg-white border border-slate-100 focus:border-milku-primary/30 rounded-2xl p-5 transition-all font-bold text-sm outline-none resize-none shadow-sm"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="pt-4 flex justify-center lg:justify-start">
                                                <button className="px-12 bg-milku-primary hover:bg-milku-secondary text-white h-14 rounded-2xl font-black text-[11px] uppercase tracking-[3px] shadow-lg hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                                                    Initialize Transmission <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>

                    </div>
                </ScrollReveal>

                <ScrollReveal className="mb-20 md:mb-24 max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-milku-secondary text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <HelpCircle size={24} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-milku-secondary tracking-tighter uppercase italic leading-none">Heritage Knowledge Base</h2>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[4px]">Frequently Asked Questions</p>
                        </div>
                    </div>
                    
                    <div className="bg-white/50 backdrop-blur-xl rounded-[40px] p-5 md:p-10 border border-white/40 shadow-xl">
                        {FAQs.map((faq, idx) => (
                            <FAQItem key={idx} index={idx} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </ScrollReveal>

                <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto">
                    <div className="space-y-4 max-w-sm text-center md:text-left">
                        <h3 className="text-4xl font-black text-milku-secondary tracking-tight">Ready to Scale?</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            Connect with our regional headquarters for business expansion and partnerships.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="bg-white/80 p-8 rounded-[40px] shadow-xl border border-white/50 flex flex-col items-center text-center gap-6 max-w-sm w-full"
                    >
                        <div className="space-y-1">
                            <h4 className="text-xl font-black text-milku-secondary">Partner with Milku</h4>
                            <p className="text-[13px] font-medium text-slate-500">Authorized slots open for 2026.</p>
                        </div>
                        <NavLink to="/bulk-order" className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center font-black text-[10px] uppercase tracking-[3px] transition-all shadow-md">
                            Apply Now
                        </NavLink>
                    </motion.div>
                </div>

            </div>
            </PageReveal>
        </motion.div>
    );
};

export default Contact;
