import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

/* Official WhatsApp logo SVG */
const WAIcon = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#25D366" />
        <path
            d="M35.2 12.7C32.5 10 29 8.5 25.2 8.5c-8 0-14.5 6.5-14.5 14.5 0 2.6.7 5.1 2 7.3L10.5 38l8-2.1c2.1 1.1 4.4 1.7 6.8 1.7h.1c8 0 14.5-6.5 14.5-14.5-.1-3.9-1.6-7.5-4.7-10.4zm-10 22.3h-.1c-2.2 0-4.3-.6-6.2-1.7l-.4-.3-4.7 1.2 1.3-4.6-.3-.5c-1.2-2-1.9-4.2-1.9-6.6 0-6.6 5.4-12 12-12 3.2 0 6.2 1.3 8.5 3.5 2.3 2.3 3.5 5.3 3.5 8.5-.1 6.7-5.5 12.1-12 12.5h.3zm6.6-9c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.5-.6c.2-.2.2-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.3 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.2 1.6.2 2.2.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.2-.2-.4-.3-.8-.4z"
            fill="white"
        />
    </svg>
);

const WhatsAppFloatingButton = () => {
    const [open, setOpen] = useState(false);
    const { getWhatsAppLink } = useSettings();

    const generalMsg = 'Hi! I want to enquire about Jay Gayatri Dairy (Milku) products.';
    const whatsappHref = getWhatsAppLink(generalMsg);

    return (
        <div className="fixed bottom-24 right-7 z-[9999] flex flex-col items-end gap-3">

            {/* ── POPUP PANEL ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.94 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="w-[320px] bg-white rounded-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="bg-[#075E54] px-5 py-4 flex items-start gap-4 relative">
                            <div className="flex-shrink-0 mt-0.5">
                                <WAIcon size={36} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white text-[15px] font-semibold leading-tight">Start a Conversation</h3>
                                <p className="text-white/75 text-[12px] mt-0.5 leading-snug">
                                    Hi! Click one of our member below to chat on <strong className="text-white">WhatsApp</strong>
                                </p>
                            </div>
                            <button onClick={() => setOpen(false)} className="flex-shrink-0 text-white/70 hover:text-white transition-colors mt-0.5">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Reply note */}
                        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-100">
                            <p className="text-slate-400 text-[11px]">The team typically replies in a few minutes.</p>
                        </div>

                        {/* Contact row */}
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group"
                        >
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-milku-primary/10 border-2 border-milku-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img src="/logo.svg" alt="Milku" className="w-10 h-10 object-contain" />
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-semibold text-slate-800 leading-none">Jay Gayatri Dairy</p>
                                <p className="text-[12px] text-slate-400 mt-0.5">Milku — Support Team</p>
                            </div>
                            {/* WA icon */}
                            <WAIcon size={28} className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>

                        {/* Footer */}
                        <div className="px-5 py-2.5 bg-white flex items-center justify-center">
                            <p className="text-[10px] text-slate-300 font-medium">Powered by WhatsApp Business</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── FLOATING TRIGGER BUTTON ── */}
            <div className="flex items-center gap-3">
                {/* "Need help?" label — shows when closed */}
                <AnimatePresence>
                    {!open && (
                        <motion.button
                            onClick={() => setOpen(true)}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white border border-slate-200 shadow-lg text-slate-600 text-[12px] font-semibold px-4 py-2.5 rounded-full hover:bg-slate-50 transition-colors whitespace-nowrap"
                        >
                            Need Help? <span className="text-[#25D366] font-bold">Chat with us</span>
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Main circle button */}
                <button
                    onClick={() => setOpen(o => !o)}
                    className="relative w-14 h-14 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center overflow-hidden"
                    aria-label="WhatsApp Chat"
                >
                    {/* Pulse ring when closed */}
                    {!open && (
                        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
                    )}
                    <AnimatePresence mode="wait">
                        {open ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}
                                className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center">
                                <X size={24} className="text-white" />
                            </motion.div>
                        ) : (
                            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <WAIcon size={56} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );
};

export default WhatsAppFloatingButton;
