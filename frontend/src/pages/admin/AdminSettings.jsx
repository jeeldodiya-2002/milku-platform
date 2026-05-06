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
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminBackground from '../../components/admin/AdminBackground';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, icon: Icon, name, value, onChange, type = "text", placeholder, multiline = false }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] flex items-center gap-2">
      <Icon size={12} className="text-[#1565C0]" />
      {label}
    </label>
    {multiline ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold focus:border-[#1565C0] focus:outline-none transition-all resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-bold focus:border-[#1565C0] focus:outline-none transition-all"
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
    googleMapsLink: ''
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
        googleMapsLink: settings.googleMapsLink || ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    <div className="h-screen bg-[#F8FAFC] font-sans overflow-hidden flex flex-col">
      <AdminNavbar />
      
      <main className="flex-1 overflow-y-auto px-6 md:px-8 pt-24 md:pt-32 pb-10">
        <div className="max-w-4xl mx-auto">
          {/* HEADER AREA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 border-b border-slate-100 pb-8 md:pb-10">
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/admin-milku-secure-9281/dashboard')}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#1565C0] transition-colors"
              >
                <ArrowLeft size={14} /> Back to Hub
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0D1B3E] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/20">
                  <SettingsIcon size={28} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">System Settings</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Manage Brand Contact & Legal Data</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-slate-100 shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time sync active</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-sm border border-slate-100 space-y-8 md:space-y-10"
            >
              {/* LEGAL SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputField 
                  label="FSSAI License Number" 
                  icon={ShieldCheck} 
                  name="fssaiNumber" 
                  value={formData.fssaiNumber}
                  onChange={handleChange}
                  placeholder="14-digit FSSAI Number" 
                />
                <InputField 
                  label="WhatsApp Number" 
                  icon={Phone} 
                  name="whatsappNumber" 
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g. 918347711123" 
                />
              </div>

              {/* CONTACT SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                <InputField 
                  label="Business Email" 
                  icon={Mail} 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="e.g. contact@milku.com" 
                />
                <InputField 
                  label="Google Maps Direct Link" 
                  icon={MapPin} 
                  name="googleMapsLink" 
                  value={formData.googleMapsLink}
                  onChange={handleChange}
                  placeholder="https://maps.app.goo.gl/..." 
                />
              </div>

              {/* LOCATION SECTION */}
              <div className="space-y-8 pt-6 border-t border-slate-50">
                <InputField 
                  label="Physical Address" 
                  icon={MapPin} 
                  name="address" 
                  value={formData.address}
                  onChange={handleChange}
                  multiline={true}
                  placeholder="Complete business address..." 
                />
              </div>
            </motion.div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
              <div className="flex-1">
                <AnimatePresence>
                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 text-green-600"
                    >
                      <CheckCircle2 size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">Settings Synchronized Globally</span>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-xs font-black uppercase tracking-widest"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-[#0D1B3E] hover:bg-[#1565C0] text-white px-12 py-6 rounded-full font-black uppercase italic tracking-[3px] shadow-2xl shadow-blue-900/30 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    Apply Global Changes
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
