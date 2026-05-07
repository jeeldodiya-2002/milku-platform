import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { GoogleLogin, googleLogout, useGoogleLogin } from '@react-oauth/google';
import { 
    Star, 
    CheckCircle2, 
    ChevronDown, 
    Send, 
    Loader2, 
    User, 
    MessageSquare, 
    MapPin,
    Quote,
    Plus,
    X,
    LogOut
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getReviews, submitReview, getProducts } from '../../services/api';
import CinematicEnvironment from '../../components/CinematicEnvironment';
import PageReveal from '../../components/PageReveal';
import SEO from '../../components/SEO';
import { TextReveal, ScrollReveal } from '../../components/RevealComponents';
import axios from 'axios';

const RatingBar = ({ rating, count, total, delay }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
        <div className="flex items-center gap-4 group">
            <div className="flex items-center gap-1 w-24 shrink-0">
                <span className="text-xs font-black text-slate-400">{rating}</span>
                <Star size={12} className="fill-amber-400 text-amber-400" />
            </div>
            <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay, ease: "circOut" }}
                    className="h-full bg-amber-400 rounded-full"
                />
            </div>
            <span className="text-[10px] font-bold text-slate-400 w-12 text-right">{count}</span>
        </div>
    );
};

const ReviewCard = ({ review }) => {
    const date = new Date(review.submittedAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative flex flex-col gap-6"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                    <div className="relative">
                        {review.googleAvatar ? (
                            <img src={review.googleAvatar} alt={review.reviewerName} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-milku-primary/10 flex items-center justify-center text-milku-primary font-black text-lg">
                                {review.reviewerName.charAt(0)}
                            </div>
                        )}
                        {review.verified && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white">
                                <CheckCircle2 size={10} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-sm font-black text-milku-secondary flex items-center gap-2 uppercase tracking-tight">
                            {review.reviewerName}
                            {review.googleVerified && (
                                <span className="bg-[#4285F4] text-white text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <svg viewBox="0 0 24 24" className="w-2 h-2 fill-current"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                    Google Verified
                                </span>
                            )}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            {review.googleEmail || review.location} • {date}
                        </span>
                    </div>
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-100"} />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {review.productName && (
                    <span className="inline-block bg-milku-accent/10 text-milku-accent text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-milku-accent/20">
                        {review.productName}
                    </span>
                )}
                <p className="text-slate-600 text-[13px] font-medium leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    "{review.reviewText}"
                </p>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Verified Customer</span>
                </div>
            </div>
        </motion.div>
    );
};

const Reviews = ({ splashFinished }) => {
    const { settings, categories } = useSettings();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [products, setProducts] = useState([]);
    
    // Form State
    const [user, setUser] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        rating: 5,
        reviewText: '',
        productName: '',
        city: '',
        googleToken: ''
    });

    const containerRef = useRef();
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const dynamicBackground = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], ["#ffffff", "#E0F2FE", "#FDF2F8", "#1A237E"]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [revRes, prodRes] = await Promise.all([
                getReviews(1, 6),
                getProducts()
            ]);
            
            if (revRes.data.success) {
                setReviews(revRes.data.data);
                setStats(revRes.data.stats);
                setHasMore(revRes.data.pagination.page < revRes.data.pagination.pages);
            }
            
            if (prodRes.data.success) {
                setProducts(prodRes.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch reviews data", err);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        try {
            const nextPage = page + 1;
            const res = await getReviews(nextPage, 6);
            if (res.data.success) {
                setReviews(prev => [...prev, ...res.data.data]);
                setPage(nextPage);
                setHasMore(res.data.pagination.page < res.data.pagination.pages);
            }
        } catch (err) {}
    };

    const handleGoogleSuccess = async (response) => {
        try {
            setFormLoading(true);
            // Get user info from Google
            const res = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`);
            setUser(res.data);
            setFormData(prev => ({ ...prev, googleToken: response.access_token })); // In a real app, verify ID token on backend
            // Note: The controller expects googleToken. Using access_token here as placeholder logic.
        } catch (err) {
            setFormError("Failed to authenticate with Google");
        } finally {
            setFormLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setFormError("Google Sign-In failed")
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            loginWithGoogle();
            return;
        }

        setFormLoading(true);
        setFormError(null);
        setFormSuccess(false);

        try {
            // Re-verify token logic should be robust. For this implementation:
            const res = await submitReview({
                ...formData,
                googleToken: formData.googleToken, // Backend will verify this
                location: formData.city
            });

            if (res.data.success) {
                setFormSuccess(true);
                setFormData({ rating: 5, reviewText: '', productName: '', city: '', googleToken: formData.googleToken });
                setTimeout(() => setFormSuccess(false), 5000);
            }
        } catch (err) {
            if (err.response?.status === 429) {
                setFormError("Too many submissions. Please wait 24 hours.");
            } else if (err.response?.status === 409) {
                setFormError(err.response.data.message);
            } else {
                setFormError("Failed to submit review. Please try again.");
            }
        } finally {
            setFormLoading(false);
        }
    };

    const ratingLabels = {
        1: "Poor",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Excellent"
    };

    return (
        <motion.div ref={containerRef} style={{ backgroundColor: dynamicBackground }} className="relative min-h-screen selection:bg-milku-primary selection:text-white overflow-hidden transition-colors duration-200">
            <SEO 
                title="MILKU | Customer Voices"
                description="What our family says about Milku Dairy. Real reviews from restaurants, hotels, and families across Gujarat. Share your experience with us."
                keywords="milku reviews, customer feedback, dairy reviews surat, jay gayatri dairy products review"
                canonical="https://milkudairy.com/reviews"
            />
            <PageReveal splashFinished={splashFinished}>
                <CinematicEnvironment chapter={1} />

                {/* SECTION 1: HERO */}
                <header className="relative z-10 pt-32 pb-24 px-6 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="space-y-3">
                            <span className="block text-[10px] md:text-xs font-black text-milku-primary uppercase tracking-[8px] md:tracking-[12px] opacity-80">CUSTOMER VOICES</span>
                            <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black text-milku-secondary tracking-tighter leading-[0.9] italic">
                                What Our Family Says
                            </h1>
                            <p className="text-sm md:text-lg text-slate-500 font-bold italic">
                                30 years of trust, 15,000+ happy families
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-xl p-8 rounded-[40px] border border-white/60 shadow-2xl inline-block mx-auto">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={28} className={s <= Math.round(stats?.averageRating || 4.8) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                                ))}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-black text-milku-secondary italic tracking-tighter">
                                    {(stats?.averageRating || 4.8).toFixed(1)}<span className="text-2xl text-slate-400">/5</span>
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    ({stats?.totalCount || 127} Verified Reviews)
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* SECTION 2: RATING BREAKDOWN */}
                <ScrollReveal className="bg-white/80 backdrop-blur-3xl border-y border-slate-100 py-20 px-6">
                    <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-10">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-milku-secondary uppercase italic tracking-tighter">Rating Breakdown</h2>
                                <div className="w-20 h-1.5 bg-milku-primary rounded-full" />
                            </div>
                            <div className="space-y-4">
                                <RatingBar rating={5} count={stats?.star5 || 89} total={stats?.totalCount || 127} delay={0.1} />
                                <RatingBar rating={4} count={stats?.star4 || 28} total={stats?.totalCount || 127} delay={0.2} />
                                <RatingBar rating={3} count={stats?.star3 || 7} total={stats?.totalCount || 127} delay={0.3} />
                                <RatingBar rating={2} count={stats?.star2 || 2} total={stats?.totalCount || 127} delay={0.4} />
                                <RatingBar rating={1} count={stats?.star1 || 1} total={stats?.totalCount || 127} delay={0.5} />
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 rounded-[60px] border border-white text-center gap-6">
                            <div className="text-8xl font-black text-milku-secondary italic tracking-tighter">
                                {(stats?.averageRating || 4.8).toFixed(1)}<span className="text-4xl text-slate-300">/5</span>
                            </div>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={20} className={s <= Math.round(stats?.averageRating || 4.8) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                                ))}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-milku-secondary uppercase tracking-tight">Based on {stats?.totalCount || 127} verified reviews</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jay Gayatri Dairy Products</p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* SECTION 3: SUBMISSION FORM */}
                <ScrollReveal className="py-24 px-6">
                    <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[0.8fr,1.2fr] gap-16 items-start">
                        {/* LEFT: Branding */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black text-milku-secondary tracking-tighter leading-none italic uppercase">Share Your<br />Experience</h2>
                                <p className="text-slate-500 font-medium text-lg italic leading-relaxed">
                                    Your honest feedback helps us serve Gujarat better every single day.
                                </p>
                            </div>

                            <ul className="space-y-6">
                                {[
                                    "Takes less than 2 minutes",
                                    "Google Sign-in for verification",
                                    "All reviews verified by our team"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-black text-milku-secondary uppercase tracking-tight italic">
                                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="relative pt-12">
                                <Quote className="absolute -top-4 -left-6 text-milku-primary/10" size={120} />
                                <p className="text-3xl font-black text-slate-400 uppercase italic tracking-tighter leading-tight relative z-10">
                                    15,000+ families<br />
                                    <span className="text-milku-primary">trust Milku</span>
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: Form */}
                        <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-milku-primary/5 blur-3xl rounded-full" />
                            
                            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black text-milku-secondary uppercase italic">Your Review</h3>
                                    {user && (
                                        <button 
                                            type="button" 
                                            onClick={() => setUser(null)}
                                            className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 hover:opacity-70"
                                        >
                                            <LogOut size={12} /> Sign Out
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence mode="wait">
                                    {!user ? (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-slate-50 rounded-[32px] p-10 text-center space-y-6 border border-slate-100"
                                        >
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                                                <User size={32} className="text-slate-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-lg font-black text-milku-secondary uppercase italic">Verify Identity</h4>
                                                <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                                                    We use Google Sign-in to ensure all reviews come from real people.
                                                </p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => loginWithGoogle()}
                                                disabled={formLoading}
                                                className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 h-14 rounded-2xl font-black text-sm uppercase tracking-tight flex items-center justify-center gap-4 transition-all shadow-sm"
                                            >
                                                {formLoading ? <Loader2 className="animate-spin" /> : (
                                                    <>
                                                        <svg viewBox="0 0 24 24" className="w-6 h-6"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                                        Continue with Google
                                                    </>
                                                )}
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-8"
                                        >
                                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <img src={user.picture} className="w-10 h-10 rounded-full shadow-sm" alt="" />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-milku-secondary uppercase italic">Reviewing as</span>
                                                    <span className="text-sm font-bold text-slate-500">{user.name}</span>
                                                </div>
                                            </div>

                                            {/* Star Selector */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-milku-secondary uppercase tracking-widest ml-1">Your Rating *</label>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <button 
                                                                key={s} 
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, rating: s })}
                                                                className="transition-transform active:scale-90"
                                                            >
                                                                <Star 
                                                                    size={32} 
                                                                    className={s <= formData.rating ? "fill-amber-400 text-amber-400" : "text-slate-100 hover:text-amber-200"} 
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-black text-amber-500 uppercase italic tracking-tight">{ratingLabels[formData.rating]}</span>
                                                </div>
                                            </div>

                                            {/* Review Textarea */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-milku-secondary uppercase tracking-widest ml-1">Your Review *</label>
                                                <div className="relative">
                                                    <MessageSquare className="absolute right-4 top-4 text-slate-200" size={18} />
                                                    <textarea 
                                                        required 
                                                        rows="4"
                                                        maxLength={300}
                                                        value={formData.reviewText}
                                                        onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                                                        placeholder="Tell us about your experience with Milku products..."
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] p-6 text-sm font-bold text-slate-700 focus:border-milku-primary/30 focus:bg-white outline-none transition-all resize-none"
                                                    />
                                                    <div className="absolute bottom-4 right-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                        {formData.reviewText.length}/300
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Product Dropdown */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-milku-secondary uppercase tracking-widest ml-1">Product <span className="text-slate-400">(Optional)</span></label>
                                                    <div className="relative">
                                                        <select 
                                                            value={formData.productName}
                                                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-12 px-4 text-xs font-bold text-slate-700 appearance-none focus:border-milku-primary/30 outline-none transition-all cursor-pointer"
                                                        >
                                                            <option value="">Select a product — optional</option>
                                                            {products.map(p => (
                                                                <option key={p._id} value={p.name}>{p.name}</option>
                                                            ))}
                                                            <option value="Other">Other</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                                    </div>
                                                </div>

                                                {/* City Field */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-milku-secondary uppercase tracking-widest ml-1">City <span className="text-slate-400">(Optional)</span></label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200" size={14} />
                                                        <input 
                                                            type="text"
                                                            placeholder="Surat, Mehsana, Bardoli..."
                                                            value={formData.city}
                                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-12 pl-10 pr-4 text-xs font-bold text-slate-700 focus:border-milku-primary/30 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                disabled={formLoading}
                                                className="w-full bg-milku-primary hover:bg-milku-secondary text-white h-16 rounded-[24px] font-black text-[11px] uppercase tracking-[4px] shadow-2xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-4 group disabled:opacity-50"
                                            >
                                                {formLoading ? <Loader2 className="animate-spin" /> : (
                                                    <>
                                                        Submit Your Review <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                                * Required fields • Reviews are verified manually before publishing<br />
                                                By submitting, you agree to show your name on our public wall.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Success/Error Messages */}
                                <AnimatePresence>
                                    {formSuccess && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 z-20"
                                        >
                                            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <h4 className="text-2xl font-black text-milku-secondary uppercase italic">Submission Received</h4>
                                            <p className="text-sm font-medium text-slate-500 mt-2">
                                                Thank you! Our quality team is verifying your experience.<br />It will appear on our wall shortly.
                                            </p>
                                        </motion.div>
                                    )}
                                    {formError && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-red-100"
                                        >
                                            <X size={14} /> {formError}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>
                </ScrollReveal>

                {/* SECTION 4: REVIEWS GRID */}
                <section className="bg-white/90 backdrop-blur-xl border-t border-slate-100 py-24 px-6 relative z-10">
                    <div className="max-w-[1400px] mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-5xl font-black text-milku-secondary tracking-tighter uppercase italic leading-none">What Customers Are Saying</h2>
                            <p className="text-slate-500 font-bold italic">Real reviews from restaurants, hotels, and families across Gujarat</p>
                        </div>

                        {loading && page === 1 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className="h-64 bg-slate-50 rounded-[32px] animate-pulse border border-slate-100" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {reviews.map((review, i) => (
                                    <ReviewCard key={review._id || i} review={review} />
                                ))}
                            </div>
                        )}

                        {hasMore && (
                            <div className="flex justify-center pt-12">
                                <button 
                                    onClick={loadMore}
                                    className="bg-white hover:bg-slate-50 text-milku-secondary border-2 border-slate-100 px-12 h-16 rounded-[24px] font-black text-[11px] uppercase tracking-[4px] shadow-xl transition-all flex items-center gap-3"
                                >
                                    Load More Reviews <ChevronDown size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </section>

            </PageReveal>
        </motion.div>
    );
};

export default Reviews;
