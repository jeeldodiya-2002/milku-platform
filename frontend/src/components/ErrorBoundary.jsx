import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 MILKU ENGINE FAILURE:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D1B3E] flex items-center justify-center p-6 font-sans">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white rounded-[40px] p-10 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-10 -mt-10 blur-2xl" />
            
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/10">
              <AlertTriangle size={40} />
            </div>

            <h1 className="text-2xl font-black text-[#0D1B3E] uppercase italic tracking-tighter leading-tight mb-4">
              System Interruption
            </h1>
            
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-10">
              The Milku high-availability engine encountered an unexpected error. Don't worry, your data is safe.
            </p>

            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-[#0D1B3E] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[3px] flex items-center justify-center gap-3 hover:bg-[#1565C0] transition-all shadow-xl shadow-blue-500/20"
            >
              <RefreshCcw size={18} /> Restart Engine
            </button>
            
            <p className="mt-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Error Shield Active • Jay Gayatri Dairy
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
