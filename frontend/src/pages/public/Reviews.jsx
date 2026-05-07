import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Quote, 
    MessageSquare, 
    CheckCircle2, 
    Loader2, 
    ArrowRight, 
    User,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    ShieldCheck
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const RatingBar = ({ rating, count, total, delay = 0 }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex items-center gap-4 group"
        >
            <div className="flex items-center gap-1 w-12 shrink-0">
                <span className="text-[10px] font-black text-milku-secondary uppercase">{rating}</span>
                <Star size={10} className="fill-amber-400 text-amber-400" />
            </div>
            <div className="flex-grow h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: delay + 0.2, ease: "circOut" }}
                    className="h-full bg-amber-400 rounded-full"
                />
            </div>
            <span className="text-[9px] font-black text-slate-300 w-8 shrink-0">{count}</span>
        </motion.div>
    );
};

const ReviewCard = ({ review, index }) => {
    const date = new Date(review.submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative group"
        >
            <div className="absolute top-8 right-10 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Quote size={80} />
            </div>

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-milku-primary/5 flex items-center justify-center text-milku-primary border border-milku-primary/10">
                        <User size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-milku-secondary uppercase italic flex items-center gap-2">
                            {review.reviewerName}
                            {review.verified && (
                                <ShieldCheck size={14} className="text-blue-500" />
                            )}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            {review.googleEmail} • {date}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-4 relative z-10">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-100"} />
                    ))}
                </div>
                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                    "{review.reviewText}"
                </p>
                {review.productName && (
                    <div className="pt-4 flex items-center gap-3">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[2px]">Reviewing:</span>
                        <span className="bg-slate-50 text-milku-primary text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-100 group-hover:bg-milku-primary group-hover:text-white transition-colors duration-300">
                            {review.productName}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });
    
    // Form State
    const [formData, setFormData] = useState({
        reviewerName: '',
        googleEmail: '',
        rating: 5,
        reviewText: '',
        productName: 'General Inquiry',
        city: ''
    });

    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [pagination.page]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/reviews?page=${pagination.page}&limit=6`);
            if (response.data.success) {
                setReviews(response.data.data);
                setStats(response.data.stats);
                setPagination(prev => ({ ...prev, pages: response.data.pagination.pages }));
            }
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        
        if (!formData.reviewerName || !formData.googleEmail || !formData.reviewText) {
            setFormError("Please fill in all required fields.");
            return;
        }

        try {
            setFormLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, formData);
            if (response.data.success) {
                setFormSuccess(true);
                fetchReviews(); // Refresh list
            }
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to submit review");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-outfit overflow-x-hidden">
            <Helmet>
                <title>Customer Voices | Milku Dairy Products</title>
                <meta name="description" content="Read authentic reviews from our community. Real people, real experiences with Milku dairy products." />
            </Helmet>

            <Navbar />

            {/* Cinematic Hero */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-white">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#000_1px,transparent_1px)] bg-[length:40px_40px]" />
                </div>

                <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-milku-primary/5 px-6 py-2 rounded-full border border-milku-primary/10"
                        >
                            <span className="text-[10px] font-black text-milku-primary uppercase tracking-[4px]">Customer Voices</span>
                        </motion.div>
                        
                        <div className="space-y-4">
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-black text-milku-secondary uppercase italic tracking-tighter leading-none"
                            >
                                Shared <span className="text-milku-primary">Experiences.</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-500 font-bold uppercase tracking-widest text-xs"
                            >
                                Your honest feedback drives our commitment to purity<br className="hidden md:block" /> every single day.
                            </motion.p>
                        </div>

                        {/* Summary Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-20 pt-10">
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-black text-milku-secondary italic tracking-tighter">
                                    {(stats?.averageRating || 0).toFixed(1)}<span className="text-2xl text-slate-400">/5</span>
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    ({stats?.totalCount || 0} Verified Reviews)
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="fill-amber-400 text-amber-400" />)}
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Community Choice</span>
                            </div>
                            <div className="hidden md:flex flex-col items-center">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                            <User size={20} className="text-slate-300" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Growing Family</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Layout */}
            <main className="max-w-[1400px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Left Sidebar: Submission Form */}
                    <div className="lg:col-span-5 space-y-8 sticky top-32">
                        <div className="bg-white rounded-[48px] p-10 md:p-14 border border-slate-100 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-milku-primary" />
                            
                            <div className="space-y-10 relative z-10">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-milku-secondary uppercase italic tracking-tighter">Share Your Experience</h3>
                                    <div className="w-20 h-1.5 bg-milku-primary rounded-full" />
                                </div>

                                <div className="space-y-12">
                                    {!formSuccess ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="space-y-10"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Full Name *</label>
                                                    <input 
                                                        type="text"
                                                        placeholder="Your full name"
                                                        value={formData.reviewerName}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, reviewerName: e.target.value }))}
                                                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-slate-700 outline-none focus:border-milku-primary transition-all shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Email Address *</label>
                                                    <input 
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={formData.googleEmail}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, googleEmail: e.target.value }))}
                                                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-slate-700 outline-none focus:border-milku-primary transition-all shadow-inner"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Select Rating *</label>
                                                <div className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                                            className="transition-transform hover:scale-110 active:scale-95"
                                                        >
                                                            <Star 
                                                                size={32} 
                                                                className={star <= formData.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Your Experience *</label>
                                                <textarea 
                                                    rows="5"
                                                    placeholder="Tell us what you liked about our products..."
                                                    value={formData.reviewText}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm font-bold text-slate-700 outline-none focus:border-milku-primary transition-all shadow-inner resize-none"
                                                />
                                            </div>

                                            {formError && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
                                                >
                                                    {formError}
                                                </motion.div>
                                            )}

                                            <button 
                                                onClick={handleSubmit}
                                                disabled={formLoading}
                                                className="w-full h-20 bg-milku-secondary text-white rounded-[24px] font-black text-xs uppercase tracking-[4px] flex items-center justify-center gap-4 hover:bg-milku-primary transition-all shadow-2xl shadow-milku-secondary/20 group"
                                            >
                                                {formLoading ? <Loader2 className="animate-spin" /> : (
                                                    <>
                                                        Publish Review <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                                                * Required fields • Reviews are published instantly<br />
                                                By submitting, you agree to show your name and email on our public wall.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center py-10 text-center"
                                        >
                                            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                                                <CheckCircle2 size={40} />
                                            </div>
                                            <h4 className="text-2xl font-black text-milku-secondary uppercase italic">Review Published!</h4>
                                            <p className="text-sm font-medium text-slate-500 mt-2">
                                                Thank you! Your experience has been shared with the Milku family.<br />It is now visible on our public wall.
                                            </p>
                                            <button 
                                                onClick={() => {
                                                    setFormSuccess(false);
                                                    setFormData({
                                                        reviewerName: '',
                                                        googleEmail: '',
                                                        rating: 5,
                                                        reviewText: '',
                                                        productName: 'General Inquiry',
                                                        city: ''
                                                    });
                                                }}
                                                className="mt-8 text-[10px] font-black text-milku-primary uppercase tracking-[2px] border-b-2 border-milku-primary/20 hover:border-milku-primary transition-all pb-1"
                                            >
                                                Post Another Review
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-milku-secondary uppercase italic tracking-tighter">Community Rating</h4>
                                <div className="w-20 h-1.5 bg-milku-primary rounded-full" />
                            </div>
                            <div className="space-y-4">
                                <RatingBar rating={5} count={stats?.star5 || 0} total={stats?.totalCount || 0} delay={0.1} />
                                <RatingBar rating={4} count={stats?.star4 || 0} total={stats?.totalCount || 0} delay={0.2} />
                                <RatingBar rating={3} count={stats?.star3 || 0} total={stats?.totalCount || 0} delay={0.3} />
                                <RatingBar rating={2} count={stats?.star2 || 0} total={stats?.totalCount || 0} delay={0.4} />
                                <RatingBar rating={1} count={stats?.star1 || 0} total={stats?.totalCount || 0} delay={0.5} />
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Review Feed */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* Feed Filter/Sort (Visual only for now) */}
                        <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-[10px] font-black text-milku-primary uppercase tracking-widest border-b-2 border-milku-primary/20 pb-1">
                                    <Filter size={12} /> Most Recent
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-not-allowed">
                                    <Star size={12} /> Top Rated
                                </div>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search reviews..."
                                    className="h-10 pl-10 pr-6 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-600 outline-none focus:border-milku-primary transition-all w-48"
                                />
                            </div>
                        </div>

                        {/* Review List */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40 gap-4">
                                <Loader2 className="animate-spin text-milku-primary" size={40} />
                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Brewing your feedback...</span>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="bg-white rounded-[48px] py-40 flex flex-col items-center justify-center text-center gap-6 border border-slate-100 border-dashed">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                    <MessageSquare size={40} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black text-milku-secondary uppercase italic tracking-tighter">Be the First!</h4>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your experience matters. Share it with us today.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {reviews.map((review, index) => (
                                        <ReviewCard key={review._id} review={review} index={index} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-center gap-4 pt-10">
                                <button 
                                    disabled={pagination.page === 1}
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-milku-primary hover:text-white transition-all shadow-sm disabled:opacity-30"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="px-8 h-14 rounded-2xl bg-white border border-slate-100 flex items-center text-xs font-black text-milku-secondary uppercase tracking-widest shadow-sm">
                                    Page {pagination.page} of {pagination.pages}
                                </div>
                                <button 
                                    disabled={pagination.page === pagination.pages}
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-milku-primary hover:text-white transition-all shadow-sm disabled:opacity-30"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Reviews;
