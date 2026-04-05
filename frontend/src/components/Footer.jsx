import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full px-3 md:px-6 py-8 md:py-12 bg-black relative">
      {/* Cinematic Glass Chassis */}
      <div className="max-w-7xl mx-auto bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_30px_-10px_rgba(16,185,129,0.15)] p-8 md:p-12 lg:p-16 relative overflow-hidden group">
        
        {/* Internal Neural Glow */}
        <div className="absolute -bottom-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/10 blur-[80px] md:blur-[120px] rounded-full group-hover:bg-emerald-500/15 transition-all duration-1000"></div>
        
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16">
          {/* Brand Neural Space */}
          <div className="space-y-6 md:space-y-8 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link to="/" className="flex items-center gap-3 md:gap-4 group/logo">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform duration-500 group-hover/logo:scale-110">
                <span className="text-black font-black text-lg md:text-xl italic">N</span>
              </div>
              <span className="text-white font-black text-xl md:text-2xl italic tracking-tighter uppercase">Nocturne</span>
            </Link>
            <p className="text-white/30 text-[9px] md:text-[10px] font-black leading-loose uppercase tracking-[0.25em] md:tracking-[0.3em] max-w-xs">
              Synchronizing cinematic archives across the global neural feed. All worlds preserved.
            </p>
            <div className="flex items-center gap-6">
              {[
                { name: 'Twitter', icon: (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
                )},
                { name: 'Discord', icon: (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>
                )},
                { name: 'GitHub', icon: (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                )}
              ].map(social => (
                <a 
                  key={social.name} 
                  href="#" 
                  className="text-white/20 hover:text-emerald-400 transition-all hover:scale-125 duration-500" 
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Discover', links: ['Trending Feed', 'Cinema Lounge', 'TV Archives', 'Anime Stream'] },
            { title: 'Neural Tools', links: ['Probe Search', 'Advanced Sorting', 'Genre Mapping', 'Archive Map'] }
          ].map((item, idx) => (
            <div key={idx} className="space-y-6 md:space-y-8 flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em]">{item.title}</h4>
              <nav className="flex flex-col gap-4 md:gap-5">
                {item.links.map(link => (
                  <Link key={link} to="/" className="text-white/30 hover:text-white transition-all text-[11px] font-extrabold tracking-widest uppercase hover:translate-x-2 duration-300 inline-block">{link}</Link>
                ))}
              </nav>
            </div>
          ))}

          {/* System Status Cluster */}
          <div className="space-y-6 md:space-y-8 min-w-fit">
            <h4 className="text-emerald-500 font-extrabold text-[10px] uppercase tracking-[0.5em] opacity-80 whitespace-nowrap text-center sm:text-left">Archive Status</h4>
            <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 md:space-y-8 shadow-inner">
              <div className="flex items-center justify-between gap-6 group/pulse whitespace-nowrap">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] italic">Neural Link</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-black text-[10px] uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors duration-500">Active</span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                </div>
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <div className="flex items-center justify-between gap-6 whitespace-nowrap">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] italic">Density</span>
                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Ultra High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Neural Cluster */}
        <div className="max-w-7xl mx-auto pt-12 md:pt-16 mt-12 md:mt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
          <p className="text-[8px] md:text-[9px] font-black tracking-[0.4em] md:tracking-[0.5em] uppercase text-white/20">© 2026 NOCTURNE HUB. ACCESS GRANTED.</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-[8px] md:text-[9px] font-black tracking-[0.4em] md:tracking-[0.5em] uppercase text-white/20">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Sync</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
