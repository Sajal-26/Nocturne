import React from 'react';
import { Link } from 'react-router-dom';

const navigationGroups = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Movies', to: '/movies' },
      { label: 'Discover', to: '/discover' }
    ]
  },
  {
    title: 'Platform',
    links: [
      { label: 'Music', to: '/music' },
      { label: 'Health', to: '/health' },
      { label: 'Community', to: '/community' }
    ]
  }
];

const socialLinks = [
  {
    name: 'X',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm1.161 17.52h1.833L7.045 4.126H5.078z" />
      </svg>
    )
  },
  {
    name: 'Discord',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
      </svg>
    )
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    )
  }
];

const Footer = () => {
  return (
    <footer className="w-full px-6 py-10 md:px-12 lg:px-20 lg:py-12 text-white">
      <div className="mx-auto max-w-[1500px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(8,14,12,0.96),rgba(6,6,6,0.98))] px-6 py-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:px-10 md:py-10">
          <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-emerald-500/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-cyan-500/6 blur-3xl" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-start">
            <div className="space-y-6">
              <Link to="/" className="inline-flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.15rem] bg-[#f3f7f5] text-black shadow-[0_10px_30px_rgba(255,255,255,0.08)]">
                  <span className="text-2xl font-black italic">N</span>
                </div>
                <div>
                  <p className="text-2xl font-black uppercase tracking-[0.24em]">Nocturne</p>
                  <p className="text-[11px] uppercase tracking-[0.45em] text-emerald-400/85">Cinematic Intelligence</p>
                </div>
              </Link>

              <div className="max-w-xl space-y-4">
                <p className="text-sm leading-relaxed text-white/60 md:text-[15px]">
                  A refined hub for discovering films, tracking momentum, and navigating streaming culture with clarity.
                </p>
                <div className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/38">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">Live charts</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">Smart discovery</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">Streaming signals</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/65 transition duration-300 hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:gap-10 lg:pt-3">
              {navigationGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400/85">
                    {group.title}
                  </h3>
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="text-sm text-white/52 transition hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/28">© 2026 Nocturne</p>
              <p className="text-[12px] text-white/40">Curated for a cleaner, more cinematic browsing experience.</p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[13px] text-white/48">
              <a href="mailto:hello@nocturne.app" className="transition hover:text-emerald-300">
                hello@nocturne.app
              </a>
              <a href="#" className="transition hover:text-emerald-300">Privacy</a>
              <a href="#" className="transition hover:text-emerald-300">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
