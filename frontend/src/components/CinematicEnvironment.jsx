import React, { useRef, useEffect } from 'react';

const CinematicEnvironment = ({ chapter = 0, isMobile = false }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const resizeTimeout = useRef(null);

    // CHAPTER CONFIGURATIONS
    const getChapterTheme = (c) => {
        switch (c) {
            case 1: // Farm Origin
                return { colors: ['#C0DD97', '#FAC775'], drift: 'diagonal' };
            case 2: // Products (Dynamic accents handled by individual product micro-chapters)
                return { colors: ['#FFFFFF'], drift: 'up' };
            case 3: // Bulk / Dealer
                return { colors: ['#2C4B7C'], drift: 'grid' };
            case 4: // Contact
                return { colors: ['#FFFFFF'], drift: 'calm' };
            case 5: // Management (Technical / Admin)
                return { colors: ['#1E293B'], drift: 'technical' };
            default: // Brand Hero / Entrance
                return { colors: [getComputedStyle(document.documentElement).getPropertyValue('--milku-particle-color') || '#0096D6'], drift: 'up' };
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frame;
        let isTabVisible = true;

        const initCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            
            // Initialization of particles
            const count = isMobile ? 20 : 50;
            particlesRef.current = Array.from({ length: count }).map(() => ({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: 2 + Math.random() * 3, // Increased size
                speed: 0.15 + Math.random() * 0.3,
                opacity: 0.2 + Math.random() * 0.4,
                angle: Math.random() * Math.PI * 2
            }));
        };

        const handleVisibility = () => {
            isTabVisible = !document.hidden;
        };

        const handleResize = () => {
            clearTimeout(resizeTimeout.current);
            resizeTimeout.current = setTimeout(initCanvas, 200);
        };

        const render = () => {
            if (!isTabVisible) {
                frame = requestAnimationFrame(render);
                return;
            }

            const theme = getChapterTheme(chapter);
            const w = window.innerWidth;
            const h = window.innerHeight;
            
            // CACHE COLOR ONCE PER FRAME - Move out of loop
            const particleColor = chapter === 5 ? '#334155' : (getComputedStyle(document.documentElement).getPropertyValue('--milku-particle-color') || '#0096D6');

            ctx.clearRect(0, 0, w, h);

            particlesRef.current.forEach((p, i) => {
                // PHYSICS UPDATE
                if (theme.drift === 'diagonal') {
                    p.y -= p.speed * 0.7;
                    p.x += p.speed * 0.4;
                } else if (theme.drift === 'grid') {
                    p.x -= 0.15; // Structured drift
                } else if (theme.drift === 'technical') {
                    p.y += p.speed * 2.5; // Fast vertical data stream
                } else if (theme.drift === 'calm') {
                    p.y -= p.speed * 0.3;
                } else {
                    p.y -= p.speed;
                }

                // BOUNDARY CHECK
                if (p.y < -10) p.y = h + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.x < -10) p.x = w + 10;
                if (p.y > h + 10) p.y = -10;

                // DRAW
                ctx.beginPath();
                ctx.strokeStyle = particleColor;
                ctx.lineWidth = chapter === 5 ? 0.8 : 1.5;
                ctx.globalAlpha = p.opacity;

                if (chapter === 5) {
                    // ADMIN UNIQUE: DIGITAL DATA STREAMS (Vertical Bars)
                    const streamLength = p.size * 15;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + streamLength);
                    ctx.stroke();
                    
                    // Add a tiny glowing tip for data presence
                    ctx.beginPath();
                    ctx.arc(p.x, p.y + streamLength, 1.2, 0, Math.PI * 2);
                    ctx.fillStyle = particleColor;
                    ctx.globalAlpha = p.opacity * 1.5;
                    ctx.fill();
                } else if (i % 3 === 0) {
                    ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    const length = p.size;
                    ctx.moveTo(p.x, p.y - length);
                    ctx.lineTo(p.x, p.y + length);
                    ctx.moveTo(p.x - length, p.y);
                    ctx.lineTo(p.x + length, p.y);
                    ctx.stroke();
                }

                if (i % 8 === 0 && chapter !== 3 && chapter !== 5) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                    ctx.fillStyle = particleColor;
                    ctx.globalAlpha = p.opacity * 0.3;
                    ctx.fill();
                }
            });

            ctx.globalAlpha = 1;
            frame = requestAnimationFrame(render);
        };

        initCanvas();
        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('resize', handleResize);
        render();

        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('resize', handleResize);
        };
    }, [chapter, isMobile]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
    );
};

export default CinematicEnvironment;
