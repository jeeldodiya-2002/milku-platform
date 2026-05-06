import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, MessageCircle, ArrowRight, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

import { getCustomers } from '../../services/api';
import { Loader2 } from 'lucide-react';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import PageReveal from '../../components/PageReveal';
import SEO from '../../components/SEO';

const Customers = ({ splashFinished }) => {
    const { getWhatsAppLink } = useSettings();
    const [search, setSearch] = useState('');
    const [activeArea, setActiveArea] = useState('All');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomersData = async () => {
            try {
                const res = await getCustomers();
                if (res.data.success) {
                    setCustomers(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch customers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomersData();
    }, []);

    const stats = useMemo(() => {
        const total_customers = customers.length;
        const total_locations = customers.reduce((acc, c) => acc + (c.addresses?.length || 0), 0);
        const total_areas = [...new Set(customers.flatMap(c => c.areas || []))].length;
        return { total_customers, total_locations, total_areas };
    }, [customers]);

    const unique_areas = useMemo(() => {
        const areas = [...new Set(customers.flatMap(c => c.areas || []))].sort();
        return areas;
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.addresses.some(a => a.toLowerCase().includes(search.toLowerCase()));
            const matchesArea = activeArea === 'All' || (c.areas && c.areas.includes(activeArea));
            return matchesSearch && matchesArea;
        });
    }, [search, activeArea, customers]);

    const StatCounter = ({ value, label, delay = 0 }) => {
        const [count, setCount] = useState(0);
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true });

        useEffect(() => {
            if (isInView) {
                let start = 0;
                const end = parseInt(value);
                if (start === end) return;

                const duration = 1500;
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);

                    setCount(Math.floor(easeProgress * end));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                requestAnimationFrame(animate);
            }
        }, [isInView, value]);


        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="flex flex-col gap-1"
            >
                <div className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-milku-secondary leading-none">
                    {count}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[3px] text-slate-400">
                    {label}
                </div>
                <div className="w-10 h-[1px] bg-milku-primary mt-1" />
            </motion.div>
        );
    };

    const CustomerCard = ({ customer, index }) => {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                    delay: Math.min(index * 0.05, 0.8),
                    duration: 0.5,
                    ease: "easeOut"
                }}
                className="group relative bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 overflow-hidden cursor-pointer"
            >
                {/* Magnetic behavior simulation & Border transition */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-milku-accent group-hover:bg-milku-primary transition-colors duration-500" />

                <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-black text-milku-secondary group-hover:text-milku-primary transition-colors duration-500 tracking-tight leading-tight uppercase italic">
                        {customer.name}
                    </h3>

                    <div className="space-y-3">
                        {customer.addresses.map((addr, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                                <MapPin size={14} className="text-milku-primary mt-1 shrink-0" />
                                <span className="text-[13px] font-medium text-slate-500 leading-snug">
                                    {addr}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    };

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const dynamicBackground = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1],
        ["#ffffff", "#BFDBFE", "#A7F3D0", "#1A237E", "#1A237E"]
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-milku-primary" size={48} />
        </div>
    );

    return (
        <motion.div ref={containerRef} style={{ backgroundColor: dynamicBackground }} className="relative min-h-screen overflow-hidden">
            <SEO 
                title="MILKU | Trusted Customers"
                description={`Explore the elite network of ${customers.length > 0 ? `${customers.length}+` : 'top'} restaurants and hotels that trust Milku for premium dairy excellence. Our partners include leading establishments across ${unique_areas.slice(0, 5).join(', ')} and beyond.`}
                keywords={`trusted customers milku, dairy partners surat, restaurant supply gujarat, hotel dairy vendor surat, milku dairy network, ${customers.slice(0, 15).map(c => c.name).join(', ')}`}
                canonical="https://milkudairy.com/trusted-by"
            />
            <PageReveal splashFinished={splashFinished}>
                {/* BACKGROUND ELEMENTS */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    {/* Soft Blobs */}
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#F7F2E8] rounded-full blur-[100px] opacity-60" />
                    <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-[#F7F2E8] rounded-full blur-[80px] opacity-40" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-[#F7F2E8] rounded-full blur-[100px] opacity-50" />

                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6.png')] " />
                </div>

                <CinematicEnvironment chapter={2} />
            <div className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto">

                {/* HERO SECTION */}
                <section className="text-center mb-16 max-w-4xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-bold text-[14px] text-milku-primary uppercase tracking-widest block mb-4"
                    >
                        Trusted By
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-slate-900 leading-tight mb-6"
                    >
                        Our Valued Customers
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto"
                    >
                        These are the restaurants, hotels, and establishments that trust Milku dairy products for their daily needs.
                    </motion.p>
                </section>

                {/* STATS SECTION */}
                <section className="grid grid-cols-2 gap-8 md:gap-24 max-w-4xl mx-auto mb-20">
                    <div className="text-center group">
                        <div className="text-[clamp(3rem,6vw,5rem)] font-bold text-[#1565C0] leading-none mb-2 relative inline-block">
                            <StatCounter value={stats.total_customers} label="Partner Network" />
                        </div>
                        <p className="text-slate-600 font-black text-[9px] md:text-xs mt-4 uppercase tracking-[2px] md:tracking-[4px] opacity-60">Partner Network</p>
                    </div>
                    <div className="text-center group">
                        <div className="text-[clamp(3rem,6vw,5rem)] font-bold text-[#1565C0] leading-none mb-2 relative inline-block">
                            <StatCounter value={stats.total_locations} label="Points of Sale" />
                        </div>
                        <p className="text-slate-600 font-black text-[9px] md:text-xs mt-4 uppercase tracking-[2px] md:tracking-[4px] opacity-60">Points of Sale</p>
                    </div>
                </section>

                {/* CUSTOMER GRID: FULL WIDTH */}
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-slate-800 tracking-tight uppercase italic">
                                Our Customers Network
                            </h3>
                            <div className="px-4 py-1.5 bg-[#1565C0]/10 rounded-full text-[12px] font-black text-[#1565C0] uppercase tracking-widest">
                                {filteredCustomers.length} Establishments
                            </div>
                        </div>

                        {/* SEARCH INTERFACE */}
                        <div className="relative group w-full md:w-[320px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-milku-primary transition-colors" size={16} />
                            <input 
                                type="text"
                                placeholder="Search partners or locations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-milku-primary/20 focus:border-milku-primary transition-all shadow-sm"
                            />
                            {search && (
                                <button 
                                    onClick={() => setSearch('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredCustomers.map((customer, index) => (
                                <motion.div
                                    key={customer._id || customer.name}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.03, 0.8) }}
                                    className="group bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden cursor-pointer hover:-translate-y-1"
                                >
                                    <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#FFD700] rounded-r-full group-hover:bg-[#1565C0] transition-colors duration-500" />
                                    <div className="pl-3">
                                        <h3 className="text-sm font-black text-slate-800 mb-2 leading-tight group-hover:text-[#1565C0] transition-colors uppercase italic">{customer.name}</h3>
                                        <div className="space-y-2">
                                            {customer.addresses.map((addr, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <MapPin size={12} className="text-[#1565C0] mt-0.5 shrink-0" />
                                                    <div className="flex flex-col">
                                                        {customer.addresses.length > 1 && (
                                                            <span className="text-[9px] font-black text-milku-primary uppercase tracking-tighter mb-0.5">
                                                                Branch {idx + 1}
                                                            </span>
                                                        )}
                                                        <span className="text-[11px] font-medium text-slate-500 leading-tight">
                                                            {addr.replace(/^[0-9]+\.\s*/, '')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* BOTTOM CTA */}
                <section className="mt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#0D1B3E] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-10" />
                        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                Want to serve <span className="text-milku-primary">Milku Excellence</span> at your establishment?
                            </h2>
                            <p className="text-slate-400 text-lg font-medium">
                                Join our network of premium partners and get access to fresh, high-quality dairy products delivered daily.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => window.open(getWhatsAppLink("Hello Milku! I'm interested in a business partnership."), '_blank')}
                                    className="bg-[#25D366] text-white h-14 px-10 rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-3"
                                >
                                    <MessageCircle size={20} /> PARTNER WITH US
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </div>
            </PageReveal>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </motion.div>
    );
};

export default Customers;
