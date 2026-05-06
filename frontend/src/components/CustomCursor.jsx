import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor = () => {
    const primaryRef = useRef(null);
    const secondaryRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    // Physics state
    const mouse = useRef({ x: 0, y: 0 });
    const secondary = useRef({ x: 0, y: 0 });
    const lerpAmount = 0.12;

    useEffect(() => {
        // HIDDEN CURSOR ON ROOT
        document.documentElement.style.cursor = 'none';
        
        const moveCursor = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            setIsVisible(true);
            
            // PRIMARY: Zero delay update
            if (primaryRef.current) {
                primaryRef.current.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0)`;
            }
        };

        const handleHover = (e) => {
            const isInteractive = e.target.closest('button, a, .clickable, input, select, [role="button"]');
            setIsHovering(!!isInteractive);
        };

        const animate = () => {
            // SECONDARY: Lerp physics (0.12)
            secondary.current.x += (mouse.current.x - secondary.current.x) * lerpAmount;
            secondary.current.y += (mouse.current.y - secondary.current.y) * lerpAmount;

            if (secondaryRef.current) {
                secondaryRef.current.style.transform = `translate3d(${secondary.current.x - 17.5}px, ${secondary.current.y - 17.5}px, 0)`;
            }
            requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover);
        const raf = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
            cancelAnimationFrame(raf);
        };
    }, []);

    // HIDE ON MOBILE
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        document.documentElement.style.cursor = 'auto';
        return null;
    }

    return (
        <div className={`fixed inset-0 pointer-events-none z-[100000] overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            {/* OUTER: 36px (56px hover), blue border, multiply blend */}
            <div 
                ref={secondaryRef}
                className="fixed rounded-full border-2 transition-[width,height,background-color] duration-300 ease-out"
                style={{ 
                    width: isHovering ? 56 : 36,
                    height: isHovering ? 56 : 36,
                    left: 0,
                    top: 0,
                    borderColor: '#1565C0',
                    backgroundColor: isHovering ? 'rgba(21, 101, 192, 0.08)' : 'transparent',
                    mixBlendMode: 'multiply',
                    willChange: 'transform'
                }}
            />

            {/* INNER: 8px, accent yellow background */}
            <div 
                ref={primaryRef}
                className="fixed w-2 h-2 bg-[#FFC107] rounded-full"
                style={{ 
                    left: 0,
                    top: 0,
                    willChange: 'transform'
                }}
            />
        </div>
    );
};

export default CustomCursor;
