import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../../components/SEO';
import { adminLogin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight, Loader2, Lock, Fingerprint, Cpu, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const ADMIN_PATH = "/admin-milku-secure-9281";

  const onLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      const res = await adminLogin(passphrase);
      if (res.data.success) {
        handleLogin(res.data.token, res.data.deviceToken);
        navigate(`${ADMIN_PATH}/dashboard`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification Failed';
      setError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="h-screen h-[100dvh] w-full bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#1565C0] selection:text-white">
      <SEO 
          title="Admin Login | Milku"
          description="Secure administrative access for Milku platform management."
          robots="noindex, nofollow"
      />

      {/* CINEMATIC 3D ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
        {/* Deep Atmospheric Mesh Base */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1565C0_0%,_transparent_70%)]"
        />

        {/* HIGH-DENSITY 3D FLOATING DATA PARTICLES - Enhanced Visibility */}
        {[...Array(100)].map((_, i) => {
          const randomX = Math.random() * 100;
          const randomY = Math.random() * 100;
          return (
            <motion.div
              key={i}
              initial={{ 
                opacity: Math.random() * 1.5 + 1.0, // Increased base opacity
                scale: Math.random() * 0.8 + 0.4,
              }}
              animate={{ 
                y: [0, (Math.random() - 0.5) * 150 + "px"],
                x: [0, (Math.random() - 0.5) * 150 + "px"],
                opacity: [1.0, 2.0, 1.0], // Higher peak opacity
              }}
              transition={{ 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity, 
                ease: "easeInOut",
              }}
              className="absolute w-1.5 h-1.5 bg-[#1565C0] rounded-full" // Slightly larger
              style={{ 
                left: `${randomX}%`,
                top: `${randomY}%`,
                boxShadow: '0 0 15px rgba(0, 60, 127, 1), 0 0 4px rgba(255,255,255,0.4)', // Intense glow
                filter: `blur(${Math.random() * 0.2}px)`,
                zIndex: 0
              }}
            />
          );
        })}

        {/* Dynamic Mesh Orbs - Intense Corner Presence */}
        <motion.div
          animate={{ x: [-200, 200, -200], y: [-100, 100, -100], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-35%] left-[-25%] w-[1200px] h-[1200px] bg-[#1565C0]/15 rounded-full blur-[200px]"
        />
        <motion.div
          animate={{ x: [200, -200, 200], y: [100, -100, 100], scale: [1.3, 1, 1.3] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-35%] right-[-25%] w-[1100px] h-[1100px] bg-[#1565C0]/10 rounded-full blur-[200px]"
        />
        
        {/* Deep Vignette & Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_#020617_90%)]" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      {/* ULTRA-COMPACT SECURITY PILLAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[350px] relative z-10"
      >
        <div className="bg-white/[0.02] backdrop-blur-[60px] border border-white/10 rounded-[40px] p-8 md:p-10 shadow-4xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-[#1565C0]/20 animate-scanline pointer-events-none" />

          {/* LOGO & IDENTITY */}
          <div className="space-y-4 mb-8 w-full flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="absolute -inset-3 bg-[#1565C0] rounded-full blur-2xl opacity-10" />
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden p-0.5">
                <img src="/logo.jpeg" className="w-full h-full object-cover rounded-[14px]" alt="Milku" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#1565C0] text-white p-1 rounded-lg shadow-lg border border-white/10">
                <Fingerprint size={10} />
              </div>
            </motion.div>

            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                Management <span className="text-[#1565C0]">Protocol</span>
              </h1>
            </div>
          </div>

          {/* TERMINAL INTERFACE */}
          <form onSubmit={onLogin} className="w-full space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1 opacity-40">
                <div className="flex items-center gap-1.5">
                  <Cpu size={10} className="text-[#1565C0]" />
                  <label className="text-[7px] font-black text-white uppercase tracking-[0.2em]">Encryption Key</label>
                </div>
                <Lock size={10} className="text-white" />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 px-4 text-white font-black text-center text-base tracking-[0.4em] outline-none transition-all focus:border-[#1565C0] focus:bg-white/[0.05] placeholder:tracking-normal placeholder:text-white/5"
                  required
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center justify-center gap-2 bg-red-500/5 border border-red-500/10 py-2.5 rounded-xl"
                  >
                    <ShieldAlert size={12} className="text-red-500" />
                    <span className="text-red-400 font-black text-[7px] uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full relative group h-14 bg-[#1565C0] rounded-xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <div className="relative flex items-center justify-center gap-3">
                {isLoggingIn ? (
                  <Loader2 className="animate-spin text-white" size={18} />
                ) : (
                  <>
                    <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Initialize Access</span>
                    <ArrowRight size={14} className="text-white group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* INTEGRATED FOOTER */}
          <div className="mt-8 flex flex-col items-center gap-3 w-full opacity-40">
            <p className="text-[7px] font-black text-white uppercase tracking-[0.2em]">Jay Gayatri Core Network</p>
            <button
              onClick={() => navigate('/')}
              className="text-[7px] font-black text-[#FFC107] transition-all uppercase tracking-[0.15em] flex items-center gap-1.5 hover:opacity-100"
            >
              <ShieldCheck size={10} /> Exit to Public
            </button>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes scanline { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scanline { animation: scanline 4s linear infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .group-hover\\:animate-shimmer { animation: shimmer 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminLogin;
