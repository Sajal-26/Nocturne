import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full px-6 md:px-12 lg:px-20 py-12 md:py-20 bg-black relative">
      {}
      <div className="w-full bg-white/[0.01] backdrop-blur-3xl rounded-[3rem] border border-white/5 p-12 md:p-20 relative overflow-hidden group">
        
        {}
        <div className="absolute -bottom-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/5 blur-[120px] rounded-full group-hover:bg-emerald-500/10 transition-all duration-1000"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20">
          {}
          <div className="space-y-10 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-4 group/logo">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center transition-transform duration-500 group-hover/logo:scale-110">
                <span className="font-black text-xl italic">N</span>
              </div>
              <span className="text-white font-black text-2xl italic tracking-tighter uppercase">Nocturne</span>
            </Link>
            <p className="text-white/20 text-[10px] font-black leading-loose uppercase tracking-[0.3em] max-w-xs">
              Synchronizing cinematic archives across the global neural feed. All worlds preserved.
            </p>
            <div className="flex items-center gap-10">
              {[
                { name: 'Twitter', icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
                )},
                { name: 'Discord', icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>
                )},
                { name: 'GitHub', icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                )}
              ].map(social => (
                <a 
                  key={social.name} 
                  href="#" 
                  className="text-white/10 hover:text-emerald-500 transition-all hover:scale-110 duration-500" 
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Discover', links: ['Trending Feed', 'Cinema Lounge', 'TV Archives', 'Anime Stream'] },
            { title: 'Intelligence', links: ['Probe Search', 'Sorting', 'Genre Mapping', 'Archive Map'] }
          ].map((item, idx) => (
            <div key={idx} className="space-y-10 flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-emerald-500/60 font-black text-[10px] uppercase tracking-[0.5em]">{item.title}</h4>
              <nav className="flex flex-col gap-6">
                {item.links.map(link => (
                  <Link key={link} to="/" className="text-white/20 hover:text-white transition-all text-[11px] font-black tracking-widest uppercase hover:translate-x-2 duration-300 inline-block">{link}</Link>
                ))}
              </nav>
            </div>
          ))}

          {}
          <div className="space-y-10 min-w-fit">
            <h4 className="text-emerald-500/60 font-black text-[10px] uppercase tracking-[0.5em] text-center md:text-left">Archive Status</h4>
            <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
              <div className="flex items-center justify-between gap-10 group/pulse whitespace-nowrap">
                <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] italic leading-none">Neural Link</span>
                <div className="flex items-center gap-3">
                  <span className="text-white/80 font-black text-[10px] uppercase tracking-widest italic group-hover:text-emerald-500 transition-colors duration-500">Active</span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                </div>
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <div className="flex items-center justify-between gap-10 whitespace-nowrap leading-none">
                <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] italic">Density</span>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Ultra High</span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="w-full pt-10 mt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/10 italic">© 2026 NOCTURNE HUB. ACCESS GRANTED.</p>
          <div className="flex flex-wrap justify-center items-center gap-10 text-[9px] font-black tracking-[0.5em] uppercase text-white/10">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Sync</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
