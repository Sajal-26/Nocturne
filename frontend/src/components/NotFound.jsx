import React from 'react';
import { Compass, MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-emerald-500 selection:text-black">
      {}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[180px] animate-pulse" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse" />
      
      <div className="relative z-10 text-center max-w-2xl px-4 pt-32 md:pt-40 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 ease-out">
        <div className="relative inline-block mb-10 group">
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" />
          <div className="relative w-32 h-32 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <Compass size={64} className="text-emerald-500 group-hover:rotate-[360deg] transition-all duration-1000" />
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-6 leading-tight">
          Seems like you are <span className="text-emerald-500">Lost!</span>
        </h1>
        
        <p className="text-white/40 text-lg md:text-xl font-medium tracking-[0.2em] uppercase italic mb-14 px-4 max-w-lg mx-auto">
          The node you are seeking has drifted into the <br />
          <span className="text-white opacity-20">Digital Void.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/" 
            className="group flex items-center gap-4 px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-emerald-500 hover:text-white hover:scale-105 transition-all duration-700 shadow-2xl active:scale-95"
          >
             Back to Command Centre
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-emerald-500 transition-all group"
          >
            <MoveLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Last Known Position
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 hidden md:block select-none pointer-events-none opacity-5">
        <span className="text-[150px] font-black text-white italic tracking-tighter uppercase">404</span>
      </div>
    </div>
  );
};

export default NotFound;
