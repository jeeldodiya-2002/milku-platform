import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── LIGHTWEIGHT BACKGROUND BLOBS (CSS only, GPU-only) ───────────────── */
const BgBlobs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,214,0.06)_0%,transparent_60%)]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,0,0.05)_0%,transparent_60%)]" />
        <div className="absolute top-1/2 right-1/3 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,150,214,0.04)_0%,transparent_60%)]" />
    </div>
);

/* ─── MAIN SPLASH SCREEN (FAST 2.2s ENTRANCE) ────────────────────────── */
const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        // Reduced duration for to a snappy 2.2s
        const timer = setTimeout(() => {
            onComplete?.();
        }, 2200);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f8faff 0%, #edf4ff 60%, #fff 100%)' }}
            // Smooth snappy transmission animation to transition to the website
            exit={{ y: '-100%', opacity: 0, borderBottomLeftRadius: '50% 10%', borderBottomRightRadius: '50% 10%', transition: { duration: 0.85, ease: [0.85, 0, 0.15, 1] } }}
        >
            <BgBlobs />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Logo Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,150,214,0.15)] mb-8 overflow-hidden"
                    >
                        <img 
                            src="/logo.jpeg" 
                            alt="Jay Gayatri Dairy" 
                            className="w-48 h-48 md:w-64 md:h-64 object-cover" 
                        />
                    </motion.div>

                    {/* Welcome Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        className="text-center"
                    >
                        <h1 className="text-2xl md:text-3xl font-black text-milku-secondary uppercase tracking-tighter italic leading-none mb-3">
                            Welcome to<br/>
                            <span className="text-milku-primary text-3xl md:text-4xl">Jay Gayatri Dairy</span>
                        </h1>
                        
                        {/* Categories / Short Info */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="flex items-center gap-2 md:gap-3 justify-center text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[4px]"
                        >
                            <span>Ghee</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-milku-accent"></span>
                            <span>Paneer</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-milku-accent"></span>
                            <span>Dahi</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-milku-accent"></span>
                            <span>Chass</span>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
    );
};

export default SplashScreen;
