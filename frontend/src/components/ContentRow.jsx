import React from 'react';
import MovieCard from './MovieCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContentRow = ({ title, subtitle, items, isLoading, viewAllPath = "/discover" }) => {
  if (!isLoading && (!items || items.length === 0)) return null;

  return (
    <div className="py-4 md:py-8">
      <div className="w-full px-6 md:px-12 lg:px-20 mb-2 md:mb-5">
        <div className="flex items-end justify-between border-b border-white/5 pb-3">
          <div className="space-y-2">
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-4 md:w-6 h-[1px] bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
              <p className="text-emerald-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">{subtitle || "Featured Archives"}</p>
            </div>
            <h2 className="text-2xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h2>
          </div>
          
          <Link 
            to={viewAllPath}
            className="group flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all active:scale-95 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white"
          >
            Explore <ChevronRight size={14} className="text-white/10 group-hover:text-emerald-500 transition-all transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="relative group/row">
        {}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity duration-700"></div>

        <div className="w-full">
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-12 no-scrollbar scroll-smooth px-6 md:px-12 lg:px-20">
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="min-w-[160px] md:min-w-[300px] aspect-[2/3] bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse"></div>
              ))
            ) : (
              items.map((item, index) => (
                <div key={`${item.imdb_id}-${index}`} className="min-w-[160px] md:min-w-[300px]">
                  <MovieCard item={item} />
                </div>
              ))
            )}
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

export default ContentRow;
