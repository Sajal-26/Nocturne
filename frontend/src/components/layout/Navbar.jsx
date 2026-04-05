import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trending', path: '/trending' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'Discover', path: '/discover' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 ${
        scrolled ? 'py-2' : 'py-5'
      }`}
    >
      {/* Persistent Glass Container */}
      <div 
        className={`max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 overflow-hidden glass border-white/10 ${
          scrolled 
          ? 'p-2 pl-6 pr-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
          : 'p-3 pl-8 pr-6'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-all duration-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                <span className="text-black font-black text-2xl italic select-none">N</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-all duration-300">
                NOCTURNE
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[11px] uppercase tracking-[0.2em] font-black transition-all hover:text-emerald-400 relative py-2 ${
                    location.pathname === link.path 
                      ? 'text-emerald-400' 
                      : 'text-white/40'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-in fade-in zoom-in duration-500"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative group hidden sm:block">
              <input 
                type="text" 
                placeholder="PROBE ARCHIVES..." 
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2 text-[10px] font-black tracking-widest w-40 focus:w-72 focus:bg-white/10 transition-all duration-700 focus:outline-none focus:border-emerald-500/50 placeholder:text-white/20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:text-emerald-400 group-focus-within:opacity-100 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            
            <button className="w-10 h-10 rounded-2xl glass-light flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white/50 hover:text-white border-white/5 hover:border-emerald-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            
            <button className="lg:hidden w-10 h-10 rounded-2xl glass-light flex items-center justify-center text-white/50 border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
