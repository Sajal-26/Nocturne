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
        // Trigger fetch whenever any core parameter changes
        fetchTrending();
    }, [contentType, selectedCountry, searchQuery, advanceFilters, personFilters]);

    const handleFilterChange = (key, value) => {
        updateAdvanceFilters({ [key]: value });
    };

    const handlePersonFilterChange = (key, value) => {
        updatePersonFilters({ [key]: value });
    };

    // Re-introduce client-side filtering for Search/Suggestion results
    const filteredTrending = trending.filter(item => {
        if (contentType !== 'search' || searchType === 'ALL') return true;
        if (searchType === 'MOVIE') return item.certificate && (item.certificate.includes('MOVIE') || item.certificate.includes('FEATURE'));
        if (searchType === 'TV') return item.certificate && (item.certificate.includes('TV') || item.certificate.includes('SERIES'));
        if (searchType === 'PERSON') return item.certificate === 'PERSON';
        return true;
    });

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
            <p className="text-xl font-light tracking-[0.2em] uppercase">Decrypting Intelligence...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="flex flex-col mb-12 border-b border-white/10 pb-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                    <div className="flex-1">
                        <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">
                            {contentType === 'movies' && <>Trending <span className="text-emerald-500">Cinema</span></>}
                            {contentType === 'tv' && <>TV <span className="text-emerald-500">Intelligence</span></>}
                            {contentType === 'advanced' && <>Advanced <span className="text-emerald-500">Vault</span></>}
                            {contentType === 'person' && <>Celeb <span className="text-amber-500">Archives</span></>}
                            {contentType === 'by-country' && <>Global <span className="text-emerald-500">Hub</span></>}
                            {contentType === 'search' && <>Search <span className="text-emerald-500">Results</span></>}
                        </h1>
                        <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-medium">Real-time IMDb Intelligence Feed</p>
                    </div>

                    <div className="flex flex-col items-end space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="relative w-72 group">
                                <input 
                                    type="text"
                                    placeholder="SEARCH ARCHIVE..."
                                    defaultValue={searchQuery}
                                    onKeyDown={(e) => { 
                                        if (e.key === 'Enter') setSearchQuery(e.target.value); 
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[10px] font-bold uppercase tracking-[0.2em] outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-2 rounded-full border transition-all ${showFilters ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-white/10 text-white hover:border-emerald-500/50'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            </button>
                        </div>

                        {contentType === 'search' && (
                            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-sm">
                                {['ALL', 'MOVIE', 'TV', 'PERSON'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSearchType(type)}
                                        className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter transition-all ${searchType === type ? 'bg-white/10 text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {showFilters && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl">
                        <div className="flex flex-col space-y-2">
                            <label className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Scope</label>
                            <select 
                                value={contentType === 'person' ? 'person' : advanceFilters.titleType}
                                onChange={(e) => {
                                    if (e.target.value === 'person') setContentType('person');
                                    else {
                                        setContentType('advanced');
                                        handleFilterChange('titleType', e.target.value);
                                    }
                                }}
                                className="bg-black border border-white/10 rounded-lg p-2 text-[10px] font-bold uppercase outline-none focus:border-emerald-500/50"
                            >
                                <option value="movie">Movies</option>
                                <option value="tvSeries">TV Series</option>
                                <option value="person">Person / Celeb</option>
                            </select>
                        </div>

                        {contentType === 'person' ? (
                            <>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[9px] font-black uppercase text-amber-500 tracking-widest">Era (Born After)</label>
                                    <input type="number" defaultValue={personFilters.birthStart} onBlur={(e) => handlePersonFilterChange('birthStart', parseInt(e.target.value))} className="bg-black border border-white/10 rounded-lg p-2 text-[10px] font-bold outline-none focus:border-amber-500/50" />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[9px] font-black uppercase text-amber-500 tracking-widest">Gender</label>
                                    <select value={personFilters.gender} onChange={(e) => handlePersonFilterChange('gender', e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-[10px] font-bold uppercase outline-none focus:border-amber-500/50">
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[9px] font-black uppercase text-amber-500 tracking-widest">Expertise</label>
                                    <input type="text" placeholder="e.g. Actor" onBlur={(e) => handlePersonFilterChange('topic', e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-[10px] font-bold outline-none focus:border-amber-500/50" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col space-y-2 lg:col-span-1">
                                    <label className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Min Rating: {advanceFilters.ratingMin}</label>
                                    <input type="range" min="0" max="10" step="0.5" value={advanceFilters.ratingMin} onChange={(e) => handleFilterChange('ratingMin', parseFloat(e.target.value))} className="accent-emerald-500" />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Decade {advanceFilters.yearStart}-{advanceFilters.yearEnd}</label>
                                    <div className="flex space-x-1">
                                        <input type="number" value={advanceFilters.yearStart} onChange={(e) => handleFilterChange('yearStart', parseInt(e.target.value))} className="w-1/2 bg-black border border-white/10 rounded-lg p-1 text-[10px] font-bold outline-none" />
                                        <input type="number" value={advanceFilters.yearEnd} onChange={(e) => handleFilterChange('yearEnd', parseInt(e.target.value))} className="w-1/2 bg-black border border-white/10 rounded-lg p-1 text-[10px] font-bold outline-none" />
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <label className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Shadow Filter</label>
                                    <select value={advanceFilters.adult} onChange={(e) => handleFilterChange('adult', e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-[10px] font-bold uppercase outline-none">
                                        <option value="EXCLUDE">Pure Content</option>
                                        <option value="INCLUDE">Unrestricted</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <div className="flex items-end h-full">
                            <button onClick={() => { setContentType('advanced'); fetchTrending(); }} className="w-full bg-emerald-500 text-black py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">Inject Parameters</button>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 overflow-x-auto py-2 scrollbar-hide">
                    {[
                        { id: 'movies', label: 'Movies' },
                        { id: 'tv', label: 'TV Shows' },
                        { id: 'top-rated', label: 'Top Movies' },
                        { id: 'top-rated-tv', label: 'Top TV' },
                        { id: 'top-english', label: 'English Top' },
                        { id: 'by-country', label: 'By Region' },
                        { id: 'bottom', label: 'Shadow Feed' },
                    ].map(btn => (
                        <button 
                            key={btn.id}
                            onClick={() => {
                                setContentType(btn.id);
                                if (searchQuery) setSearchQuery(''); // Clear search when switching categories
                            }}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border
                            ${contentType === btn.id ? 
                                `bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]` : 
                                'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:border-white/20'}`}
                        >
                            {btn.label}
                        </button>
                    ))}

                    {contentType === 'by-country' && (
                        <select 
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="bg-[#1a1a1a] text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-white/10 outline-none focus:border-emerald-500/50 transition-all"
                        >
                            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                        </select>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-10">
                {filteredTrending.map((item, index) => (
                    <div 
                        key={`${item.imdb_id}-${index}`} 
                        className={`group relative bg-[#121212] rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/5 
                            ${item.certificate === 'PERSON' ? 'border-amber-500/20' : 'hover:border-emerald-500/30'}`}
                    >
                        <div className="relative aspect-[2/3] overflow-hidden">
                            {item.poster ? (
                                <img src={item.poster} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-[10px] tracking-widest uppercase">No Visual</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                            
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {(item.genres || []).slice(0, 2).map(g => (
                                        <span key={g} className="bg-emerald-500/20 text-emerald-400 text-[7px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/20">{g}</span>
                                    ))}
                                </div>
                                <h3 className="text-base font-black tracking-tighter uppercase leading-tight mb-1 group-hover:text-emerald-400 transition-colors line-clamp-2">{item.title}</h3>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.year || '----'}</p>
                            </div>

                            <div className="absolute top-4 right-4">
                                <div className={`h-8 w-8 rounded-full backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center
                                    ${item.certificate === 'PERSON' ? 'bg-amber-500/30 text-amber-400' : 'bg-emerald-500/30 text-emerald-400'}`}>
                                    <span className="text-[9px] font-black leading-none">{item.rating || '★'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-4 bg-zinc-900/40">
                            <p className="text-[8px] text-zinc-500 line-clamp-2 uppercase font-bold tracking-wide leading-relaxed">
                                {item.description || "Metadata decrypted. Feed operational."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {filteredTrending.length === 0 && (
                <div className="flex items-center justify-center py-20 text-zinc-700 uppercase tracking-widest font-black text-sm">No Intelligence Found</div>
            )}
        </div>
    );
};
