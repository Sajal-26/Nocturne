import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X, Bell, Sparkles, Users, MessageSquare, ChevronDown, LogOut, Settings, Bookmark, ArrowLeft, Home, Play, Monitor, LayoutGrid, TrendingUp, Compass, Plus, Music } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeRect, setActiveRect] = useState(null);
  const location = useLocation();
  const profileRef = useRef(null);
  const moreRef = useRef(null);
  const searchInputRef = useRef(null);
  const navContainerRef = useRef(null);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchWrapRef = useRef(null);
  const isDiscoverPage = location.pathname === '/discover' || location.pathname === '/search';

  const isPathActive = (path) => {
    if (path === '/movies') {
      return location.pathname === '/movies' || location.pathname.startsWith('/movie');
    }
    return location.pathname === path;
  };

  const activeNavPath = primaryLinksPath(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  useEffect(() => {
    if (!searchValue || searchValue.length < 2) {
      setSuggestions([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch("/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query SearchMovies($q: String!) {
                searchMovies(query: $q) {
                  imdb_id
                  title
                  year
                  poster
                  certificate
                }
              }
            `,
            variables: { q: searchValue }
          })
        });
        const result = await response.json();
        setSuggestions(result.data?.searchMovies?.slice(0, 5) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchValue]);

  useEffect(() => {
    const activeEl = navContainerRef.current?.querySelector(`[data-path="${activeNavPath}"]`);
    if (activeEl) {
      setActiveRect({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth
      });
    } else {
      setActiveRect(null);
    }
  }, [activeNavPath, isSearchActive]);

  const primaryLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Movies', path: '/movies', icon: <Play size={18} /> },
    { name: 'TV Shows', path: '/tv-shows', icon: <Monitor size={18} /> },
    { name: 'Discover', path: '/discover', icon: <Compass size={18} /> },
    { name: 'Music', path: '/music', icon: <Music size={18} /> }
  ];

  const platformLinks = [
    { name: 'Intelligence', path: '/ai', icon: <Sparkles size={14} /> },
    { name: 'Community', path: '/community', icon: <MessageSquare size={14} /> },
    { name: 'Friends', path: '/friends', icon: <Users size={14} /> }
  ];

  const bottomNavItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Movies', path: '/movies', icon: <Play size={22} /> },
    { name: 'Music', path: '/music', icon: <Music size={22} /> },
    { name: 'Discover', path: '/discover', icon: <Compass size={22} /> },
    { name: 'More', path: '#more', icon: <LayoutGrid size={22} /> }
  ];

  return (
    <>
        <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 flex justify-center px-4 md:px-8 pointer-events-none ${
        isScrolled ? 'mt-2' : 'mt-4 md:mt-6'
      }`}>
        <nav className={`w-full max-w-[1700px] flex items-center pointer-events-auto h-16 px-4 md:px-8 rounded-2xl md:rounded-3xl transition-all duration-500 ${
          isScrolled ? 'bg-black/80 backdrop-blur-3xl border border-white/5 shadow-2xl' : 'bg-black/40 backdrop-blur-2xl border border-white/[0.03]'
        }`}>
          {!isSearchActive ? (
            <div className="w-full h-full flex items-center justify-between gap-6">
              {}
              <div className="flex items-center min-w-[100px] xl:min-w-[200px] flex-1 lg:flex-none">
                <Link to="/" className="flex items-center gap-3 group transition-transform active:scale-95 px-1">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white text-black rounded-lg flex items-center justify-center transition-all duration-500 group-hover:bg-emerald-500">
                    <span className="font-black text-sm italic tracking-tighter">N</span>
                  </div>
                  <span className="hidden xl:block text-white font-black text-base tracking-tighter uppercase italic transition-all duration-500">Nocturne</span>
                </Link>
              </div>

              {}
              <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-4">
                <div className="flex items-center gap-2 relative h-10" ref={navContainerRef}>
                  {activeRect && (
                    <div 
                      className="absolute bg-white/[0.08] backdrop-blur-sm rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                      style={{ 
                        left: activeRect.left, 
                        width: activeRect.width,
                        height: '100%',
                        top: '0'
                      }}
                    >
                      <div className="absolute inset-x-0 -bottom-[1px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-[1px]" />
                    </div>
                  )}
                  {primaryLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      data-path={link.path}
                      className={`relative px-4 py-2 text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-300 whitespace-nowrap z-10 ${
                        isPathActive(link.path) ? 'text-white' : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {}
                  <div className="relative" ref={moreRef}>
                    <button
                      onClick={() => setIsMoreOpen(!isMoreOpen)}
                      className={`relative px-4 py-2 text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-300 whitespace-nowrap z-10 flex items-center gap-1.5 ${
                        isMoreOpen ? 'text-white bg-white/10 rounded-xl' : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      More
                      <ChevronDown size={14} className={`transition-transform duration-300 ${isMoreOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 min-w-[220px] shadow-[0_32px_64px_rgba(0,0,0,0.8)] z-[110] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top ${
                      isMoreOpen 
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 scale-90 -translate-y-4 pointer-events-none'
                    }`}>
                      <div className="grid grid-cols-1 gap-1">
                        {platformLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMoreOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                              location.pathname === link.path ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-white/5 text-white/50 hover:text-white'
                            }`}
                          >
                            <span className={`transition-all duration-300 ${location.pathname === link.path ? 'text-emerald-500 scale-110' : 'opacity-40 group-hover:opacity-100 group-hover:scale-110'}`}>
                              {link.icon}
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{link.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="flex items-center justify-end gap-3 md:gap-4 flex-none">
                <div className={`relative group/search shrink-0 transition-all duration-500 ${isDiscoverPage ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'}`} ref={searchWrapRef}>
                    <div className="hidden sm:flex items-center bg-black/40 rounded-xl px-3 py-2 border border-white/[0.02] focus-within:border-white/10 focus-within:bg-black/60 transition-all duration-500 shadow-xl group hover:bg-black/60">
                      {isSearching ? (
                        <div className="w-3 h-3 border border-white/10 border-t-emerald-500 rounded-full animate-spin" />
                      ) : (
                        <Search size={14} className="text-white/20 group-hover:text-white/60 transition-colors" />
                      )}
                      <input 
                        type="text" 
                        placeholder="DISCOVER..." 
                        className="bg-transparent border-none outline-none text-white text-[10px] font-bold px-2 w-16 md:w-20 lg:w-28 placeholder:text-white/10 placeholder:uppercase transition-all focus:w-40 lg:focus:w-48"
                        value={searchValue}
                        onFocus={() => setShowSuggestions(true)}
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && searchValue.trim()) {
                            setShowSuggestions(false);
                            navigate(`/discover?q=${encodeURIComponent(searchValue)}`);
                            setSearchValue("");
                          }
                        }}
                      />
                    </div>
                    
                    {}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-[calc(100%+16px)] right-0 w-[320px] bg-black/60 backdrop-blur-3xl border border-white/5 rounded-2xl p-2 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col gap-1 overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-300">
                        {suggestions.map(s => {
                          const isCompany = s.certificate === 'COMPANY' || s.titleType === 'company';
                          const isPerson = s.certificate === 'PERSON' || s.titleType === 'person';
                          return (
                            <button
                              key={s.imdb_id}
                              onClick={() => {
                                setShowSuggestions(false);
                                setSearchValue('');
                                navigate(`/discover?q=${encodeURIComponent(s.title)}`);
                              }}
                              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-left group"
                            >
                              <div className={`w-10 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${
                                isCompany ? 'bg-blue-500/10' :
                                isPerson  ? 'bg-amber-500/10' :
                                            'bg-white/5'
                              }`}>
                                {s.poster ? (
                                  <img src={s.poster} alt={s.title} className="w-full h-full object-cover" />
                                ) : isCompany ? (
                                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" /></svg>
                                ) : isPerson ? (
                                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                ) : null}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-black uppercase tracking-wider text-white truncate group-hover:text-emerald-400 transition-colors">{s.title}</span>
                                <div className="flex items-center gap-2 mt-1 opacity-40">
                                  {isCompany && <span className="text-[8px] font-black uppercase text-blue-400">Company</span>}
                                  {isPerson && <span className="text-[8px] font-black uppercase text-amber-400">Person</span>}
                                  {s.year && <span className="text-[9px] font-bold">{s.year}</span>}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                <div className="flex items-center gap-2">
                  {!isDiscoverPage && (
                    <button 
                      onClick={() => setIsSearchActive(true)}
                      className="sm:hidden p-2.5 bg-white/5 border border-white/5 rounded-full text-white/20 hover:text-white transition-all duration-500 active:scale-90"
                    >
                      <Search size={16} />
                    </button>
                  )}

                  <button className="relative p-2.5 bg-white/5 border border-white/5 rounded-full text-white/20 hover:text-white transition-all duration-500 group">
                    <Bell size={16} />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                  </button>
                  
                  <div className="relative" ref={profileRef}>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="p-2.5 bg-white/5 border border-white/5 rounded-full text-white/20 hover:text-white transition-all duration-500 flex items-center group"
                    >
                      <User size={16} />
                    </button>

                    <div className={`absolute top-full right-0 mt-4 w-60 bg-black/80 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-2xl p-2 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-right overflow-hidden ${
                      isProfileOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
                    }`}>
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-black">SA</div>
                           <div className="flex flex-col">
                             <p className="text-[11px] font-black text-white italic">Sajal-26</p>
                             <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Premium Member</p>
                           </div>
                         </div>
                      </div>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Bookmark size={14} /> My Watchlist
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Settings size={14} /> Settings
                      </button>
                      <div className="my-1 border-t border-white/5" />
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-[9px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500 hover:text-black rounded-xl transition-all">
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center animate-in fade-in slide-in-from-top-4 duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] relative" ref={searchWrapRef}>
              <button 
                onClick={() => { setIsSearchActive(false); setShowSuggestions(false); setSearchValue(""); }}
                className="p-3 text-white/40 hover:text-white shrink-0 hover:bg-white/5 rounded-full transition-all active:scale-90"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="relative flex-1">
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search movies, series, people..." 
                  className="bg-transparent border-none outline-none text-white text-base font-black px-2 w-full placeholder:text-white/10 placeholder:uppercase placeholder:text-[11px]"
                  value={searchValue}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  onChange={(e) => { setSearchValue(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchValue.trim()) {
                      setShowSuggestions(false);
                      navigate(`/discover?q=${encodeURIComponent(searchValue)}`);
                      setSearchValue("");
                      setIsSearchActive(false);
                    }
                  }}
                />

                {}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+20px)] bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex flex-col gap-1 overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{ width: 'calc(100vw - 80px)', left: '-40px' }}
                  >
                    {isSearching && (
                      <div className="flex items-center gap-2 px-4 py-2">
                        <div className="w-3 h-3 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Searching...</span>
                      </div>
                    )}
                    {suggestions.map(s => {
                      const isCompany = s.certificate === 'COMPANY' || s.titleType === 'company';
                      const isPerson = s.certificate === 'PERSON' || s.titleType === 'person';
                      return (
                        <button
                          key={s.imdb_id}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            navigate(`/${isPerson ? 'person' : 'title'}/${s.imdb_id}`);
                            setSearchValue("");
                            setShowSuggestions(false);
                            setIsSearchActive(false);
                          }}
                          className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/10 active:bg-white/5 transition-all text-left group"
                        >
                          <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 bg-white/[0.02] border border-white/5 flex items-center justify-center">
                            {s.poster ? (
                              <img src={s.poster} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                               <Film size={20} className="text-white/10" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[12px] font-black uppercase tracking-tight text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">{s.title}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              {isCompany ? (
                                <span className="text-[8px] font-black uppercase text-emerald-500/60 bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">Archive</span>
                              ) : isPerson ? (
                                <span className="text-[8px] font-black uppercase text-white/40 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">Entity</span>
                              ) : (
                                <span className="text-[8px] font-black uppercase text-emerald-500/40 bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">{s.certificate || 'Movie'}</span>
                              )}
                              {s.year && <span className="text-[9px] font-black text-white/20 tracking-widest">{s.year}</span>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {searchValue ? (
                <button 
                  onClick={() => { setSearchValue(""); setSuggestions([]); setShowSuggestions(false); }}
                  className="p-3 text-white/20 hover:text-white shrink-0 active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => setIsSearchActive(false)}
                  className="p-3 text-white/20 hover:text-white shrink-0 active:scale-90 transition-all"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}
        </nav>
      </div>

      <div className={`lg:hidden fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none transition-all duration-1000 ${isSearchActive ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100 animate-in slide-in-from-bottom-full'}`}>
        <nav className="w-full max-w-[500px] h-16 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl flex items-center justify-around px-4 pointer-events-auto">
          {bottomNavItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.path === '#more') {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  setIsMobileMenuOpen(false);
                  navigate(item.path);
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group ${
                (isPathActive(item.path) || (item.path === '#more' && isMobileMenuOpen)) ? 'text-emerald-500 scale-110' : 'text-white/30 active:scale-95'
              }`}
            >
              <div className={`transition-all duration-500 ${ (isPathActive(item.path) || (item.path === '#more' && isMobileMenuOpen)) ? 'animate-pulse' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.1em]">{item.name}</span>
              {(isPathActive(item.path) || (item.path === '#more' && isMobileMenuOpen)) && (
                <div className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div 
        className={`lg:hidden fixed inset-0 z-[110] bg-black/30 backdrop-blur-sm transition-all duration-700 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-3xl border-t border-white/10 rounded-t-[3rem] p-8 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden ${
            isMobileMenuOpen ? 'translate-y-0 h-[70vh]' : 'translate-y-full h-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
          <div className="relative z-10 w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
          
          <div className="relative z-10 flex flex-col gap-1 h-full overflow-y-auto pb-12">
            {[...primaryLinks, ...platformLinks].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isPathActive(link.path) 
                  ? 'text-emerald-400 bg-white/10 shadow-lg' 
                  : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`transition-colors duration-300 ${isPathActive(link.path) ? 'text-emerald-400 scale-110' : 'text-white/20'}`}>
                  {link.icon || <Plus size={22} />}
                </span>
                <span className={`text-[15px] font-black uppercase tracking-[0.2em] ${isPathActive(link.path) ? 'font-black' : 'font-bold'}`}>
                  {link.name}
                </span>
                {isPathActive(link.path) && (
                  <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)]" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

function primaryLinksPath(pathname) {
  if (pathname === '/movies' || pathname.startsWith('/movie')) {
    return '/movies';
  }
  return pathname;
}
