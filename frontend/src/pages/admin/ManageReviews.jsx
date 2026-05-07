import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, 
    XCircle, 
    Trash2, 
    Star, 
    MessageSquare, 
    User, 
    Clock,
    Search,
    Filter,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminGetPendingReviews, adminApproveReview, adminDeleteReview } from '../../services/api';

const ManageReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const res = await adminGetPendingReviews();
            if (res.data.success) {
                setReviews(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch pending reviews", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            setActionLoading(id);
            const res = await adminApproveReview(id);
            if (res.data.success) {
                setReviews(prev => prev.filter(r => r._id !== id));
            }
        } catch (err) {
            alert("Failed to approve review");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
        try {
            setActionLoading(id);
            const res = await adminDeleteReview(id);
            if (res.data.success) {
                setReviews(prev => prev.filter(r => r._id !== id));
            }
        } catch (err) {
            alert("Failed to delete review");
        } finally {
            setActionLoading(null);
        }
    };

    const filteredReviews = reviews.filter(r => 
        r.reviewerName.toLowerCase().includes(filter.toLowerCase()) || 
        r.reviewText.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 md:px-10">
            <div className="max-w-[1400px] mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <Link to="/admin-milku-secure-9281/dashboard" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-milku-primary hover:text-white transition-all shadow-sm">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-4xl font-black text-milku-secondary uppercase italic tracking-tighter">Review Moderation</h1>
                        </div>
                        <p className="text-slate-500 font-bold italic ml-14">Approve or delete pending customer reviews</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text"
                                placeholder="Search reviews..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-white border border-slate-200 rounded-2xl h-12 pl-12 pr-6 text-sm font-bold text-slate-700 focus:border-milku-primary outline-none transition-all w-[300px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Verification</span>
                        <div className="flex items-center justify-between">
                            <span className="text-4xl font-black text-milku-secondary italic tracking-tighter">{reviews.length}</span>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="animate-spin text-milku-primary" size={40} />
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Loading pending reviews...</span>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="bg-white rounded-[40px] border border-slate-100 border-dashed py-32 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <MessageSquare size={40} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-milku-secondary uppercase italic">Clean Slate!</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">No pending reviews require your attention.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence>
                            {filteredReviews.map((review) => (
                                <motion.div 
                                    key={review._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center relative group"
                                >
                                    <div className="flex gap-6 flex-grow items-start">
                                        <div className="relative">
                                            {review.googleAvatar ? (
                                                <img src={review.googleAvatar} className="w-16 h-16 rounded-2xl shadow-md border-2 border-white" alt="" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <User size={32} />
                                                </div>
                                            )}
                                            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-lg border-2 border-white">
                                                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="white"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/></svg>
                                            </div>
                                        </div>

                                        <div className="space-y-2 flex-grow">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h4 className="text-xl font-black text-milku-secondary uppercase italic tracking-tighter">{review.reviewerName}</h4>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} size={14} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-100"} />
                                                    ))}
                                                </div>
                                                {review.productName && (
                                                    <span className="bg-milku-primary/10 text-milku-primary text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-milku-primary/20">
                                                        {review.productName}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-slate-600 italic leading-relaxed max-w-3xl">
                                                "{review.reviewText}"
                                            </p>
                                            <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(review.submittedAt).toLocaleString()}</span>
                                                <span className="flex items-center gap-1.5"><User size={12} /> {review.googleEmail}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 shrink-0 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-0 border-slate-50">
                                        <button 
                                            disabled={actionLoading === review._id}
                                            onClick={() => handleDelete(review._id)}
                                            className="flex-grow md:flex-none h-14 w-14 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <button 
                                            disabled={actionLoading === review._id}
                                            onClick={() => handleApprove(review._id)}
                                            className="flex-grow md:flex-none h-14 px-8 rounded-2xl bg-green-500 text-white hover:bg-milku-secondary transition-all font-black text-xs uppercase tracking-[2px] flex items-center justify-center gap-3 shadow-xl shadow-green-900/10"
                                        >
                                            {actionLoading === review._id ? <Loader2 className="animate-spin" /> : (
                                                <>
                                                    <CheckCircle2 size={18} /> Approve Review
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageReviews;
