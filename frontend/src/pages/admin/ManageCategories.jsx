import React, { useState, useEffect } from 'react';
import { getCategories, getProducts, deleteProduct, updateProduct, updateCategory, deleteCategory, getImageUrl, createCategory } from '../../services/api';
import {
   Plus, Edit2, Edit3, Trash2, Loader2, AlertTriangle, RefreshCw, X, Package, Zap, Upload,
   PlusCircle, ArrowLeft, ChevronRight, Settings, Eye, Search, Filter, CheckCircle2,
   Save, Power, LayoutGrid, Info, ShieldAlert, ZapOff, Palette, FileText, Layers
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminBackground from '../../components/admin/AdminBackground';
import { useSettings } from '../../context/SettingsContext';

const ManageCategories = () => {
   const navigate = useNavigate();
   const { isAdmin, loading: authLoading } = useAuth();
   const { refreshCategories } = useSettings();
   const ADMIN_PATH = "/admin-milku-secure-9281";

   const [searchParams, setSearchParams] = useSearchParams();
   const urlCategory = searchParams.get('category');

   const sortPackageVariants = (variants) => {
      if (!variants || !Array.isArray(variants)) return [];
      return [...variants].sort((a, b) => {
         const parseValue = (s) => {
            const num = parseFloat(s);
            const unit = s.toLowerCase().replace(/[0-9.]/g, '').trim();
            if (unit === 'kg' || unit === 'liter' || unit === 'l') return num * 1000;
            return num; // Default gm
         };
         return parseValue(a) - parseValue(b);
      });
   };

   const [categories, setCategories] = useState([]);
   const [allProducts, setAllProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedCategory, setSelectedCategory] = useState(null);

   // Product list state
   const [searchTerm, setSearchTerm] = useState('');
   const [catSearchTerm, setCatSearchTerm] = useState('');
   const [deleteId, setDeleteId] = useState(null);
   const [actionLoading, setActionLoading] = useState(false);
   const [editingId, setEditingId] = useState(null);
   const [quickForm, setQuickForm] = useState({ name: '', shortDescription: '' });

   // Modals state
   const [showImageWarning, setShowImageWarning] = useState(false);
   const [showValidationError, setShowValidationError] = useState(false);
   const [validationData, setValidationData] = useState({ count: 0, examples: [] });
   const [success, setSuccess] = useState(false);
   const [error, setError] = useState('');
   const [pendingCategory, setPendingCategory] = useState(null);

   const [editingCategory, setEditingCategory] = useState(null);
   const [catEditForm, setCatEditForm] = useState({ name: '', isMain: false });
   const [deleteCatData, setDeleteCatData] = useState(null);
   const [isAddingCategory, setIsAddingCategory] = useState(false);
   const [newCategoryForm, setNewCategoryForm] = useState({ name: '', isMain: false });

   // Wizard state for Category Conversion
   const [wizardProduct, setWizardProduct] = useState(null);
   const [wizardImages, setWizardImages] = useState([]);
   const [wizardPreviews, setWizardPreviews] = useState([]);
   const [wizardRemovedImages, setWizardRemovedImages] = useState([]);
   const [wizardVariants, setWizardVariants] = useState([]);
   const [wizardDesc, setWizardDesc] = useState('');
   const [wizardUnit, setWizardUnit] = useState('gm');
   const [wizardWeight, setWizardWeight] = useState('100');
   const [wizardName, setWizardName] = useState('');
   const [convertingCategory, setConvertingCategory] = useState(null);

   useEffect(() => {
      if (!authLoading && !isAdmin) navigate(`${ADMIN_PATH}/login`);
      fetchData();
   }, [isAdmin, authLoading, navigate]);

   // Handle body scroll locking when any modal is open
   useEffect(() => {
      const isAnyModalOpen = deleteId || deleteCatData || showImageWarning || showValidationError || editingCategory || isAddingCategory;
      if (isAnyModalOpen) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'unset';
      }
      return () => { document.body.style.overflow = 'unset'; };
   }, [deleteId, deleteCatData, showImageWarning, showValidationError, editingCategory, isAddingCategory]);

   const fetchData = async () => {
      setLoading(true);
      try {
         const [catRes, prodRes] = await Promise.all([getCategories(), getProducts()]);
         if (catRes.data.success) {
            const allCats = catRes.data.data.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
            setCategories(allCats);

            // If category in URL, auto-select it
            const targetCat = searchParams.get('category');
            if (targetCat) {
               const found = allCats.find(c => c.name === targetCat);
               if (found) setSelectedCategory(found);
            }
         }
         if (prodRes.data.success) setAllProducts(prodRes.data.data);
      } catch (err) {
         console.error("Fetch failed");
      } finally {
         setLoading(false);
      }
   };

   const categoryProducts = selectedCategory
      ? allProducts.filter(p => p.category === selectedCategory.name)
      : [];

   const filteredCategories = categories.filter(c =>
      c.name.toLowerCase().includes(catSearchTerm.toLowerCase())
   );

   const filteredProducts = categoryProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const startQuickEdit = (p) => {
      setEditingId(p._id);
      setQuickForm({ name: p.name, shortDescription: p.shortDescription });
   };

   const handleQuickUpdate = async (id) => {
      if (actionLoading) return;
      setActionLoading(true);
      try {
         const res = await updateProduct(id, quickForm);
         if (res.data.success) {
            setAllProducts(allProducts.map(p => p._id === id ? { ...p, ...quickForm } : p));
            setEditingId(null);
         }
      } catch (err) {
         alert("Update failed");
      } finally {
         setActionLoading(false);
      }
   };

   const toggleProductStatus = async (product) => {
      if (actionLoading) return;
      setActionLoading(true);
      try {
         const res = await updateProduct(product._id, { isActive: !product.isActive });
         if (res.data.success) {
            setAllProducts(allProducts.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p));
         }
      } catch (err) {
         alert("Status update failed");
      } finally {
         setActionLoading(false);
      }
   };

   const handleDeleteProduct = async () => {
      if (actionLoading) return;
      setActionLoading(true);
      try {
         const res = await deleteProduct(deleteId);
         if (res.data.success) {
            setAllProducts(allProducts.filter(p => p._id !== deleteId));
            setDeleteId(null);
         }
      } catch (err) {
         alert("Delete failed");
      } finally {
         setActionLoading(false);
      }
   };

   const handleDeleteCategory = async () => {
      if (actionLoading || !deleteCatData) return;
      setActionLoading(true);
      try {
         const res = await deleteCategory(deleteCatData._id);
         if (res.data.success) {
            setCategories(categories.filter(c => c._id !== deleteCatData._id));
            setAllProducts(allProducts.filter(p => p.category !== deleteCatData.name));
            refreshCategories();
            setDeleteCatData(null);
         }
      } catch (err) {
         alert("Failed to delete category");
      } finally {
         setActionLoading(false);
      }
   };

   const handleUpdateCategory = async (e) => {
      e.preventDefault();
      if (actionLoading || !editingCategory) return;

      // If turning on Main, validate
      if (catEditForm.isMain && !editingCategory.isMain) {
         const validation = validateCategoryForMain(editingCategory.name);
         if (!validation.success) {
            setValidationData(validation);
            setShowValidationError(true);
            setConvertingCategory(editingCategory); // Track which category we're converting
            setEditingCategory(null); // Close the edit modal
            return;
         }
      }

      setActionLoading(true);
      try {
         const res = await updateCategory(editingCategory._id, catEditForm);
         if (res.data.success) {
            setCategories(categories.map(c => c._id === editingCategory._id ? { ...c, ...catEditForm } : c));
            refreshCategories();
            setEditingCategory(null);
         }
      } catch (err) {
         alert("Failed to update category");
      } finally {
         setActionLoading(false);
      }
   };

   const handleCreateCategory = async (e, andAddProducts = false) => {
      if (e) e.preventDefault();
      if (actionLoading || !newCategoryForm.name.trim()) return;

      setActionLoading(true);
      try {
         const res = await createCategory(newCategoryForm);
         if (res.data.success) {
            const newCat = res.data.data;
            setCategories([...categories, newCat].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0)));
            refreshCategories();
            setIsAddingCategory(false);
            setNewCategoryForm({ name: '', isMain: false });

            if (andAddProducts) {
               navigate(`${ADMIN_PATH}/add-product?category=${newCat.name}`);
            }
         }
      } catch (err) {
         alert("Failed to create category");
      } finally {
         setActionLoading(false);
      }
   };

   const validateCategoryForMain = (catName, productsToUse = allProducts) => {
      const prods = productsToUse.filter(p => p.category === catName);
      if (prods.length === 0) return { success: true };

      const incomplete = prods.filter(p => {
         const hasImages = (p.frontImage && p.backImage) || (p.images && p.images.length >= 2);
         const hasVariants = p.availableSizes && p.availableSizes.length > 0;
         return !hasImages || !hasVariants;
      });

      return {
         success: incomplete.length === 0,
         count: incomplete.length,
         examples: incomplete.slice(0, 3).map(p => p.name),
         incompleteProds: incomplete
      };
   };

   const startWizardEdit = (p) => {
      setWizardProduct(p);
      setWizardName(p.name || '');
      setWizardVariants(p.availableSizes || []);
      setWizardDesc(p.shortDescription || '');
      setWizardRemovedImages([]);

      // PRE-FILL EXISTING IMAGES
      const existingImages = [];
      if (p.frontImage) existingImages.push(getImageUrl(p.frontImage));
      if (p.backImage) existingImages.push(getImageUrl(p.backImage));
      if (p.images && p.images.length > 0) {
         p.images.forEach(img => {
            const url = getImageUrl(img);
            if (!existingImages.includes(url)) existingImages.push(url);
         });
      }
      setWizardPreviews(existingImages);
      setWizardImages([]);
      setShowValidationError(false); 
      setEditingCategory(null); // Ensure edit modal is closed
   };

   const handleAddWizardVariant = () => {
      let finalSize = '';
      const val = parseInt(wizardWeight);
      if (!val) return;

      if (wizardUnit === 'gm' && val >= 1000) finalSize = `${val / 1000}kg`;
      else if (wizardUnit === 'liter' && val >= 1000) finalSize = `${val / 1000}L`;
      else {
         const suffix = wizardUnit === 'gm' ? 'g' : wizardUnit === 'kg' ? 'kg' : wizardUnit === 'liter' ? 'L' : '';
         finalSize = `${wizardWeight}${suffix}`;
      }
      if (!wizardVariants.includes(finalSize)) setWizardVariants([...wizardVariants, finalSize]);
   };

   const handleSaveWizardProduct = async () => {
      if (actionLoading || !wizardProduct) return;
      setError('');

      // COMPREHENSIVE VALIDATION
      if (!wizardDesc.trim()) {
         setError("Product description is required.");
         return;
      }
      if (wizardVariants.length === 0) {
         setError("Please add at least one package variant.");
         return;
      }

      setActionLoading(true);
      try {
         const data = new FormData();
         data.append('name', wizardName);
         data.append('shortDescription', wizardDesc);
         data.append('availableSizes', JSON.stringify(wizardVariants));
         if (wizardRemovedImages.length > 0) {
            data.append('removedImages', JSON.stringify(wizardRemovedImages));
         }
         wizardImages.forEach(file => data.append('images', file));

         const res = await updateProduct(wizardProduct._id, data);
         if (res.data.success) {
            const updatedProducts = allProducts.map(p => p._id === wizardProduct._id ? res.data.data : p);
            setAllProducts(updatedProducts);

            // Re-validate category to see if more products need work
            const catToValidate = convertingCategory || categories.find(c => c.name === wizardProduct.category);
            if (catToValidate) {
               const v = validateCategoryForMain(catToValidate.name, updatedProducts);
               setValidationData(v);
               setShowValidationError(true); // Always show validation list after saving
            }

            setWizardProduct(null);
            setWizardRemovedImages([]);
         }
      } catch (err) {
         setError(err.response?.data?.message || "Failed to save product data");
      } finally {
         setActionLoading(false);
      }
   };

   const toggleCategoryMain = async (cat) => {
      if (actionLoading) return;

      // If enabling, perform validation
      if (!cat.isMain) {
         const validation = validateCategoryForMain(cat.name);
         if (!validation.success) {
            setValidationData(validation);
            setShowValidationError(true);
            setConvertingCategory(cat || editingCategory);
            setEditingCategory(null);
            return;
         }

         setPendingCategory(cat);
         setShowImageWarning(true);
         return;
      }

      // If disabling, do it directly
      performCategoryToggle(cat);
   };

   const performCategoryToggle = async (cat) => {
      setActionLoading(true);
      try {
         const res = await updateCategory(cat._id, { isMain: !cat.isMain });
         if (res.data.success) {
            const updatedCats = categories.map(c => c._id === cat._id ? { ...c, isMain: !c.isMain } : c);
            // Re-sort: Main first
            const sorted = updatedCats.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
            setCategories(sorted);
            refreshCategories();
            setShowImageWarning(false);
            setPendingCategory(null);
         }
      } catch (err) {
         alert("Failed to update category status");
      } finally {
         setActionLoading(false);
      }
   };

   const isHighFidelityMode = () => {
      if (selectedCategory?.isMain) return true;
      if (editingCategory?.isMain || catEditForm.isMain) return true;
      if (pendingCategory) return true;
      if (showValidationError) return true;
      return false;
   };

   return (
      <div className="min-h-screen bg-slate-50/50 font-sans pb-20 relative">
         <AdminBackground />
         <AdminNavbar />

         <main className="max-w-[1500px] mx-auto px-6 md:px-8 pt-32">
            <AnimatePresence mode="wait">
               {wizardProduct ? (
                  /* FULL SCREEN WIZARD EDITOR */
                  <motion.div
                     key="wizard-full"
                     initial={{ opacity: 1 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 1 }}
                     className="max-w-6xl mx-auto space-y-10"
                  >
                     {/* WIZARD HEADER */}
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                        <div className="flex items-center gap-6">
                           <button
                              onClick={() => setWizardProduct(null)}
                              className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:text-[#1565C0] transition-all shadow-sm"
                           >
                              <ArrowLeft size={20} />
                           </button>
                           <div>
                              <div className="flex items-center gap-3">
                                 <h1 className="text-3xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">Product Wizard Editor</h1>
                                 <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isHighFidelityMode() ? 'bg-blue-50 text-[#1565C0] border border-blue-100' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                                    {isHighFidelityMode() ? 'High-Fidelity Mode' : 'Standard Mode'}
                                 </div>
                              </div>
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">
                                 {isHighFidelityMode() ? 'Manage Premium Card View Requirements' : 'Update Basic Product Details'}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white rounded-[50px] p-6 md:p-12 border-t-8 border-[#1565C0] shadow-2xl space-y-12">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4 text-[#1565C0]">
                              <ShieldAlert size={32} />
                              <div className="text-left">
                                 <h2 className="text-2xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none">Required Data Terminal</h2>
                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Images & Variants Mandatory for Card View</p>
                              </div>
                           </div>
                        </div>

                        {error && (
                           <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                              <AlertTriangle size={14} /> {error}
                           </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                           {/* LEFT COLUMN: GALLERY - ONLY FOR MAIN CATEGORIES */}
                           {isHighFidelityMode() && (
                              <div className="lg:col-span-4 space-y-6">
                                 <div className="flex items-center gap-3 text-[#1565C0]">
                                    <Palette size={16} strokeWidth={2.5} />
                                    <h3 className="text-[9px] font-black uppercase tracking-widest text-[#0D1B3E]">Media Gallery</h3>
                                 </div>

                                 <div className="space-y-4">
                                    <label className="group block cursor-pointer">
                                       <div className="w-full aspect-[4/3] rounded-[40px] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-4 transition-all group-hover:border-[#1565C0] group-hover:bg-blue-50/30">
                                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-[#1565C0] shadow-sm transition-all group-hover:scale-110">
                                             <Upload size={32} />
                                          </div>
                                          <div className="text-center">
                                             <p className="text-[10px] font-black text-[#0D1B3E] uppercase tracking-widest">Upload Images</p>
                                             <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1">Front & Back Recommended</p>
                                          </div>
                                       </div>
                                       <input
                                          type="file"
                                          multiple
                                          accept="image/*"
                                          onChange={(e) => {
                                             const files = Array.from(e.target.files);
                                             setWizardImages([...wizardImages, ...files]);
                                             const newPreviews = files.map(f => URL.createObjectURL(f));
                                             setWizardPreviews([...wizardPreviews, ...newPreviews]);
                                          }}
                                          className="hidden"
                                       />
                                    </label>

                                    <div className="grid grid-cols-2 gap-3">
                                       {wizardPreviews.map((p, i) => (
                                          <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 p-1 group">
                                             <img src={p} crossOrigin="anonymous" className="w-full h-full object-contain rounded-xl" alt="Preview" />
                                             <button
                                                onClick={() => {
                                                   const previewToRemove = wizardPreviews[i];
                                                   // If it's an existing image (contains getImageUrl or localhost/upload)
                                                   if (previewToRemove.includes('uploads') || previewToRemove.includes('http')) {
                                                      // Extract the filename from URL
                                                      const filename = previewToRemove.split('/').pop();
                                                      setWizardRemovedImages([...wizardRemovedImages, filename]);
                                                   } else {
                                                      // It's a new upload, remove from wizardImages
                                                      const newImgIndex = wizardPreviews.filter((p, idx) => idx < i && !(p.includes('uploads') || p.includes('http'))).length;
                                                      setWizardImages(wizardImages.filter((_, idx) => idx !== newImgIndex));
                                                   }
                                                   setWizardPreviews(wizardPreviews.filter((_, idx) => idx !== i));
                                                }}
                                                className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
                                             >
                                                <Trash2 size={16} />
                                             </button>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           )}

                           {/* MIDDLE COLUMN: PRODUCT INFO */}
                           <div className={`${isHighFidelityMode() ? 'lg:col-span-8 border-l' : 'lg:col-span-12'} space-y-8 border-slate-50 pl-0 lg:pl-8`}>
                              <div className="flex items-center gap-3 text-[#1565C0]">
                                 <FileText size={16} strokeWidth={2.5} />
                                 <h3 className="text-[9px] font-black uppercase tracking-widest text-[#0D1B3E]">Product Identity</h3>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Product Name</label>
                                    <input
                                       type="text"
                                       value={wizardName}
                                       onChange={e => setWizardName(e.target.value)}
                                       className="w-full bg-[#F8FAFC] border border-slate-50 rounded-2xl py-5 px-8 text-sm font-black text-[#0D1B3E] outline-none focus:border-[#1565C0] transition-all"
                                    />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Category</label>
                                    <div className="w-full bg-[#F8FAFC] border border-slate-50 rounded-2xl py-5 px-8 text-[11px] font-black uppercase text-slate-600">
                                       {wizardProduct.category}
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Short Description</label>
                                 <textarea
                                    value={wizardDesc}
                                    onChange={e => setWizardDesc(e.target.value)}
                                    className="w-full bg-[#F8FAFC] border border-slate-50 rounded-2xl py-5 px-8 font-medium text-xs h-32 focus:border-[#1565C0] outline-none transition-all resize-none"
                                 />
                              </div>

                              {/* VARIANTS SECTION */}
                              {isHighFidelityMode() && (
                                 <div className="space-y-8 pt-8 border-t border-slate-50">
                                    <div className="flex items-center gap-4 text-[#1565C0]">
                                       <Layers size={20} strokeWidth={2.5} />
                                       <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0D1B3E]">Package Variants</h3>
                                    </div>

                                    <div className="bg-[#F8FAFC] p-4 md:p-8 rounded-[32px] border border-slate-50 space-y-6">
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                          <div className="space-y-2">
                                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-2">Measure Unit</label>
                                             <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-100 overflow-hidden">
                                                {['gm', 'kg', 'liter'].map(u => (
                                                   <button
                                                      key={u} type="button" onClick={() => {
                                                         setWizardUnit(u);
                                                         if (u === 'gm') setWizardWeight('100');
                                                         else setWizardWeight('');
                                                      }}
                                                      className={`flex-1 py-3 px-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${wizardUnit === u ? 'bg-[#1565C0] text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
                                                   >
                                                      {u}
                                                   </button>
                                                ))}
                                             </div>
                                          </div>
                                          <div className="space-y-2">
                                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-2">Quantity</label>
                                             {wizardUnit === 'gm' ? (
                                                <select
                                                   value={wizardWeight}
                                                   onChange={e => {
                                                      const val = e.target.value;
                                                      if (val === '1000') {
                                                         setWizardUnit('kg');
                                                         setWizardWeight('1');
                                                      } else {
                                                         setWizardWeight(val);
                                                      }
                                                   }}
                                                   className="w-full bg-white border border-slate-100 rounded-xl py-3 px-6 font-black text-[12px] text-[#0D1B3E] outline-none shadow-sm focus:border-[#1565C0] appearance-none"
                                                >
                                                   {[100, 200, 250, 300, 400, 500, 600, 700, 750, 800, 900, 1000].map(v => (
                                                      <option key={v} value={v}>{v} gm</option>
                                                   ))}
                                                </select>
                                             ) : (
                                                <input
                                                   type="number"
                                                   value={wizardWeight}
                                                   onChange={e => setWizardWeight(e.target.value)}
                                                   placeholder={wizardUnit === 'kg' ? "Enter KG" : "Enter Liters"}
                                                   className="w-full bg-white border border-slate-100 rounded-xl py-3 px-6 font-black text-[12px] text-[#0D1B3E] outline-none shadow-sm focus:border-[#1565C0]"
                                                />
                                             )}
                                          </div>
                                       </div>
                                       <button
                                          onClick={handleAddWizardVariant}
                                          className="w-full bg-[#0D1B3E] text-white py-5 rounded-xl font-black uppercase text-[10px] tracking-[3px] shadow-lg hover:bg-[#1565C0] transition-all flex items-center justify-center gap-2 active:scale-95"
                                       >
                                          <Plus size={16} /> Add Package Variant
                                       </button>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                       {sortPackageVariants(wizardVariants).map(v => (
                                          <div key={v} className="bg-[#0D1B3E] text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 shadow-md">
                                             {v} <Trash2 size={14} className="cursor-pointer text-[#FFC107] hover:text-red-400" onClick={() => setWizardVariants(wizardVariants.filter(x => x !== v))} />
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              <button
                                 onClick={handleSaveWizardProduct}
                                 disabled={actionLoading}
                                 className="w-full bg-[#1565C0] text-white font-black py-6 rounded-2xl shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-[13px] hover:bg-[#0D1B3E] transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                              >
                                 {actionLoading ? <RefreshCw className="animate-spin" size={20} /> : (
                                    <>
                                       <CheckCircle2 size={24} /> <span>Save Changes</span>
                                    </>
                                 )}
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ) : !selectedCategory ? (
                  /* CATEGORY LIST VIEW */
                  <motion.div
                     key="cat-list"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="max-w-5xl mx-auto space-y-10"
                  >
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                        <div>
                           <h1 className="text-3xl md:text-4xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">Category Management</h1>
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">Manage Store Categories & Products</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                           <div className="relative group w-full md:w-auto flex-1 md:flex-none">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1565C0] transition-colors" size={16} />
                              <input
                                 type="text"
                                 placeholder="Search categories..."
                                 value={catSearchTerm}
                                 onChange={(e) => setCatSearchTerm(e.target.value)}
                                 className="bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-[#0D1B3E] focus:border-[#1565C0] outline-none transition-all shadow-sm w-full md:w-[240px]"
                              />
                           </div>
                           <div className="flex items-center gap-2 w-full md:w-auto">
                              <button
                                 onClick={() => navigate(`${ADMIN_PATH}/dashboard`)}
                                 className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                              >
                                 <ArrowLeft size={14} /> <span className="hidden sm:inline">Dashboard</span>
                              </button>
                              <button
                                 onClick={() => setIsAddingCategory(true)}
                                 className="flex-1 md:flex-none bg-[#1565C0] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-500/20"
                              >
                                 <PlusCircle size={14} /> Add Category
                              </button>
                           </div>
                        </div>
                     </div>

                     {!loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4">
                           <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm group hover:border-blue-200 transition-all">
                              <div className="w-10 h-10 bg-blue-50 text-[#1565C0] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Package size={20} /></div>
                              <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Inventory</span>
                                 <span className="text-xl font-black text-[#0D1B3E] tracking-tighter">{allProducts.length} <span className="text-[10px] text-slate-400 ml-1 italic">Products</span></span>
                              </div>
                           </div>
                           <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm group hover:border-purple-200 transition-all">
                              <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Layers size={20} /></div>
                              <div className="flex flex-col">
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Categorization</span>
                                 <span className="text-xl font-black text-[#0D1B3E] tracking-tighter">{categories.length} <span className="text-[10px] text-slate-400 ml-1 italic">Groups</span></span>
                              </div>
                           </div>
                        </div>
                     )}

                     {loading ? (
                        <div className="p-32 flex flex-col items-center gap-4 text-slate-400">
                           <Loader2 className="animate-spin" size={48} />
                           <span className="font-black uppercase tracking-widest text-[10px]">Loading Categories...</span>
                        </div>
                     ) : (
                        <div className="space-y-12">
                           {/* MAIN CATEGORIES SECTION */}
                           {filteredCategories.some(c => c.isMain) && (
                              <div className="space-y-6">
                                 <div className="flex items-center gap-4">
                                    <h2 className="text-[11px] font-black text-[#1565C0] uppercase tracking-[4px]">Featured Categories</h2>
                                    <div className="h-px flex-grow bg-blue-100" />
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredCategories.filter(c => c.isMain).map((cat) => {
                                       const count = allProducts.filter(p => p.category === cat.name).length;
                                       return (
                                          <div key={cat._id} className="bg-white rounded-[24px] p-5 border-2 border-[#FFC107] shadow-lg shadow-yellow-500/5 transition-all group relative overflow-hidden h-full flex flex-col">
                                             <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFC107]/10 rounded-bl-[40px] flex items-center justify-center pl-4 pb-4">
                                                <CheckCircle2 size={16} className="text-[#FFC107]" />
                                             </div>

                                             <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-[#0D1B3E] text-[#FFC107] rounded-xl flex items-center justify-center font-black text-lg italic uppercase shadow-lg">
                                                   {cat.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                   <div className="bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 flex items-center gap-2">
                                                      <Package size={12} className="text-[#1565C0]" />
                                                      <span className="text-[10px] font-black text-[#1565C0] uppercase tracking-widest">{count}</span>
                                                   </div>
                                                   <div className="flex gap-1.5">
                                                      <button
                                                         onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingCategory(cat);
                                                            setCatEditForm({ name: cat.name, isMain: cat.isMain });
                                                         }}
                                                         className="px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all bg-[#FFC107] text-[#0D1B3E] border-[#FFC107] shadow-lg shadow-yellow-500/20 flex items-center gap-2 z-10"
                                                      >
                                                         <Edit2 size={10} /> Edit
                                                      </button>
                                                      <button
                                                         onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteCatData({ ...cat, count });
                                                         }}
                                                         className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                                      >
                                                         <Trash2 size={12} />
                                                      </button>
                                                   </div>
                                                </div>
                                             </div>

                                             <div className="flex-grow space-y-1">
                                                <div className="flex items-center gap-2">
                                                   <h3 className="text-lg font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-tight">{cat.name}</h3>
                                                   <span className="bg-[#FFC107] text-[#0D1B3E] px-1.5 py-0.5 rounded-md text-[6px] font-black uppercase tracking-widest">Main</span>
                                                </div>
                                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Premium</p>
                                             </div>

                                             <button
                                                onClick={() => {
                                                   setSelectedCategory(cat);
                                                   setSearchParams({ category: cat.name });
                                                }}
                                                className="mt-6 w-full bg-[#0D1B3E] text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-[8px] hover:bg-[#1565C0] transition-all"
                                             >
                                                View Products <ChevronRight size={12} />
                                             </button>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           )}

                           {/* STANDARD CATEGORIES SECTION */}
                           <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                 <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[4px]">Standard Categories</h2>
                                 <div className="h-px flex-grow bg-slate-100" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {filteredCategories.filter(c => !c.isMain).map((cat) => {
                                    const count = allProducts.filter(p => p.category === cat.name).length;
                                    return (
                                       <div key={cat._id} className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden h-full flex flex-col">
                                          <div className="flex justify-between items-start mb-4">
                                             <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center font-black text-lg italic uppercase group-hover:bg-[#0D1B3E] group-hover:text-[#FFC107] transition-all">
                                                {cat.name.charAt(0)}
                                             </div>
                                             <div className="flex flex-col items-end gap-2">
                                                <div className="bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 flex items-center gap-2">
                                                   <Package size={12} className="text-slate-600" />
                                                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{count}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                   <button
                                                      onClick={(e) => {
                                                         e.stopPropagation();
                                                         setEditingCategory(cat); setCatEditForm({ name: cat.name, isMain: cat.isMain });
                                                      }}
                                                      className="px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-200 hover:text-[#1565C0] flex items-center gap-2"
                                                   >
                                                      <Edit2 size={10} /> Edit
                                                   </button>
                                                   <button
                                                      onClick={(e) => {
                                                         e.stopPropagation();
                                                         setDeleteCatData({ ...cat, count });
                                                      }}
                                                      className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                                   >
                                                      <Trash2 size={12} />
                                                   </button>
                                                </div>
                                             </div>
                                          </div>

                                          <div className="flex-grow space-y-1">
                                             <h3 className="text-lg font-black text-slate-600 group-hover:text-[#0D1B3E] uppercase italic tracking-tighter leading-tight transition-all">{cat.name}</h3>
                                             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Standard</p>
                                          </div>

                                          <button
                                             onClick={() => {
                                                setSelectedCategory(cat);
                                                setSearchParams({ category: cat.name });
                                             }}
                                             className="mt-6 w-full bg-slate-50 text-slate-600 font-black py-3 rounded-xl border border-slate-100 flex items-center justify-center gap-2 uppercase tracking-widest text-[8px] group-hover:bg-[#0D1B3E] group-hover:text-white group-hover:border-transparent transition-all"
                                          >
                                             View Products <ChevronRight size={12} />
                                          </button>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </div>
                     )}
                  </motion.div>
               ) : (
                  /* SIMPLIFIED LIST FORM FOR PRODUCT UPDATION */
                  <motion.div
                     key="prod-list-form"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="max-w-6xl mx-auto space-y-8"
                  >
                     {/* HEADER AREA */}
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
                        <div className="flex items-center gap-6">
                           <button
                              onClick={() => {
                                 setSelectedCategory(null);
                                 setSearchParams({});
                              }}
                              className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:text-[#1565C0] transition-all shadow-sm"
                           >
                              <ArrowLeft size={20} />
                           </button>
                           <div>
                              <div className="flex items-center gap-3">
                                 <h1 className="text-3xl font-black text-[#0D1B3E] tracking-tighter uppercase italic leading-none">{selectedCategory.name}</h1>
                                 <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${selectedCategory.isMain ? 'bg-yellow-50 text-[#FFC107] border border-[#FFC107]/20' : 'bg-blue-50 text-[#1565C0] border border-blue-100'}`}>
                                    {selectedCategory.isMain ? 'Main Category' : 'Standard Category'}
                                 </div>
                              </div>
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">Quick Update Terminal</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <button
                              onClick={() => navigate(`${ADMIN_PATH}/add-product?category=${selectedCategory.name}`)}
                              className="bg-[#1565C0] text-white px-6 py-3.5 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:bg-[#0D1B3E] transition-all"
                           >
                              <PlusCircle size={18} /> Add Product
                           </button>
                        </div>
                     </div>

                     {/* SEARCH */}
                     <div className="relative group w-full max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1565C0] transition-colors" size={20} />
                        <input
                           type="text"
                           placeholder={`Search in ${selectedCategory.name}...`}
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-[#0D1B3E] focus:border-[#1565C0] outline-none transition-all shadow-sm"
                        />
                     </div>

                     {/* SIMPLIFIED LIST FORM */}
                     <div className="space-y-4">
                        {filteredProducts.length === 0 ? (
                           <div className="bg-white p-24 rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center gap-4 text-slate-500 shadow-sm">
                              <LayoutGrid size={64} strokeWidth={1} />
                              <span className="font-black uppercase tracking-widest text-[10px]">No products found</span>
                           </div>
                        ) : (
                           filteredProducts.map((p) => {
                              const isEditing = editingId === p._id;
                              return (
                                 <motion.div
                                    key={p._id}
                                    layout
                                    className={`bg-white rounded-[32px] border transition-all p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center ${isEditing ? 'border-[#1565C0] shadow-2xl ring-4 ring-blue-50' : 'border-slate-100 shadow-sm hover:shadow-md'}`}
                                 >
                                    {/* VISUAL PREVIEW - ONLY FOR CARD VIEW CATEGORIES */}
                                    {selectedCategory.isMain && (
                                       <div className="w-24 h-24 bg-slate-50 rounded-[20px] overflow-hidden border border-slate-100 flex-shrink-0 p-1">
                                          <img
                                             src={getImageUrl(p.frontImage)}
                                             className="w-full h-full object-cover rounded-[14px]"
                                             alt={p.name}
                                             onError={(e) => e.target.src = '/placeholder-product.png'}
                                          />
                                       </div>
                                    )}

                                    {/* PRODUCT DATA DISPLAY / EDIT */}
                                    <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div className="space-y-1">
                                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Name</label>
                                          <input
                                             type="text"
                                             value={selectedCategory.isMain ? p.name : (isEditing ? quickForm.name : p.name)}
                                             readOnly={selectedCategory.isMain}
                                             onFocus={() => !selectedCategory.isMain && !isEditing && startQuickEdit(p)}
                                             onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                                             className={`w-full transition-all outline-none rounded-xl py-2 px-3 text-[13px] font-bold ${!selectedCategory.isMain
                                                ? 'bg-slate-50 border border-slate-100 focus:border-[#1565C0] focus:bg-white text-[#0D1B3E]'
                                                : 'bg-transparent border-transparent text-slate-600'}`}
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                                          <textarea
                                             value={selectedCategory.isMain ? p.shortDescription : (isEditing ? quickForm.shortDescription : p.shortDescription)}
                                             readOnly={selectedCategory.isMain}
                                             onFocus={() => !selectedCategory.isMain && !isEditing && startQuickEdit(p)}
                                             onChange={(e) => setQuickForm({ ...quickForm, shortDescription: e.target.value })}
                                             rows={1}
                                             className={`w-full transition-all outline-none resize-none rounded-xl py-2 px-3 text-[11px] font-medium ${!selectedCategory.isMain
                                                ? 'bg-slate-50 border border-slate-100 focus:border-[#1565C0] focus:bg-white text-slate-600'
                                                : 'bg-transparent border-transparent text-slate-400 truncate'}`}
                                          />
                                       </div>
                                    </div>

                                    {/* CONTROLS */}
                                    <div className="flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-50">
                                       <button
                                          onClick={() => toggleProductStatus(p)}
                                          disabled={actionLoading}
                                          className={`flex-grow lg:flex-grow-0 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${p.isActive ? 'bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}
                                       >
                                          <Power size={14} strokeWidth={3} /> {p.isActive ? 'Enabled' : 'Disabled'}
                                       </button>

                                       {!selectedCategory.isMain ? (
                                          isEditing && (
                                             <button
                                                onClick={saveQuickEdit}
                                                disabled={actionLoading}
                                                className="p-4 bg-[#25D366] text-white rounded-2xl shadow-lg hover:bg-[#1DA851] transition-all"
                                                title="Save Changes"
                                             >
                                                <CheckCircle2 size={20} />
                                             </button>
                                          )
                                       ) : (
                                          <button
                                             onClick={() => startWizardEdit(p)}
                                             className="w-12 h-12 bg-[#1565C0] text-white rounded-2xl shadow-lg hover:bg-[#0D1B3E] transition-all flex items-center justify-center"
                                             title="Edit Product"
                                          >
                                             <Edit3 size={20} />
                                          </button>
                                       )}

                                       <button
                                          onClick={() => setDeleteId(p._id)}
                                          className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                                       >
                                          <Trash2 size={18} />
                                       </button>
                                    </div>
                                 </motion.div>
                              );
                           })
                        )}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* PRODUCT DELETE MODAL */}
            <AnimatePresence>
               {deleteId && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-[#0D1B3E]/95 backdrop-blur-md z-[20000] flex items-center justify-center p-6"
                  >
                     <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[40px] p-12 max-w-md w-full text-center space-y-8 shadow-2xl"
                     >
                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                           <AlertTriangle size={48} />
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-4xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none">Delete Product?</h3>
                           <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed px-4">This action will permanently remove this item from the {selectedCategory?.name} category.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                           <button
                              onClick={handleDeleteProduct}
                              className="w-full bg-red-500 text-white font-black py-6 rounded-2xl shadow-xl shadow-red-500/10 uppercase tracking-widest text-[11px] hover:bg-black transition-all"
                           >
                              Confirm Delete
                           </button>
                           <button
                              onClick={() => setDeleteId(null)}
                              className="w-full bg-slate-50 text-slate-600 font-black py-6 rounded-2xl uppercase tracking-widest text-[11px]"
                           >
                              Cancel
                           </button>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* CATEGORY DELETE MODAL */}
            <AnimatePresence>
               {deleteCatData && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-[#0D1B3E]/95 backdrop-blur-md z-[20000] flex items-center justify-center p-6"
                  >
                     <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[40px] p-12 max-w-md w-full text-center space-y-8 shadow-2xl border-t-8 border-red-500"
                     >
                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                           <ZapOff size={48} />
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-4xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none text-red-500">Delete Category?</h3>
                           <div className="space-y-2">
                              <p className="text-[11px] font-black text-[#0D1B3E] uppercase tracking-widest">Category: {deleteCatData.name}</p>
                              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed px-4">
                                 Deleting this category will permanently remove **{deleteCatData.count} products** and all related data.
                              </p>
                           </div>
                        </div>
                        <div className="flex flex-col gap-3 pt-4">
                           <button
                              onClick={handleDeleteCategory}
                              disabled={actionLoading}
                              className="w-full bg-red-600 text-white font-black py-6 rounded-2xl shadow-xl shadow-red-500/20 uppercase tracking-widest text-[11px] hover:bg-black transition-all flex items-center justify-center gap-2"
                           >
                              {actionLoading ? <RefreshCw className="animate-spin" size={14} /> : "Confirm Delete Category"}
                           </button>
                           <button
                              onClick={() => setDeleteCatData(null)}
                              className="w-full bg-slate-50 text-slate-600 font-black py-6 rounded-2xl uppercase tracking-widest text-[11px]"
                           >
                              Cancel
                           </button>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* IMAGE WARNING MODAL */}
            <AnimatePresence>
               {showImageWarning && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-[#0D1B3E]/95 backdrop-blur-md z-[20001] flex items-center justify-center p-6"
                  >
                     <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[50px] p-6 md:p-8 max-w-md w-full text-center space-y-4 shadow-2xl border-t-8 border-[#FFC107]"
                     >
                        <div className="w-20 h-20 bg-yellow-50 text-[#FFC107] rounded-full flex items-center justify-center mx-auto">
                           <AlertTriangle size={36} />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-2xl md:text-3xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none">Images Required</h3>
                           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed px-4">
                              Before enabling Card View, please ensure you have uploaded **ALL products images** first.
                           </p>
                        </div>
                        <div className="flex flex-col gap-3">
                           <button
                              onClick={() => performCategoryToggle(pendingCategory)}
                              className="w-full bg-[#1565C0] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/10 uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                           >
                              Confirm Images Uploaded
                           </button>
                           <button
                              onClick={() => {
                                 setShowImageWarning(false);
                                 setPendingCategory(null);
                              }}
                              className="w-full bg-slate-50 text-slate-600 font-black py-4 rounded-2xl uppercase tracking-widest text-[10px]"
                           >
                              Cancel Update
                           </button>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* CATEGORY UPGRADE WIZARD MODAL */}
            <AnimatePresence>
               {showValidationError && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-[#0D1B3E]/95 backdrop-blur-md z-[20001] flex items-center justify-center p-6"
                  >
                     <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[50px] p-5 md:p-8 max-w-lg w-full text-center space-y-4 shadow-2xl border-t-8 border-red-500 overflow-hidden"
                     >
                        <div className="flex justify-between items-start mb-1">
                           <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                              <ShieldAlert size={24} />
                           </div>
                           <button onClick={() => setShowValidationError(false)} className="text-slate-500 hover:text-red-500 transition-colors"><X size={20} /></button>
                        </div>

                        <div className="text-left space-y-1">
                           <h3 className="text-xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none">Category Conversion Wizard</h3>
                           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Action Required: Complete Product Data</p>
                        </div>

                        {validationData.count > 0 ? (
                           <>
                              <div className="bg-slate-50/50 rounded-[32px] p-4 text-left border border-slate-100 max-h-[30vh] overflow-y-auto custom-scrollbar space-y-3">
                                 <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Incomplete Products ({validationData.count})</span>
                                 </div>
                                 <div className="space-y-3">
                                    {validationData.incompleteProds.map((p) => (
                                       <div key={p._id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-red-200 transition-all">
                                          <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-red-400">
                                                <AlertTriangle size={18} />
                                             </div>
                                             <div>
                                                <h4 className="text-[11px] font-black text-[#0D1B3E] uppercase italic leading-none">{p.name}</h4>
                                                <p className="text-[8px] font-bold text-red-400 uppercase tracking-widest mt-1">Missing Images/Variants</p>
                                             </div>
                                          </div>
                                          <button
                                             onClick={() => startWizardEdit(p)}
                                             className="px-4 py-2 bg-[#0D1B3E] text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-[#1565C0] transition-all"
                                          >
                                             Complete Data
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center px-6">
                                 All products in this category must have **Images** and **Variants** to enable the premium Card View experience.
                              </p>
                           </>
                        ) : (
                           <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="bg-green-50/50 rounded-[32px] p-6 text-center border border-green-100 space-y-4"
                           >
                              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                                 <CheckCircle2 size={32} />
                              </div>
                              <div className="space-y-1">
                                 <h4 className="text-xl font-black text-green-600 uppercase italic tracking-tighter">All Systems Ready!</h4>
                                 <p className="text-[9px] font-bold text-green-600/60 uppercase tracking-widest">Products now meet catalog standards.</p>
                              </div>
                              <button
                                 onClick={() => {
                                    setShowValidationError(false);
                                    if (convertingCategory) {
                                       setCatEditForm({ name: convertingCategory.name, isMain: true });
                                       // Directly call updateCategory logic or use helper
                                       performCategoryToggle(convertingCategory);
                                    }
                                 }}
                                 className="w-full bg-green-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-500/20 uppercase tracking-widest text-[10px] hover:bg-green-600 transition-all flex items-center justify-center gap-3"
                              >
                                 <Zap size={16} /> Confirm Conversion
                              </button>
                           </motion.div>
                        )}

                        {validationData.count > 0 && (
                           <button
                              onClick={() => setShowValidationError(false)}
                              className="w-full bg-slate-50 text-slate-600 font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
                           >
                              Close Wizard
                           </button>
                        )}
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* CATEGORY CREATION MODAL */}
            <AnimatePresence>
               {isAddingCategory && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-[#0D1B3E]/95 backdrop-blur-md z-[20000] flex items-center justify-center p-6"
                  >
                     <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[50px] p-6 md:p-10 max-w-md w-full text-center space-y-6 shadow-2xl border-t-8 border-[#1565C0]"
                     >
                        <div className="flex justify-between items-start mb-2">
                           <div className="w-16 h-16 bg-blue-50 text-[#1565C0] rounded-full flex items-center justify-center">
                              <Layers size={32} />
                           </div>
                           <button onClick={() => setIsAddingCategory(false)} className="text-slate-500 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>

                        <div className="text-left space-y-2">
                           <h3 className="text-2xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none">New Category</h3>
                           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Create a new product group for your store</p>
                        </div>

                        <form onSubmit={handleCreateCategory} className="text-left space-y-6">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Category Name</label>
                              <input
                                 type="text"
                                 placeholder="e.g. Traditional Sweets"
                                 value={newCategoryForm.name}
                                 onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-[#0D1B3E] outline-none focus:border-[#1565C0] transition-all"
                                 required
                              />
                           </div>

                           <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-[#0D1B3E] uppercase tracking-widest">Main Category</span>
                                 <span className="text-[8px] font-medium text-slate-600 uppercase">
                                    Enable premium card view on public site?
                                 </span>
                              </div>
                              <button
                                 type="button"
                                 onClick={() => setNewCategoryForm({ ...newCategoryForm, isMain: !newCategoryForm.isMain })}
                                 className={`w-14 h-8 rounded-full p-1 transition-all ${newCategoryForm.isMain ? 'bg-[#FFC107]' : 'bg-slate-200'} cursor-pointer`}
                              >
                                 <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-sm ${newCategoryForm.isMain ? 'translate-x-6' : 'translate-x-0'}`} />
                              </button>
                           </div>

                           <div className="flex flex-col gap-3 pt-2">
                              <button
                                 type="button"
                                 onClick={(e) => handleCreateCategory(e, true)}
                                 disabled={actionLoading}
                                 className="w-full bg-[#1565C0] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/10 uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center justify-center gap-2"
                              >
                                 {actionLoading ? <RefreshCw className="animate-spin" size={14} /> : <Plus size={14} />} Save & Add Products
                              </button>
                              <button
                                 type="submit"
                                 disabled={actionLoading}
                                 className="w-full bg-[#0D1B3E] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/10 uppercase tracking-widest text-[10px] hover:bg-[#1565C0] transition-all flex items-center justify-center gap-2"
                              >
                                 {actionLoading ? <RefreshCw className="animate-spin" size={14} /> : <CheckCircle2 size={14} />} Confirm Creation
                              </button>
                              <button
                                 type="button"
                                 onClick={() => setIsAddingCategory(false)}
                                 className="w-full bg-slate-50 text-slate-600 font-black py-4 px-6 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
                              >
                                 Cancel
                              </button>
                           </div>
                        </form>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* CATEGORY EDIT MODAL */}
            <AnimatePresence>
               {editingCategory && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-[#0D1B3E]/95 backdrop-blur-md z-[20000] flex items-center justify-center p-6"
                  >
                     <motion.div
                        initial={{ scale: 0.95, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[50px] p-6 md:p-10 max-w-md w-full text-center space-y-6 shadow-2xl border-t-8 border-[#1565C0]"
                     >
                        <div className="flex justify-between items-start mb-2">
                           <div className="w-16 h-16 bg-blue-50 text-[#1565C0] rounded-full flex items-center justify-center">
                              <Settings size={32} />
                           </div>
                           <button onClick={() => setEditingCategory(null)} className="text-slate-500 hover:text-red-500 transition-colors"><X size={24} /></button>
                        </div>

                        <div className="text-left space-y-2">
                           <h3 className="text-2xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-none">Edit Category</h3>
                           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Update category identity and view mode</p>
                        </div>

                        <form onSubmit={handleUpdateCategory} className="text-left space-y-6">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Category Name</label>
                              <input
                                 type="text"
                                 value={catEditForm.name}
                                 onChange={(e) => setCatEditForm({ ...catEditForm, name: e.target.value })}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-[#0D1B3E] outline-none focus:border-[#1565C0] transition-all"
                                 required
                              />
                           </div>

                           <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-[#0D1B3E] uppercase tracking-widest">Main Category</span>
                                 <span className="text-[8px] font-medium text-slate-600 uppercase">
                                    {editingCategory?.isMain ? 'Permanent Card View Active' : 'Enable Card View Experience'}
                                 </span>
                              </div>
                              {!editingCategory?.isMain ? (
                                 <button
                                    type="button"
                                    onClick={() => setCatEditForm({ ...catEditForm, isMain: !catEditForm.isMain })}
                                    className={`w-14 h-8 rounded-full p-1 transition-all ${catEditForm.isMain ? 'bg-[#FFC107]' : 'bg-slate-200'} cursor-pointer`}
                                 >
                                    <div className={`w-6 h-6 bg-white rounded-full transition-all shadow-sm ${catEditForm.isMain ? 'translate-x-6' : 'translate-x-0'}`} />
                                 </button>
                              ) : (
                                 <div className="bg-[#FFC107]/10 text-[#FFC107] px-3 py-1.5 rounded-xl flex items-center gap-2">
                                    <CheckCircle2 size={12} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Permanent</span>
                                 </div>
                              )}
                           </div>

                           <div className="flex flex-col gap-2 pt-2">
                              <button
                                 type="submit"
                                 disabled={actionLoading}
                                 className="w-full bg-[#0D1B3E] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/10 uppercase tracking-widest text-[10px] hover:bg-[#1565C0] transition-all flex items-center justify-center gap-2"
                              >
                                 {actionLoading ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />} Save Changes
                              </button>
                              <button
                                 type="button"
                                 onClick={() => setEditingCategory(null)}
                                 className="w-full bg-slate-50 text-slate-600 font-black py-4 px-6 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
                              >
                                 Cancel
                              </button>
                           </div>
                        </form>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>
         </main>
      </div>
   );
};

export default ManageCategories;
