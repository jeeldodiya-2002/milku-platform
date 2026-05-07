import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import { MessageCircle, Check, Zap, ArrowRight, Building2, User, Phone, MapPin, Package, ChevronLeft, ChevronRight, LayoutGrid, Droplet, GlassWater, IceCream, Coffee, Cookie, Cake, Flame, Sparkles, Gift, Archive, CircleDashed, ShieldCheck, Truck, Headset, Clock, Trash2, ShoppingBag } from 'lucide-react';
import PageReveal from '../../components/PageReveal';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import SEO from '../../components/SEO';
import { trackPartnerEnquiry, trackWhatsAppClick } from '../../utils/analytics';

const PRODUCT_FAMILIES = [
    { id: 'buttermilk', name: 'Buttermilk/Chass', icon: GlassWater, color: '#1565C0', items: ['Fresh Chass'], packageType: 'fixed', packages: ['500ml'], unit: 'Packets' },
    { id: 'curd', name: 'Curd/Dahi', icon: CircleDashed, color: '#4CAF50', items: ['Fresh Dahi'], packageType: 'fixed', packages: ['5kg'], unit: 'Buckets' },
    { id: 'paneer', name: 'Paneer', icon: LayoutGrid, color: '#FF9800', items: ['Malai Paneer', 'Medium Fat Paneer', 'Low Fat Soft Paneer', 'Low Fat Hard Paneer'], packageType: 'multi', packages: ['1kg', '5kg'], unit: 'Packets' },
    { id: 'ghee', name: 'Ghee', icon: Droplet, color: '#FFC107', items: ['A2 Desi Cow Ghee', 'Buffalo Ghee'], packageType: 'multi', packages: ['500ml', '1000ml', '5kg', '15kg'], unit: 'Units' },
    { id: 'shrikhand', name: 'Shrikhand', icon: IceCream, color: '#FBC31F', items: ['Mattho', 'Rajbhog', 'Mango', 'American Dry Fruit', 'Kesar Elaichi', 'Elaichi', 'Kaju Draksh', 'Kesar Dry Fruit', 'Badam Pista'], packageType: 'fixed', packages: ['250g', '500g', '1kg'], unit: 'Cups' },
    { id: 'lassi', name: 'Lassi', icon: GlassWater, color: '#D86FA0', items: ['Kesar Dry Fruit', 'Mava', 'Rose', 'Mango', 'Cold Coco'], packageType: 'fixed', packages: ['200ml', '500ml', '1L'], unit: 'Bottles' },
    { id: 'basundi', name: 'Basundi', icon: Coffee, color: '#FF9800', items: ['Plane', 'Kesar Dry Fruit', 'Kesar Angur', 'Anjir', 'Chandni Bahar', 'Sitafal', 'Mango Delight', 'Mango Fruit Plaza'], packageType: 'fixed', packages: ['500g', '1kg'], unit: 'Cups' },
    { id: 'peda', name: 'Penda', icon: Cookie, color: '#E8571A', items: ['White', 'Kesar Elaichi', 'Thabdi', 'Milku Special', 'mix mithai'], packageType: 'fixed', packages: ['250g', '500g', '1kg'], unit: 'Boxes' },
    { id: 'barfi', name: 'Barfi', icon: LayoutGrid, color: '#8B5CF6', items: ['Gulkand', 'Anjir', 'Kalakand', 'Pista', 'Chocolate', 'Kesar', 'Rose', 'Akhrot', 'Compound'], packageType: 'fixed', packages: ['250g', '500g', '1kg'], unit: 'Boxes' },
    { id: 'halwa', name: 'Halwa', icon: Cake, color: '#FBC31F', items: ['Bombay', 'Dry Fruit', 'Dudhi', 'Kaju Akhrot', 'Gajar'], packageType: 'fixed', packages: ['500g', '1kg'], unit: 'Boxes' },
    { id: 'cruz', name: 'Cruz', icon: Sparkles, color: '#EC4899', items: ['Raja Rani', 'Volcano', 'Madhu Malti', 'Red Velvet'], packageType: 'fixed', packages: ['Standard'], unit: 'Units' },
    { id: 'mava', name: 'Mava', icon: Package, color: '#FF9800', items: ['Sweet Mava', 'Molo Mavo', 'Cow Mava', 'Lal Mava'], packageType: 'fixed', packages: ['500g', '1kg'], unit: 'Packets' },
    { id: 'chikki', name: 'Chikki', icon: Cookie, color: '#D86FA0', items: ['Khajur Dry Fruit', 'Anjir Dry Fruit'], packageType: 'fixed', packages: ['250g', '500g'], unit: 'Boxes' },
    { id: 'special', name: 'Special Items', icon: Gift, color: '#F59E0B', items: ['Premium Kaju Katri', 'Mix Dry Fruit Mithai', 'Kesar Kaju Katri', 'Kaju Kasata', 'Kaju Anjir Role', 'Strawberry Kaju Katri', 'Sangam Kaju Katri', 'Cadbury Ball', 'Roasted Almond Ball', 'Orange Bite', 'Blueberry Bite', 'Coconut Ball', 'Kaju Gajar', 'Meva Bite', 'Dry Fruit Laddu (Sugar Free)', 'Kaju Pan', 'Choco Bite'], packageType: 'fixed', packages: ['250g', '500g', '1kg'], unit: 'Boxes' },
];

const ALL_ITEMS = PRODUCT_FAMILIES.flatMap(f => f.items.map(item => ({ 
    id: `${f.id}-${item}`, 
    name: item, 
    categoryId: f.id, 
    category: f.name,
    unit: f.unit || (f.units ? f.units[0] : 'kg'),
    packages: f.packages || [],
    packageType: f.packageType
})));

const BulkOrder = ({ splashFinished }) => {
    const { getWhatsAppLink } = useSettings();
    const [activeCategory, setActiveCategory] = useState('buttermilk');
    const [selectedProducts, setSelectedProducts] = useState([]); // Array of IDs
    const [config, setConfig] = useState({}); // { itemId: { qty, size } }
    const [form, setForm] = useState({ company: '', contact: '', city: '', phone: '', notes: '' });
    
    const [orderId, setOrderId] = useState(() => {
        const ts = Date.now().toString(36).toUpperCase();
        return `MLK-${ts}`;
    });

    // Step Tracking
    const currentStep = useMemo(() => {
        if (selectedProducts.length === 0) return 1;
        if (!form.company || !form.phone) return 2;
        return 3;
    }, [selectedProducts, form]);

    const toggleProduct = (id) => {
        setSelectedProducts(prev => {
            if (prev.includes(id)) {
                const newConfig = { ...config };
                delete newConfig[id];
                setConfig(newConfig);
                return prev.filter(x => x !== id);
            } else {
                const item = ALL_ITEMS.find(p => p.id === id);
                setConfig(prev => ({
                    ...prev,
                    [id]: { 
                        qty: 1, 
                        size: item.packages[0] || 'Standard',
                        unit: item.unit || (item.packageType === 'bulk' ? 'kg' : '') 
                    }
                }));
                return [...prev, id];
            }
        });
    };

    const updateQty = (id, delta) => {
        setConfig(prev => ({
            ...prev,
            [id]: { ...prev[id], qty: Math.max(1, (prev[id]?.qty || 1) + delta) }
        }));
    };

    const updateSize = (id, size) => {
        setConfig(prev => ({
            ...prev,
            [id]: { ...prev[id], size }
        }));
    };

    const updateUnit = (id, unit) => {
        setConfig(prev => ({
            ...prev,
            [id]: { ...prev[id], unit }
        }));
    };

    const getTransmitMessage = () => {
        let msg = `*MILKU B2B ORDER TRANSMISSION*\n`;
        msg += `------------------------------------\n`;
        msg += `*Order ID:* ${orderId}\n`;
        msg += `*Company:* ${form.company}\n`;
        if (form.contact) msg += `*Contact:* ${form.contact}\n`;
        if (form.city) msg += `*City:* ${form.city}\n`;
        if (form.phone) msg += `*WhatsApp:* ${form.phone}\n`;
        msg += `------------------------------------\n\n`;
        msg += `*ORDER DETAILS:*\n\n`;

        // Group selected items by category
        const grouped = {};
        selectedProducts.forEach(id => {
            const item = ALL_ITEMS.find(p => p.id === id);
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push({ ...item, ...config[id] });
        });

        Object.entries(grouped).forEach(([cat, items]) => {
            msg += `*${cat}*\n`;
            items.forEach(item => {
                const sizeInfo = item.size !== 'Standard' ? ` (${item.size})` : '';
                const unitInfo = item.unit ? ` ${item.unit}${item.unit === 'gm' ? ' (×100)' : ''}` : '';
                msg += `  - ${item.name}${sizeInfo} -- Qty: ${item.qty}${unitInfo}\n`;
            });
            msg += '\n';
        });

        msg += `------------------------------------\n`;
        msg += `*Total Items:* ${selectedProducts.length}\n`;
        if (form.notes) msg += `\n*Notes:* ${form.notes}\n`;
        msg += `\nPlease provide the current pricing and availability for the items listed above, along with the estimated delivery timeline for our area.\n`;
        msg += `\nSent via Milku Partner Terminal`;
        return msg;
    };

    const handleTransmit = () => {
        if (selectedProducts.length === 0 || !form.company || !form.phone) return;
        trackPartnerEnquiry(form.company, form.city || 'Unknown');
        window.open(getWhatsAppLink(getTransmitMessage()), '_blank');
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to clear this entire order draft?')) {
            setSelectedProducts([]);
            setConfig({});
            setForm({ company: '', contact: '', city: '', phone: '', notes: '' });
            const ts = Date.now().toString(36).toUpperCase();
            setOrderId(`MLK-${ts}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const dynamicBackground = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1],
        ["#ffffff", "#BFDBFE", "#A7F3D0", "#1A237E", "#1A237E"]
    );

    return (
        <motion.div 
            ref={containerRef}
            style={{ backgroundColor: dynamicBackground }}
            className="relative min-h-screen selection:bg-[#1565C0] selection:text-white"
        >
            {/* BACKGROUND DECORATIONS */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-[#FFF8F0] blur-[100px] opacity-50 animate-pulse" />
                <div className="absolute top-[40%] right-[8%] w-[250px] h-[250px] bg-[#FFF8F0] blur-[100px] opacity-40 animate-pulse" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Cellipse cx=%22100%22 cy=%2280%22 rx=%22180%22 ry=%2218%22 fill=%22none%22 stroke=%22%231565C0%22 stroke-width=%221.5%22 transform=%22rotate(-15 100 80)%22/%3E%3Cellipse cx=%22300%22 cy=%22200%22 rx=%22160%22 ry=%2214%22 fill=%22none%22 stroke=%22%231565C0%22 stroke-width=%221.2%22 transform=%22rotate(10 300 200)%22/%3E%3C/svg%3E')] bg-repeat" />
            </div>

            <SEO 
                title="MILKU | Partner Program"
                description="Milku is Gujarat's trusted B2B dairy supplier. We provide wholesale Paneer, Ghee, and Dahi to top restaurants and hotels with zero-lag daily delivery across Surat."
                keywords="B2B dairy supplier gujarat, restaurant dairy supply surat, bulk paneer supplier gujarat, sweet shop supplier surat, dairy wholesale gujarat, wholesale dahi, fresh paneer delivery surat"
                canonical="https://milkudairy.com/bulk-order"
            />
            <CinematicEnvironment chapter={3} />
            <PageReveal splashFinished={splashFinished}>
                <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pt-32 pb-32">
                    
                    {/* HERO */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
                        <div className="space-y-6 max-w-2xl">
                            <div className="flex items-center gap-4 text-[#1565C0] font-mono text-[10px] uppercase tracking-[6px] font-black">
                                <div className="w-12 h-[2px] bg-[#FFC107]" /> B2B PROCUREMENT TERMINAL
                            </div>
                            <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black text-[#0D1B3E] italic leading-[0.85] uppercase tracking-tighter">
                                Scale <br /><span className="text-[#1565C0]">Together.</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                                Your high-efficiency command center. Configure bulk orders and transmit directly to our team.
                            </p>
                            <div className="flex items-center gap-4 font-mono">
                                <span className="text-3xl md:text-4xl font-black text-[#1565C0]">0{currentStep}</span>
                                <div className="w-[1px] h-8 md:h-10 bg-slate-200" />
                                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Current<br/>Step</span>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col items-end gap-6">
                            <div className="bg-gradient-to-r from-[#1565C0] to-[#1A237E] text-white px-6 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20">
                                ● Live Terminal Active
                            </div>
                            <div className="flex gap-4">
                                {[
                                    { val: '14', label: 'Categories' },
                                    { val: '76', label: 'Products' },
                                    { val: '24/7', label: 'Support' }
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-xl border border-slate-100 p-5 rounded-3xl min-w-[110px] text-center shadow-lg">
                                        <div className="text-3xl font-black text-[#1565C0] leading-none">{s.val}</div>
                                        <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-2">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MAIN TERMINAL */}
                    <div className="bg-white/90 border border-white/50 rounded-[40px] shadow-4xl overflow-hidden min-h-[700px] flex flex-col">
                        
                        {/* Progress Header */}
                        <div className="flex items-center px-10 py-6 border-b border-slate-100 bg-white/40">
                            {[
                                { id: 1, label: 'Select Products' },
                                { id: 2, label: 'Business Details' },
                                { id: 3, label: 'Transmit Order' }
                            ].map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <div className={`flex items-center gap-4 ${currentStep === s.id ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${currentStep >= s.id ? 'bg-[#1565C0] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            {currentStep > s.id ? <Check size={14} /> : `0${s.id}`}
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-widest ${currentStep >= s.id ? 'text-[#1565C0]' : 'text-slate-500'}`}>{s.label}</span>
                                    </div>
                                    {i < 2 && <div className={`flex-grow mx-8 h-[2px] rounded-full ${currentStep > s.id ? 'bg-[#1565C0]' : 'bg-slate-100'}`} />}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-[1fr,360px] flex-grow">
                            
                            {/* LEFT: SELECTION GRID */}
                            <div className="flex flex-col border-r border-slate-100 overflow-hidden">
                                
                                {/* Category Switcher */}
                                <div className="px-8 py-4 border-b border-slate-100 bg-white/30 overflow-x-auto no-scrollbar flex gap-2 will-change-transform translate-z-0">
                                    {PRODUCT_FAMILIES.map(cat => {
                                        const Icon = cat.icon;
                                        const isActive = activeCategory === cat.id;
                                        return (
                                            <button 
                                                key={cat.id}
                                                onClick={() => setActiveCategory(cat.id)}
                                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all whitespace-nowrap relative ${isActive ? 'bg-[#1565C0]/10 text-[#1565C0]' : 'hover:bg-slate-50 text-slate-500'}`}
                                            >
                                                <Icon size={16} className={isActive ? 'text-[#1565C0]' : 'text-slate-500'} />
                                                <span className={`text-[11px] font-black uppercase tracking-wider transition-colors`}>{cat.name}</span>
                                                {isActive && (
                                                    <motion.div layoutId="tabUnderline" className="absolute -bottom-4 left-4 right-4 h-[3px] bg-gradient-to-r from-[#1565C0] to-[#FFC107] rounded-full" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Product Grid */}
                                <div className="p-10 overflow-y-auto max-h-[600px] custom-scrollbar will-change-transform translate-z-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {ALL_ITEMS.filter(p => p.categoryId === activeCategory).map(item => {
                                            const isSelected = selectedProducts.includes(item.id);
                                            const configData = config[item.id] || {};
                                            return (
                                                <motion.div 
                                                    key={item.id}
                                                    whileHover={{ y: -4 }}
                                                    onClick={() => toggleProduct(item.id)}
                                                    className={`group relative p-6 rounded-3xl border-2 transition-all cursor-pointer ${isSelected ? 'border-[#1565C0] bg-[#1565C0]/5 shadow-xl shadow-blue-500/10' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                                                >
                                                    <div className={`absolute top-4 right-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#1565C0] border-[#1565C0] scale-110' : 'border-slate-100 group-hover:border-slate-300'}`}>
                                                        {isSelected && <Check size={16} className="text-white" />}
                                                    </div>
                                                    
                                                    <div className="space-y-4">
                                                        <h4 className={`text-sm font-black uppercase tracking-tight leading-tight pr-8 transition-colors ${isSelected ? 'text-[#1565C0]' : 'text-slate-800'}`}>
                                                            {item.name}
                                                        </h4>

                                                        <AnimatePresence>
                                                            {isSelected && (
                                                                <motion.div 
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: 10 }}
                                                                    className="space-y-4 pt-2"
                                                                    onClick={e => e.stopPropagation()}
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-[#1565C0] hover:text-white transition-all shadow-sm active:scale-90">
                                                                            <span className="font-black text-xl leading-none">−</span>
                                                                        </button>
                                                                        <input 
                                                                            required
                                                                            type="number"
                                                                            min="1"
                                                                            value={configData.qty}
                                                                            onChange={(e) => {
                                                                                const val = parseInt(e.target.value);
                                                                                if (!isNaN(val)) updateQty(item.id, val - configData.qty);
                                                                                else updateQty(item.id, -configData.qty); 
                                                                            }}
                                                                            className="font-mono text-base font-black text-[#1565C0] bg-white border border-slate-200 rounded-xl w-14 h-10 text-center outline-none focus:border-[#1565C0] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
                                                                        />
                                                                        <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-[#1565C0] hover:text-white transition-all shadow-sm active:scale-90">
                                                                            <span className="font-black text-xl leading-none">+</span>
                                                                        </button>
                                                                        {item.packageType === 'bulk' && (
                                                                            <div className="flex flex-col items-end ml-auto gap-1">
                                                                                <div className="flex gap-1">
                                                                                    {(PRODUCT_FAMILIES.find(f => f.id === item.categoryId)?.units || ['kg', 'gm']).map(u => (
                                                                                        <button 
                                                                                            key={u}
                                                                                            onClick={() => updateUnit(item.id, u)}
                                                                                            className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all ${configData.unit === u ? 'bg-[#1565C0] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                                                        >
                                                                                            {u}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                                <span className={`text-[7px] font-bold uppercase tracking-widest ${configData.unit === 'gm' ? 'text-red-500 animate-pulse' : 'text-[#FFC107]'}`}>
                                                                                    {configData.unit === 'gm' ? '× 100g Multiplier' : 'Required Unit'}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {item.packages.length > 0 && (
                                                                        <select 
                                                                            value={configData.size}
                                                                            onChange={(e) => updateSize(item.id, e.target.value)}
                                                                            className="w-full h-10 bg-white border border-slate-100 rounded-xl px-3 font-mono text-[10px] uppercase font-bold outline-none focus:border-[#1565C0]"
                                                                        >
                                                                            {item.packages.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
                                                                        </select>
                                                                    )}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: DIGITAL DRAFT SIDEBAR */}
                            <div id="order-summary-mobile" className="bg-[#0D1B3E] text-white flex flex-col relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#1A237E]/20 to-transparent pointer-events-none" />
                                
                                <div className="p-8 border-b border-white/10 space-y-2 relative z-10">
                                    <div className="text-[#FFC107] font-mono text-[9px] uppercase tracking-[4px] font-black">// Digital Draft</div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Procurement Summary</h3>
                                        <Zap size={18} className="text-[#FFC107] animate-pulse" />
                                    </div>
                                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">ORDER #{orderId}</div>
                                </div>

                                <div className="p-8 space-y-6 border-b border-white/10 relative z-10">
                                    <div className="text-white/30 font-mono text-[9px] uppercase tracking-widest">// Business Credentials</div>
                                    <div className="space-y-3">
                                        <input 
                                            placeholder="Company Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs focus:border-[#FFC107] outline-none transition-all"
                                            value={form.company}
                                            onChange={e => setForm({...form, company: e.target.value})}
                                        />
                                        <input 
                                            placeholder="Contact Person"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs focus:border-[#FFC107] outline-none transition-all"
                                            value={form.contact}
                                            onChange={e => setForm({...form, contact: e.target.value})}
                                        />
                                        <input 
                                            placeholder="City / Area"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs focus:border-[#FFC107] outline-none transition-all"
                                            value={form.city}
                                            onChange={e => setForm({...form, city: e.target.value})}
                                        />
                                        <input 
                                            placeholder="WhatsApp Number"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs focus:border-[#FFC107] outline-none transition-all"
                                            value={form.phone}
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="flex-grow p-8 overflow-y-auto max-h-[350px] custom-scrollbar relative z-10">
                                    {selectedProducts.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4 grayscale">
                                            <Package size={40} />
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Select products to<br/>build your order</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {Object.entries(
                                                selectedProducts.reduce((acc, id) => {
                                                    const item = ALL_ITEMS.find(p => p.id === id);
                                                    if (!acc[item.category]) acc[item.category] = [];
                                                    acc[item.category].push({ ...item, ...config[id] });
                                                    return acc;
                                                }, {})
                                            ).map(([cat, items]) => (
                                                <div key={cat} className="space-y-3">
                                                    <div className="text-[#FFC107]/50 font-mono text-[9px] uppercase tracking-widest">— {cat}</div>
                                                    {items.map(item => (
                                                        <div key={item.id} className="flex justify-between items-start group">
                                                            <div className="flex-grow">
                                                                <div className="text-[11px] font-black uppercase tracking-tight text-white/90">{item.name}</div>
                                                                <div className="text-[9px] font-mono text-white/40 uppercase mt-0.5">{item.size}</div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[#FFC107] font-mono font-black text-xs">
                                                                    ×{item.qty}{item.unit ? ` ${item.unit}` : ''}
                                                                    {item.unit === 'gm' && <span className="text-[8px] opacity-60 ml-1">(×100)</span>}
                                                                </span>
                                                                <button onClick={() => toggleProduct(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 border-top border-white/10 bg-black/20 relative z-10">
                                    <textarea 
                                        placeholder="Additional notes / requirements..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-[10px] h-20 resize-none outline-none focus:border-[#FFC107] transition-all mb-4"
                                        value={form.notes}
                                        onChange={e => setForm({...form, notes: e.target.value})}
                                    />
                                    <div className="flex flex-col gap-3">
                                        <button 
                                            disabled={selectedProducts.length === 0 || !form.company || !form.phone || selectedProducts.some(id => !config[id]?.qty || config[id].qty <= 0)}
                                            onClick={handleTransmit}
                                            className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[4px] shadow-xl shadow-green-500/20 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3"
                                        >
                                            <MessageCircle size={18} /> TRANSMIT ORDER
                                        </button>
                                        <button 
                                            onClick={handleCancel}
                                            className="w-full bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 py-3 rounded-xl font-black text-[9px] uppercase tracking-[3px] transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-red-500/20"
                                        >
                                            <Trash2 size={14} /> CANCEL ORDER
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="bg-white/50 px-10 py-4 flex flex-wrap gap-8 justify-between">
                            {[
                                { icon: ShieldCheck, text: 'Secure B2B Channel' },
                                { icon: Truck, text: 'Daily Fresh Delivery' },
                                { icon: Headset, text: 'Dedicated Manager' },
                                { icon: Clock, text: 'Order by 8PM' }
                            ].map((info, i) => (
                                <div key={i} className="flex items-center gap-2.5 opacity-60">
                                    <info.icon size={14} className="text-[#1565C0]" />
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-800">{info.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-32">
                        <div className="bg-gradient-to-br from-[#1565C0] to-[#0D1B3E] rounded-[50px] p-16 md:p-24 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                                    Join the elite circle <br />of <span className="text-[#FFC107]">Milku Partners.</span>
                                </h2>
                                <p className="text-white/60 font-medium text-lg leading-relaxed">
                                    Scale your business with the consistency and quality of Jay Gayatri's fresh dairy supply.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                    <button 
                                        onClick={() => {
                                            trackWhatsAppClick('B2B Partnership', 'Join Elite Circle CTA');
                                            window.open(getWhatsAppLink("Hello Milku! I am interested in a business partnership."), '_blank');
                                        }}
                                        className="bg-[#25D366] text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[3px] shadow-2xl shadow-green-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                                    >
                                        <MessageCircle size={20} /> WHATSAPP ENQUIRY
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* MOBILE FLOATING SUMMARY BUTTON */}
                <AnimatePresence>
                    {selectedProducts.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="lg:hidden fixed bottom-24 left-4 right-4 z-[999]"
                        >
                            <button 
                                onClick={() => {
                                    const summary = document.getElementById('order-summary-mobile');
                                    if (summary) summary.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full h-14 bg-[#0D1B3E] text-white rounded-2xl shadow-[0_20px_40px_rgba(13,27,62,0.3)] flex items-center justify-between px-5 font-black text-[10px] uppercase tracking-widest border border-white/10 active:scale-95 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-milku-accent/20 flex items-center justify-center">
                                        <ShoppingBag size={16} className="text-[#FFC107]" />
                                    </div>
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[#FFC107] mb-0.5">{selectedProducts.length} Items</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    DRAFT <ArrowRight size={12} />
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </PageReveal>
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(21, 101, 192, 0.1); border-radius: 10px; }
            `}</style>
        </motion.div>
    );
};

export default BulkOrder;
