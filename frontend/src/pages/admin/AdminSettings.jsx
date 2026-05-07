import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { updateSettings as updateSettingsApi } from '../../services/api';
import { 
  Settings as SettingsIcon, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Save, 
  Loader2,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
  Plus,
  Trash2,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminBackground from '../../components/admin/AdminBackground';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, icon: Icon, name, value, onChange, type = "text", placeholder, multiline = false }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
      {Icon && <Icon size={12} className="text-[#1565C0]" />}
      {label}
    </label>
    {multiline ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold focus:border-[#1565C0] focus:bg-white focus:outline-none transition-all resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold focus:border-[#1565C0] focus:bg-white focus:outline-none transition-all"
      />
    )}
  </div>
);

const AdminSettings = () => {
  const navigate = useNavigate();
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    whatsappNumber: '',
    email: '',
    address: '',
    fssaiNumber: '',
    googleMapsLink: '',
    branches: []
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        whatsappNumber: settings.whatsappNumber || '',
        email: settings.email || '',
        address: settings.address || '',
        fssaiNumber: settings.fssaiNumber || '',
        googleMapsLink: settings.googleMapsLink || '',
        branches: settings.branches || []
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBranchChange = (index, field, value) => {
    const updatedBranches = [...formData.branches];
    updatedBranches[index] = { ...updatedBranches[index], [field]: value };
    
    // If setting a branch as main, unset others
    if (field === 'isMain' && value === true) {
        updatedBranches.forEach((b, i) => {
            if (i !== index) b.isMain = false;
        });
    }
    
    setFormData({ ...formData, branches: updatedBranches });
  };

  const addBranch = () => {
    setFormData({
      ...formData,
      branches: [
        ...formData.branches,
        {
          name: '',
          address: '',
          email: '',
          phone: '',
          fssaiNumber: '',
          googleMapsLink: '',
          isMain: formData.branches.length === 0
        }
      ]
    });
  };

  const removeBranch = (index) => {
    const updatedBranches = formData.branches.filter((_, i) => i !== index);
    // If removed the main branch, set the first one as main
    if (formData.branches[index].isMain && updatedBranches.length > 0) {
        updatedBranches[0].isMain = true;
    }
    setFormData({ ...formData, branches: updatedBranches });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await updateSettingsApi(formData);
      if (res.data.success) {
        setSuccess(true);
        refreshSettings();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col relative pb-20">
      <AdminBackground />
      <AdminNavbar />
      
      <main className="flex-1 px-6 md:px-8 pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto">
          {/* HEADER AREA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-10">
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/admin-milku-secure-9281/dashboard')}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1565C0] transition-colors"
              >
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#0D1B3E] text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-blue-900/20">
                  <SettingsIcon size={32} />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">System Settings</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Multi-Branch Contact & Legal Hub</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time sync active</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* BRANCHES MANAGEMENT */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1565C0]/10 text-[#1565C0] rounded-xl flex items-center justify-center">
                    <Building size={20} />
                  </div>
                  <h2 className="text-xl font-black text-[#0D1B3E] uppercase italic tracking-tight">Business Branches</h2>
                </div>
                <button 
                  type="button"
                  onClick={addBranch}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1565C0] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0D1B3E] transition-all shadow-xl shadow-blue-900/20"
                >
                  <Plus size={14} /> Add New Branch
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {formData.branches.map((branch, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className={`bg-white rounded-[40px] p-8 border-2 transition-all relative ${branch.isMain ? 'border-[#1565C0] shadow-2xl ring-8 ring-blue-50/50' : 'border-slate-100 shadow-sm hover:shadow-xl'}`}
                    >
                      {branch.isMain && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1565C0] text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[2px] shadow-lg">
                          Main Branch
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs">
                            0{index + 1}
                          </div>
                          <input 
                            value={branch.name}
                            onChange={(e) => handleBranchChange(index, 'name', e.target.value)}
                            placeholder="Branch Name (e.g. Surat Branch)"
                            className="text-lg font-black text-[#0D1B3E] uppercase italic bg-transparent border-none outline-none focus:text-[#1565C0] w-full"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                           <button 
                             type="button"
                             onClick={() => handleBranchChange(index, 'isMain', !branch.isMain)}
                             className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${branch.isMain ? 'bg-[#1565C0] text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                           >
                             {branch.isMain ? 'Main' : 'Set as Main'}
                           </button>
                           <button 
                             type="button"
                             onClick={() => removeBranch(index)}
                             className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <InputField 
                          label="Physical Address" 
                          icon={MapPin} 
                          value={branch.address}
                          onChange={(e) => handleBranchChange(index, 'address', e.target.value)}
                          multiline={true}
                          placeholder="Complete address..." 
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField 
                            label="Email Address" 
                            icon={Mail} 
                            value={branch.email}
                            onChange={(e) => handleBranchChange(index, 'email', e.target.value)}
                            type="email"
                            placeholder="gdproduct@gmail.com" 
                          />
                          <InputField 
                            label="Contact Number" 
                            icon={Phone} 
                            value={branch.phone}
                            onChange={(e) => handleBranchChange(index, 'phone', e.target.value)}
                            placeholder="81281 64251" 
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputField 
                            label="FSSAI License" 
                            icon={ShieldCheck} 
                            value={branch.fssaiNumber}
                            onChange={(e) => handleBranchChange(index, 'fssaiNumber', e.target.value)}
                            placeholder="14-digit FSSAI" 
                          />
                          <InputField 
                            label="Google Maps Link" 
                            icon={MapPin} 
                            value={branch.googleMapsLink}
                            onChange={(e) => handleBranchChange(index, 'googleMapsLink', e.target.value)}
                            placeholder="https://maps.app.goo.gl/..." 
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* GLOBAL SETTINGS */}
            <div className="space-y-8 pt-12 border-t border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#0D1B3E]/10 text-[#0D1B3E] rounded-xl flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <h2 className="text-xl font-black text-[#0D1B3E] uppercase italic tracking-tight">Global Interaction</h2>
                </div>
                
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField 
                      label="Primary WhatsApp (Global)" 
                      icon={Phone} 
                      name="whatsappNumber" 
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="e.g. 918347711123" 
                    />
                    <div className="flex items-end pb-2">
                       <p className="text-[10px] font-bold text-slate-400 italic">This number is used for the global floating chat button across the entire site.</p>
                    </div>
                  </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 sticky bottom-8 z-10">
              <div className="flex-1 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full border border-slate-100 shadow-xl">
                <AnimatePresence>
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 text-green-600"
                    >
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Multi-Branch Data Synchronized</span>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-[10px] font-black uppercase tracking-widest"
                    >
                      {error}
                    </motion.div>
                  )}
                  {!success && !error && (
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ready to apply changes</span>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-[#0D1B3E] hover:bg-[#1565C0] text-white px-16 py-7 rounded-full font-black uppercase italic tracking-[3px] shadow-2xl shadow-blue-900/40 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    Publish Updates Globally
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
