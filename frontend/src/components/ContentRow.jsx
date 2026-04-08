import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';

const useNearViewport = () => {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isVisible || !ref.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  return [ref, isVisible];
};

const ContentRow = ({ title, subtitle, items, isLoading, viewAllPath = '/discover' }) => {
  const [rowRef, isVisible] = useNearViewport();

  if (!isLoading && (!items || items.length === 0)) return null;

  const shouldRenderItems = isVisible || isLoading;

  return (
    <div ref={rowRef} className="py-4 md:py-8">
      <div className="mb-2 w-full px-6 md:mb-5 md:px-12 lg:px-20">
        <div className="flex items-end justify-between border-b border-white/5 pb-3">
          <div className="space-y-2">
            <div className="flex items-center gap-3 opacity-60">
              <div className="h-[1px] w-4 bg-emerald-500 shadow-[0_0_10px_#10b981] md:w-6" />
              <p className="text-[8px] font-black uppercase italic leading-none tracking-[0.4em] text-emerald-500 md:text-[10px]">
                {subtitle || 'Featured Archives'}
              </p>
            </div>
            <h2 className="text-2xl font-black uppercase italic leading-none tracking-tighter text-white md:text-5xl">
              {title}
            </h2>
          </div>

          <Link
            to={viewAllPath}
            className="group flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/20 transition-all hover:border-white/10 hover:text-white active:scale-95 md:gap-3 md:rounded-2xl md:px-8 md:py-4 md:text-[10px]"
          >
            Explore <ChevronRight size={14} className="text-white/10 transition-all group-hover:translate-x-1 group-hover:text-emerald-500" />
          </Link>
        </div>
      </div>

      <div className="group/row relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent opacity-0 transition-opacity duration-700 group-hover/row:opacity-100" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent opacity-0 transition-opacity duration-700 group-hover/row:opacity-100" />

        <div className="w-full">
          <div className="no-scrollbar flex gap-4 overflow-x-auto px-6 pb-12 scroll-smooth md:gap-6 md:px-12 lg:px-20">
            {isLoading || !shouldRenderItems
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="aspect-[2/3] min-w-[160px] animate-pulse rounded-[2rem] border border-white/5 bg-white/[0.02] md:min-w-[300px]" />
                ))
              : items.map((item, index) => (
                  <div key={`${item.imdb_id}-${index}`} className="min-w-[160px] md:min-w-[300px]">
                    <div className="group relative">
                      <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 shadow-xl transition-colors duration-300 group-hover:border-emerald-500/20">
                        <MovieCard item={item} className="h-full w-full" />
                      </div>
                      <div className="space-y-2 px-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="line-clamp-1 text-xs font-black uppercase italic leading-tight tracking-tighter text-white/90 transition-colors group-hover:text-emerald-500">
                            {item.title}
                          </h3>
                          <div className="flex-shrink-0 rounded border border-white/5 bg-white/5 px-2 py-0.5 text-[9px] font-black text-emerald-400">
                            {item.rating || '...'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest opacity-30">
                          <span>{item.year || '----'}</span>
                          <span className="italic">{item.certificate || 'NR'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ContentRow);
