import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovieStore } from '../store/useMovieStore';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';
import { 
  Search, Filter, Sliders, Calendar, Star, Clock, 
  ChevronRight, ChevronDown, Check, X, RotateCcw,
  Film, Monitor, User, Globe, Tag, AlertTriangle, Briefcase
} from 'lucide-react';

const GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "History", 
  "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", 
  "Short", "Sport", "Thriller", "War", "Western"
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' }
];

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' }
];

const SORT_OPTIONS = [
  { id: 'POPULARITY', name: 'Popularity' },
  { id: 'USER_RATING', name: 'Rating' },
  { id: 'RELEASE_DATE', name: 'Release Date' },
  { id: 'ALPHABETICAL', name: 'Alphabetical' }
];

const TITLE_TYPES = [
  { id: 'ALL', name: 'All Content', icon: <Globe size={14} /> },
  { id: 'movie', name: 'Movies', icon: <Film size={14} /> },
  { id: 'tvSeries', name: 'TV Shows', icon: <Monitor size={14} /> },
  { id: 'tvMiniSeries', name: 'Mini Series', icon: <Monitor size={14} /> },
  { id: 'person', name: 'People', icon: <User size={14} /> },
  { id: 'company', name: 'Companies', icon: <Briefcase size={14} /> }
];

const VOTES_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 1000, label: "1K+ Minimum" },
  { value: 10000, label: "10K+ Minimum" },
  { value: 50000, label: "50K+ Minimum" },
  { value: 100000, label: "100K+ Minimum" }
];

const GlassDropdown = ({ value, options, onChange, dropUp = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value)) || options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[1.5rem] px-5 py-3 text-[10px] uppercase font-black text-white hover:bg-white/5 transition-all outline-none shadow-lg"
      >
        <span className="truncate tracking-[0.1em] text-white/80">{selectedOption.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 ml-4 text-emerald-500 ${isOpen ? (dropUp ? 'rotate-0' : 'rotate-180') : (dropUp ? 'rotate-180' : 'rotate-0')}`} />
      </button>

      <div 
        className={`absolute z-[100] right-0 w-full min-w-[180px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${dropUp ? "bottom-[calc(100%+8px)] origin-bottom" : "top-[calc(100%+8px)] origin-top"}
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto transform-none" : "opacity-0 scale-95 pointer-events-none translate-y-[-10px]"}
        `}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all hover:translate-x-1 ${
              String(value) === String(opt.value)
                ? 'bg-emerald-500/10 text-emerald-400 font-black'
                : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { 
    trending: results, 
    isLoading, 
    fetchTrending, 
    setSearchQuery, 
    setContentType,
    advanceFilters,
    updateAdvanceFilters,
    applyLocalFilters,
    fetchTime
  } = useMovieStore();

  const [localQuery, setLocalQuery] = useState(query);
  const [visibleCount, setVisibleCount] = useState(24);

  // Reset pagination on results change
  useEffect(() => {
    setVisibleCount(24);
  }, [results]);

  // Infinite Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 1200) {
        setVisibleCount((prev) => Math.min(prev + 12, results.length || 0));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [results.length]);

  useEffect(() => {
    if (query !== advanceFilters.query) {
      updateAdvanceFilters({ query: query || "" });
      setContentType(query ? 'advanced' : 'mixed');
      fetchTrending();
    } else if (results.length === 0) {
      setContentType(query || Object.values(advanceFilters).some(v => Array.isArray(v) ? v.length > 0 : v && v !== 'ALL' && v !== 'INCLUDE' && v !== 0 && v !== 300 && v !== 2030 && v !== 1900 && v !== 'POPULARITY' && v !== 10) ? 'advanced' : 'mixed');
      fetchTrending();
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== query) {
        setSearchParams(localQuery ? { q: localQuery } : {});
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localQuery, query, setSearchParams]);

  const handleFilterUpdate = (updates) => {
    updateAdvanceFilters(updates);
  };

  const resetFilters = () => {
    updateAdvanceFilters({
      genres: [],
      languages: [],
      countries: [],
      ratingMin: 0,
      ratingMax: 10,
      yearStart: 1900,
      yearEnd: 2030,
      adult: 'INCLUDE',
      titleType: 'ALL'
    });
    if (advanceFilters.query) {
      applyLocalFilters();
    } else {
      fetchTrending();
    }
  };

  return (
    <div className="pt-24 md:pt-32 min-h-screen px-4 md:px-12 pb-20">
      {/* Search Header */}
      <div className="max-w-[1400px] mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-grow max-w-4xl">

            <div className="relative group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search movies, series, or people..."
                className="w-full h-12 md:h-14 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-full px-12 text-sm font-bold text-white placeholder:text-white/10 focus:bg-white/[0.03] focus:border-emerald-500/50 focus:outline-none transition-all shadow-2xl"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <span className="hidden lg:block text-[9px] font-black text-white/20 uppercase tracking-[0.2em] whitespace-nowrap">Sort By</span>
              <div className="w-[180px]">
                <GlassDropdown 
                  value={advanceFilters.sortBy}
                  options={SORT_OPTIONS.map(opt => ({ value: opt.id, label: opt.name }))}
                  onChange={(val) => handleFilterUpdate({ sortBy: val })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <div className="lg:w-80 shrink-0">
          <div className="sticky top-32 space-y-6">
            <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-3">
                  <Sliders size={16} className="text-emerald-500" /> Advanced Filters
                </h3>
                <button onClick={resetFilters} className="text-white/20 hover:text-emerald-500 transition-colors">
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Title Type */}
              <div className="mb-8">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {TITLE_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => handleFilterUpdate({ titleType: type.id })}
                      className={`flex items-center justify-center gap-2 px-3 py-3 rounded-2xl border text-[9px] font-black uppercase tracking-[0.1em] transition-all ${
                        advanceFilters.titleType === type.id 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {type.icon}
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adult Content */}
              <div className="mb-8">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4 flex items-center gap-2">
                  <AlertTriangle size={12} className="text-amber-500" /> Content Rating
                </label>
                <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
                  {['EXCLUDE', 'INCLUDE', 'ONLY'].map(v => (
                    <button
                      key={v}
                      onClick={() => handleFilterUpdate({ adult: v })}
                      className={`flex-1 flex justify-center items-center px-1 sm:px-2 py-3 rounded-xl border text-[7.5px] sm:text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
                        advanceFilters.adult === v 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      {v === 'EXCLUDE' ? 'Strict' : v === 'INCLUDE' ? 'Adults' : 'Only 18+'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genres */}
              <div className="mb-8">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Genres</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.slice(0, 12).map(genre => (
                    <button
                      key={genre}
                      onClick={() => {
                        const newGenres = advanceFilters.genres.includes(genre)
                          ? advanceFilters.genres.filter(g => g !== genre)
                          : [...advanceFilters.genres, genre];
                        handleFilterUpdate({ genres: newGenres });
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-[0.1em] transition-all ${
                        advanceFilters.genres.includes(genre)
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                        : 'bg-white/5 border-white/5 text-white/30 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Range */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Aggregate Rating</label>
                  <span className="text-[9px] font-black text-emerald-500">{advanceFilters.ratingMin} - {advanceFilters.ratingMax}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="0.1"
                  value={advanceFilters.ratingMin}
                  onChange={(e) => handleFilterUpdate({ ratingMin: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Year Range */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Release Year</label>
                  <span className="text-[9px] font-black text-emerald-500">{advanceFilters.yearStart} - {advanceFilters.yearEnd}</span>
                </div>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    value={advanceFilters.yearStart}
                    onChange={(e) => handleFilterUpdate({ yearStart: parseInt(e.target.value) })}
                    className="w-1/2 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black text-white focus:outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all text-center"
                  />
                  <input 
                    type="number" 
                    value={advanceFilters.yearEnd}
                    onChange={(e) => handleFilterUpdate({ yearEnd: parseInt(e.target.value) })}
                    className="w-1/2 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black text-white focus:outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all text-center"
                  />
                </div>
              </div>

              {/* Runtime Range */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Runtime (Mins)</label>
                  <span className="text-[9px] font-black text-emerald-500">{advanceFilters.runtimeMin} - {advanceFilters.runtimeMax}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="300" 
                  step="5"
                  value={advanceFilters.runtimeMax}
                  onChange={(e) => handleFilterUpdate({ runtimeMax: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Languages */}
              <div className="mb-8">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4 flex items-center gap-2">
                  <Globe size={12} className="text-blue-400" /> Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        const newLangs = advanceFilters.languages.includes(lang.code)
                          ? advanceFilters.languages.filter(l => l !== lang.code)
                          : [...advanceFilters.languages, lang.code];
                        handleFilterUpdate({ languages: newLangs });
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-[0.1em] transition-all ${
                        advanceFilters.languages.includes(lang.code)
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                        : 'bg-white/5 border-white/5 text-white/30 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div className="mb-8">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4 flex items-center gap-2">
                  <Globe size={12} className="text-emerald-500" /> Countries
                </label>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map(country => (
                    <button
                      key={country.code}
                      onClick={() => {
                        const newCountries = advanceFilters.countries.includes(country.code)
                          ? advanceFilters.countries.filter(c => c !== country.code)
                          : [...advanceFilters.countries, country.code];
                        handleFilterUpdate({ countries: newCountries });
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-[0.1em] transition-all ${
                        advanceFilters.countries.includes(country.code)
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                        : 'bg-white/5 border-white/5 text-white/30 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {country.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Votes Min */}
              <div className="mb-8">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Minimum Votes</label>
                <GlassDropdown 
                  value={advanceFilters.votesMin}
                  options={VOTES_OPTIONS}
                  onChange={(val) => handleFilterUpdate({ votesMin: parseInt(val) })}
                  dropUp={true}
                />
              </div>


            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-white/[0.02] border border-white/5 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {results.slice(0, visibleCount).map((item) => (
                item.titleType === 'person' || item.titleType === 'company' || item.imdb_id?.startsWith('nm') || item.imdb_id?.startsWith('co')
                ? <PersonCard key={`person-${item.imdb_id}`} item={item} />
                : <MovieCard key={`${item.titleType}-${item.imdb_id}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                <Search size={40} className="text-white/10" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">No Results Found</h2>
              <p className="text-white/40 max-w-sm text-sm uppercase font-bold tracking-widest leading-loose">
                We couldn't find anything matching your filters. Try adjusting the parameters.
              </p>
              <button 
                onClick={resetFilters}
                className="mt-8 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all active:scale-95"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
