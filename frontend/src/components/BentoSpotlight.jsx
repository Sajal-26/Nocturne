import React from 'react';
import { TrendingUp, Newspaper, ChevronRight, Globe } from 'lucide-react';
import MovieCard from './MovieCard';

const BentoSpotlight = ({ trending = [], netflix = [], prime = [], isLoading }) => {
  if (isLoading) return (
    <div className="w-full px-6 md:px-12 lg:px-20 py-10 md:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:gap-6 h-[500px] md:h-[600px]">
        <div className="col-span-2 row-span-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse"></div>
        <div className="col-span-1 row-span-1 bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse"></div>
        <div className="col-span-1 row-span-1 bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse"></div>
        <div className="col-span-2 row-span-1 bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse"></div>
      </div>
    </div>
  );

  const main = trending[0];
  const mockNews = [
    { id: 1, tag: "Exclusive", title: "Denis Villeneuve planning third 'Dune' film as 'Messiah' adaptation", time: "2h ago" },
    { id: 2, tag: "Casting", title: "Florence Pugh and Andrew Garfield ensemble drama sets release date", time: "5h ago" },
    { id: 3, tag: "Box Office", title: "Animated features dominate global weekend rankings with record openings", time: "8h ago" }
  ];

  return (
    <div className="w-full px-6 md:px-12 lg:px-20 py-10 md:py-16">
      <div className="flex items-end justify-between mb-8 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500">
            <TrendingUp size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Intelligence Feed</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Spotlight</h2>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Archive v4.0</p>
          <p className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest mt-1">Real-time Synchronization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 h-auto md:h-[650px]">
        { }
        <div className="md:col-span-2 md:row-span-2 h-[400px] md:h-full rounded-[2.5rem] bg-black overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-700 shadow-2xl relative group">
          {main && <MovieCard item={main} className="h-full w-full" />}
          <div className="absolute top-6 left-6 z-20">
            <span className="px-4 py-1.5 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Deep Spotlight</span>
          </div>
        </div>

        { }
        <div className="md:col-span-1 md:row-span-1 h-[300px] md:h-full rounded-[2.5rem] bg-white/[0.02] overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-700 shadow-xl relative group">
          {netflix[0] && <MovieCard item={netflix[0]} className="h-full w-full" />}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">Hot Mix</span>
          </div>
        </div>

        { }
        <div className="md:col-span-1 md:row-span-1 h-[300px] md:h-full rounded-[2.5rem] bg-white/[0.02] overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-700 shadow-xl relative group">
          {prime[0] && <MovieCard item={prime[0]} className="h-full w-full" />}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">Popular</span>
          </div>
        </div>

        {/* Pulse News Section */}
        <div className="md:col-span-2 md:row-span-1 h-[350px] md:h-full group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-2xl p-8 flex flex-col transition-all hover:bg-white/[0.03] hover:border-white/10 will-change-transform">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                <Newspaper size={18} className="text-white/40 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">Cinema Pulse</h3>
            </div>
            <ChevronRight size={20} className="text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
          </div>

          <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar">
            {mockNews.map((news) => (
              <div key={news.id} className="group/item flex items-start gap-5 p-4 rounded-[1.5rem] hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all cursor-pointer">
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[8px] font-black uppercase text-emerald-500 tracking-[0.2em]">{news.tag}</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{news.time}</span>
                  </div>
                  <h4 className="text-[12px] md:text-[13px] font-black text-white/80 leading-tight uppercase tracking-tight group-hover/item:text-white transition-colors">
                    {news.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BentoSpotlight;
