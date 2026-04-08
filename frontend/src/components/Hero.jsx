import React from 'react';
import { Play, Plus, ChevronRight, ChevronLeft, Star, TrendingUp } from 'lucide-react';
import { useMovieStore } from '../store/useMovieStore';

const Hero = () => {
  const heroSource = useMovieStore((state) => state.homeTrending);
  const isLoading = useMovieStore((state) => state.homeTrendingLoading);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState('next');
  const [isPaused, setIsPaused] = React.useState(false);

  const heroItems = React.useMemo(() => heroSource.slice(0, 8), [heroSource]);

  const handleNext = React.useCallback(() => {
    if (heroItems.length === 0) return;
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  const handlePrev = React.useCallback(() => {
    if (heroItems.length === 0) return;
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  }, [heroItems.length]);

  React.useEffect(() => {
    if (currentIndex >= heroItems.length && heroItems.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, heroItems.length]);

  React.useEffect(() => {
    if (heroItems.length <= 1 || isPaused) return undefined;
    const timer = window.setInterval(handleNext, 12000);
    return () => window.clearInterval(timer);
  }, [handleNext, heroItems.length, isPaused]);

  if (isLoading || heroItems.length === 0) {
    return (
      <div className="flex h-[100vh] w-full flex-col justify-end bg-[#050505] px-6 pb-32 md:px-12 lg:px-20">
        <div className="animate-pulse space-y-12">
          <div className="space-y-4">
            <div className="h-24 w-2/3 rounded-3xl bg-white/5" />
            <div className="h-4 w-1/2 rounded-full bg-white/5" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-1/3 rounded-full bg-white/5" />
            <div className="h-4 w-1/4 rounded-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex h-[85vh] w-full flex-col justify-end overflow-hidden md:h-[95vh]"
    >
      {heroItems.map((item, index) => {
        const isActive = index === currentIndex;
        const isNext = direction === 'next';
        let xPos = isNext ? (index < currentIndex ? '-translate-x-full' : 'translate-x-full') : (index > currentIndex ? 'translate-x-full' : '-translate-x-full');
        if (isActive) xPos = 'translate-x-0';

        return (
          <div
            key={item.imdb_id || index}
            className={`absolute inset-0 transition-transform duration-[1500ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${xPos} ${isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
          >
            <div className="absolute inset-0">
              <img
                src={item.poster}
                alt=""
                className={`h-full w-full object-cover md:hidden transition-transform duration-[20s] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                style={{ objectPosition: '50% 20%' }}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
              <img
                src={item.backdrop || item.poster}
                alt=""
                className={`hidden h-full w-full object-cover md:block transition-transform duration-[20s] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                style={{ objectPosition: '50% 15%' }}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
            </div>

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black/20" />
            <div className="absolute inset-y-0 left-0 z-10 hidden w-2/3 bg-gradient-to-r from-black via-black/40 to-transparent md:block" />
            <div className="absolute inset-0 z-10 bg-black/30 md:hidden" />
          </div>
        );
      })}

      <div className="pointer-events-none relative z-20 flex h-full flex-col justify-end px-6 pb-24 md:px-12 md:pb-36 lg:px-20">
        {heroItems.map((item, index) => {
          const isActive = index === currentIndex;
          const isNext = direction === 'next';
          let xPos = isNext ? (index < currentIndex ? '-translate-x-full' : 'translate-x-full') : (index > currentIndex ? 'translate-x-full' : '-translate-x-full');
          if (isActive) xPos = 'translate-x-0';

          return (
            <div
              key={`${item.imdb_id || index}-content`}
              className={`pointer-events-none absolute inset-0 flex translate-x-0 flex-col justify-end px-6 pb-24 transition-all duration-[1200ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] md:px-12 md:pb-36 lg:px-20 ${
                isActive ? 'translate-x-0 opacity-100 delay-300' : `${xPos} opacity-0`
              }`}
            >
              <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 md:space-y-10">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex min-h-[60px] items-end md:min-h-[100px] lg:min-h-[130px]">
                    {item.logo ? (
                      <div className="relative">
                        <img
                          src={item.logo}
                          alt={item.title}
                          className="h-12 w-auto max-w-[70vw] object-contain brightness-125 drop-shadow-[0_20px_50px_rgba(0,0,0,1)] md:h-24 lg:h-32"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                        <h1 style={{ display: 'none' }} className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)] md:text-6xl lg:text-7xl">
                          {item.title}
                        </h1>
                      </div>
                    ) : (
                      <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)] md:text-6xl lg:text-7xl">
                        {item.title}
                      </h1>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] md:text-xs">
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-400 backdrop-blur-md">
                      <TrendingUp size={12} />
                      {item.titleType}
                    </span>
                    {item.year && <span className="font-bold text-white/60">{item.year}</span>}
                    {item.certificate && <span className="rounded-lg border border-white/20 px-2.5 py-1 text-white/50">{item.certificate}</span>}
                    {item.rating && (
                      <span className="flex items-center gap-2 text-white/90">
                        <Star size={14} className="fill-emerald-500 text-emerald-500" />
                        <span className="font-bold">{item.rating}</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="max-w-2xl line-clamp-3 text-sm font-medium leading-relaxed text-white/50 md:text-base md:line-clamp-none">
                  {item.description}
                </p>

                <div className="pointer-events-auto flex items-center gap-4 pt-4">
                  <button className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:bg-emerald-500 hover:text-white active:scale-95 md:px-14 md:py-5 md:text-xs">
                    <Play size={20} fill="currentColor" className="relative z-10" />
                    <span className="relative z-10">Watch Now</span>
                  </button>
                  <button className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-3xl transition-all hover:border-white/20 hover:bg-white/10 active:scale-95 md:px-14 md:py-5 md:text-xs">
                    <Plus size={20} />
                    My List
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-10 right-6 z-20 flex items-center gap-8 md:right-12 lg:right-20">
        <div className="flex gap-2.5">
          {heroItems.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setDirection(index > currentIndex ? 'next' : 'prev');
                setCurrentIndex(index);
              }}
              className={`h-1 cursor-pointer overflow-hidden rounded-full transition-all duration-700 ${index === currentIndex ? 'w-20 bg-white/10' : 'w-2 bg-white/5 hover:bg-white/20'}`}
            >
              {index === currentIndex && (
                <div
                  className="h-full animate-[progress_12s_linear_forwards] bg-emerald-500 shadow-[0_0_15px_#10b981]"
                  style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button onClick={handlePrev} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/20 backdrop-blur-3xl transition-all hover:bg-white/10 hover:text-white active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/20 backdrop-blur-3xl transition-all hover:bg-white/10 hover:text-white active:scale-90">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes progress { 0% { width: 0% } 100% { width: 100% } }
      `}</style>
    </section>
  );
};

export default React.memo(Hero);
