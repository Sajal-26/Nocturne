import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-20 pb-10 px-6 relative overflow-hidden">
      {}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="glass border-white/5 rounded-[2.5rem] p-10 md:p-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 group mb-6">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-all duration-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  <span className="text-black font-black text-xl italic italic select-none">N</span>
                </div>
                <span className="text-xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-all duration-300">
                  NOCTURNE
                </span>
              </Link>
              <p className="text-white/40 text-[11px] font-medium leading-relaxed max-w-[260px] tracking-wide">
                A high-fidelity social conductor for those who find their rhythm at night. Synchronize your entertainment ecosystem through curated cinema and AI-driven discovery.
              </p>
            </div>

            {}
            <div>
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Ecosystem</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Cinema', path: '/trending' },
                  { name: 'Anime', path: '/anime' },
                  { name: 'Vibe Sync', path: '/vibe' },
                  { name: 'Muse AI', path: '/muse' },
                  { name: 'Social Lounge', path: '/lounge' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      className="text-white/40 hover:text-emerald-400 text-[11px] font-black uppercase tracking-widest transition-all hover:translate-x-1 inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {}
            <div>
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Protocol</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Documentation', path: '/docs' },
                  { name: 'Security', path: '/security' },
                  { name: 'Terms of Use', path: '/terms' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      className="text-white/40 hover:text-emerald-400 text-[11px] font-black uppercase tracking-widest transition-all hover:translate-x-1 inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {}
            <div className="md:col-span-1">
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Connect</h4>
              <div className="flex gap-4 mb-8">
                {[
                  { name: 'Github', url: 'https://github.com', icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  )},
                  { name: 'Discord', url: 'https://discord.com', icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                  )},
                  { name: 'X', url: 'https://x.com', icon: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.291 19.489h2.039L6.486 3.24H4.298l13.312 17.403z"/></svg>
                  )},
                ].map((social) => (
                  <a 
                    key={social.name} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-10 h-10 rounded-xl glass-light flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-white/30 hover:text-emerald-400 border-white/5 hover:border-emerald-500/30"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest">
                Network: <span className="text-emerald-500/50">SECURE [NODES: 2.4k]</span>
              </p>
            </div>
          </div>

          {}
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 overflow-hidden px-4 py-1.5 bg-black/40 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">
                Verified Cinematic Node: 0xFD442
              </span>
            </div>
            
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
              &copy; {currentYear} NOCTURNE MEDIA GROUP. ALL PROTOCOLS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
