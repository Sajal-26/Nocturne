import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Info, Plus, ChevronRight, ChevronLeft, Heart, Star, TrendingUp } from 'lucide-react';

const Hero = () => {
  const [heroItems, setHeroItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const query = `
          query {
            trendingMovies(enrich: true) { imdb_id title poster backdrop logo description rating genres year certificate }
            trendingTVShows(enrich: true) { imdb_id title poster backdrop logo description rating genres year certificate }
          }
        `;
        const res = await axios.post('/graphql', { query });
        
        const { trendingMovies, trendingTVShows } = res.data.data;
        const movies = (trendingMovies || []).slice(0, 4).map(i => ({ ...i, titleType: 'MOVIE' }));
        const tvShows = (trendingTVShows || []).slice(0, 4).map(i => ({ ...i, titleType: 'TV SERIES' }));
        const combined = [...movies, ...tvShows].sort(() => Math.random() - 0.5);
        
        setHeroItems(combined);
        setIsLoading(false);
      } catch (err) {
        console.error("Hero Fetch Error:", err);
      }
    };
    fetchHeroContent();
  }, []);

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      diff > 0 ? handleNext() : handlePrev();
    }
    setTouchStart(null);
  };

  useEffect(() => {
    if (heroItems.length === 0 || isPaused) return;
    const timer = setInterval(handleNext, 12000);
    return () => clearInterval(timer);
  }, [heroItems.length, isPaused]);

  if (isLoading || heroItems.length === 0) return (
    <div className="h-[100vh] w-full bg-[#050505] px-6 md:px-12 lg:px-20 flex flex-col justify-end pb-32">
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

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden flex flex-col justify-end"
    >
      {heroItems.map((item, index) => {
        const isActive = index === currentIndex;
        const isNext = direction === 'next';
        let xPos = isNext ? (index < currentIndex ? '-translate-x-full' : 'translate-x-full') 
                          : (index > currentIndex ? 'translate-x-full' : '-translate-x-full');
        if (isActive) xPos = 'translate-x-0';
        return (
          <div 
            key={item.imdb_id || index}
            className={`absolute inset-0 transition-transform duration-[1500ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] ${xPos} ${isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
          >
            {/* Backdrop Layer */}
            <div className="absolute inset-0">
               <img 
                src={item.poster}
                alt=""
                className={`md:hidden w-full h-full object-cover transition-transform duration-[20s] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                style={{ objectPosition: '50% 20%' }}
              />
              <img 
                src={item.backdrop || item.poster}
                alt=""
                className={`hidden md:block w-full h-full object-cover transition-transform duration-[20s] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
                style={{ objectPosition: '50% 15%' }}
                onLoad={() => {}}
                onError={() => {}}
              />
            </div>
            
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10" />
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black via-black/40 to-transparent z-10 hidden md:block" />
            <div className="absolute inset-0 bg-black/30 md:hidden z-10" />
          </div>
        );
      })}

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-24 md:pb-36 px-6 md:px-12 lg:px-20 pointer-events-none">
        {heroItems.map((item, index) => {
          const isActive = index === currentIndex;
          const isNext = direction === 'next';
          let xPos = isNext ? (index < currentIndex ? '-translate-x-full' : 'translate-x-full') 
                            : (index > currentIndex ? 'translate-x-full' : '-translate-x-full');
          if (isActive) xPos = 'translate-x-0';
          return (
            <div 
              key={`${item.imdb_id || index}-content`}
              className={`absolute inset-0 px-6 md:px-12 lg:px-20 flex flex-col justify-end pb-24 md:pb-36 transition-all duration-[1200ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] pointer-events-none ${
                isActive ? 'translate-x-0 opacity-100 delay-300' : `${xPos} opacity-0`
              }`}
            >
              <div className="max-w-4xl space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="space-y-4 md:space-y-6">
                  <div className="min-h-[60px] md:min-h-[100px] lg:min-h-[130px] flex items-end">
                    {item.logo ? (
                      <div className="relative group/logo">
                        <img 
                          src={item.logo} 
                          alt={item.title} 
                          className="h-12 md:h-24 lg:h-32 w-auto max-w-[70vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,1)] filter brightness-125"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                        <h1 style={{ display: 'none' }} className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
                          {item.title}
                        </h1>
                      </div>
                    ) : (
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
                        {item.title}
                      </h1>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 backdrop-blur-md">
                      <TrendingUp size={12} />
                      {item.titleType}
                    </span>
                    {item.year && <span className="text-white/60 font-bold">{item.year}</span>}
                    {item.certificate && (
                      <span className="px-2.5 py-1 border border-white/20 rounded-lg text-white/50 font-bold">
                        {item.certificate}
                      </span>
                    )}
                    {item.rating && (
                      <span className="flex items-center gap-2 text-white/90">
                         <Star size={14} className="fill-emerald-500 text-emerald-500" />
                         <span className="font-bold">{item.rating}</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-2xl font-medium shadow-black/20 text-shadow-sm line-clamp-3 md:line-clamp-none">
                  {item.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 pointer-events-auto">
                  <button className="group relative flex items-center gap-3 bg-white text-black px-10 md:px-14 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] transition-all hover:bg-emerald-500 hover:text-white hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden">
                    <Play size={20} fill="currentColor" className="relative z-10" />
                    <span className="relative z-10">Watch Now</span>
                  </button>
                  <button className="group flex items-center gap-3 bg-white/5 backdrop-blur-3xl border border-white/10 text-white px-10 md:px-14 py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] transition-all hover:bg-white/10 hover:border-white/20 active:scale-95">
                    <Plus size={20} />
                    My List
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      { }
      <div className="absolute bottom-10 right-6 md:right-12 lg:right-20 z-20 flex items-center gap-8">
        <div className="flex gap-2.5">
          {heroItems.map((_, i) => (
            <div
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 'next' : 'prev');
                setCurrentIndex(i);
              }}
              className={`h-1 cursor-pointer transition-all duration-700 rounded-full overflow-hidden ${i === currentIndex ? 'w-20 bg-white/10' : 'w-2 bg-white/5 hover:bg-white/20'}`}
            >
              {i === currentIndex && (
                <div
                  className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-[progress_12s_linear_forwards]"
                  style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={handlePrev} className="p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/20 hover:text-white active:scale-90">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className="p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/20 hover:text-white active:scale-90">
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

export default Hero;
