import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * PageReveal - A premium wrapper for all pages to ensure consistent 
 * "Coming Motion" and synchronization with the SplashScreen.
 */
const PageReveal = ({ children, splashFinished }) => {
    const containerRef = useRef();

    useGSAP(() => {
        // If splash is not finished, we don't start the entrance motion
        if (!splashFinished) return;

        // TARGETS: All direct children (sections, headers, etc.)
        const targets = containerRef.current.children;

        // Hide targets initially with a slight 3D tilt
        gsap.set(targets, { opacity: 0, y: 60, scale: 0.96, rotationX: 10 });

        gsap.to(targets, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            stagger: {
                each: 0.18,
                ease: "power2.out"
            },
            duration: 1.8,
            delay: 0.2, // Tiny delay to allow splash cleanup
            ease: "expo.out",
            clearProps: "all" // Important to let scroll animations take over later
        });

    }, [splashFinished]);

    return (
        <div ref={containerRef} className="relative w-full">
            {children}
        </div>
    );
};

export default PageReveal;
