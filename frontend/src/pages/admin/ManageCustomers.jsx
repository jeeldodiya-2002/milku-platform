import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  getCustomers, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
} from '../../services/api';
import { 
  Users, 
  Plus, 
  Search, 
  MapPin, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Loader2, 
  ArrowLeft,
  MoreHorizontal,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminBackground from '../../components/admin/AdminBackground';
import { useAuth } from '../../context/AuthContext';

const ManageCustomers = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const ADMIN_PATH = "/admin-milku-secure-9281";
  
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal/Form States
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    addresses: ['']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Delete Confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', addresses: [''] });
    setEditingCustomer(null);
    setError('');
    setShowModal(false);
  };

  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, '']
    }));
  };

  const handleRemoveAddress = (index) => {
    if (formData.addresses.length === 1) return;
    const newAddresses = [...formData.addresses];
    newAddresses.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      addresses: newAddresses
    }));
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = value;
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name.trim()) return setError('Customer name is mandatory');
    if (formData.addresses.some(a => !a.trim())) return setError('All branch addresses are mandatory');

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        addresses: formData.addresses.filter(a => a.trim() !== '')
      };

      if (editingCustomer) {
        await updateCustomer(editingCustomer._id, payload);
      } else {
        await createCustomer(payload);
      }
      
      await fetchCustomers();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      addresses: cust.addresses.length > 0 ? cust.addresses : ['']
    });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await deleteCustomer(deleteConfirm._id);
      if (res.data.success) {
        setCustomers(customers.filter(c => c._id !== deleteConfirm._id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete customer. The record might have been already removed.");
      // Even if it failed with 404, we should remove it from the UI to keep it in sync
      setCustomers(customers.filter(c => c._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    }
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.addresses.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20 relative">
      <AdminBackground />
      <AdminNavbar />
      
      <main className="max-w-[1500px] mx-auto px-6 md:px-8 pt-32">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <button 
                onClick={() => navigate(`${ADMIN_PATH}/dashboard`)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[2px] hover:text-[#1565C0] transition-colors"
              >
                <ArrowLeft size={12} /> Back to Dashboard
              </button>
              <h1 className="text-3xl md:text-4xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">Partner Network</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage establishments and branches</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search partners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] w-[240px] md:w-[320px] transition-all shadow-sm font-medium"
                />
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-[#1565C0] text-white px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#0D1B3E] transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus size={18} /> Add Partner
              </button>
            </div>
          </div>

          {/* CUSTOMER LIST */}
          {loading ? (
            <div className="py-32 flex flex-col items-center gap-4 text-slate-200">
              <Loader2 className="animate-spin" size={48} />
              <span className="font-black uppercase tracking-widest text-[10px]">Syncing Directory...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {filtered.map((cust, idx) => (
                  <motion.div
                    key={cust._id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#1565C0] group-hover:text-white transition-all">
                        <Users size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#0D1B3E] uppercase italic tracking-tight group-hover:text-[#1565C0] transition-colors">{cust.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">{cust.addresses.length} Branches</span>
                          <div className="flex items-center gap-1.5 overflow-hidden max-w-[200px] md:max-w-md">
                            <MapPin size={10} className="text-milku-primary shrink-0" />
                            <span className="text-[10px] font-medium text-slate-400 truncate">{cust.addresses[0]}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all">
                       <button 
                        onClick={() => startEdit(cust)}
                        className="flex-1 md:flex-none h-10 px-4 bg-blue-50 text-[#1565C0] rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest hover:bg-[#1565C0] hover:text-white transition-all"
                       >
                         <Edit2 size={14} /> Edit
                       </button>
                       <button 
                        onClick={() => setDeleteConfirm(cust)}
                        className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-400 hover:text-white transition-all"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filtered.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Search size={40} />
               </div>
               <h3 className="text-2xl font-black text-slate-300 uppercase italic">No matches found</h3>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </main>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[20000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-[#0D1B3E]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
               {/* Modal Header */}
               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h2 className="text-lg font-black text-[#0D1B3E] uppercase italic tracking-tighter">
                      {editingCustomer ? 'Update Partner' : 'New Partner'}
                    </h2>
                  </div>
                  <button onClick={resetForm} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-red-400 transition-all">
                    <X size={18} />
                  </button>
               </div>

               {/* Modal Body */}
               <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3 text-red-500">
                        <AlertCircle size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{error}</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                       <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Establishment Name</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all"
                         placeholder="e.g. Roopa Restaurant"
                       />
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Branches</label>
                         <button 
                           type="button"
                           onClick={handleAddAddress}
                           className="flex items-center gap-1.5 text-[8px] font-black text-[#1565C0] uppercase tracking-widest hover:underline"
                         >
                           <Plus size={10} /> Add Branch
                         </button>
                       </div>
                       
                       <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                         {formData.addresses.map((addr, idx) => (
                           <motion.div 
                             key={idx}
                             initial={{ opacity: 0, y: 5 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group/item"
                           >
                              <div className="flex-grow flex items-center gap-3">
                                 <span className="text-[8px] font-black text-[#1565C0] uppercase opacity-50 shrink-0">#{idx + 1}</span>
                                 <input 
                                   type="text" 
                                   value={addr}
                                   onChange={(e) => handleAddressChange(idx, e.target.value)}
                                   className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none"
                                   placeholder="Full Address..."
                                 />
                              </div>
                              {formData.addresses.length > 1 && (
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveAddress(idx)}
                                  className="text-red-300 hover:text-red-500 transition-colors shrink-0"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                           </motion.div>
                         ))}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                       <button 
                         type="button"
                         onClick={resetForm}
                         className="flex-1 h-12 bg-slate-50 text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all"
                       >
                         Cancel
                       </button>
                       <button 
                         type="submit"
                         disabled={isSubmitting}
                         className="flex-[2] h-12 bg-[#1565C0] text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-[#0D1B3E] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                       >
                         {isSubmitting ? (
                           <Loader2 className="animate-spin mx-auto" size={16} />
                         ) : (
                           editingCustomer ? 'Save Changes' : 'Confirm Registration'
                         )}
                       </button>
                    </div>
                  </form>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-[#0D1B3E]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-[#0D1B3E] uppercase italic tracking-tighter mb-4">Confirm Removal</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                Are you sure you want to remove <span className="font-black text-[#0D1B3E]">"{deleteConfirm.name}"</span>? 
                This will delete all branch data from the network registry.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 h-14 bg-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 h-14 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
};

export default ManageCustomers;
