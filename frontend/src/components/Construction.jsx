import React from 'react';
import { Home, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Construction = ({ title }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 pb-20 pt-32 md:pt-40 overflow-hidden relative">
      {}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse delay-700" />
      
      <div className="relative z-10 text-center max-w-2xl animate-in fade-in zoom-in duration-1000 ease-out">
        <div className="relative inline-block mb-10 group">
          <div className="absolute inset-0 bg-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />
          <div className="relative w-24 h-24 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl">
            <Sparkles size={48} className="text-emerald-500 animate-bounce" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-4 leading-tight">
          {title} <span className="text-emerald-500">Node</span>
        </h1>
        
        <p className="text-white/40 text-lg md:text-xl font-medium tracking-wide uppercase italic mb-12">
          This sector is currently under construction. <br />
          <span className="text-white/20">The Nocturne Forge is crafting something extraordinary.</span>
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:scale-110 transition-all duration-500 shadow-[0_0_40px_rgba(16,185,129,0.3)] group active:scale-95"
        >
          <Home size={20} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Construction;
