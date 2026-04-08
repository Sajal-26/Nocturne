import React from 'react';
import { Star, Clock, Film } from 'lucide-react';

const MovieCard = ({ item, className = "" }) => {
  const isFluid = className.includes('h-full') || className.includes('w-full');

  const normalizeCertificate = (cert) => {
    if (!cert) return null;
    const c = cert.toUpperCase().replace(/\s+/g, '');
    if (c === 'U' || c === 'G') return 'U';
    if (c === 'A' || c === 'R' || c === 'ADULT' || c === '18+' || c === 'NC-17' || c === 'X') return 'A';
    if (c.includes('UA') || c.includes('U/A') || c.includes('13+') || c.includes('16+') || c.includes('7+') || c === 'PG-13' || c === 'PG') return 'UA';
    if (c === 'NR' || c === 'UNKNOWN' || c === 'UR') return null;
    return cert;
  };

  const normalizedCert = normalizeCertificate(item.certificate);

  return (
    <div className={`group relative ${!isFluid ? 'w-[160px] md:w-[300px] aspect-[2/3]' : 'w-full h-full'} rounded-xl md:rounded-2xl overflow-hidden bg-[#060606] border border-white/5 transition-all duration-500 cursor-pointer hover:border-emerald-500/30 hover:scale-[1.02] shadow-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)] will-change-transform ${className}`}>
      {/* Poster */}
      <img
        src={item.poster || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop'}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 will-change-transform"
        loading="lazy"
      />

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 will-change-opacity" />
      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 will-change-opacity" />

      {/* Rating & Cert (Bottom) */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100 invisible sm:group-hover:visible transition-all duration-500 transform translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 z-10 will-change-[transform,opacity]">
        <div className="flex items-center gap-2">
          {item.rating && item.rating !== "0.0" && item.rating !== 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-lg">
              <Star size={12} fill="#fbbf24" className="text-amber-400" />
              <span className="text-white text-[10px] font-black">{item.rating}</span>
            </div>
          )}
          {normalizedCert && (
            <div className={`px-2.5 py-1.5 ${normalizedCert === 'A' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'} border border-transparent rounded-xl flex items-center justify-center`}>
              <span className="text-[9px] font-black uppercase tracking-tighter italic">{normalizedCert}</span>
            </div>
          )}
        </div>
        {item.titleType && (
          <div className="px-2.5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
            <span className="text-white/40 text-[9px] font-black uppercase tracking-tighter italic">
              {item.titleType === 'movie' || item.titleType === 'MOVIE' ? 'Movie' : 
               item.titleType === 'tvSeries' || item.titleType === 'TV SERIES' ? 'Series' : item.titleType}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
