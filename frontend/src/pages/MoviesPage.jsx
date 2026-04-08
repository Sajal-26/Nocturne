import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useMovieStore } from '../store/useMovieStore';
import MovieCard from '../components/MovieCard';
import NetflixTimeline from '../components/NetflixTimeline';
import { Globe, TrendingUp, Award, AlertCircle, MapPin, ChevronDown, Filter } from 'lucide-react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
];

const PRIMARY_CATEGORIES = [
  { id: 'movies', path: '/movie/trending', label: 'Trending', icon: <TrendingUp size={12} /> },
  { id: 'top-rated', path: '/movie/top-250', label: 'Top 250', icon: <Award size={12} /> },
  { id: 'top-english', path: '/movie/top-english', label: 'Top English', icon: <Globe size={12} /> },
  { id: 'genre', path: '/movie/genre', label: 'Genres', icon: <Filter size={12} /> },
  { id: 'by-country', path: '/movie/indian-cinema', label: 'Indian Cinema', icon: <MapPin size={12} /> },
  { id: 'bottom', path: '/movie/worst-rated', label: 'Worst Rated', icon: <AlertCircle size={12} /> },
];

const SECONDARY_CATEGORIES = [
  { id: 'netflix', path: '/movie/netflix', label: 'Netflix', icon: <img src="https://assets.nflxext.com/ffe/siteui/common/icons/nficon2016.ico" className="w-3 h-3 object-contain" alt="Netflix" /> },
  { id: 'hotstar', path: '/movie/hotstar', label: 'Hotstar', icon: <img src="https://img.hotstar.com/image/upload/v1737554969/web-assets/prod/images/rebrand/logo.png" className="w-3 h-3 object-contain brightness-200" alt="Hotstar" /> },
];

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'Game-Show',
  'History', 'Horror', 'Music', 'Musical', 'Mystery', 'News',
  'Reality-TV', 'Romance', 'Sci-Fi', 'Short', 'Sport', 'Talk-Show',
  'Thriller', 'War', 'Western'
];

const SORT_OPTIONS = [
  { id: 'DEFAULT', label: 'Default Rank' },
  { id: 'RATING_DESC', label: 'IMDb Rating' },
  { id: 'RELEASE_DESC', label: 'Release Date' },
  { id: 'ALPHABETICAL', label: 'Alphabetical' },
];

const normalizeGenreSlug = (value) => value.toLowerCase();

const parseGenreParam = (value) => {
  if (!value) return [];

  const allowedGenres = new Map(
    GENRES.map((genre) => [normalizeGenreSlug(genre), genre])
  );

  return value
    .split(',')
    .map((genre) => allowedGenres.get(normalizeGenreSlug(genre.trim())))
    .filter(Boolean);
};

const areGenreListsEqual = (left, right) => {
  if (left.length !== right.length) return false;
  return left.every((genre, index) => genre === right[index]);
};

const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const activeOption = SORT_OPTIONS.find((option) => option.id === value) || SORT_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex min-w-[160px] items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-[9px] md:text-[10px] font-black uppercase tracking-[0.14em] transition-all duration-300 ${
          isOpen
            ? 'border-emerald-500/40 bg-emerald-500/10 text-white shadow-[0_10px_30px_rgba(16,185,129,0.15)]'
            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/[0.08]'
        }`}
      >
        <span className="truncate">{activeOption.label}</span>
        <ChevronDown size={12} className={`shrink-0 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+10px)] z-[120] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
      >
        {SORT_OPTIONS.map((option, index) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              onChange(option.id);
              setIsOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] transition-all duration-300 ${
              value === option.id
                ? 'bg-emerald-500/12 text-emerald-400'
                : 'text-white/45 hover:bg-white/5 hover:text-white'
            }`}
            style={{ transitionDelay: isOpen ? `${index * 35}ms` : '0ms' }}
          >
            <span>{option.label}</span>
            {value === option.id && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)]" />}
          </button>
        ))}
      </div>
    </div>
  );
};

const GenreDropdown = ({ selectedGenres, onToggleGenre, onClearGenres }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const summaryLabel = selectedGenres.length
    ? `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''} selected`
    : 'All movie genres';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
          isOpen
            ? 'border-emerald-500/40 bg-emerald-500/10 shadow-[0_10px_30px_rgba(16,185,129,0.12)]'
            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
        }`}
      >
        <div className="min-w-0">
          <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Genre Explorer</span>
          <span className="mt-1 block truncate text-[10px] font-black uppercase tracking-[0.12em] text-white/80">
            {summaryLabel}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`shrink-0 text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}
        />
      </button>

      <div
        className={`absolute left-0 right-0 top-[calc(100%+12px)] z-[130] overflow-hidden rounded-[28px] border border-white/10 bg-[#070707]/95 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <div className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Genre Explorer</span>
              <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/35">
                Select one or more genres to discover matching titles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClearGenres();
                setIsOpen(false);
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/60 transition hover:border-emerald-500/40 hover:text-white"
            >
              Clear genres
            </button>
          </div>

          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => onToggleGenre(genre)}
                  className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  {genre}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:grid-cols-5">
            {GENRES.map((genre) => {
              const isActive = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => onToggleGenre(genre)}
                  className={`rounded-3xl border px-3 py-3 text-[9px] font-black uppercase tracking-[0.12em] transition-all duration-300 sm:px-4 sm:text-[10px] ${
                    isActive
                      ? 'border-emerald-400 bg-emerald-500 text-black shadow-[0_10px_20px_rgba(16,185,129,0.2)]'
                      : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const SubtleRegionSelector = () => {
  const { selectedCountry, setSelectedCountry } = useMovieStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeCountry = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group"
      >
        <span className="text-xs">{activeCountry.flag}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{activeCountry.name}</span>
        <ChevronDown size={10} className={`text-white/20 group-hover:text-emerald-500 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Persistent Menu with Visibility Animations */}
      <div className={`absolute top-full left-0 mt-3 w-52 bg-[#0a0a0a]/95 border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[1000] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isOpen 
        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
        : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
      }`}>
         <div className="p-2 grid grid-cols-1 gap-1">
            <div className="px-3 py-2 text-[8px] font-black text-white/20 uppercase tracking-[0.2em] border-b border-white/5 mb-1">
               Select Region
            </div>
            {COUNTRIES.map(country => (
              <button
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country.code);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left transition-all duration-300 ${
                  selectedCountry === country.code
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs shadow-inner">
                      {country.flag}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest italic">{country.name}</span>
                </div>
                {selectedCountry === country.code && (
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
                )}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

const MoviesPage = () => {
  const { 
    trending, 
    contentType, 
    setContentType, 
    selectedCountry,
    isLoading, 
    fetchTrending,
    loadMoreTrending,
    hasMoreTrending,
    isFetchingMoreTrending,
    initUserLocation,
    selectedNetflixDate,
    setSelectedNetflixDate,
    advanceFilters,
    updateAdvanceFilters
  } = useMovieStore();

  const { date } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);
  const loadMoreRef = useRef(null);
  const [sortBy, setSortBy] = useState('DEFAULT');

  const selectedGenres = advanceFilters?.genres || [];
  const genreParam = searchParams.get('g') || '';
  const isGenreView = contentType === 'genre' || location.pathname === '/movie/genre';

  const handleGenreToggle = (genre) => {
    const nextGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((item) => item !== genre)
      : [...selectedGenres, genre];

    updateAdvanceFilters({ genres: nextGenres, query: '', titleType: 'movie' });
    const nextGenreParam = nextGenres.map(normalizeGenreSlug).join(',');

    if (location.pathname !== '/movie/genre') {
      navigate(nextGenreParam ? `/movie/genre?g=${nextGenreParam}` : '/movie/genre');
      return;
    }

    setSearchParams(nextGenreParam ? { g: nextGenreParam } : {}, { replace: true });

    if (contentType !== 'genre') {
      setContentType('genre');
    }
  };

  const clearGenres = () => {
    updateAdvanceFilters({ genres: [], query: '', titleType: 'movie' });
    if (location.pathname !== '/movie/genre') {
      navigate('/movie/genre');
      return;
    }
    setSearchParams({}, { replace: true });
    if (contentType !== 'genre') {
      setContentType('genre');
    }
  };

  const sortedTrending = useMemo(() => {
    const items = [...trending];

    if (sortBy === 'RATING_DESC') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'RELEASE_DESC') {
      items.sort((a, b) => (parseInt(b.year || 0, 10) || 0) - (parseInt(a.year || 0, 10) || 0));
    } else if (sortBy === 'ALPHABETICAL') {
      items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return items;
  }, [trending, sortBy]);

  // Unified Sync & Fetch Engine
  useEffect(() => {
    const syncAndFetch = async () => {
      const path = location.pathname;
      let targetType = contentType;
      let targetDate = selectedNetflixDate;
      let nextPath = null;

      // 1. Initial Location Hydration
      if (isInitialMount.current) {
        await initUserLocation();
        isInitialMount.current = false;
      }

      // 2. URL -> State Mapping
      if (path.startsWith('/movie/netflix') || path.startsWith('/netflix')) {
        targetType = 'netflix';
        if (contentType !== 'netflix' || !selectedNetflixDate) {
          const today = new Date();
          targetDate = new Date(today.setDate(today.getDate() - today.getDay()));
          targetDate.setHours(0, 0, 0, 0);
        }
      } else if (path === '/movie/hotstar' || path === '/hotstar') {
        targetType = 'hotstar';
      } else if (path === '/movie/top-250' || path === '/top-250') {
        targetType = 'top-rated';
      } else if (path === '/movie/top-english' || path === '/top-english') {
        targetType = 'top-english';
      } else if (path === '/movie/genre') {
        targetType = 'genre';
        const parsedGenres = parseGenreParam(genreParam);
        if (advanceFilters.titleType !== 'movie' || advanceFilters.query !== '' || !areGenreListsEqual(selectedGenres, parsedGenres)) {
          updateAdvanceFilters({ genres: parsedGenres, titleType: 'movie', query: '' });
          return;
        }
      } else if (path === '/movie/indian-cinema' || path === '/indian-cinema') {
        targetType = 'by-country';
      } else if (path === '/movie/worst-rated' || path === '/worst-rated') {
        targetType = 'bottom';
      } else if (path === '/movie/trending' || path === '/trending-movie' || path === '/movies' || path === '/movie') {
        targetType = 'movies';
      }

      // 3. Commit States (Batch Update)
      if (targetType !== contentType) {
        setContentType(targetType);
        return;
      }
      if (targetDate && targetDate.getTime() !== selectedNetflixDate?.getTime()) {
        setSelectedNetflixDate(targetDate);
        return;
      }

      // 4. State -> URL Mapping (Persistence)
      if (targetType === 'netflix' && path !== '/movie/netflix') {
        nextPath = '/movie/netflix';
      } else if (targetType === 'hotstar' && path !== '/movie/hotstar') {
        nextPath = '/movie/hotstar';
      } else if (targetType === 'top-rated' && path !== '/movie/top-250') {
        nextPath = '/movie/top-250';
      } else if (targetType === 'top-english' && path !== '/movie/top-english') {
        nextPath = '/movie/top-english';
      } else if (targetType === 'by-country' && path !== '/movie/indian-cinema') {
        nextPath = '/movie/indian-cinema';
      } else if (targetType === 'bottom' && path !== '/movie/worst-rated') {
        nextPath = '/movie/worst-rated';
      } else if (targetType === 'movies' && path !== '/movie/trending') {
        nextPath = '/movie/trending';
      }

      if (nextPath) {
        navigate(nextPath, { replace: true });
        return;
      }

      // 5. Trigger Engine
      fetchTrending();
    };

    syncAndFetch();
  }, [location.pathname, genreParam, date, selectedCountry, contentType, selectedNetflixDate]);

  useEffect(() => {
    if (!loadMoreRef.current || contentType !== 'genre' || !hasMoreTrending) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreTrending();
        }
      },
      { rootMargin: '500px 0px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [contentType, hasMoreTrending, loadMoreTrending]);

  return (
    <div className="min-h-screen bg-black pb-20 selection:bg-emerald-500/30">
      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-2 pt-20 space-y-4 sm:px-3 md:px-4 md:pt-24 md:space-y-5">
        
        {/* Navigation Layer - Primary Filters */}
        <div className="relative z-[100] space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
           {/* Row 1: Primary Filters */}
           <div className="space-y-3">
              <div className="flex items-center gap-3 h-6">
                 <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Rankings & Charts</span>
                 <div className={`transition-all duration-500 transform ${
                   contentType === 'by-country' 
                   ? 'opacity-100 translate-x-0' 
                   : 'opacity-0 -translate-x-4 pointer-events-none'
                 }`}>
                    <SubtleRegionSelector />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap">
                {PRIMARY_CATEGORIES.map(cat => (
                  <button
                     key={cat.id}
                     onClick={() => navigate(cat.path)}
                     className={`w-full md:w-auto px-3 md:px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.14em] md:tracking-widest transition-all duration-300 border ${
                       contentType === cat.id
                       ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_5px_20px_rgba(16,185,129,0.3)]'
                       : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:border-white/10 hover:bg-white/[0.08]'
                     }`}
                  >
                    <div className="flex items-center gap-2">
                       {cat.icon}
                       <span>{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
           </div>

           {/* Row 2: Platforms */}
           <div className="space-y-3">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Platforms</span>
              <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-3">
                {SECONDARY_CATEGORIES.map(cat => (
                  <button
                     key={cat.id}
                     onClick={() => navigate(cat.path)}
                     className={`w-full md:w-auto px-4 md:px-5 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.14em] md:tracking-widest transition-all duration-300 border ${
                       contentType === cat.id
                       ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_5px_20px_rgba(16,185,129,0.3)]'
                       : 'bg-white/5 text-white/40 border-white/5 hover:text-white hover:border-white/10 hover:bg-white/[0.08]'
                     }`}
                  >
                    <div className="flex items-center gap-2">
                       {cat.icon}
                       <span>{cat.label}</span>
                    </div>
                  </button>
               ))}
              </div>
           </div>

           {isGenreView && (
           <div className="grid gap-3 md:gap-4">
              <GenreDropdown
                selectedGenres={selectedGenres}
                onToggleGenre={handleGenreToggle}
                onClearGenres={clearGenres}
              />
           </div>
           )}

           <div className="flex items-center justify-between gap-4 border-t border-white/[0.03] pt-4">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Sort Results</span>
              <SortDropdown value={sortBy} onChange={setSortBy} />
           </div>

           {/* Contextual Timeline Row (Netflix Specific) */}
           <div className={`transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] transform origin-top border-t border-white/[0.03] pt-12 ${
             contentType === 'netflix' 
             ? 'opacity-100 translate-y-0 scale-100 h-auto visible mb-8' 
             : 'opacity-0 -translate-y-8 scale-[0.98] h-0 invisible pointer-events-none overflow-hidden'
           }`}>
              <NetflixTimeline onSelect={setSelectedNetflixDate} selectedDate={selectedNetflixDate} />
           </div>
        </div>

        {/* Results Grid */}
        <div className="relative z-10">
           {isLoading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
               {Array.from({ length: 15 }).map((_, i) => (
                 <div key={i} className="aspect-[2/3] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse overflow-hidden" />
               ))}
             </div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-12">
               {sortedTrending.map((movie, index) => (
                 <div 
                   key={`${movie.imdb_id}-${index}`}
                   className="group relative animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                   style={{ animationDelay: `${index * 40}ms` }}
                 >
                   <div className="relative mb-6 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-white/5 transition-colors duration-300 group-hover:border-emerald-500/20">
                     <MovieCard item={movie} className="w-full h-full" priority={index < 10} />
                     <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                       <div className="bg-emerald-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded shadow-[0_4px_15px_rgba(16,185,129,0.3)] border border-emerald-400/20">
                         #{index + 1}
                       </div>
                     </div>
                   </div>
                   
                   <div className="space-y-2 px-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-white/90 font-black text-xs uppercase tracking-tighter leading-tight group-hover:text-emerald-500 transition-colors line-clamp-1 italic">
                          {movie.title}
                        </h3>
                        <div className="flex-shrink-0 bg-white/5 px-2 py-0.5 rounded text-emerald-400 text-[9px] font-black border border-white/5">
                           {movie.rating || '★'}
                        </div>
                      </div>
                      <div className="flex items-center justify-between opacity-30 text-[9px] font-bold uppercase tracking-widest">
                         <span>{movie.year || '----'}</span>
                         <span className="italic">{movie.certificate || 'NR'}</span>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
           )}

           {contentType === 'genre' && sortedTrending.length > 0 && (
             <div ref={loadMoreRef} className="flex justify-center py-12">
               {isFetchingMoreTrending ? (
                 <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-400">
                   Loading more movies...
                 </div>
               ) : hasMoreTrending ? (
                 <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 animate-pulse" />
               ) : (
                 <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/25">
                   End of results
                 </div>
               )}
             </div>
           )}

           {/* Empty State */}
           {!isLoading && trending.length === 0 && (
             <div className="flex flex-col items-center justify-center py-40 text-center animate-in zoom-in-95 duration-700">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 text-white/10">
                 <AlertCircle size={24} />
               </div>
               <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white/20 text-center italic">Hub Connection Failed</h2>
               <button 
                 onClick={() => fetchTrending()}
                 className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all italic"
               >
                 Re-link Database
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
