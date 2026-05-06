import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct, deleteProduct, getImageUrl } from '../../services/api';
import { 
  ArrowLeft, Search, Edit2, Trash2, Loader2, AlertTriangle, Package, RefreshCw,
  PlusCircle, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminBackground from '../../components/admin/AdminBackground';

const ManageProducts = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const ADMIN_PATH = "/admin-milku-secure-9281";

  // Security Lock
  useEffect(() => {
    if (!authLoading && !isAdmin) navigate(`${ADMIN_PATH}/login`);
  }, [isAdmin, authLoading, navigate]);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (product) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const res = await updateProduct(product._id, { isActive: !product.isActive });
      if (res.data.success) {
        setProducts(products.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p));
      }
    } catch (err) {
      alert("Status update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const res = await deleteProduct(deleteId);
      if (res.data.success) {
        setProducts(products.filter(p => p._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      alert("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term);
    const catMatch = categoryFilter === 'all' || p.category === categoryFilter;
    return nameMatch && catMatch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <AdminNavbar />

      <main className="max-w-[1500px] mx-auto px-6 md:px-8 pt-32">
        <div className="max-w-6xl mx-auto space-y-8">
           {/* HEADER AREA */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="flex items-center gap-6">
                 <button onClick={() => navigate(-1)} className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#1565C0] transition-all shadow-sm">
                    <ArrowLeft size={18} />
                 </button>
                 <div>
                    <h1 className="text-3xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">Catalog Hub</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Inventory Management Terminal</p>
                 </div>
              </div>
              <button 
                onClick={() => navigate(`${ADMIN_PATH}/add-product`)}
                className="bg-[#1565C0] text-white px-6 py-3.5 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10 hover:bg-[#0D1B3E] transition-all justify-center"
              >
                <PlusCircle size={18} /> Add Product
              </button>
           </div>

           {/* SEARCH & FILTERS */}
           <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative group w-full lg:w-96">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1565C0] transition-colors" size={18} />
                 <input 
                   type="text" 
                   placeholder="Search nodes by identity..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-[#F8FAFC] border border-slate-100 rounded-xl py-3.5 pl-12 pr-6 text-xs font-bold text-[#0D1B3E] focus:border-[#1565C0] outline-none transition-all"
                 />
              </div>
              
              <div className="flex items-center gap-3 w-full lg:w-auto">
                 <div className="flex-grow lg:flex-grow-0 flex items-center gap-2 bg-[#F8FAFC] px-5 py-3 rounded-xl border border-slate-100">
                    <Filter size={14} className="text-slate-400" />
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none w-full"
                    >
                       <option value="all">All Clusters</option>
                       <option value="chaas">Chaas</option>
                       <option value="paneer">Paneer</option>
                       <option value="dahi">Dahi</option>
                       <option value="ghee">Ghee</option>
                    </select>
                 </div>
                 <button 
                   onClick={fetchProducts} 
                   className={`p-3.5 bg-white rounded-xl text-slate-400 hover:text-[#1565C0] border border-slate-100 transition-all shadow-sm ${loading ? 'animate-spin' : ''}`}
                 >
                    <RefreshCw size={18} />
                 </button>
              </div>
           </div>

           {/* LIST AREA */}
           <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
              {loading ? (
                 <div className="p-32 flex flex-col items-center gap-4 text-slate-200">
                    <Loader2 className="animate-spin" size={48} />
                    <span className="font-black uppercase tracking-widest text-[10px]">Retrieving...</span>
                 </div>
              ) : filteredProducts.length === 0 ? (
                 <div className="p-32 flex flex-col items-center gap-4 text-slate-300">
                    <Package size={64} strokeWidth={1} />
                    <span className="font-black uppercase tracking-widest text-[10px]">Zero Items Found</span>
                 </div>
              ) : (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                       <thead>
                          <tr className="bg-[#F8FAFC] border-b border-slate-100">
                             <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Node</th>
                             <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Variants</th>
                             <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Status</th>
                             <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {filteredProducts.map((p) => (
                             <tr key={p._id} className="group hover:bg-blue-50/20 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-5">
                                      <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm">
                                         <img 
                                           src={getImageUrl(p.frontImage)} 
                                           className="w-full h-full object-cover" 
                                           alt={p.name} 
                                           onError={(e) => e.target.src = '/placeholder-product.png'}
                                         />
                                      </div>
                                      <div>
                                         <h4 className="text-base font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-tight">{p.name}</h4>
                                         <p className="text-[9px] font-black text-[#1565C0] uppercase tracking-widest mt-1">{p.category}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex flex-wrap gap-2">
                                      {p.availableSizes?.map(size => (
                                         <span key={size} className="px-3 py-1 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                                            {size}
                                         </span>
                                      ))}
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <button 
                                     onClick={() => toggleStatus(p)}
                                     disabled={actionLoading}
                                     className={`w-11 h-6 rounded-full relative transition-all ${p.isActive ? 'bg-[#25D366]' : 'bg-slate-200'}`}
                                   >
                                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${p.isActive ? 'left-6' : 'left-1'}`}></div>
                                   </button>
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <div className="flex justify-end gap-3">
                                      <button 
                                        onClick={() => navigate(`${ADMIN_PATH}/edit-product/${p._id}`)}
                                        className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#1565C0] hover:bg-blue-50 transition-all shadow-sm"
                                      >
                                         <Edit2 size={16} strokeWidth={2.5} />
                                      </button>
                                      <button 
                                        onClick={() => setDeleteId(p._id)}
                                        className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                      >
                                         <Trash2 size={16} strokeWidth={2.5} />
                                      </button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              )}
           </div>
        </div>

        {/* DELETE MODAL */}
        <AnimatePresence>
          {deleteId && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0D1B3E]/95 backdrop-blur-md z-[10000] flex items-center justify-center p-6"
            >
               <motion.div 
                 initial={{ scale: 0.95, y: 10 }}
                 animate={{ scale: 1, y: 0 }}
                 className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center space-y-8 shadow-2xl"
               >
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                     <AlertTriangle size={40} />
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-3xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none">Sever Node?</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">This action will permanently remove the item from the live database.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                     <button 
                       onClick={handleDelete}
                       className="w-full bg-red-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-500/10 uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                     >
                        Confirm Severance
                     </button>
                     <button 
                       onClick={() => setDeleteId(null)}
                       className="w-full bg-slate-50 text-slate-400 font-black py-5 rounded-2xl uppercase tracking-widest text-[10px]"
                     >
                        Abort
                     </button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ManageProducts;
