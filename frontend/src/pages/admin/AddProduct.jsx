import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createProduct, getCategories } from '../../services/api';
import { 
  Upload, ArrowLeft, RefreshCw, CheckCircle2, Plus, X, 
  Palette, FileText, Layers, Trash2, AlertTriangle, Sparkles, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminBackground from '../../components/admin/AdminBackground';

const AddProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    category: ''
  });

  const [sizes, setSizes] = useState([]);
  const [unitType, setUnitType] = useState('gm');
  const [weightValue, setWeightValue] = useState('100');
  
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [categories, setCategories] = useState([]);

  // VIEW MODE LOGIC
  const [isFullView, setIsFullView] = useState(false);
  const [showUpgradeWarning, setShowUpgradeWarning] = useState(false);

  const ADMIN_PATH = "/admin-milku-secure-9281";

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate(`${ADMIN_PATH}/login`);
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await getCategories();
      if (res.data.success) {
        setCategories(res.data.data);
        const queryCat = searchParams.get('category');
        
        if (queryCat) {
           const found = res.data.data.find(c => c.name === queryCat);
           if (found) {
              setFormData(prev => ({ ...prev, category: found.name }));
              setIsFullView(found.isMain || false);
              return;
           }
        }

        if (res.data.data.length > 0) {
          const firstCat = res.data.data[0];
          setFormData(prev => ({ ...prev, category: firstCat.name }));
          setIsFullView(firstCat.isMain || false);
        }
      }
    };
    fetchCats();
  }, [searchParams]);

  const handleCategoryChange = (catName) => {
    const cat = categories.find(c => c.name === catName);
    setFormData({ ...formData, category: catName });
    if (cat?.isMain) {
       setIsFullView(true);
    } else {
       setIsFullView(false);
    }
  };

  const handleUpgradeToggle = () => {
     if (!isFullView) {
        setShowUpgradeWarning(true);
     } else {
        setIsFullView(false);
     }
  };

  const confirmUpgrade = () => {
     setIsFullView(true);
     setShowUpgradeWarning(false);
  };

  const handleAddSize = () => {
    let finalSize = '';
    const val = parseInt(weightValue);

    if (unitType === 'gm' && val >= 1000) {
      finalSize = `${val / 1000}kg`;
    } else if (unitType === 'liter' && val >= 1000) {
      finalSize = `${val / 1000}L`;
    } else {
      const suffix = unitType === 'gm' ? 'g' : unitType === 'kg' ? 'kg' : unitType === 'liter' ? 'L' : '';
      finalSize = `${weightValue}${suffix}`;
    }

    if (!sizes.includes(finalSize)) {
      setSizes([...sizes, finalSize]);
    }
  };

  const handleRemoveSize = (s) => setSizes(sizes.filter(x => x !== s));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- COMPREHENSIVE FRONTEND VALIDATION ---
    if (!formData.name.trim()) {
       setError("Product Name is mandatory.");
       setLoading(false);
       return;
    }
    if (!formData.shortDescription.trim()) {
       setError("Product Description is mandatory.");
       setLoading(false);
       return;
    }
    if (!formData.category) {
       setError("Please select a category.");
       setLoading(false);
       return;
    }

    if (isFullView) {
       if (sizes.length === 0) {
          setError("Please add at least one Package Variant (e.g., 500g, 1kg).");
          setLoading(false);
          return;
       }
       if (galleryFiles.length === 0) {
          setError("At least one product image is required for Card View.");
          setLoading(false);
          return;
       }
    }
    // -----------------------------------------

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('shortDescription', formData.shortDescription);
      data.append('category', formData.category);
      
      // Full view data
      if (isFullView) {
         data.append('availableSizes', JSON.stringify(sizes));
         // Append all gallery images
         galleryFiles.forEach(file => {
            data.append('images', file);
         });
      } else {
         data.append('availableSizes', JSON.stringify([]));
      }

      const res = await createProduct(data);
      if (res.data.success) {
        navigate(`${ADMIN_PATH}/manage-categories?category=${formData.category}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20 relative">
      <AdminBackground />
      <AdminNavbar />

      <main className="max-w-[1500px] mx-auto px-6 md:px-8 pt-32">
        <div className="max-w-5xl mx-auto space-y-10">
           {/* HEADER AREA */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="flex items-center gap-6">
                 <button onClick={() => navigate(-1)} className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#1565C0] transition-all shadow-sm">
                    <ArrowLeft size={18} />
                 </button>
                 <div>
                    <h1 className="text-3xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">Add New Product</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Create a new item for your store</p>
                 </div>
              </div>
              
               <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${isFullView ? 'bg-yellow-50 text-[#FFC107] border-yellow-200' : 'bg-blue-50 text-[#1565C0] border-blue-200'}`}>
                     {isFullView ? <Sparkles size={12} /> : <Layers size={12} />} {isFullView ? 'Card View Active' : 'Standard View'}
                  </div>
                  
                  {!isFullView && (
                     <button 
                       type="button"
                       onClick={handleUpgradeToggle}
                       className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-[#1565C0] hover:text-[#1565C0] transition-all shadow-sm"
                     >
                        Upgrade to Card View
                     </button>
                  )}
               </div>
           </div>

           <AnimatePresence mode="wait">
              {success ? (
                 <motion.div 
                   key="success"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="bg-white rounded-[32px] p-24 text-center space-y-8 shadow-sm border border-slate-200"
                 >
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                       <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-4xl font-black text-[#0D1B3E] uppercase italic tracking-tighter">Product Saved</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Updating store database...</p>
                 </motion.div>
              ) : (
                 <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* DYNAMIC GALLERY (ONLY FULL VIEW) */}
                    {isFullView && (
                       <motion.div 
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="lg:col-span-1 space-y-8"
                       >
                          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 space-y-8">
                             <div className="flex items-center gap-4 text-[#1565C0] border-b border-slate-50 pb-6">
                                <Palette size={20} strokeWidth={2.5} />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0D1B3E]">Product Gallery</h3>
                             </div>
                             
                             <div className="space-y-6">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Upload product images (Multiple allowed)</label>
                                
                                <div className="relative group aspect-square bg-[#F8FAFC] rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-[#1565C0] transition-all cursor-pointer">
                                   <div className="text-center space-y-3">
                                      <Upload size={32} className="mx-auto text-[#1565C0]" />
                                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Drop images or click to browse</p>
                                   </div>
                                   <input 
                                     type="file" 
                                     multiple 
                                     onChange={(e) => {
                                        const selectedFiles = Array.from(e.target.files);
                                        // 10MB check
                                        const largeFile = selectedFiles.find(f => f.size > 10 * 1024 * 1024);
                                        if (largeFile) {
                                           setError(`File "${largeFile.name}" is too large! Maximum 10MB.`);
                                           return;
                                        }
                                        setGalleryFiles([...galleryFiles, ...selectedFiles]);
                                        const newPreviews = selectedFiles.map(f => URL.createObjectURL(f));
                                        setGalleryPreviews([...galleryPreviews, ...newPreviews]);
                                     }} 
                                     className="absolute inset-0 opacity-0 cursor-pointer" 
                                   />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                   <AnimatePresence>
                                      {galleryPreviews.map((p, idx) => (
                                         <motion.div 
                                           key={idx}
                                           initial={{ opacity: 0, scale: 0.8 }}
                                           animate={{ opacity: 1, scale: 1 }}
                                           exit={{ opacity: 0, scale: 0.8 }}
                                           className="relative aspect-square bg-slate-50 rounded-xl border border-slate-100 overflow-hidden group"
                                         >
                                            <img src={p} className="w-full h-full object-cover p-1" alt="Preview" />
                                            <button 
                                              type="button"
                                              onClick={() => {
                                                 setGalleryFiles(galleryFiles.filter((_, i) => i !== idx));
                                                 setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx));
                                              }}
                                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                               <X size={12} />
                                            </button>
                                         </motion.div>
                                      ))}
                                   </AnimatePresence>
                                </div>
                                
                                {galleryFiles.length > 0 && (
                                   <p className="text-[9px] font-black text-milku-primary uppercase text-center mt-2">
                                      {galleryFiles.length} Image{galleryFiles.length > 1 ? 's' : ''} Selected
                                   </p>
                                )}
                             </div>
                          </div>
                       </motion.div>
                    )}

                    {/* DATA (ADAPTIVE) */}
                    <div className={`${isFullView ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-8`}>
                       <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-200 space-y-10">
                          <div className="flex items-center gap-4 text-[#1565C0] border-b border-slate-50 pb-6">
                             <FileText size={20} strokeWidth={2.5} />
                             <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0D1B3E]">Product Info</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Product Name</label>
                                <input 
                                  value={formData.name} 
                                  onChange={e => setFormData({...formData, name: e.target.value})} 
                                  placeholder="Enter product name..."
                                  className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl py-5 px-8 text-sm font-black text-[#0D1B3E] focus:border-[#1565C0] outline-none transition-all" 
                                  required 
                                />
                             </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
                                <select 
                                  value={formData.category} 
                                  onChange={e => handleCategoryChange(e.target.value)} 
                                  className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl py-5 px-8 font-black uppercase text-[11px] cursor-pointer focus:border-[#1565C0] outline-none"
                                >
                                   {categories.map(cat => (
                                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                                   ))}
                                </select>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
                             <textarea 
                               value={formData.shortDescription} 
                               onChange={e => setFormData({...formData, shortDescription: e.target.value})} 
                               placeholder="Enter product description..."
                               className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl py-5 px-8 font-medium text-xs h-32 focus:border-[#1565C0] outline-none transition-all resize-none" 
                               required 
                             />
                          </div>

                          {isFullView && (
                             <motion.div 
                               initial={{ opacity: 0, height: 0 }}
                               animate={{ opacity: 1, height: 'auto' }}
                               className="space-y-10"
                             >
                                {/* PACKAGING VARIANTS */}
                                <div className="space-y-6 pt-6 border-t border-slate-50">
                                   <div className="flex items-center gap-4 text-[#1565C0]">
                                      <Layers size={20} strokeWidth={2.5} />
                                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0D1B3E]">Package Variants</h3>
                                   </div>
                                   
                                   <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-100 space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                         <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Measure Unit</label>
                                            <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                                               {['gm', 'kg', 'liter'].map(u => (
                                                  <button 
                                                    key={u} type="button"
                                                    onClick={() => {
                                                       setUnitType(u);
                                                       if (u === 'gm') setWeightValue('100');
                                                       else setWeightValue('');
                                                    }}
                                                    className={`flex-1 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${unitType === u ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
                                                  >
                                                     {u}
                                                  </button>
                                               ))}
                                            </div>
                                         </div>
                                         <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Quantity</label>
                                            <div className="relative">
                                               {unitType === 'gm' ? (
                                                  <select 
                                                    value={weightValue} 
                                                    onChange={e => {
                                                       const val = e.target.value;
                                                       if (val === '1000') {
                                                          setUnitType('kg');
                                                          setWeightValue('1');
                                                       } else {
                                                          setWeightValue(val);
                                                       }
                                                    }}
                                                    className="w-full bg-white border border-slate-100 rounded-xl py-2.5 px-4 font-mono text-sm font-black text-[#0D1B3E] outline-none shadow-sm focus:border-[#1565C0]"
                                                  >
                                                     {[100, 200, 250, 300, 400, 500, 600, 700, 750, 800, 900, 1000].map(v => (
                                                        <option key={v} value={v}>{v} gm</option>
                                                     ))}
                                                  </select>
                                               ) : (
                                                  <input 
                                                    type="number" 
                                                    value={weightValue} 
                                                    onChange={e => setWeightValue(e.target.value)}
                                                    placeholder={unitType === 'kg' ? "Enter KG" : "Enter Liters"}
                                                    className="w-full bg-white border border-slate-100 rounded-xl py-2.5 px-4 font-mono text-sm font-black text-[#0D1B3E] outline-none shadow-sm focus:border-[#1565C0]"
                                                  />
                                               )}
                                            </div>
                                         </div>
                                      </div>
                                      <button 
                                        type="button" onClick={handleAddSize}
                                        className="w-full bg-[#0D1B3E] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[3px] shadow-lg hover:bg-[#1565C0] transition-all flex items-center justify-center gap-2"
                                      >
                                         <Plus size={16} /> Add Package Variant
                                      </button>
                                   </div>

                                   <div className="flex flex-wrap gap-3">
                                      <AnimatePresence>
                                         {sizes.map(s => (
                                            <motion.div 
                                              key={s}
                                              initial={{ scale: 0.8, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              exit={{ scale: 0.8, opacity: 0 }}
                                              className="bg-[#0D1B3E] text-white font-black text-[9px] uppercase tracking-widest px-5 py-3 rounded-xl flex items-center gap-3 shadow-md border border-white/5"
                                            >
                                               {s} <Trash2 size={14} className="cursor-pointer text-[#FFC107] hover:text-red-400 transition-colors" onClick={() => handleRemoveSize(s)} strokeWidth={3} />
                                            </motion.div>
                                         ))}
                                      </AnimatePresence>
                                   </div>
                                </div>
                             </motion.div>
                          )}

                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#1565C0] text-white font-black py-6 rounded-2xl shadow-2xl shadow-blue-500/20 hover:bg-[#0D1B3E] transition-all flex items-center justify-center gap-4 text-sm active:scale-[0.98] disabled:opacity-50 group"
                          >
                             {loading ? <RefreshCw className="animate-spin" /> : (
                                <>
                                   <CheckCircle2 size={24} /> 
                                   <span className="uppercase tracking-widest">Save Product</span>
                                </>
                             )}
                          </button>
                       </div>
                    </div>
                 </form>
              )}
           </AnimatePresence>
        </div>
      </main>

      {/* UPGRADE WARNING MODAL */}
      <AnimatePresence>
         {showUpgradeWarning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0D1B3E]/95 backdrop-blur-md z-[10000] flex items-center justify-center p-6"
            >
               <motion.div 
                 initial={{ scale: 0.95, y: 10 }}
                 animate={{ scale: 1, y: 0 }}
                 className="bg-white rounded-[40px] p-12 max-md:p-8 max-w-md w-full text-center space-y-8 shadow-2xl border-t-8 border-[#FFC107]"
               >
                  <div className="w-24 h-24 max-md:w-16 max-md:h-16 bg-yellow-50 text-[#FFC107] rounded-full flex items-center justify-center mx-auto">
                     <AlertTriangle size={48} className="max-md:w-10 max-md:h-10" />
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-4xl max-md:text-2xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none">Card View Mode</h3>
                     <p className="text-[11px] max-md:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">
                        Switching to Card View requires you to upload **Front/Back Images** and define **Package Variants**. Storage instructions will be automatically generated.
                     </p>
                  </div>
                  <div className="flex flex-col gap-3">
                     <button 
                       onClick={confirmUpgrade}
                       className="w-full bg-[#1565C0] text-white font-black py-6 rounded-2xl shadow-xl shadow-blue-500/10 uppercase tracking-widest text-[11px] hover:bg-black transition-all"
                     >
                        Confirm & Reveal Fields
                     </button>
                     <button 
                       onClick={() => setShowUpgradeWarning(false)}
                       className="w-full bg-slate-50 text-slate-400 font-black py-6 rounded-2xl uppercase tracking-widest text-[11px]"
                     >
                        Cancel
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default AddProduct;
