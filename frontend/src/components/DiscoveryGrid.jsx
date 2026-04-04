import React, { useEffect } from 'react';
import { useMovieStore } from '../store/useMovieStore';

export const DiscoveryGrid = () => {
    const { trending, contentType, setContentType, isLoading, error, fetchTime, fetchTrending } = useMovieStore();

    useEffect(() => {
        fetchTrending();
    }, [fetchTrending, contentType]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
            <p className="text-xl font-light tracking-[0.2em] uppercase">Decrypting {contentType} Intelligence...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen bg-black text-red-500">
            <p className="text-xl font-mono uppercase tracking-widest">Engine Failure: {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8 space-y-6 md:space-y-0">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">
                        {contentType === 'movies' && <>Trending <span className="text-emerald-500">Cinema</span></>}
                        {contentType === 'tv' && <>TV <span className="text-emerald-500">Intelligence</span></>}
                        {contentType === 'top-rated' && <>Top <span className="text-emerald-500">Rated</span> Movies</>}
                        {contentType === 'top-rated-tv' && <>Top <span className="text-emerald-500">Rated</span> TV</>}
                        {contentType === 'top-english' && <>English <span className="text-emerald-500">Legends</span></>}
                        {contentType === 'bottom' && <><span className="text-red-500 italic">Shadow</span> Feed</>}
                    </h1>
                    <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs font-medium">Real-time IMDb Intelligence Feed</p>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
                        <button 
                            onClick={() => setContentType('movies')}
                            className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${contentType === 'movies' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Trending
                        </button>
                        <button 
                            onClick={() => setContentType('tv')}
                            className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${contentType === 'tv' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-white'}`}
                        >
                            TV Shows
                        </button>
                        <button 
                            onClick={() => setContentType('top-rated')}
                            className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${contentType === 'top-rated' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Top Movies
                        </button>
                        <button 
                            onClick={() => setContentType('top-rated-tv')}
                            className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${contentType === 'top-rated-tv' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-white'}`}
                        >
                            Top TV
                        </button>
                        <button 
                            onClick={() => setContentType('top-english')}
                            className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${contentType === 'top-english' ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-white'}`}
                        >
                            English Top
                        </button>
                        <button 
                            onClick={() => setContentType('bottom')}
                            className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${contentType === 'bottom' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'text-zinc-500 hover:text-red-400'}`}
                        >
                            Shadow Feed
                        </button>
                    </div>



                    <div className="hidden lg:flex flex-col items-end">
                        <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-mono border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.1)] uppercase tracking-widest">
                            {fetchTime.toFixed(3)}s Secure Uplink
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10">
                {trending.map((item, index) => (
                    <div 
                        key={item.imdb_id} 
                        className={`group relative bg-[#121212] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/5 ${contentType === 'bottom' ? 'hover:border-red-500/30' : 'hover:border-emerald-500/30'}`}
                    >

                        <div className="relative aspect-[2/3] overflow-hidden">
                            {item.poster ? (
                                <img 
                                    src={item.poster} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-800 font-black text-4xl">
                                    NO POSTER
                                </div>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-90" />
                            
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl px-3 py-1 rounded-lg text-[10px] font-black border border-white/10 tracking-widest">
                                Rank #{item.rank}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-center mb-3">
                                <span 
                                    className={`text-[10px] font-black ${contentType === 'bottom' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'} px-2 py-1 rounded border tracking-widest uppercase cursor-help`}
                                    title={`${item.rating_count?.toLocaleString()} Actual Ratings`}
                                >
                                    ⭐ {item.rating || "N/A"}
                                </span>
                                <span className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase font-bold italic">
                                    {item.certificate || "NR"}
                                </span>
                            </div>

                            <h3 className={`text-sm font-bold truncate ${contentType === 'bottom' ? 'group-hover:text-red-400' : 'group-hover:text-emerald-400'} transition-colors uppercase tracking-widest mb-1`}>
                                {item.title}
                            </h3>

                            <div className={`text-[9px] ${contentType === 'bottom' ? 'text-red-500/40' : 'text-emerald-500/40'} font-mono mb-4 tracking-tighter uppercase`}>
                                Global position: {item.rank}
                            </div>

                            <div className="text-[9px] text-zinc-600 font-mono mb-4 tracking-tighter">
                                {item.rating_count ? `${item.rating_count.toLocaleString()} VERIFIED VOTES` : 'NO DATA AVAILABLE'}
                            </div>

                            
                            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">
                                <span>{item.year || "----"}</span>
                                <span className={contentType === 'bottom' ? 'text-red-500/50' : 'text-emerald-500/50'}>{item.duration}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );

};

