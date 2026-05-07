import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { MASTER_CONFIG } from '../../masterConfig';
import { ArrowRight, MessageCircle, Star, Zap, ShieldCheck, Award, Leaf } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { NavLink } from 'react-router-dom';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSettings } from '../../context/SettingsContext';
import PageReveal from '../../components/PageReveal';
import { TextReveal, ScrollReveal } from '../../components/RevealComponents';
import SEO from '../../components/SEO';
import { trackWhatsAppClick, trackContactClick } from '../../utils/analytics';

gsap.registerPlugin(ScrollTrigger);



import { getProducts, getImageUrl } from '../../services/api';

// ─── TRUST BADGE ──────────────────────────────────────────────────────────────
const TrustBadge = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">
        <Icon size={12} className="text-milku-primary" />
        <span className="text-[9px] font-black text-milku-secondary uppercase tracking-[4px]">{label}</span>
    </div>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductSlide = ({ product, index }) => {
    const cardRef = useRef();
    
    return (
        <motion.div
            ref={cardRef}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col rounded-[32px] bg-white border border-slate-100 shadow-[0_6px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_56px_rgba(0,100,200,0.08)] transition-all duration-500 will-change-transform min-w-[280px] md:min-w-[340px]"
        >
            <div className="absolute top-4 md:top-5 left-4 md:left-5 z-10">
                <span className="inline-flex items-center gap-1 md:gap-1.5 bg-milku-secondary/6 text-milku-secondary text-[7px] md:text-[9px] font-black uppercase tracking-[2px] md:tracking-[4px] px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-milku-secondary/10">
                    <ShieldCheck size={10} className="text-milku-primary hidden sm:block" />
                    <span className="sm:hidden block w-1 h-1 bg-milku-primary rounded-full"></span>
                    {product.category || 'PREMIUM'}
                </span>
            </div>
            <div className="relative flex items-end justify-center pt-12 pb-4 px-6 min-h-[220px] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,150,214,0.03)_0%,transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
                <img src={getImageUrl(product.frontImage || product.images?.[0])} alt={product.name}
                    crossOrigin="anonymous"
                    className="relative z-10 h-32 md:h-44 w-auto object-contain transition-all duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3" />
            </div>
            <div className="flex-1 px-6 pb-6 pt-2 flex flex-col justify-between">
                <div className="space-y-1 mb-4">
                    <p className="text-[9px] font-black text-milku-primary uppercase tracking-[5px]">{product.category}</p>
                    <h3 className="text-lg md:text-xl font-black text-milku-secondary uppercase tracking-tight leading-tight italic group-hover:text-milku-primary transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest line-clamp-1">
                        {product.availableSizes?.join(', ') || product.packaging}
                    </p>
                </div>
                <NavLink to="/products"
                    className="inline-flex items-center justify-between w-full text-[10px] font-black uppercase tracking-[3px] text-milku-secondary hover:text-milku-primary transition-colors duration-300 pt-4 border-t border-slate-100">
                    <span>EXPLORE PRODUCT</span>
                    <span className="w-8 h-8 rounded-full bg-milku-secondary group-hover:bg-milku-primary flex items-center justify-center transition-colors duration-300 shadow">
                        <ArrowRight size={12} className="text-white" />
                    </span>
                </NavLink>
            </div>
        </motion.div>
    );
};

// ─── METRIC COUNTER ───────────────────────────────────────────────────────────
const MetricCounter = ({ value, suffix, label }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef();

    useGSAP(() => {
        gsap.to({ val: 0 }, {
            val: value,
            duration: 2.5,
            ease: "expo.out",
            scrollTrigger: {
                trigger: ref.current,
                start: "top 90%",
            },
            onUpdate: function () {
                setDisplayValue(Math.floor(this.targets()[0].val));
            }
        });
    }, { scope: ref });

    return (
        <div ref={ref} className="space-y-1 group">
            <div className="text-3xl sm:text-4xl md:text-6xl font-black text-milku-secondary tracking-tighter italic group-hover:text-milku-primary transition-colors duration-500">
                {displayValue}{suffix}
            </div>
            <div className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-[4px] sm:tracking-[6px]">{label}</div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const Home = ({ splashFinished }) => {
    const { settings, getWhatsAppLink, categories: dbCategories } = useSettings(); 
    const containerRef = useRef();
    const config = MASTER_CONFIG;
    
    const [products, setProducts] = useState([]);
    const [mainProducts, setMainProducts] = useState([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await getProducts();
                if (res.data.success) {
                    const allProds = res.data.data.filter(p => p.isActive !== false);
                    setProducts(allProds);
                }
            } catch (err) {
                console.error("Home Data Fetch Failed:", err);
            }
        };
        fetchHomeData();
    }, []);

    useEffect(() => {
        if (dbCategories.length > 0 && products.length > 0) {
            const mainCatNames = dbCategories
                .filter(c => c.isMain === true || String(c.isMain) === 'true')
                .map(c => c.name);
            
            const filtered = products.filter(p => mainCatNames.includes(p.category));
            setMainProducts(filtered.length > 0 ? filtered : products.slice(0, 8));
        }
    }, [dbCategories, products]);

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const dynamicBackground = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1],
        ["#ffffff", "#BFDBFE", "#A7F3D0", "#1A237E", "#1A237E"] // Seamlessly fade into Navy for the footer
    );

    return (
        <motion.div ref={containerRef} style={{ backgroundColor: dynamicBackground }} id="home-container" className="relative w-full overflow-x-hidden selection:bg-milku-primary selection:text-white">
            <SEO
                title="MILKU | Jay Gayatri Dairy"
                description="Jay Gayatri Dairy presents Milku: Surat's premier dairy brand. Delivering pure A2 Ghee, fresh Malai Paneer, Dahi, and Chaas from farm to table. Quality since 30 years."
                keywords="dairy products surat, jay gayatri dairy, milku dairy, fresh paneer surat, A2 ghee gujarat, fresh dahi surat, chaas buttermilk, premium dairy gujarat, FSSAI certified dairy surat"
                canonical="https://milkudairy.com/"
            />
            <PageReveal splashFinished={splashFinished}>
                <CinematicEnvironment chapter={0} />

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SECTION 1 — HERO
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <section className="relative flex items-center px-5 lg:px-20 pt-[90px] md:pt-[110px] pb-6 md:pb-8 min-h-[65vh] md:min-h-fit overflow-hidden">
                    {/* Hardware-accelerated radial glow instead of expensive CSS blur */}
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,214,0.06)_0%,transparent_70%)] pointer-events-none" />

                    <div className="max-w-[1500px] mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                        {/* MOBILE BRAND LOGO */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={splashFinished ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.2, duration: 1 }}
                            className="lg:hidden flex justify-center mb-4"
                        >
                            <img src="/logo.jpeg" alt="Milku" className="h-28 w-auto mix-blend-multiply opacity-90" />
                        </motion.div>

                        {/* LEFT: Brand Text */}
                        <div className="space-y-4 md:space-y-5 text-center lg:text-left">


                            <h1 className="text-[clamp(2.4rem,10vw,5.5rem)] font-black text-milku-secondary leading-[0.9] uppercase tracking-tighter italic">
                                <TextReveal className="block" delay={0.15} splashFinished={splashFinished}>GUJARAT'S</TextReveal>
                                <TextReveal className="block text-milku-primary" delay={0.28} splashFinished={splashFinished}>PUREST</TextReveal>
                                <TextReveal className="block" delay={0.41} splashFinished={splashFinished}>HERITAGE.</TextReveal>
                            </h1>

                            <motion.p initial={{ opacity: 0 }} animate={splashFinished ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
                                className="text-[10px] font-black text-milku-primary/70 uppercase tracking-[6px] italic hidden sm:block">
                                {config.HERO.subtitle}
                            </motion.p>

                            <motion.p initial={{ opacity: 0, y: 14 }} animate={splashFinished ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.9, duration: 0.8 }}
                                className="text-[13px] md:text-[15px] text-slate-500 font-medium leading-[1.75] max-w-[460px] line-clamp-4 md:line-clamp-none">
                                {config.HERO.desc}
                            </motion.p>

                            <motion.div initial={{ opacity: 0 }} animate={splashFinished ? { opacity: 1 } : {}} transition={{ delay: 1.05 }}
                                className="flex flex-wrap justify-center lg:justify-start gap-2">
                                <TrustBadge icon={ShieldCheck} label="FSSAI Grade A" />
                                <TrustBadge icon={Leaf} label="No Additives" />
                                <TrustBadge icon={Award} label="Bilona Method" />
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 14 }} animate={splashFinished ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 1.2, duration: 0.7 }}
                                className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
                                <NavLink to="/products"
                                    onClick={() => trackContactClick('explore_products')}
                                    className="btn-pill bg-milku-primary text-white shadow-lg shadow-milku-primary/25 hover:scale-105 active:scale-95 transition-all text-[11px] px-8">
                                    {config.HERO.ctas[0].text} <ArrowRight size={15} className="ml-1.5" />
                                </NavLink>
                                <NavLink to="/bulk-order"
                                    onClick={() => trackContactClick('bulk_order')}
                                    className="btn-pill bg-white border-2 border-slate-200 text-milku-secondary hover:bg-slate-50 active:scale-95 transition-all text-[11px] px-8">
                                    {config.HERO.ctas[1].text}
                                </NavLink>
                            </motion.div>
                        </div>

                        {/* RIGHT: Brand Logo — hidden on mobile, shown on lg+ */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }} animate={splashFinished ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.3, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                            className="relative hidden lg:flex items-center justify-center h-[420px]"
                        >
                            {/* Static glow blob — fast radial-gradient instead of blur() */}
                            <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,214,0.06)_0%,transparent_60%)] pointer-events-none" />
                            <div className="absolute w-[380px] h-[380px] rounded-full border border-dashed border-milku-primary/15 pointer-events-none" />

                            {/* Logo float */}
                            <motion.img
                                src="/logo.jpeg"
                                alt="Jay Gayatri Dairy — Milku"
                                crossOrigin="anonymous"
                                className="relative z-10 w-[300px] md:w-[340px] h-auto object-contain mix-blend-multiply"
                                style={{ imageRendering: '-webkit-optimize-contrast', WebkitFontSmoothing: 'antialiased' }}
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            />

                            <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                                className="absolute bottom-16 -left-4 bg-white border border-milku-primary/25 text-milku-primary text-[9px] font-black uppercase tracking-[3px] px-4 py-2 rounded-full shadow-sm z-20 will-change-transform">
                                100% Pure
                            </motion.span>
                            <motion.span animate={{ y: [-4, 5, -4] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
                                className="absolute bottom-24 -right-4 bg-milku-secondary text-white text-[9px] font-black uppercase tracking-[3px] px-4 py-2 rounded-full shadow-sm z-20 will-change-transform">
                                Gujarat's Best
                            </motion.span>
                        </motion.div>
                    </div>
                </section>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SECTION 2 — METRICS
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <ScrollReveal className="py-10 md:py-16 px-5 lg:px-10">
                    <div className="max-w-[1500px] mx-auto bg-white/60 backdrop-blur-3xl border border-white/40 rounded-[40px] md:rounded-[80px] p-8 md:p-16 shadow-xl relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-milku-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-milku-accent/5 blur-[80px] rounded-full pointer-events-none"></div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-14 relative z-10">
                            {config.METRICS.map((m, i) => (
                                <MetricCounter key={i} {...m} />
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SECTION 3 — SIGNATURE PRODUCT GRID
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <ScrollReveal className="py-6 md:py-10 px-4 md:px-6 lg:px-20">
                    <div className="max-w-[1500px] mx-auto space-y-8 md:space-y-12">
                        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-4 md:gap-6">
                            <div className="space-y-2 md:space-y-3 text-center lg:text-left">
                                <span className="text-[9px] font-black text-milku-primary uppercase tracking-[8px]">COLLECTION 2025</span>
                                <h2 className="text-[clamp(2rem,8vw,5.5rem)] font-black text-milku-secondary leading-none uppercase tracking-tighter italic">
                                    Signature<br />Selection.
                                </h2>
                            </div>
                            <p className="text-sm text-slate-500 font-medium max-w-xs italic hidden md:block">
                                Traditional dairy essentials crafted for the modern household.
                            </p>
                        </div>
                        {/* LIVE PRODUCT TICKER — Auto-scrolling marquee */}
                        <div className="relative -mx-4 md:-mx-6 lg:-mx-20 overflow-hidden group/ticker py-10">
                            <motion.div 
                                className="flex gap-6 md:gap-10 w-fit"
                                animate={{ x: [0, -1 * (mainProducts.length * 380)] }}
                                transition={{ 
                                    duration: mainProducts.length * 5, 
                                    repeat: Infinity, 
                                    ease: "linear",
                                    pauseOnHover: true 
                                }}
                                style={{ display: 'flex' }}
                            >
                                {/* First set of products */}
                                {mainProducts.map((prod, i) => (
                                    <div key={`set1-${prod._id || i}`} className="shrink-0">
                                        <ProductSlide product={prod} index={i} />
                                    </div>
                                ))}
                                {/* Duplicated set for seamless loop */}
                                {mainProducts.map((prod, i) => (
                                    <div key={`set2-${prod._id || i}`} className="shrink-0">
                                        <ProductSlide product={prod} index={i} />
                                    </div>
                                ))}
                                {/* Triplicated set for ultra-wide screens */}
                                {mainProducts.map((prod, i) => (
                                    <div key={`set3-${prod._id || i}`} className="shrink-0">
                                        <ProductSlide product={prod} index={i} />
                                    </div>
                                ))}
                            </motion.div>
                            
                            {/* Scroll Indicator Hint */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30 group-hover/ticker:opacity-60 transition-opacity">
                                <div className="w-12 h-[1px] bg-milku-secondary" />
                                <span className="text-[8px] font-black uppercase tracking-[4px] text-milku-secondary">Live Inventory Stream</span>
                                <div className="w-12 h-[1px] bg-milku-secondary" />
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SECTION 4 — BILONA LEGACY (Dark Block)
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <ScrollReveal className="py-8 md:py-12 px-4 md:px-10 mt-2 md:mt-6">
                    <div className="relative max-w-[1500px] mx-auto rounded-[40px] md:rounded-[80px] overflow-hidden bg-milku-secondary shadow-2xl">
                        {/* Animated Background Block */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B4B] via-milku-secondary to-[#1A237E] z-0"></div>
                            {/* Animated glowing orbs */}
                            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-milku-primary/20 blur-[100px] animate-pulse"></div>
                            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] md:w-[30vw] md:h-[30vw] rounded-full bg-milku-accent/15 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                            {/* Grid pattern overlay for professional look */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10 px-8 py-12 md:px-16 md:py-20">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <span className="inline-block px-5 py-2.5 rounded-full border border-milku-accent/20 bg-milku-accent/10 text-milku-accent text-[10px] font-black uppercase tracking-[6px] backdrop-blur-md shadow-sm">{config.LEGACY_CONTENT.tagline}</span>
                                    <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] uppercase tracking-tighter italic">
                                        {config.LEGACY_CONTENT.title}
                                    </h2>
                                </div>
                                <p className="text-base md:text-lg text-white/60 font-medium leading-relaxed max-w-xl">
                                    {config.LEGACY_CONTENT.body}
                                </p>
                                <NavLink to="/about" className="btn-premium inline-flex items-center justify-center bg-white text-milku-secondary h-16 px-10 rounded-full font-black text-[11px] uppercase tracking-[4px] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all mt-4 w-fit">
                                    EXPLORE LEGACY <Star size={18} className="ml-3" />
                                </NavLink>
                            </div>
                            <div className="relative flex items-center justify-center h-[320px] md:h-[480px]">
                                {/* Glassmorphism pedestal for the product */}
                                <div className="absolute bottom-0 md:bottom-10 w-[70%] h-[30px] md:h-[50px] bg-black/40 blur-2xl rounded-[100%]"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-full blur-3xl opacity-50"></div>
                                <img src={config.LEGACY_CONTENT.image} alt="Heritage Product"
                                    crossOrigin="anonymous"
                                    loading="lazy"
                                    className="relative z-10 h-full w-auto object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] will-change-transform hover:scale-110 transition-transform duration-1000 ease-out" />
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                SECTION 5 — B2B CTA
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <ScrollReveal className="py-10 md:py-16 px-6 lg:px-20 transition-colors duration-700">
                    <div className="max-w-[1200px] mx-auto text-center space-y-8 md:space-y-10">
                        <div className="space-y-3 md:space-y-4">
                            <span className="text-[9px] font-black text-milku-accent uppercase tracking-[8px]">GLOBAL PARTNERSHIP</span>
                            <h2 className="text-white text-4xl md:text-6xl font-black leading-[0.9] uppercase tracking-tighter italic">
                                {config.B2B_CTA.title}
                            </h2>
                            <p className="text-sm text-slate-200 font-medium max-w-md mx-auto">{config.B2B_CTA.subtitle}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-5">
                            <NavLink to="/bulk-order" 
                                onClick={() => trackContactClick('b2b_cta_primary')}
                                className="btn-pill bg-milku-accent text-milku-secondary h-14 px-12 shadow-lg hover:scale-105 active:scale-95 transition-all">
                                {config.B2B_CTA.btnPrimary} <ArrowRight size={19} className="ml-3" />
                            </NavLink>
                            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
                                onClick={() => trackWhatsAppClick('General Enquiry', 'B2B Footer')}
                                className="btn-pill bg-transparent border-2 border-white/20 text-white h-14 px-12 hover:bg-white/10 active:scale-95 transition-all">
                                {config.B2B_CTA.btnSecondary} <MessageCircle size={19} className="ml-3" />
                            </a>
                        </div>
                    </div>
                </ScrollReveal>
            </PageReveal>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </motion.div>
    );
};

export default Home;
