import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Info, Plus, ChevronRight, ChevronLeft, Heart, Star, Clock } from 'lucide-react';

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
        const movies = (trendingMovies || []).slice(0, 4).map(i => ({ ...i, type: 'MOVIE' }));
        const tvShows = (trendingTVShows || []).slice(0, 4).map(i => ({ ...i, type: 'TV SERIES' }));
        const combined = [...movies, ...tvShows].sort(() => Math.random() - 0.5);
        setHeroItems(combined);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
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
    <div className="h-[100vh] w-full bg-[#050505] p-10 md:p-24 lg:p-32 flex flex-col justify-end pb-32">
       <div className="animate-pulse space-y-12">
          <div className="space-y-4">
             <div className="h-24 w-2/3 rounded-3xl bg-white/5" />
             <div className="h-24 w-1/2 rounded-3xl bg-white/5" />
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
      className="relative h-[100vh] w-full overflow-hidden group/hero bg-black select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {heroItems.map((item, index) => {
        const isActive = index === currentIndex;
        const isNext = direction === 'next';
        let xPos = isNext ? (index < currentIndex ? '-translate-x-full' : 'translate-x-full') 
                          : (index > currentIndex ? 'translate-x-full' : '-translate-x-full');
        if (isActive) xPos = 'translate-x-0';
        return (
          <div 
            key={item.imdb_id}
            className={`absolute inset-0 z-0 transition-transform duration-[1500ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${xPos}`}
            style={{ 
              opacity: isActive ? 1 : 0,
              visibility: Math.abs(index - currentIndex) <= 1 ? 'visible' : 'hidden'
            }}
          >
            {}
            <img 
              src={item.poster}
              alt=""
              className={`md:hidden w-full h-full object-cover transition-transform duration-[24s] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
              style={{ objectPosition: '50% 20%' }}
            />
            {}
            <img 
              src={item.backdrop || item.poster}
              alt=""
              className={`hidden md:block w-full h-full object-cover transition-transform duration-[24s] ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
              style={{ objectPosition: '50% 30%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-transparent z-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-0 hidden md:block" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] md:hidden z-0" />
          </div>
        );
      })}

      <div className="relative z-10 h-full flex flex-col justify-end pb-12 md:pb-32 px-6 md:px-24 lg:px-32 max-w-[1700px] pointer-events-none">
        {heroItems.map((item, index) => {
          const isActive = index === currentIndex;
          const isNext = direction === 'next';
          let xPos = isNext ? (index < currentIndex ? '-translate-x-full' : 'translate-x-full') 
                            : (index > currentIndex ? 'translate-x-full' : '-translate-x-full');
          if (isActive) xPos = 'translate-x-0';
          return (
            <div 
              key={`${item.imdb_id}-content`}
              className={`absolute inset-0 px-6 md:px-24 lg:px-32 flex flex-col justify-end pb-12 md:pb-32 transition-all duration-[1200ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] pointer-events-none ${
                isActive ? 'translate-x-0 opacity-100 delay-300' : `${xPos} opacity-0`
              }`}
            >
              <div className="pointer-events-auto flex flex-col items-center md:items-start text-center md:text-left">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.title}
                    className="max-h-28 md:max-h-40 lg:max-h-52 w-auto max-w-[280px] md:max-w-[420px] object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)] mb-4 md:mb-8"
                  />
                ) : (
                  <h1 
                    className="text-4xl md:text-6xl lg:text-[5.5rem] font-black italic uppercase leading-[1.1] text-white mb-4 md:mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] line-clamp-2"
                    style={{ letterSpacing: "-1px" }}
                  >
                    {item.title}
                  </h1>
                )}

                <div className="flex items-center gap-3 mb-6 flex-wrap justify-center md:justify-start">
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] rounded">
                    {item.type}
                  </span>
                  <span className="px-2.5 py-1 bg-white/5 border border-white/15 text-white/80 text-[9px] font-black uppercase tracking-[0.2em] rounded">
                    {item.certificate || 'NR'}
                  </span>
                  <div className="flex items-center gap-4 text-white/40 text-[9px] font-black uppercase tracking-[0.2em] border-l border-white/15 pl-4 ml-1">
                    <span className="text-amber-400 flex items-center gap-1"><Star size={10} fill="currentColor"/> {item.rating || '8.2'}</span>
                    <span>{item.year}</span>
                    <span className="hidden sm:inline">{(item.genres || ['Action'])[0]}</span>
                  </div>
                </div>

                <p className="text-sm md:text-base text-white/60 max-w-sm md:max-w-2xl leading-[1.6] mb-8 font-medium line-clamp-3 md:line-clamp-2 italic tracking-tight opacity-90">
                  {item.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button className="w-full sm:w-auto group relative px-12 py-4 md:px-14 md:py-6 bg-white text-black font-black uppercase text-[10px] md:text-xs tracking-[0.3em] rounded-xl hover:bg-emerald-500 transition-all duration-700 flex items-center justify-center gap-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <Play size={18} fill="black" className="relative z-10 transition-transform group-hover:scale-110" /> 
                    <span className="relative z-10 font-black">Watch Now</span>
                    <div className="absolute inset-0 bg-emerald-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
                  </button>

                  <div 
                    className="flex items-center gap-2 p-1 backdrop-blur-3xl rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    <button className="p-4 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                      <Info size={20} />
                    </button>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <button className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-3">
                      <Plus size={18} /> My List
                    </button>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <button className="p-4 text-white/60 hover:text-pink-500 hover:bg-pink-500/10 rounded-xl transition-all">
                      <Heart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 md:bottom-16 left-1/2 md:left-auto md:right-16 transform -translate-x-1/2 md:translate-x-0 z-20 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="flex gap-2.5">
          {heroItems.map((_, i) => (
            <div 
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 'next' : 'prev');
                setCurrentIndex(i);
              }}
              className={`h-1 cursor-pointer transition-all duration-700 rounded-full overflow-hidden ${i === currentIndex ? 'w-12 md:w-20 bg-white/10' : 'w-2 bg-white/5 hover:bg-white/20'}`} 
            >
              {i === currentIndex && (
                <div 
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-[progress_12s_linear_forwards]" 
                  style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-8">
          <button onClick={handlePrev} className="p-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className="p-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white">
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
