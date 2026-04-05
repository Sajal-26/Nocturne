import React, { useEffect, useState } from 'react';
import { useMovieStore } from '../store/useMovieStore';

const COUNTRIES = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "IN", name: "India", flag: "🇮🇳" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "KR", name: "South Korea", flag: "🇰🇷" },
    { code: "BR", name: "Brazil", flag: "🇧🇷" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "CN", name: "China", flag: "🇨🇳" },
    { code: "RU", name: "Russia", flag: "🇷🇺" },
    { code: "MX", name: "Mexico", flag: "🇲🇽" }
].sort((a, b) => a.name.localeCompare(b.name));

export const DiscoveryGrid = () => {
    const { 
        trending, contentType, setContentType, 
        selectedCountry, setSelectedCountry, 
        searchQuery, setSearchQuery,
        searchType, setSearchType,
        advanceFilters, updateAdvanceFilters,
        personFilters, updatePersonFilters,
        isLoading, error, fetchTime, fetchTrending 
    } = useMovieStore();

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchTrending();
    }, [contentType, selectedCountry, searchQuery, advanceFilters, personFilters]);

    const handleFilterChange = (key, value) => {
        updateAdvanceFilters({ [key]: value });
    };

    const handlePersonFilterChange = (key, value) => {
        updatePersonFilters({ [key]: value });
    };

    const filteredTrending = trending.filter(item => {
        if (contentType !== 'search' || searchType === 'ALL') return true;
        if (searchType === 'MOVIE') return item.certificate && (item.certificate.includes('MOVIE') || item.certificate.includes('FEATURE'));
        if (searchType === 'TV') return item.certificate && (item.certificate.includes('TV') || item.certificate.includes('SERIES'));
        if (searchType === 'PERSON') return item.certificate === 'PERSON';
        return true;
    });

    const SkeletonCard = () => (
        <div className="group relative flex flex-col h-full animate-pulse">
            <div className="relative aspect-[2/3] rounded-[1.5rem] bg-white/[0.03] border border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent shimmer-trace" />
                <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/5 border border-white/5" />
                <div className="absolute bottom-5 left-5 right-5 space-y-3">
                    <div className="flex gap-2">
                        <div className="h-4 w-12 rounded-full bg-white/5" />
                        <div className="h-4 w-12 rounded-full bg-white/5" />
                    </div>
                    <div className="h-6 w-3/4 rounded-lg bg-white/5" />
                    <div className="h-3 w-1/4 rounded-md bg-white/5" />
                </div>
            </div>
            <div className="pt-4 px-2 space-y-2">
                <div className="h-2.5 w-full rounded-full bg-white/5" />
                <div className="h-2.5 w-2/3 rounded-full bg-white/5" />
            </div>
        </div>
    );

    if (isLoading) return (
        <div className="min-h-screen text-white p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="h-16 w-1/3 bg-white/5 rounded-2xl mb-12 animate-pulse" />
                <div className="flex gap-3 mb-12">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-24 rounded-full bg-white/5 animate-pulse" />)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
            <style>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                .shimmer-trace { animation: shimmer 2.5s infinite linear; }
            `}</style>
        </div>
    );

    return (
        <div className="min-h-screen text-white p-6 md:p-10">
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase mb-3 text-glow">
                            {contentType === 'movies' && <>Trending <span className="text-emerald-500">Cinema</span></>}
                            {contentType === 'tv' && <>TV <span className="text-emerald-500">Intelligence</span></>}
                            {contentType === 'advanced' && <>Advanced <span className="text-emerald-500">Vault</span></>}
                            {contentType === 'person' && <>Celeb <span className="text-amber-500">Archives</span></>}
                            {contentType === 'by-country' && <>Global <span className="text-emerald-500">Hub</span></>}
                            {contentType === 'search' && <>Search <span className="text-emerald-500">Results</span></>}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold">Live Intelligence Stream</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${
                                showFilters 
                                ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                                : 'glass text-white/70 hover:text-white hover:border-white/20'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            Filters
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="glass rounded-[2rem] p-8 mb-10 animate-in fade-in zoom-in-95 duration-500 border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">Category</label>
                                <select 
                                    value={contentType === 'person' ? 'person' : advanceFilters.titleType}
                                    onChange={(e) => {
                                        if (e.target.value === 'person') setContentType('person');
                                        else {
                                            setContentType('advanced');
                                            handleFilterChange('titleType', e.target.value);
                                        }
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold uppercase outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                                >
                                    <option value="movie">Movies</option>
                                    <option value="tvSeries">TV Series</option>
                                    <option value="person">Person / Celeb</option>
                                </select>
                            </div>

                            {contentType === 'person' ? (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-amber-500/70 tracking-widest">Born After</label>
                                        <input type="number" defaultValue={personFilters.birthStart} onBlur={(e) => handlePersonFilterChange('birthStart', parseInt(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-amber-500/50 transition-all" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-amber-500/70 tracking-widest">Gender</label>
                                        <select value={personFilters.gender} onChange={(e) => handlePersonFilterChange('gender', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold uppercase outline-none focus:border-amber-500/50 transition-all cursor-pointer">
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-amber-500/70 tracking-widest">Role</label>
                                        <input type="text" placeholder="e.g. Actor" onBlur={(e) => handlePersonFilterChange('topic', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-amber-500/50 transition-all" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-3 pb-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">Rating</label>
                                            <span className="text-[10px] font-black text-emerald-400">{advanceFilters.ratingMin}+</span>
                                        </div>
                                        <input type="range" min="0" max="10" step="0.1" value={advanceFilters.ratingMin} onChange={(e) => handleFilterChange('ratingMin', parseFloat(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">Year Range</label>
                                        <div className="flex gap-2">
                                            <input type="number" value={advanceFilters.yearStart} onChange={(e) => handleFilterChange('yearStart', parseInt(e.target.value))} className="w-1/2 bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-emerald-500/50 transition-all" />
                                            <input type="number" value={advanceFilters.yearEnd} onChange={(e) => handleFilterChange('yearEnd', parseInt(e.target.value))} className="w-1/2 bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-emerald-500/50 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">Shadow Filter</label>
                                        <select value={advanceFilters.adult} onChange={(e) => handleFilterChange('adult', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold uppercase outline-none focus:border-emerald-500/50 transition-all cursor-pointer">
                                            <option value="EXCLUDE">Pure Content</option>
                                            <option value="INCLUDE">Unrestricted</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="flex items-end">
                                <button onClick={() => { setContentType('advanced'); fetchTrending(); }} className="w-full bg-emerald-500 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(16,185,129,0.3)]">Apply Filters</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-3 mb-12">
                    {[
                        { id: 'movies', label: 'Movies' },
                        { id: 'tv', label: 'TV Shows' },
                        { id: 'top-rated', label: 'Top Rated' },
                        { id: 'top-english', label: 'English Hits' },
                        { id: 'by-country', label: 'Regional' },
                    ].map(btn => (
                        <button 
                            key={btn.id}
                            onClick={() => {
                                setContentType(btn.id);
                                if (searchQuery) setSearchQuery('');
                            }}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                                contentType === btn.id 
                                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                                : 'glass text-white/50 border-white/5 hover:text-white hover:border-white/20'
                            }`}
                        >
                            {btn.label}
                        </button>
                    ))}

                    {contentType === 'by-country' && (
                        <select 
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="bg-white/5 glass text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full border border-white/10 outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                        >
                            {COUNTRIES.map(c => <option key={c.code} value={c.code} className="bg-black">{c.flag} {c.name}</option>)}
                        </select>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {filteredTrending.map((item, index) => (
                        <div 
                            key={`${item.imdb_id}-${index}`} 
                            className="group relative flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="relative aspect-[2/3] rounded-[1.5rem] overflow-hidden glass border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:border-emerald-500/30">
                                {item.poster ? (
                                    <img 
                                        src={item.poster} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        loading="lazy" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center text-white/20 text-[9px] tracking-widest uppercase gap-3">
                                        <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        No Visual Data
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                
                                <div className="absolute top-4 right-4">
                                    <div className={`h-10 w-10 rounded-full glass border-white/10 flex items-center justify-center font-black text-xs ${
                                        item.certificate === 'PERSON' ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>
                                        {item.rating || '★'}
                                    </div>
                                </div>

                                <div className="absolute bottom-5 left-5 right-5">
                                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                                        {(item.genres || []).slice(0, 2).map(g => (
                                            <span key={g} className="bg-white/10 backdrop-blur-md text-white/90 text-[8px] font-black uppercase px-2.5 py-1 rounded-full border border-white/10">{g}</span>
                                        ))}
                                    </div>
                                    <h3 className="text-lg font-black tracking-tighter uppercase leading-none mb-1 text-white group-hover:text-emerald-400 transition-colors line-clamp-2">{item.title}</h3>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{item.year || '----'}</p>
                                </div>
                            </div>
                            
                            <div className="pt-4 px-2">
                                <p className="text-[9px] text-white/30 line-clamp-2 uppercase font-black tracking-wide leading-relaxed group-hover:text-white/50 transition-colors">
                                    {item.description || "INTELLIGENCE DECRYPTED. STANDBY FOR FEED."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTrending.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-6 border-white/5 text-white/20">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-white/20">No Intelligence Found</h2>
                        <p className="text-xs text-white/10 uppercase tracking-widest mt-2">Try adjusting your spectral orientation</p>
                    </div>
                )}
            </div>
        </div>
    );
};
