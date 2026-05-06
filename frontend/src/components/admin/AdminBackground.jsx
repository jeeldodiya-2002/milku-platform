import React, { useRef, useEffect } from 'react';

/**
 * AdminBackground — Premium 3D Neural-Network Canvas Animation
 * Features:
 *   • Floating 3D nodes with simulated depth (z-axis)
 *   • Dynamic edges between nearby nodes with distance-based opacity
 *   • Mouse parallax: camera tilts toward cursor
 *   • Pulsing glow rings on select nodes
 *   • Color theme: deep navy + electric cyan + slate
 *   • Completely different from public site animation
 */
const AdminBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── COLOURS ────────────────────────────────────────────────
    const COLORS = {
      bg: '#F0F4F8',          // light admin background
      nodeCore: '#1E40AF',    // deep blue
      nodeAccent: '#0EA5E9',  // electric cyan
      nodeHot: '#6366F1',     // indigo accent
      edge: '#93C5FD',        // light-blue edge
      glow: '#38BDF8',        // glow ring
    };

    const NODE_COUNT = 60;
    const CONNECTION_DISTANCE = 180;
    const DEPTH_RANGE = 800;

    // ── RESIZE ─────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };

    // ── NODE FACTORY ───────────────────────────────────────────
    const makeNode = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nodeTypes = ['core', 'accent', 'hot'];
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      return {
        x:  Math.random() * w,
        y:  Math.random() * h,
        z:  Math.random() * DEPTH_RANGE,        // 0 = near, DEPTH_RANGE = far
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.6,
        r:  2 + Math.random() * 3,              // base radius
        type,
        pulse: Math.random() * Math.PI * 2,     // phase offset for pulse
        pulseSpeed: 0.015 + Math.random() * 0.02,
        isHub: Math.random() < 0.12,            // ~12% are hubs (larger, more connected)
      };
    };

    const initNodes = () => {
      nodesRef.current = Array.from({ length: NODE_COUNT }, makeNode);
    };

    // ── PROJECTION (z → scale/opacity) ────────────────────────
    const project = (node) => {
      const scale   = 1 - node.z / DEPTH_RANGE * 0.65;
      const opacity = 0.15 + scale * 0.85;
      return { scale, opacity };
    };

    // ── MOUSE ──────────────────────────────────────────────────
    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth  - 0.5;  // -0.5 → 0.5
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── RENDER LOOP ────────────────────────────────────────────
    let isVisible = true;
    const onVisChange = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisChange);

    const draw = () => {
      if (!isVisible) { frameRef.current = requestAnimationFrame(draw); return; }

      const W = window.innerWidth;
      const H = window.innerHeight;
      const mx = mouseRef.current.x;  // parallax offset
      const my = mouseRef.current.y;

      // Clear
      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;

      // ── UPDATE PHYSICS ────────────────────────────────────
      nodes.forEach(n => {
        n.x += n.vx + mx * 0.4;
        n.y += n.vy + my * 0.4;
        n.z += n.vz;
        n.pulse += n.pulseSpeed;

        // Bounce bounds
        if (n.x < -50)   { n.x = W + 50; }
        if (n.x > W + 50) { n.x = -50; }
        if (n.y < -50)   { n.y = H + 50; }
        if (n.y > H + 50) { n.y = -50; }
        if (n.z < 0)         n.vz =  Math.abs(n.vz);
        if (n.z > DEPTH_RANGE) n.vz = -Math.abs(n.vz);
      });

      // ── DRAW EDGES ────────────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist2D = Math.sqrt(dx * dx + dy * dy);
          if (dist2D > CONNECTION_DISTANCE) continue;

          const dz = Math.abs(a.z - b.z);
          if (dz > 300) continue;   // skip nodes too far apart in depth

          const pA = project(a), pB = project(b);
          const avgOpacity = (pA.opacity + pB.opacity) / 2;
          const fadeByDist  = 1 - dist2D / CONNECTION_DISTANCE;

          // Thicker edges for hub nodes
          const isHubEdge = a.isHub || b.isHub;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = COLORS.edge;
          ctx.lineWidth   = isHubEdge ? 1.0 : 0.4;
          ctx.globalAlpha = avgOpacity * fadeByDist * (isHubEdge ? 0.5 : 0.25);
          ctx.stroke();
        }
      }

      // ── DRAW NODES ───────────────────────────────────────
      nodes.forEach(n => {
        const { scale, opacity } = project(n);
        const r = (n.isHub ? n.r * 2.2 : n.r) * scale;
        const color = n.type === 'core'   ? COLORS.nodeCore
                    : n.type === 'accent' ? COLORS.nodeAccent
                    :                       COLORS.nodeHot;

        // -- Glow ring (only hubs + accent nodes)
        if (n.isHub || n.type === 'accent') {
          const glowR = r + 4 + Math.sin(n.pulse) * 3;
          const grad = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, glowR * 2);
          grad.addColorStop(0, color + '55');
          grad.addColorStop(1, color + '00');
          ctx.beginPath();
          ctx.arc(n.x, n.y, glowR * 2, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.globalAlpha = opacity * 0.6;
          ctx.fill();
        }

        // -- Core circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity * (n.isHub ? 0.9 : 0.7);
        ctx.fill();

        // -- Inner white highlight
        ctx.beginPath();
        ctx.arc(n.x - r * 0.25, n.y - r * 0.25, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = opacity * 0.4;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    // ── BOOT ───────────────────────────────────────────────────
    resize();
    initNodes();
    draw();

    const handleResize = () => { resize(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.55 }}
    />
  );
};

export default AdminBackground;
