import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * TextReveal - Cinematic character-by-character stagger animation
 */
export const TextReveal = ({ children, className, delay = 0, splashFinished = true }) => {
    const ref = useRef();
    useGSAP(() => {
        if (!splashFinished) return;
        const chars = ref.current.querySelectorAll('.char');
        if (!chars.length) return;

        gsap.from(chars, {
            opacity: 0,
            y: 36,
            stagger: 0.045,
            delay,
            duration: 1.0,
            ease: 'power3.out',
        });
    }, { scope: ref, dependencies: [splashFinished, children] });

    if (typeof children !== 'string') return <div className={className}>{children}</div>;

    return (
        <div ref={ref} className={className}>
            {children.split('').map((c, i) => (
                <span key={i} className="char inline-block">{c === ' ' ? '\u00A0' : c}</span>
            ))}
        </div>
    );
};

/**
 * ScrollReveal - Smooth scale and float entrance for sections and components
 */
export const ScrollReveal = ({ children, className, delay = 0, direction = 'up', distance = 40 }) => {
    const ref = useRef();
    
    useGSAP(() => {
        const vars = {
            opacity: 0,
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        };

        if (direction === 'up')    vars.y = distance;
        if (direction === 'down')  vars.y = -distance;
        if (direction === 'left')  vars.x = distance;
        if (direction === 'right') vars.x = -distance;
        if (direction === 'scale') vars.scale = 0.9;

        gsap.from(ref.current, vars);
    }, { scope: ref });

    return (
        <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
            {children}
        </div>
    );
};
