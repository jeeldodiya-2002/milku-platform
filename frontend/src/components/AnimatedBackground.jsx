import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AnimatedBackground = () => {
    // Harness global scroll for parallax effect on the floating elements
    const { scrollY } = useScroll();
    
    // Parallax mapping: as you scroll down, these background blobs shift vertically
    const y1 = useTransform(scrollY, [0, 3000], [0, 400]);
    const y2 = useTransform(scrollY, [0, 3000], [0, -600]);
    const y3 = useTransform(scrollY, [0, 3000], [0, 350]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none mix-blend-multiply opacity-70">
            {/* Primary Blue Blob - Top Left */}
            <motion.div 
                style={{ y: y1 }}
                animate={{ 
                    rotate: 360, 
                    scale: [1, 1.2, 1],
                    x: [0, 50, -20, 0] 
                }} 
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-15%] w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,150,214,0.06)_0%,transparent_60%)] rounded-[40%]"
            />
            
            {/* Accent Yellow Blob - Middle Right */}
            <motion.div 
                style={{ y: y2 }}
                animate={{ 
                    rotate: -360, 
                    scale: [1, 1.3, 1],
                    x: [0, -60, 30, 0]
                }} 
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] right-[-20%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(255,214,0,0.04)_0%,transparent_60%)] rounded-[35%]"
            />
            
            {/* Soft Secondary Blob - Bottom Center */}
            <motion.div 
                style={{ y: y3 }}
                animate={{ 
                    rotate: 180, 
                    scale: [1, 1.15, 1],
                    x: [0, 40, -40, 0]
                }} 
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-15%] left-[10%] w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,rgba(0,150,214,0.04)_0%,transparent_60%)] rounded-[45%]"
            />
        </div>
    );
};

export default AnimatedBackground;
