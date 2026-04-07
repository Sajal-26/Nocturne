import React from 'react';
import { Home, Music, Volume2, Mic2, Disc, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const MusicPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 pb-20 pt-32 md:pt-40 overflow-hidden relative">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] animate-pulse delay-700" />
      
      <div className="relative z-10 text-center max-w-2xl animate-in fade-in zoom-in duration-1000 ease-out">
        <div className="relative inline-block mb-10 group">
          <div className="absolute inset-0 bg-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
          <div className="relative w-24 h-24 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700">
            <Music size={48} className="text-emerald-500 animate-[bounce_2s_infinite]" />
          </div>
          
          {/* Decorative Icons */}
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-xl flex items-center justify-center animate-bounce delay-100">
            <Volume2 size={20} className="text-emerald-500/50" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-xl flex items-center justify-center animate-bounce delay-300">
            <Disc size={20} className="text-emerald-500/50 animate-spin-slow" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4 leading-tight">
          Nocturne <span className="text-emerald-500">Audio Node</span>
        </h1>
        
        <p className="text-white/40 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase italic mb-12 px-6 max-w-lg mx-auto leading-loose">
          Synchronizing sonic signatures. <br />
          <span className="text-white/20">A premium audio experience is being mastered in the void.</span>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {['Soundtracks', 'Originals', 'Synthetics'].map((item) => (
                <div key={item} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center gap-2 group cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                        <Play size={14} fill="currentColor" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-all">{item}</span>
                </div>
            ))}
        </div>

        <Link 
          to="/" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-500 hover:text-white hover:scale-110 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
        >
          <Home size={18} /> Command Centre
        </Link>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MusicPage;
