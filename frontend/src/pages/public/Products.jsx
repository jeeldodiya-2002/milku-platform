import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useAnimationFrame } from 'framer-motion';

// ─── INTERACTIVE CATEGORY TICKER ──────────────────────────────────────────────
const InteractiveCategoryTicker = ({ items, activeCategory, onCategoryClick, speed = 0.5 }) => {
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useAnimationFrame((t, delta) => {
    if (!isDragging) {
      const currentX = x.get();
      const contentWidth = contentRef.current?.offsetWidth / 5 || 0;
      if (contentWidth > 0) {
        let nextX = currentX - (isHovered ? 0 : speed);
        if (nextX <= -contentWidth * 3) nextX += contentWidth;
        if (nextX >= -contentWidth) nextX -= contentWidth;
        x.set(nextX);
      }
    }
  });

  const renderSet = (id) => (
    <div key={id} className="flex items-center shrink-0">
      {items.map((cat, idx) => (
        <div key={`${id}-${idx}`} className="flex items-center">
          <button
            onClick={() => onCategoryClick(cat.name.toLowerCase().replace(/[\s\/]+/g, '-'))}
            className={`ticker-item ${activeCategory === cat.name.toLowerCase().replace(/[\s\/]+/g, '-') ? 'active' : ''}`}
          >
            {cat.name}
          </button>
          <span className="ticker-separator">◆</span>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      className="flex w-fit cursor-grab active:cursor-grabbing py-3"
      style={{ x }}
      drag="x"
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={contentRef} className="flex">
        {['s1', 's2', 's3', 's4', 's5'].map(renderSet)}
      </div>
    </motion.div>
  );
};

// ─── INTERACTIVE PRODUCT TICKER ──────────────────────────────────────────────
const InteractiveProductTicker = ({ items, onProductClick, speed = 0.6 }) => {
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useAnimationFrame((t, delta) => {
    if (!isDragging) {
      const currentX = x.get();
      const contentWidth = contentRef.current?.offsetWidth / 5 || 0;
      if (contentWidth > 0) {
        let nextX = currentX - (isHovered ? 0 : speed);
        if (nextX <= -contentWidth * 3) nextX += contentWidth;
        if (nextX >= -contentWidth) nextX -= contentWidth;
        x.set(nextX);
      }
    }
  });

  const renderProductSet = (id) => (
    <div key={id} className="flex shrink-0">
      {items.map((p, i) => {
        const hasImage = !!p.frontImage;
        const rImg = hasImage ? getImageUrl(p.frontImage) : null;
        const rName = p.name || '';
        const config = CATEGORY_UI_CONFIG[p.category] || { icon: Package, color: '#64748B' };
        const Icon = config.icon;

        return (
          <motion.div
            key={`${id}-${p._id}-${i}`}
            whileTap={{ scale: 0.96 }}
            onClick={() => !isDragging && onProductClick(p)}
            className="group/r shrink-0 w-36 cursor-pointer space-y-3 mr-6 transition-transform duration-300"
          >
            <div className="w-36 aspect-[4/3] rounded-[28px] bg-white flex flex-col items-center justify-center p-3 shadow-sm border border-slate-100 transition-all duration-700 overflow-hidden relative">
              {hasImage ? (
                <img src={rImg} alt={rName} crossOrigin="anonymous" className="relative z-10 w-full h-full object-contain" />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-5" style={{ backgroundColor: config.color }} />
                  <Icon size={32} color={config.color} className="opacity-40 mb-2" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center px-2">{p.category}</span>
                </>
              )}
            </div>
            <p className="text-[11px] md:text-xs font-black text-slate-600 capitalize tracking-tight text-center group-hover/r:text-milku-primary transition-colors duration-300 line-clamp-2 leading-tight px-1">{rName}</p>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      className="flex w-fit cursor-grab active:cursor-grabbing pb-4"
      style={{ x }}
      drag="x"
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={contentRef} className="flex">
        {['s1', 's2', 's3', 's4', 's5'].map(renderProductSet)}
      </div>
    </motion.div>
  );
};
import { useSettings } from '../../context/SettingsContext';
import { getProducts, getCategories, getImageUrl } from '../../services/api';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import {
  MessageCircle, ShoppingBag, ShieldCheck, ChevronRight, X, CheckCircle2, Search,
  Star, ArrowRight, Zap, Info, GlassWater, CircleDashed, LayoutGrid, Droplet,
  IceCream, Coffee, Cookie, Cake, Flame, Sparkles, Package, Gift, Archive, Loader2
} from 'lucide-react';
import PageReveal from '../../components/PageReveal';
import { TextReveal, ScrollReveal } from '../../components/RevealComponents';
import SEO from '../../components/SEO';
import { trackProductView, trackWhatsAppClick, trackBrochureRequest } from '../../utils/analytics';
import gsap from 'gsap';

// ─── HELPERS ───────────────────────────────────────────────────────────────
const sortPackageVariants = (variants) => {
  if (!variants || !Array.isArray(variants)) return [];
  return [...variants].sort((a, b) => {
    const parseValue = (s) => {
      const num = parseFloat(s);
      const unit = s.toLowerCase().replace(/[0-9.]/g, '').trim();
      if (unit === 'kg' || unit === 'liter' || unit === 'l') return num * 1000;
      return num; // Default gm
    };
    return parseValue(a) - parseValue(b);
  });
};

// ─── ICON MAPPING ──────────────────────────────────────────────────────────
const CATEGORY_UI_CONFIG = {
  'Buttermilk/Chass': { icon: GlassWater, color: '#0096D6' },
  'Curd/Dahi': { icon: CircleDashed, color: '#4CAF50' },
  'Paneer': { icon: LayoutGrid, color: '#FF9800' },
  'Ghee': { icon: Droplet, color: '#FFC107' },
  'Shrikhand': { icon: IceCream, color: '#FBC31F' },
  'Lassi': { icon: GlassWater, color: '#D86FA0' },
  'Basundi': { icon: Coffee, color: '#FF9800' },
  'Penda': { icon: Cookie, color: '#E8571A' },
  'Barfi': { icon: LayoutGrid, color: '#8B5CF6' },
  'Halwa': { icon: Cake, color: '#FBC31F' },
  'Live Halwa': { icon: Flame, color: '#E8571A' },
  'Cruz': { icon: Sparkles, color: '#1B9FDA' },
  'Mava': { icon: Package, color: '#FF9800' },
  'Chikki': { icon: Cookie, color: '#D86FA0' },
  'Special Items': { icon: Gift, color: '#4CAF50' },
  'Other Items': { icon: Archive, color: '#64748B' }
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const SidebarItem = ({ sub, activeCategory, onCategoryClick }) => {
  const config = CATEGORY_UI_CONFIG[sub.name] || { icon: Package, color: '#64748B' };
  const Icon = config.icon;

  return (
    <motion.button
      onClick={() => onCategoryClick(sub.name.toLowerCase().replace(/[\s\/]+/g, '-'))}
      whileHover={{ x: 4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`nav-sub-item w-full text-left ${activeCategory === sub.name.toLowerCase().replace(/[\s\/]+/g, '-') ? 'active' : ''}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={14} color={config.color} className="transition-transform duration-300 group-hover:scale-110 shrink-0" />
        <span className="truncate">{sub.name}</span>
      </div>
    </motion.button>
  );
};

const ProductListItem = ({ product, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getWhatsAppLink } = useSettings();
  const name = product.name || '';
  const categoryName = product.category || '';

  const isSpecialCategory = categoryName.toLowerCase().includes('special') || categoryName.toLowerCase().includes('other');
  const fullName = isSpecialCategory
    ? name
    : name.toLowerCase().includes(categoryName.toLowerCase())
      ? name
      : `${name} ${categoryName}`;

  const waText = `Hi Milku! I am interested in *${fullName}*. Please share pricing and availability.`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-slate-50 last:border-b-0"
    >
      <div
        className="group flex items-center justify-between py-1 px-3 md:py-1.5 md:px-4 transition-colors duration-300 cursor-pointer relative hover:bg-slate-50/80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-1 h-1 rounded-full transition-colors duration-300 ${isExpanded ? 'bg-milku-primary' : 'bg-slate-200 group-hover:bg-milku-primary'}`}
            animate={{ scale: isExpanded ? 2 : 1 }}
            whileHover={{ scale: 2 }}
          />
          <h3 className={`text-[12px] md:text-[14px] font-bold transition-colors capitalize tracking-tight ${isExpanded ? 'text-milku-primary' : 'text-slate-700 group-hover:text-milku-primary'}`}>
            {name}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {product.specialTag && product.specialTag !== 'None' && (
            <span
              className="text-[6px] font-black uppercase tracking-[1px] px-2 py-0.5 rounded-full text-white bg-milku-primary"
            >
              {product.specialTag}
            </span>
          )}
          <motion.div
            className={`w-6 h-6 rounded-full border border-slate-100 flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-milku-secondary text-white border-milku-secondary' : 'text-slate-100 group-hover:bg-milku-secondary group-hover:text-white group-hover:border-milku-secondary'}`}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <ChevronRight size={10} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-3 md:px-5 md:pb-5 pt-2 flex flex-col gap-4 border-t border-slate-50/50 bg-slate-50/30">
              <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                {product.shortDescription || `Premium quality ${fullName} from Milku Dairy.`}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); window.open(getWhatsAppLink(waText), '_blank'); }}
                  className="bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:shadow-[0_8px_20px_rgba(37,211,102,0.25)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle size={14} /> Enquire Now
                </button>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-milku-primary" /> 100% Pure
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const DairyProductCard = ({ product, index, onClick }) => {
  const name = product.name || '';
  const image = getImageUrl(product.frontImage);
  const sortedSizes = sortPackageVariants(product.availableSizes);
  const size = sortedSizes?.join(' / ') || '';

  const handleClick = () => {
    trackProductView(name, product.category, 'Call for price');
    onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 22 }}
      onClick={handleClick}
      className="group bg-white rounded-[32px] border border-slate-100 shadow-sm lg:hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="aspect-[4/3] bg-white flex items-center justify-center relative overflow-hidden p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-milku-primary/5 to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700" />
        <img
          src={image}
          alt={name}
          crossOrigin="anonymous"
          loading="lazy"
          className="relative z-10 w-full h-full object-contain grayscale-0 md:grayscale md:opacity-80 lg:group-hover:grayscale-0 lg:group-hover:opacity-100 lg:group-hover:scale-105 transition-all duration-700 ease-out"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-black text-milku-secondary lg:group-hover:text-milku-primary transition-colors font-outfit capitalize italic tracking-tighter leading-tight">{name}</h4>
          <span className="text-[10px] font-black text-milku-primary uppercase tracking-widest">{size}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 lg:group-hover:text-milku-primary transition-colors">
          SPECIFICATIONS <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
  );
};

const WhatsAppCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-milku-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-milku-primary/10 transition-colors duration-700" />

      <div className="relative z-10 space-y-3 text-center md:text-left">
        <h3 className="text-3xl font-black text-milku-secondary font-outfit uppercase italic tracking-tighter">Custom Order?</h3>
        <p className="text-base font-medium text-slate-500 font-hind">Connect with our dairy experts for bulk pricing and fresh availability.</p>
      </div>

      <button
        onClick={() => navigate('/bulk-order')}
        className="relative z-10 bg-milku-secondary text-white px-12 h-16 rounded-2xl font-black text-[11px] uppercase tracking-[4px] flex items-center gap-4 hover:bg-milku-primary hover:shadow-[0_20px_40px_rgba(0,150,214,0.3)] hover:-translate-y-1 transition-all duration-500 shrink-0"
      >
        <ShoppingBag size={20} /> OPEN ORDER TERMINAL
      </button>
    </div>
  );
};

const MiniProductAccordion = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const { getWhatsAppLink } = useSettings();

  const waText = `Hi Milku! I am interested in *${product.name}*. Please share pricing and availability.`;

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 flex items-center justify-between text-left group"
      >
        <span className={`text-[11px] font-semibold transition-colors line-clamp-1 pr-2 ${expanded ? 'text-milku-primary' : 'text-slate-600 group-hover:text-milku-primary'}`}>
          {product.name}
        </span>
        <ChevronRight size={12} className={`transition-transform duration-300 shrink-0 ${expanded ? 'rotate-90 text-milku-primary' : 'text-slate-400 group-hover:text-milku-primary'}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-3 flex flex-col gap-2">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                {product.shortDescription || `Premium quality ${product.name}.`}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(getWhatsAppLink(waText), '_blank'); }}
                className="self-start bg-[#25D366] hover:bg-[#1DA851] text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <MessageCircle size={12} /> Enquire
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FloatingBadge = ({ text, delay = 0, initialPos }) => (
  <motion.div
    initial={{ opacity: 0, ...initialPos }}
    animate={{
      opacity: 1,
      y: [initialPos.y - 10, initialPos.y + 10, initialPos.y - 10],
      x: [initialPos.x - 5, initialPos.x + 5, initialPos.x - 5]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay
    }}
    className="absolute z-20 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 text-[8px] font-black text-milku-primary uppercase tracking-[2px] whitespace-nowrap"
  >
    {text}
  </motion.div>
);

// ─── PRODUCT DETAIL MODAL ───────────────────────────────────────────────────

const ProductDetailModal = ({ item, category, isOpen, onClose, setSelectedItem, allProducts }) => {
  const [, setSearchParams] = useSearchParams();
  const { getWhatsAppLink } = useSettings();
  const modalRef = useRef(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIdx(0); // Reset index when opening modal

      // AUTO-PLAY SLIDESHOW LOGIC
      if (item?.images && item.images.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIdx(prev => (prev + 1) % item.images.length);
        }, 3500); // 3.5s per slide
        return () => clearInterval(interval);
      }
    }

    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current.querySelectorAll('.reveal-text'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out', delay: 0.2 }
      );
    }
  }, [isOpen, item]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const [relatedTickerPaused, setRelatedTickerPaused] = useState(false);
  const relatedPauseTimerRef = useRef(null);

  if (!item) return null;

  const name = item.name || '';
  const image = getImageUrl(item.frontImage);
  const displayCategory = item.category || '';

  const waText = `Hi Milku! I'm interested in *${name}* from the ${displayCategory} collection. Please share pricing and availability.`;

  // 1. Image Products (Main Products)
  const relatedImageProducts = allProducts.filter(p => p.name !== name && p.frontImage).sort(() => Math.random() - 0.5);

  // 2. Other Categories
  const availableCategories = [...new Set(allProducts.filter(p => !p.frontImage).map(p => p.category))].filter(c => c !== displayCategory);
  const selectedCategories = [...availableCategories].sort(() => Math.random() - 0.5).slice(0, 4);

  const renderRelatedProduct = (p, idx) => {
    const hasImage = !!p.frontImage;
    const rImg = hasImage ? getImageUrl(p.frontImage) : null;
    const rName = p.name || '';
    const config = CATEGORY_UI_CONFIG[p.category] || { icon: Package, color: '#64748B' };
    const Icon = config.icon;

    return (
      <motion.div
        key={`${p._id}-${idx}`}
        whileTap={{ scale: 0.96 }}
        onClick={() => setSelectedItem(p)}
        className="group/r shrink-0 w-36 cursor-pointer space-y-3 mr-6 md:mr-0 transition-transform duration-300"
      >
        <div className="w-36 aspect-[4/3] rounded-[28px] bg-white flex flex-col items-center justify-center p-3 shadow-sm border border-slate-100 transition-all duration-700 overflow-hidden relative">
          {hasImage ? (
            <img src={rImg} alt={rName} crossOrigin="anonymous" className="relative z-10 w-full h-full object-contain" />
          ) : (
            <>
              <div className="absolute inset-0 opacity-5" style={{ backgroundColor: config.color }} />
              <Icon size={32} color={config.color} className="opacity-40 mb-2" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center px-2">{p.category}</span>
            </>
          )}
        </div>
        <p className="text-[11px] md:text-xs font-black text-slate-600 capitalize tracking-tight text-center group-hover/r:text-milku-primary transition-colors duration-300 line-clamp-2 leading-tight px-1">{rName}</p>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[10000] bg-white overflow-y-auto"
        >
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-milku-primary hover:bg-slate-50 transition-colors shadow-xl"
          >
            <X size={22} />
          </motion.button>

          <div ref={modalRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={name}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onAnimationStart={() => {
                  const modal = document.querySelector('.fixed.inset-0.z-\\[10000\\]');
                  if (modal) modal.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                <div className={`flex flex-col ${image ? 'md:flex-row' : ''}`}>
                  {image && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                      className="md:w-1/2 md:sticky md:top-0 md:h-screen flex items-center justify-center p-6 md:p-10 relative overflow-hidden bg-[#f8fbfe]"
                    >
                      {/* Live Background Blobs */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 90, 0],
                          x: [-20, 20, -20],
                          y: [-20, 20, -20]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
                        style={{ background: 'radial-gradient(circle, #0096D6 0%, transparent 70%)' }}
                      />
                      <motion.div
                        animate={{
                          scale: [1.2, 1, 1.2],
                          rotate: [0, -90, 0],
                          x: [20, -20, 20],
                          y: [20, -20, 20]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
                        style={{ background: 'radial-gradient(circle, #FF9800 0%, transparent 70%)' }}
                      />

                      {/* Floating Badges */}
                      <FloatingBadge text="100% Pure Dairy" delay={0} initialPos={{ top: '15%', left: '15%' }} />
                      <FloatingBadge text="Fresh Collection" delay={1} initialPos={{ bottom: '20%', right: '15%' }} />
                      <FloatingBadge text="Artisan Quality" delay={2} initialPos={{ top: '25%', right: '10%' }} />

                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {item.images && item.images.length > 1 ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={currentImageIdx}
                                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                src={getImageUrl(item.images[currentImageIdx])}
                                alt={name}
                                crossOrigin="anonymous"
                                className="object-contain drop-shadow-2xl rounded-3xl"
                                style={{ maxWidth: '80%', maxHeight: '55vh' }}
                              />
                            </AnimatePresence>

                            <div className="flex gap-3">
                              {item.images.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentImageIdx(i)}
                                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i === currentImageIdx ? 'bg-milku-primary w-8' : 'bg-slate-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <motion.img
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
                            src={image}
                            alt={name}
                            crossOrigin="anonymous"
                            className="object-contain drop-shadow-2xl rounded-3xl"
                            style={{ maxWidth: '80%', maxHeight: '60vh' }}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                    className={`${image ? 'md:w-1/2' : 'max-w-3xl mx-auto w-full'} flex flex-col justify-center p-10 md:p-14 space-y-8`}
                  >
                    <div className="space-y-3">
                      <span className="text-sm font-black text-milku-primary uppercase tracking-widest reveal-text block">{displayCategory}</span>
                      <h1 className="text-5xl md:text-6xl font-black text-milku-secondary italic tracking-tighter leading-none font-outfit capitalize reveal-text">{name}</h1>
                    </div>

                    <div className="flex flex-wrap gap-3 reveal-text">
                      <span className="px-4 py-2 rounded-xl bg-milku-primary/8 text-milku-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} /> 100% Pure
                      </span>
                      <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag size={14} /> {item.availableSizes?.length > 0 ? sortPackageVariants(item.availableSizes).join(', ') : 'Standard Pack'}
                      </span>
                    </div>

                    <div className="space-y-4 reveal-text">
                      <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-milku-primary/10 flex items-center justify-center text-milku-primary shrink-0"><ShieldCheck size={20} /></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Product Info</p>
                          <p className="text-sm font-medium text-slate-500">{item.shortDescription || "Authentic quality products crafted with traditional methods."}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        trackWhatsAppClick(name, 'Product Detail Modal');
                        window.open(getWhatsAppLink(waText), '_blank');
                      }}
                      className="w-full h-16 rounded-2xl bg-[#25D366] text-white flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[5px] shadow-[0_15px_40px_rgba(37,211,102,0.2)] hover:scale-[1.02] active:scale-95 transition-all duration-500 group reveal-text"
                    >
                      <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" /> ENQUIRE ON WHATSAPP
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {(relatedImageProducts.length > 0 || selectedCategories.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="border-t border-slate-100 bg-slate-50/50 px-8 md:px-12 py-8 overflow-hidden"
              >
                {relatedImageProducts.length > 0 && (
                  <div className="mb-10">
                    <div className="flex items-center gap-4 mb-7">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[6px] whitespace-nowrap">Explore Other Products</span>
                      <div className="flex-1 h-[1px] bg-slate-200" />
                    </div>

                    <div
                      className="w-full overflow-hidden"
                    >
                      <div className="w-fit">
                        <InteractiveProductTicker 
                          items={relatedImageProducts} 
                          onProductClick={(p) => setSelectedItem(p)}
                          speed={0.7}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedCategories.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-7">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[6px] whitespace-nowrap">Explore Categories</span>
                      <div className="flex-1 h-[1px] bg-slate-200" />
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {availableCategories.map((cat, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onClose();
                            setSearchParams({ category: cat.toLowerCase().replace(/[\s\/]+/g, '-') });
                          }}
                          className="text-[11px] font-bold text-slate-500 hover:text-milku-primary transition-colors flex items-center gap-1.5 uppercase tracking-widest group"
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-milku-primary transition-colors" />
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const Products = ({ splashFinished }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')?.toLowerCase().replace(/[\s\/]+/g, '-');
  const [activeCategory, setActiveCategory] = useState(categoryParam || '');

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showPricingNotice, setShowPricingNotice] = useState(false);
  const { getWhatsAppLink } = useSettings(); const contentRef = useRef(null);
  const [tickerPaused, setTickerPaused] = useState(false);
  const pauseTimerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([getCategories(), getProducts()]);
        if (catRes.data.success) {
          const fetchedCats = catRes.data.data.sort((a, b) => {
            const getName = (cat) => (cat.name || '').toLowerCase().trim();
            const nameA = getName(a);
            const nameB = getName(b);

            const getRank = (cat) => {
              const name = getName(cat);
              if (name === 'other items') return 3;
              if (name === 'special items') return 2;
              if (cat.isMain) return 0;
              return 1;
            };

            const rankA = getRank(a);
            const rankB = getRank(b);

            if (rankA !== rankB) return rankA - rankB;
            return nameA.localeCompare(nameB);
          });
          setCategories(fetchedCats);
          if (!categoryParam && fetchedCats.length > 0) {
            setActiveCategory(fetchedCats[0].name.toLowerCase().replace(/[\s\/]+/g, '-'));
          }
        }
        if (prodRes.data.success) setProducts(prodRes.data.data);
      } catch (err) {
        console.error("Failed to fetch shop data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  useEffect(() => {
    const lastShown = localStorage.getItem('milku_pricing_notice_time');
    const now = new Date().getTime();
    if (!lastShown || now - parseInt(lastShown, 10) > 900000) {
      const timer = setTimeout(() => setShowPricingNotice(true), 2000);
      localStorage.setItem('milku_pricing_notice_time', now.toString());
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setSearchParams({ category: id });
  };


  const getActiveCategoryTitle = () => {
    const cat = categories.find(c => c.name.toLowerCase().replace(/[\s\/]+/g, '-') === activeCategory);
    return cat ? cat.name : '';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-milku-primary" size={48} />
    </div>
  );

  return (
    <motion.div className="selection:bg-milku-primary selection:text-white">
      <SEO
        title="MILKU | Jay Gayatri Dairy Products"
        description="Explore our FSSAI certified dairy range. From hand-churned Bilona Ghee to creamy Malai Paneer and probiotic Dahi. Premium quality for families and B2B partners in Surat."
        keywords="fresh paneer surat, A2 ghee gujarat, malai paneer wholesale, buffalo ghee gujarat, shrikhand surat, basundi supplier gujarat, dairy products mehsana gujarat, A2 desi cow ghee supplier"
        canonical="https://milkudairy.com/products"
      />
      <PageReveal splashFinished={splashFinished}>
        <CinematicEnvironment chapter={2} />

        <div className="products-layout">
          <div className="side-nav-container shrink-0 z-30 relative bg-white/80 backdrop-blur-3xl border-r border-milku-primary/10 shadow-[4px_0_30px_rgba(0,0,0,0.02)]">
            <div className="side-nav-panel">
              <div className="mb-6 space-y-1">
                <TextReveal splashFinished={splashFinished} className="text-sm font-black text-milku-primary uppercase tracking-widest block opacity-80">Discovery</TextReveal>
                <TextReveal splashFinished={splashFinished} delay={0.2} className="text-xl font-black text-milku-secondary uppercase tracking-wide font-outfit">Product Hub</TextReveal>
              </div>

              <div className="flex-1 space-y-1">
                {categories.map(cat => (
                  <SidebarItem key={cat._id} sub={cat} activeCategory={activeCategory} onCategoryClick={handleCategoryChange} />
                ))}
              </div>
            </div>
          </div>

          <ScrollReveal className="main-content-area flex-1">
            {/* MOBILE TICKER - HIDDEN ON DESKTOP/TABLET (MD+) */}
            <div className="md:hidden sticky top-[var(--header-height)] z-40 bg-white border-b border-milku-primary/10 overflow-hidden">
              <InteractiveCategoryTicker 
                items={categories} 
                activeCategory={activeCategory} 
                onCategoryClick={handleCategoryChange} 
                speed={0.4}
              />
            </div>

            <div className="max-w-[1000px] mx-auto px-4 md:px-12 pt-4 md:pt-6 pb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                  {(() => {
                    const activeCatObj = categories.find(c => c.name.toLowerCase().replace(/[\s\/]+/g, '-') === activeCategory);
                    const isMainView = activeCatObj?.isMain;

                    if (isMainView) {
                      return (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {products.filter(p => p.category.toLowerCase().replace(/[\s\/]+/g, '-') === activeCategory).map((p, i) => (
                              <DairyProductCard key={p._id} product={p} index={i} onClick={() => setSelectedItem(p)} />
                            ))}
                          </div>
                          <WhatsAppCTA category={getActiveCategoryTitle()} />
                        </div>
                      );
                    } else {
                      return (
                        <div className="space-y-6">
                          <div className="flex flex-col gap-4 mb-4">
                            <div className="h-[2px] w-12 bg-milku-primary/30" />
                            <div className="text-sm font-black text-milku-secondary uppercase tracking-widest">{getActiveCategoryTitle()}</div>
                          </div>
                          <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-lg">
                            <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-slate-50">
                              {products.filter(p => p.category.toLowerCase().replace(/[\s\/]+/g, '-') === activeCategory).map((p, idx) => (
                                <ProductListItem key={p._id} product={p} index={idx} />
                              ))}
                            </div>
                          </div>
                          <WhatsAppCTA category={getActiveCategoryTitle()} />
                        </div>
                      );
                    }
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollReveal>

          <ProductDetailModal
            item={selectedItem}
            category={getActiveCategoryTitle()}
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            allProducts={products}
          />

          <AnimatePresence>
            {showPricingNotice && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPricingNotice(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[95]" />
                <motion.div
                  initial={{ opacity: 0, y: 20, x: "-50%", scale: 0.95 }}
                  animate={{ opacity: 1, y: "-50%", x: "-50%", scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
                  className="fixed top-1/2 left-1/2 z-[100] bg-white p-6 rounded-[24px] shadow-2xl border border-slate-100 w-[90%] md:w-[420px] flex flex-col md:flex-row items-start gap-5"
                >
                  <div className="bg-milku-primary/10 p-3.5 rounded-full shrink-0"><Info className="text-milku-primary" size={28} /></div>
                  <div className="flex-1 w-full">
                    <h4 className="text-sm font-black text-milku-secondary uppercase tracking-widest mb-2">Pricing Notice</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">Due to daily market variations in pure milk, prices are dynamic. Please contact us directly for today's pricing.</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowPricingNotice(false)} className="flex-1 bg-slate-100 text-slate-600 text-[11px] font-black uppercase py-3 rounded-xl">Close</button>
                      <button onClick={() => { window.open(getWhatsAppLink('Hi Milku, please share today\'s pricing list!'), '_blank'); setShowPricingNotice(false); }} className="flex-[2] bg-milku-primary text-white text-[11px] font-black uppercase py-3 rounded-xl flex items-center justify-center gap-2">
                        <MessageCircle size={14} /> Get Price
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </PageReveal>
    </motion.div>
  );
};

export default Products;
