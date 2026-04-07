import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovieStore } from '../store/useMovieStore';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';
import { 
  Search, Filter, Sliders, Calendar, Star, Clock, 
  ChevronRight, ChevronDown, Check, X, RotateCcw,
  Film, Monitor, User, Globe, Tag, AlertTriangle, Briefcase,
  SlidersHorizontal, CheckSquare, Square
} from 'lucide-react';
import SearchableDropdown from '../components/SearchableDropdown';
import { COUNTRIES } from '../constants/countries';
import { LANGUAGES } from '../constants/languages';

const GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "History", 
  "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", 
  "Short", "Sport", "Thriller", "War", "Western"
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

const COUNTRY_LANG_MAP = {
  'US': ['en', 'es'], 'GB': ['en'], 'IN': ['hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'sa', 'ks', 'en'],
  'FR': ['fr'], 'ES': ['es', 'ca', 'eu', 'gl'], 'DE': ['de'], 'IT': ['it'], 'JP': ['ja'], 'CN': ['zh'], 'KR': ['ko'],
  'RU': ['ru'], 'BR': ['pt'], 'MX': ['es'], 'AR': ['es'], 'CO': ['es'], 'TR': ['tr'], 'SA': ['ar'], 'AE': ['ar'],
  'EG': ['ar'], 'PK': ['ur', 'pa', 'sd', 'ps', 'en'], 'BD': ['bn'], 'ID': ['id'], 'TH': ['th'], 'VN': ['vi'],
  'PH': ['tl', 'en'], 'MY': ['ms', 'en'], 'SG': ['en', 'ms', 'zh', 'ta'], 'AU': ['en'], 'CA': ['en', 'fr'],
  'NL': ['nl'], 'BE': ['nl', 'fr', 'de'], 'CH': ['de', 'fr', 'it', 'rm'], 'AT': ['de'], 'GR': ['el'],
  'PL': ['pl'], 'PT': ['pt'], 'SE': ['sv'], 'NO': ['no', 'nb', 'nn'], 'DK': ['da'], 'FI': ['fi'],
  'IL': ['he', 'ar'], 'ZA': ['en', 'af', 'zu', 'xh'], 'NG': ['en', 'ha', 'ig', 'yo'], 'KE': ['sw', 'en'],
  'ET': ['am'], 'TZ': ['sw'], 'UA': ['uk', 'ru'], 'RO': ['ro'], 'HU': ['hu'], 'CZ': ['cs'], 'IR': ['fa'],
  'AF': ['ps', 'fa'], 'KZ': ['kk', 'ru'], 'UZ': ['uz'], 'PK': ['ur'], 'LK': ['si', 'ta'], 'NP': ['ne'],
  'MM': ['my'], 'KH': ['km'], 'LA': ['lo'], 'MN': ['mn'], 'IE': ['en', 'ga']
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
    fetchTime,
    unfilteredResults
  } = useMovieStore();

  const [localQuery, setLocalQuery] = useState(query);
  const [visibleCount, setVisibleCount] = useState(24);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setVisibleCount(24);
  }, [results]);

  const filteredLanguages = useMemo(() => {
    if (!advanceFilters.countries || advanceFilters.countries.length === 0) {
      return LANGUAGES;
    }

    const relevantLangCodes = new Set();
    advanceFilters.countries.forEach(countryCode => {
      const langs = COUNTRY_LANG_MAP[countryCode] || [];
      langs.forEach(l => relevantLangCodes.add(l));
    });

    if (relevantLangCodes.size > 0) {
      return LANGUAGES.filter(lang => relevantLangCodes.has(lang.code));
    }

    return LANGUAGES;
  }, [advanceFilters.countries]);

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
      setContentType(query ? 'search' : 'mixed');
      fetchTrending();
    } else if (unfilteredResults.length === 0) {
      setContentType(query ? 'search' : 'mixed');
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
      runtimeMin: 0,
      runtimeMax: 300,
      votesMin: 0,
      adult: 'INCLUDE',
      titleType: 'ALL'
    });
  };

  return (
    <div className="pt-24 md:pt-32 min-h-screen px-4 md:px-12 pb-20">
      <div className="max-w-[1700px] mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] whitespace-nowrap">Sort By</span>
            <div className="w-[180px]">
              <GlassDropdown 
                value={advanceFilters.sortBy}
                options={SORT_OPTIONS.map(opt => ({ value: opt.id, label: opt.name }))}
                onChange={(val) => handleFilterUpdate({ sortBy: val })}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 lg:hidden">
          <button
            onClick={() => setShowMobileFilters(prev => !prev)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              showMobileFilters
                ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                : 'bg-black/40 border-white/10 text-white/60 hover:text-white hover:border-white/20 backdrop-blur-xl'
            }`}
          >
            <SlidersHorizontal size={14} />
            Advanced Filters
            <ChevronDown
              size={13}
              className={`transition-transform duration-300 ${showMobileFilters ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>

          <div className="flex-1 min-w-0">
            <GlassDropdown 
              value={advanceFilters.sortBy}
              options={SORT_OPTIONS.map(opt => ({ value: opt.id, label: opt.name }))}
              onChange={(val) => handleFilterUpdate({ sortBy: val })}
            />
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            showMobileFilters ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="bg-black/40 border border-white/5 rounded-xl p-6 backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-2.5">
                <SlidersHorizontal size={15} className="text-emerald-500" />
                Advanced Filters
              </h3>
              <button onClick={resetFilters} className="text-white/20 hover:text-emerald-500 transition-colors">
                <RotateCcw size={15} />
              </button>
            </div>

            <div className="mb-6">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-3">Content Type</label>
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

            <div className="mb-6">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 flex items-center gap-2">
                <AlertTriangle size={12} className="text-amber-500" /> Content Rating
              </label>
              <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
                {['EXCLUDE', 'INCLUDE', 'ONLY'].map(v => (
                  <button
                    key={v}
                    onClick={() => handleFilterUpdate({ adult: v })}
                    className={`flex-1 flex justify-center items-center py-3 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all ${
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

            <div className="mb-6">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-3">Genres</label>
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

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Aggregate Rating</label>
                <span className="text-[9px] font-black text-emerald-500">{advanceFilters.ratingMin} - {advanceFilters.ratingMax}</span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.1"
                value={advanceFilters.ratingMin}
                onChange={(e) => handleFilterUpdate({ ratingMin: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Release Year</label>
                <span className="text-[9px] font-black text-emerald-500">{advanceFilters.yearStart} - {advanceFilters.yearEnd}</span>
              </div>
              <div className="flex gap-3">
                <input 
                  type="number" value={advanceFilters.yearStart}
                  onChange={(e) => handleFilterUpdate({ yearStart: parseInt(e.target.value) })}
                  className="w-1/2 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black text-white focus:outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all text-center"
                />
                <input 
                  type="number" value={advanceFilters.yearEnd}
                  onChange={(e) => handleFilterUpdate({ yearEnd: parseInt(e.target.value) })}
                  className="w-1/2 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black text-white focus:outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all text-center"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Runtime (Mins)</label>
                <span className="text-[9px] font-black text-emerald-500">{advanceFilters.runtimeMin} - {advanceFilters.runtimeMax}</span>
              </div>
              <input 
                type="range" min="0" max="300" step="5"
                value={advanceFilters.runtimeMax}
                onChange={(e) => handleFilterUpdate({ runtimeMax: parseInt(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <SearchableDropdown 
                label="Country" 
                placeholder="All Countries"
                options={COUNTRIES}
                value={advanceFilters.countries[0] || null}
                onChange={(newCountry) => {
                   handleFilterUpdate({ 
                     countries: newCountry ? [newCountry] : [],
                     languages: [] 
                   });
                }}
                isMulti={false}
                showFlags={true}
              />

              <SearchableDropdown 
                label="Language" 
                placeholder={advanceFilters.countries.length > 0 ? "Related Languages" : "All Languages"}
                options={filteredLanguages}
                value={advanceFilters.languages}
                onChange={(newLangs) => handleFilterUpdate({ languages: newLangs })}
                icon={Globe}
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-3">Minimum Votes</label>
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

      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-8 xl:gap-12">
        <div className="hidden lg:block lg:w-80 shrink-0">
          <div className="sticky top-16 space-y-6">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-8 backdrop-blur-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white italic flex items-center gap-2.5">
                  <SlidersHorizontal size={15} className="text-emerald-500" /> Advanced Filters
                </h3>
                <button onClick={resetFilters} className="text-white/20 hover:text-emerald-500 transition-colors">
                  <RotateCcw size={16} />
                </button>
              </div>

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

              <div className="flex flex-col gap-2">
                <SearchableDropdown 
                  label="Country" 
                  placeholder="All Countries"
                  options={COUNTRIES}
                  value={advanceFilters.countries[0] || null}
                  onChange={(newCountry) => {
                    handleFilterUpdate({ 
                      countries: newCountry ? [newCountry] : [],
                      languages: [] 
                    });
                  }}
                  isMulti={false}
                  showFlags={true}
                  dropUp={true}
                />

                <SearchableDropdown 
                  label="Language" 
                  placeholder={advanceFilters.countries.length > 0 ? "Related Languages" : "All Languages"}
                  options={filteredLanguages}
                  value={advanceFilters.languages}
                  onChange={(newLangs) => handleFilterUpdate({ languages: newLangs })}
                  icon={Globe}
                  dropUp={true}
                />
              </div>

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

        <div className="flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {results.slice(0, visibleCount).map((item) => (
                <div key={`${item.titleType}-${item.imdb_id}`} className="w-full">
                  {item.titleType === 'person' || item.titleType === 'company' || item.imdb_id?.startsWith('nm') || item.imdb_id?.startsWith('co')
                    ? <PersonCard item={item} className="w-full h-full" />
                    : <MovieCard item={item} className="w-full h-full" />
                  }
                </div>
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
