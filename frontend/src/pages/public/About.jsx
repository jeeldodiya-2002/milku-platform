import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import { ShieldCheck, Award, Zap, Heart, TrendingUp } from 'lucide-react';
import PageReveal from '../../components/PageReveal';
import { TextReveal, ScrollReveal } from '../../components/RevealComponents';
import SEO from '../../components/SEO';

const ImpactCounter = ({ value, label, sublabel }) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    const suffix = value.replace(/[0-9]/g, '');
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef();

    useGSAP(() => {
        gsap.to({ val: 0 }, {
            val: numValue,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ref.current,
                start: "top 90%",
            },
            onUpdate: function() {
                setDisplayValue(Math.floor(this.targets()[0].val));
            }
        });
    }, { scope: ref });

    return (
        <motion.div
            ref={ref}
            className="flex flex-col items-center gap-3 text-center group"
        >
            <div className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none group-hover:scale-110 transition-transform duration-500">
                {displayValue}{suffix}
            </div>
            <div className="space-y-1">
                <span className="block text-[10px] font-black text-milku-accent uppercase tracking-[6px]">{label}</span>
                <span className="block text-[8px] font-bold text-white/60 uppercase tracking-widest">{sublabel}</span>
            </div>
        </motion.div>
    );
};

const LineReveal = ({ children, delay = 0, splashFinished = true }) => (
    <div className="overflow-hidden pb-4 -mb-4">
        <motion.div
            initial={{ y: "100%" }}
            animate={splashFinished ? { y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] }}
        >
            {children}
        </motion.div>
    </div>
);

const About = ({ splashFinished }) => {
    const containerRef = useRef();

    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const dynamicBackground = useTransform(
        scrollYProgress,
        [0, 0.4, 0.8, 1],
        ["#ffffff", "#FDE68A", "#BAE6FD", "#1A237E"] // Seamlessly fade into Navy for the footer
    );

    const CONTENT = {
        hero: "Jay Gayatri Dairy symbolizes purity and trust. We deliver fresh milk directly from farm to families. Our goal is to maintain high quality and natural heritage."
    };

    return (
        <motion.div ref={containerRef} style={{ backgroundColor: dynamicBackground }} className="relative min-h-screen overflow-hidden selection:bg-milku-primary selection:text-white transition-colors duration-200">
            <SEO 
                title="MILKU | Our Legacy"
                description="With a legacy of 30 years, Jay Gayatri Dairy honors the soul of purity. Discover our history of traditional Bilona churning and ethical farming in Mehsana, Gujarat."
                keywords="jay gayatri dairy, bilona ghee unjha, dairy mehsana, dairy heritage gujarat, ethical farming gujarat, pure dairy history, legacy dairy brand"
                canonical="https://milkudairy.com/about"
            />
            <PageReveal splashFinished={splashFinished}>
                <CinematicEnvironment chapter={1} />

            {/* EDITORIAL HERO */}
            <header className="pt-24 pb-6 md:pb-8 px-10 border-b border-slate-50">
                <div className="max-w-[1400px] mx-auto space-y-4 md:space-y-8">
                    <TextReveal splashFinished={splashFinished} className="text-[10px] md:text-[12px] font-black text-milku-primary uppercase tracking-[4px] md:tracking-[10px]">
                        Premium Dairy Heritage
                    </TextReveal>
                    <h1 className="text-[clamp(2.5rem,8vw,8rem)] font-black text-milku-secondary leading-[0.95] max-w-5xl italic">
                        <TextReveal splashFinished={splashFinished}>Honoring the</TextReveal>
                        <TextReveal delay={0.3} splashFinished={splashFinished}>Soul of Purity.</TextReveal>
                    </h1>
                </div>
            </header>

            {/* STORYTELLING SECTION */}
            <ScrollReveal className="max-w-[1400px] mx-auto px-10 pt-12 md:pt-24 pb-8 md:pb-12 grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
                <div className="space-y-8 md:space-y-12">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-xl md:text-5xl font-medium text-slate-500 leading-tight tracking-tight italic"
                    >
                        {CONTENT.hero}
                    </motion.p>

                    <div className="grid md:grid-cols-2 gap-12 pt-10 md:pt-20 border-t border-slate-100">
                        <div className="space-y-4">
                            <TrendingUp size={32} className="text-milku-primary" />
                            <h3 className="text-2xl font-black text-milku-secondary uppercase tracking-tighter">SURAT'S HERITAGE</h3>
                            <p className="text-base text-slate-400 font-medium">Built on the values of honesty and natural well-being for over 3 decades.</p>
                        </div>
                        <div className="space-y-4">
                            <Heart size={32} className="text-milku-primary" />
                            <h3 className="text-2xl font-black text-milku-secondary uppercase tracking-tighter">ETHICAL FARMING</h3>
                            <p className="text-base text-slate-400 font-medium">We treat our cattle as family, ensuring stress-free and pure nourishment.</p>
                        </div>
                    </div>
                </div>

                <div className="image-reveal-mask rounded-[40px] md:rounded-[80px] shadow-6xl border-[15px] border-white/30 backdrop-blur-sm p-10 flex items-center justify-center aspect-square md:aspect-[4/3] max-h-[400px] md:max-h-[600px]">
                    <img
                        src="/media/a2_cow_ghee.png"
                        alt="Heritage"
                        className="w-full h-full object-contain drop-shadow-5xl"
                    />
                </div>
            </ScrollReveal>

            {/* IMPACT SECTION */}
            <ScrollReveal direction="scale" className="px-6 md:px-10 pb-16">
                <div className="max-w-[1500px] mx-auto bg-milku-secondary rounded-[40px] md:rounded-[60px] p-10 md:p-14 relative overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#09122C] to-[#1A237E] opacity-95" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-milku-primary/10 blur-[120px] rounded-full" />
                    
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 items-center">
                        <ImpactCounter value="30+" label="Legacy" sublabel="Years of Trust" />
                        <ImpactCounter value="15K+" label="Families" sublabel="Happy Customers" />
                        <ImpactCounter value="50+" label="Network" sublabel="Dealer Points" />
                        <ImpactCounter value="98%" label="Purity" sublabel="Certified Rating" />
                    </div>
                </div>
            </ScrollReveal>

            {/* PILLARS OF QUALITY */}
            <ScrollReveal className="px-6 md:px-10 pb-20">
                <div className="max-w-[1500px] mx-auto bg-white/5 backdrop-blur-2xl rounded-[40px] md:rounded-[80px] p-12 md:p-20 border border-white/10 shadow-3xl overflow-hidden relative">
                    {/* Decorative glow */}
                    <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-milku-accent/5 blur-[120px] rounded-full" />
                    
                    <div className="relative z-10 space-y-10 md:space-y-16">
                        <div className="text-center space-y-2">
                            <span className="block text-[10px] font-black text-milku-accent uppercase tracking-[8px]">THE MILKU PROMISE</span>
                            <h2 className="text-white text-4xl md:text-6xl font-black italic m-0 leading-none">The Bilona Standard.</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
                            {[
                                { icon: <ShieldCheck />, title: "FSSAI Grade A", desc: "Adhering to the highest safety and hygiene standards." },
                                { icon: <Award />, title: "Ancient Tradition", desc: "Preserving secrets like Bilona churning for authentic nutrition." },
                                { icon: <Zap />, title: "Zero Lag Supply", desc: "From farm to fridge within hours, ensuring maximum freshness." },
                                { icon: <Heart />, title: "Happy Cattle", desc: "Our cattle are raised on 100% natural, pesticide-free fodder." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="space-y-4 md:space-y-8 flex flex-col items-center text-center group"
                                >
                                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 border border-white/10 rounded-[25px] md:rounded-[35px] flex items-center justify-center text-white shadow-xl group-hover:bg-milku-accent group-hover:text-milku-secondary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        {React.cloneElement(item.icon, { size: 28, className: "md:w-9 md:h-9" })}
                                    </div>
                                    <div className="space-y-2 md:space-y-3">
                                        <h3 className="text-sm md:text-xl font-black text-white uppercase tracking-tighter italic">{item.title}</h3>
                                        <p className="text-white/70 text-[10px] md:text-[13px] font-medium leading-relaxed max-w-[140px] md:max-w-[200px]">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollReveal>
            </PageReveal>
        </motion.div>
    );
};

export default About;
