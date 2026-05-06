import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProducts, getCategories, getCustomers } from '../../services/api';
import { 
  Package, 
  Layers,
  Users,
  PlusCircle, 
  ExternalLink,
  Loader2,
  ChevronRight,
  Settings as SettingsIcon,
  RefreshCw,
  Activity,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminBackground from '../../components/admin/AdminBackground';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const ADMIN_PATH = "/admin-milku-secure-9281";
  
  const [stats, setStats] = useState({ totalProducts: 0, totalCategories: 0, totalCustomers: 0 });
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    try {
      const [prodRes, catRes, custRes] = await Promise.all([
        getProducts(), 
        getCategories(),
        getCustomers()
      ]);
      setStats({
        totalProducts: prodRes.data.success ? prodRes.data.data.length : 0,
        totalCategories: catRes.data.success ? catRes.data.data.length : 0,
        totalCustomers: custRes.data.success ? custRes.data.data.length : 0
      });
    } catch (err) {
      console.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20 relative">
      <AdminBackground />
      <AdminNavbar />
      
      <main className="max-w-[1500px] mx-auto px-6 md:px-8 pt-32">
        <div className="max-w-5xl mx-auto space-y-10">
           {/* HEADER AREA */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
              <div>
                 <h1 className="text-3xl md:text-4xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">Management Center</h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Milku Admin Dashboard</p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                 <button 
                   onClick={async () => {
                      setLoading(true);
                      await refreshStats();
                   }}
                   className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-milku-primary hover:text-white transition-all shadow-sm"
                 >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Sync System
                 </button>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Online</span>
                 </div>
              </div>
           </div>

           {loading ? (
              <div className="p-32 flex flex-col items-center gap-4 text-slate-200">
                 <Loader2 className="animate-spin" size={48} />
                 <span className="font-black uppercase tracking-widest text-[10px]">Loading stats...</span>
              </div>
           ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                 {/* STATS GRID */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 group hover:shadow-xl transition-all">
                       <div className="w-12 h-12 bg-blue-50 text-[#1565C0] rounded-xl flex items-center justify-center mb-6"><Package size={24} /></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
                       <h3 className="text-4xl font-black text-[#0D1B3E] tracking-tighter">{stats.totalProducts}</h3>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 group hover:shadow-xl transition-all">
                       <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-6"><Layers size={24} /></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Categories</p>
                       <h3 className="text-4xl font-black text-[#0D1B3E] tracking-tighter">{stats.totalCategories}</h3>
                    </div>
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 group hover:shadow-xl transition-all">
                       <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-6"><Users size={24} /></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Partners</p>
                       <h3 className="text-4xl font-black text-[#0D1B3E] tracking-tighter">{stats.totalCustomers}</h3>
                    </div>
                 </div>

                  {/* MAIN HUB REDIRECTS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                     <button 
                       onClick={() => navigate(`${ADMIN_PATH}/manage-categories`)}
                       className="bg-[#0D1B3E] text-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center justify-between group hover:bg-[#1565C0] transition-all relative overflow-hidden h-[320px]"
                     >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-white/10 transition-all" />
                        <div className="space-y-4 text-center relative z-10">
                           <div className="inline-flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                              <Layers size={14} className="text-[#FFC107]" />
                              <span className="text-[10px] font-black uppercase tracking-[3px]">Catalog Management</span>
                           </div>
                           <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">Manage Store Catalog</h2>
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest max-w-[240px] mx-auto">Access category-specific product management & control</p>
                        </div>
                        <div className="relative z-10">
                           <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#0D1B3E] group-hover:scale-110 transition-all shadow-xl">
                              <ChevronRight size={28} strokeWidth={3} />
                           </div>
                        </div>
                     </button>

                     <button 
                       onClick={() => navigate(`${ADMIN_PATH}/manage-customers`)}
                       className="bg-white text-[#0D1B3E] border-2 border-slate-100 p-10 rounded-[40px] shadow-sm flex flex-col items-center justify-between group hover:border-[#1565C0] hover:shadow-2xl transition-all h-[320px]"
                     >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-blue-500/10 transition-all" />
                        <div className="space-y-4 text-center relative z-10">
                           <div className="inline-flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                              <Users size={14} className="text-[#1565C0]" />
                              <span className="text-[10px] font-black uppercase tracking-[3px] text-[#1565C0]">Network Management</span>
                           </div>
                           <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">Partner Directory</h2>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[240px] mx-auto">Manage establishments, hotels, and restaurants in your network</p>
                        </div>
                        <div className="relative z-10">
                           <div className="w-14 h-14 bg-[#1565C0] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-xl">
                              <ChevronRight size={28} strokeWidth={3} />
                           </div>
                        </div>
                     </button>
                  </div>

                  {/* DIGITAL PERFORMANCE PULSE */}
                  <div className="bg-[#0D1B3E] p-8 md:p-10 rounded-[40px] shadow-2xl flex flex-col justify-between group hover:bg-[#1565C0] transition-all relative overflow-hidden mb-10">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-all" />
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                        <div className="space-y-3">
                           <div className="flex items-center gap-2 text-[#FFC107] font-mono text-[10px] uppercase tracking-[4px] font-black">
                              <Activity size={14} className="animate-pulse" /> Live Tracking Engine Active
                           </div>
                           <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Digital Performance Pulse</h2>
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Measuring high-value B2B conversions and retail engagement</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4">
                           {[
                              { label: 'WA Clicks', status: 'Tracking' },
                              { label: 'B2B Leads', status: 'Tracking' },
                              { label: 'Product Views', status: 'Tracking' }
                           ].map((t, i) => (
                              <div key={i} className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex flex-col items-center min-w-[120px]">
                                 <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{t.label}</span>
                                 <span className="text-[11px] font-black text-[#25D366] uppercase tracking-widest">{t.status}</span>
                              </div>
                           ))}
                           
                           <a 
                              href="https://analytics.google.com/analytics/web/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-white text-[#0D1B3E] px-8 h-16 rounded-2xl flex items-center gap-4 font-black text-[11px] uppercase tracking-[3px] hover:scale-105 active:scale-95 transition-all shadow-xl"
                           >
                              <BarChart3 size={20} /> Open GA4 Console
                           </a>
                        </div>
                     </div>
                  </div>

                  {/* SECONDARY ACTIONS */}
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <button 
                      onClick={() => navigate(`${ADMIN_PATH}/add-product`)}
                      className="bg-white text-[#0D1B3E] p-8 rounded-[32px] shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all"
                    >
                       <div className="space-y-1 text-left">
                          <h4 className="text-lg font-black uppercase italic tracking-tight leading-none">Add Product</h4>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Create New Product</p>
                       </div>
                       <div className="w-12 h-12 bg-[#1565C0] rounded-xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-blue-500/20">
                          <PlusCircle size={24} className="text-white" />
                       </div>
                    </button>

                    <button 
                      onClick={() => navigate(`${ADMIN_PATH}/settings`)}
                      className="bg-white text-[#0D1B3E] p-8 rounded-[32px] shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all"
                    >
                       <div className="space-y-1 text-left">
                          <h4 className="text-lg font-black uppercase italic tracking-tight leading-none">Settings</h4>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">System Configuration</p>
                       </div>
                       <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-slate-900/20">
                          <SettingsIcon size={24} className="text-white" />
                       </div>
                    </button>

                    <a 
                      href="/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-[#1565C0] p-8 rounded-[32px] shadow-sm border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all"
                    >
                       <div className="space-y-1 text-left">
                          <h4 className="text-lg font-black uppercase italic tracking-tight leading-none">View Website</h4>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Site Audit</p>
                       </div>
                       <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all border border-blue-100">
                          <ExternalLink size={24} />
                       </div>
                    </a>
                 </div>
              </motion.div>
           )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
