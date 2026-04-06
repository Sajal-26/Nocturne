import React from 'react';
import { Star, Clock, Film } from 'lucide-react';

const MovieCard = ({ item }) => {
  return (
    <div className="group relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all duration-500 hover:-translate-y-2 border border-white/10 bg-[#060606]">
      <img 
        decoding="async"
        src={item.poster || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop'} 
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]" />

      <div className="hidden sm:block absolute top-4 left-4 z-[5] transition-opacity duration-500">
        <span className="px-3 py-1.5 bg-black/80 sm:bg-black/60 sm:backdrop-blur-xl border border-white/10 rounded-xl text-[8px] font-black tracking-widest text-emerald-400 shadow-lg uppercase">
          {item.titleType === 'movie' || item.titleType === 'tvMovie' ? 'MOVIE' : 
           item.titleType === 'tvSeries' ? 'TV SERIES' : 
           item.titleType === 'tvMiniSeries' ? 'MINI SERIES' : 
           item.titleType === 'videoOriginal' ? 'ORIGINAL' : 
           item.titleType || 'TITLE'}
        </span>
      </div>

      <button className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-[6] overflow-hidden pointer-events-none">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(16,185,129,0.8)] scale-50 group-hover:scale-100 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
          <Film size={28} />
        </div>
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 flex flex-col justify-end z-[5] bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        <div className="flex items-center gap-2 w-full sm:translate-y-3 sm:group-hover:translate-y-0 transition-transform duration-500">
          {item.rating && (
            <span className="px-2 py-1 sm:px-2.5 sm:py-1.5 bg-black/80 sm:bg-black/60 sm:backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black text-amber-400 flex items-center gap-1 shadow-lg">
              <Star size={10} fill="currentColor" /> {item.rating}
            </span>
          )}
          {item.certificate && item.certificate !== 'UNKNOWN' && (
            <span className={`px-2 py-1 sm:px-2.5 sm:py-1.5 ${item.isAdult || item.certificate === 'A' ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' : 'bg-emerald-900/40 sm:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'} sm:backdrop-blur-xl border rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black tracking-widest uppercase shadow-lg transition-colors`}>
              {(item.certificate === 'NR' && item.isAdult) ? 'A' : item.certificate}
            </span>
          )}
        </div>
        
        <div className="hidden sm:flex flex-col gap-2.5 text-white/50 transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-[80px] group-hover:opacity-100 group-hover:mt-4 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3">
            {item.year && (
              <span className="text-[10px] font-black text-white px-2 py-1 bg-white/5 rounded-md border border-white/5">
                {item.year}
              </span>
            )}
            {item.duration && (
              <span className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1 shrink-0">
                <Clock size={10} /> {item.duration}
              </span>
            )}
          </div>
          {item.genres && item.genres.length > 0 && (
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] truncate text-white/50">
              {item.genres.join(' • ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
