import React from 'react';
import { Star } from 'lucide-react';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop';

const MovieCard = ({ item, className = '', priority = false }) => {
  const isFluid = className.includes('h-full') || className.includes('w-full');
  const posterSrc = item.poster || FALLBACK_POSTER;
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(false);
  }, [posterSrc]);

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
    <div className={`group relative ${!isFluid ? 'aspect-[2/3] w-[160px] md:w-[300px]' : 'h-full w-full'} cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-[#060606] shadow-lg transition-[border-color,box-shadow] duration-300 hover:border-emerald-500/20 hover:shadow-[0_10px_25px_rgba(0,0,0,0.28)] ${className}`}>
      <div className={`absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015),rgba(16,185,129,0.05))]" />
        <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <img
        src={posterSrc}
        alt={item.title}
        className={`h-full w-full object-cover transition-[opacity,transform] duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-[1.03]`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        onError={(event) => {
          if (event.currentTarget.src !== FALLBACK_POSTER) {
            event.currentTarget.src = FALLBACK_POSTER;
            return;
          }
          setIsLoaded(true);
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-emerald-500/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="invisible absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between opacity-100 transition-[opacity,transform] duration-300 sm:translate-y-1 sm:opacity-0 sm:group-hover:visible sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
        <div className="flex items-center gap-2">
          {item.rating && item.rating !== '0.0' && item.rating !== 0 && (
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/60 px-2.5 py-1.5 shadow-lg backdrop-blur-md">
              <Star size={12} fill="#fbbf24" className="text-amber-400" />
              <span className="text-[10px] font-black text-white">{item.rating}</span>
            </div>
          )}
          {normalizedCert && (
            <div className={`flex items-center justify-center rounded-xl border border-transparent px-2.5 py-1.5 ${normalizedCert === 'A' ? 'border-rose-500/30 bg-rose-500/20 text-rose-400' : 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}>
              <span className="text-[9px] font-black uppercase tracking-tighter italic">{normalizedCert}</span>
            </div>
          )}
        </div>
        {item.titleType && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 backdrop-blur-md">
            <span className="text-[9px] font-black uppercase tracking-tighter italic text-white/40">
              {item.titleType === 'movie' || item.titleType === 'MOVIE'
                ? 'Movie'
                : item.titleType === 'tvSeries' || item.titleType === 'TV SERIES'
                  ? 'Series'
                  : item.titleType}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MovieCard);
