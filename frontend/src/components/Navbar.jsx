import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X, Bell, Sparkles, Users, MessageSquare, ChevronDown, LogOut, Settings, Bookmark, ArrowLeft, Home, Play, Monitor, LayoutGrid, TrendingUp, Compass, Plus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeRect, setActiveRect] = useState(null);
  const location = useLocation();
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);
  const navContainerRef = useRef(null);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
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
    const activeEl = navContainerRef.current?.querySelector(`[data-path="${location.pathname}"]`);
    if (activeEl) {
      setActiveRect({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth
      });
    } else {
      setActiveRect(null);
    }
  }, [location.pathname, isSearchActive]);

  const primaryLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Movies', path: '/movies', icon: <Play size={20} /> },
    { name: 'TV Shows', path: '/tv-shows', icon: <Monitor size={20} /> },
    { name: 'Discover', path: '/discover', icon: <Compass size={20} /> }
  ];

  const platformLinks = [
    { name: 'AI', path: '/ai', icon: <Sparkles size={16} /> },
    { name: 'Community', path: '/community', icon: <MessageSquare size={16} /> },
    { name: 'Friends', path: '/friends', icon: <Users size={16} /> }
  ];

  const bottomNavItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Movies', path: '/movies', icon: <Play size={22} /> },
    { name: 'AI', path: '/ai', icon: <Sparkles size={22} /> },
    { name: 'Social', path: '/community', icon: <Users size={22} /> },
    { name: 'Explore', path: '#more', icon: <LayoutGrid size={22} /> }
  ];

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 flex justify-center px-6 md:px-12 pointer-events-none animate-in slide-in-from-top-full duration-700 ${
        isScrolled ? 'mt-2' : 'mt-4 md:mt-6'
      }`}>
        <nav className={`w-full max-w-[1400px] flex items-center pointer-events-auto h-16 md:h-20 px-4 md:px-8 rounded-full transition-all duration-700 ${
          isScrolled ? 'bg-black/80 backdrop-blur-3xl border border-white/10 shadow-2xl scale-[0.98]' : 'bg-white/[0.05] backdrop-blur-2xl border border-white/5 shadow-xl'
        }`}>
          {!isSearchActive ? (
            <div className="w-full h-full flex items-center justify-between">
              {}
              <div className="flex-1 flex items-center justify-start min-w-[150px]">
                <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg]">
                    <span className="text-black font-black text-lg italic tracking-tighter">N</span>
                  </div>
                  <span className="hidden xl:block text-white font-black text-lg tracking-tighter uppercase italic group-hover:tracking-[0.1em] transition-all duration-700">Nocturne</span>
                </Link>
              </div>

              {}
              <div className="hidden lg:flex items-center justify-center relative h-full">
                <div className="flex items-center gap-1 relative h-full" ref={navContainerRef}>
                  {activeRect && (
                    <div 
                      className="absolute bottom-4 h-[2px] bg-emerald-500 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                      style={{ left: activeRect.left, width: activeRect.width }}
                    />
                  )}
                  {primaryLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      data-path={link.path}
                      className={`relative px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap hover:translate-y-[-2px] ${
                        location.pathname === link.path ? 'text-emerald-500' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {}
              <div className="flex-1 flex items-center justify-end gap-3 md:gap-4 ml-4">
                <div className="hidden xl:flex items-center gap-1 border-r border-white/10 pr-4 mr-1">
                  {platformLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex items-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap hover:translate-y-[-2px] rounded-full hover:bg-white/5 ${
                        location.pathname === link.path ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      <span className={location.pathname === link.path ? 'text-emerald-400 animate-pulse' : 'text-white/20'}>
                        {link.icon}
                      </span>
                      <span className="hidden xl:inline">{link.name}</span>
                    </Link>
                  ))}
                </div>

                {location.pathname !== '/discover' && (
                  <div className="relative" ref={searchWrapRef}>
                    <div className="hidden sm:flex items-center bg-white/[0.03] backdrop-blur-2xl rounded-full px-4 py-2 border border-white/5 focus-within:border-emerald-500/30 transition-all duration-500 group shadow-lg hover:bg-white/[0.08]">
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin transition-colors" />
                      ) : (
                        <Search size={16} className="text-white/20 group-hover:text-emerald-500 transition-colors" />
                      )}
                      <input 
                        type="text" 
                        placeholder="Deep Search..." 
                        className="bg-transparent border-none outline-none text-white text-[11px] font-bold px-3 w-20 md:w-28 lg:w-32 xl:w-44 placeholder:text-white/10 placeholder:uppercase transition-all"
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
                      <div className="absolute top-[calc(100%+12px)] right-0 w-[300px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col gap-1 overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-300">
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
                                isCompany ? 'bg-blue-500/10 border border-blue-500/20' :
                                isPerson  ? 'bg-amber-500/10 border border-amber-500/20' :
                                            'bg-white/5'
                              }`}>
                                {s.poster ? (
                                  <img src={s.poster} alt={s.title} className="w-full h-full object-cover" />
                                ) : isCompany ? (
                                  <svg className="w-5 h-5 text-blue-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" /></svg>
                                ) : isPerson ? (
                                  <svg className="w-5 h-5 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                ) : null}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-black uppercase tracking-[0.05em] text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">{s.title}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  {isCompany && (
                                    <span className="text-[8px] font-black uppercase text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Company</span>
                                  )}
                                  {isPerson && !isCompany && (
                                    <span className="text-[8px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Person</span>
                                  )}
                                  {!isCompany && !isPerson && s.certificate && s.certificate !== 'UNKNOWN' && (
                                    <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{s.certificate}</span>
                                  )}
                                  {s.year && <span className="text-[9px] font-black text-white/30">{s.year}</span>}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 md:gap-3">
                  {location.pathname !== '/discover' && (
                    <button 
                      onClick={() => setIsSearchActive(true)}
                      className="p-3 bg-white/5 border border-white/5 rounded-full text-white/40 hover:text-white hover:bg-emerald-500/20 transition-all duration-500 active:scale-90 sm:hidden"
                    >
                      <Search size={20} />
                    </button>
                  )}
                  
                  <button className="relative p-3 bg-white/5 border border-white/5 rounded-full text-white/30 hover:text-white transition-all duration-500 group active:scale-90">
                    <Bell size={18} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  </button>
                  
                  <div className="relative" ref={profileRef}>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="p-3 bg-white/5 border border-white/5 rounded-full text-white/40 hover:text-white hover:bg-emerald-500/20 transition-all duration-500 flex items-center group active:scale-95"
                    >
                      <User size={18} className="group-hover:rotate-6 transition-transform" />
                    </button>

                    <div className={`absolute top-full right-0 mt-4 w-64 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl p-3 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-right overflow-hidden ${
                      isProfileOpen ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' : 'opacity-0 -translate-y-10 pointer-events-none scale-75 blur-lg'
                    }`}>
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Active User</p>
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black italic">S</div>
                           <p className="text-sm font-black text-white italic">Sajal-26</p>
                         </div>
                      </div>
                      <button className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                        <Bookmark size={16} className="text-white/10 group-hover:text-emerald-500 transition-colors" /> My Watchlist
                      </button>
                      <button className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                        <Settings size={16} className="text-white/10 group-hover:text-emerald-500 transition-colors" /> Account Settings
                      </button>
                      <div className="my-2 border-t border-white/5" />
                      <button className="w-full flex items-center gap-4 px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:bg-emerald-500 hover:text-black rounded-2xl transition-all group shadow-lg">
                        <LogOut size={16} /> Terminate session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center animate-in slide-in-from-right-10 duration-700 ease-out relative" ref={searchWrapRef}>
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
                            setShowSuggestions(false);
                            setSearchValue('');
                            setIsSearchActive(false);
                            navigate(`/discover?q=${encodeURIComponent(s.title)}`);
                          }}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-all text-left group"
                        >
                          <div className={`w-10 h-14 rounded-lg overflow-hidden shrink-0 flex items-center justify-center ${
                            isCompany ? 'bg-blue-500/10 border border-blue-500/20' :
                            isPerson  ? 'bg-amber-500/10 border border-amber-500/20' :
                                        'bg-white/5'
                          }`}>
                            {s.poster ? (
                              <img src={s.poster} alt={s.title} className="w-full h-full object-cover" />
                            ) : isCompany ? (
                              <svg className="w-5 h-5 text-blue-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" /></svg>
                            ) : isPerson ? (
                              <svg className="w-5 h-5 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            ) : null}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] font-black uppercase tracking-[0.05em] text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">{s.title}</span>
                            <div className="flex items-center gap-2 mt-1">
                              {isCompany && (
                                <span className="text-[8px] font-black uppercase text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Company</span>
                              )}
                              {isPerson && !isCompany && (
                                <span className="text-[8px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Person</span>
                              )}
                              {!isCompany && !isPerson && s.certificate && s.certificate !== 'UNKNOWN' && (
                                <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{s.certificate}</span>
                              )}
                              {s.year && <span className="text-[9px] font-black text-white/30">{s.year}</span>}
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
                }
              }}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group ${
                (location.pathname === item.path || (item.name === 'Social' && location.pathname === '/community')) ? 'text-emerald-500 scale-110' : 'text-white/30 active:scale-95'
              }`}
            >
              <div className={`transition-all duration-500 ${ (location.pathname === item.path || (item.name === 'Social' && location.pathname === '/community')) ? 'animate-pulse' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.1em]">{item.name}</span>
              {(location.pathname === item.path || (item.name === 'Social' && location.pathname === '/community')) && (
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
                  location.pathname === link.path 
                  ? 'text-emerald-400 bg-white/10 shadow-lg' 
                  : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className={`transition-colors duration-300 ${location.pathname === link.path ? 'text-emerald-400 scale-110' : 'text-white/20'}`}>
                  {link.icon || <Plus size={22} />}
                </span>
                <span className={`text-[15px] font-black uppercase tracking-[0.2em] ${location.pathname === link.path ? 'font-black' : 'font-bold'}`}>
                  {link.name}
                </span>
                {location.pathname === link.path && (
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
