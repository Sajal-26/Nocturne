import { create } from 'zustand';
import axios from 'axios';

const GRAPHQL_URL = "/graphql";

let advanceFilterTimeout = null;

export const useMovieStore = create((set, get) => ({
    trending: [],
    contentType: 'mixed',
    selectedCountry: 'US',
    searchQuery: '',
    searchType: 'ALL', 
    isLoading: false,
    error: null,
    fetchTime: 0,
    unfilteredResults: [],
    
    // Home Page Specific State
    homeTrending: [],
    homeNetflix: [],
    homePrime: [],
    homeApple: [],
    homeZee5: [],
    homeSonyLiv: [],
    homeMxPlayer: [],
    homeCrunchyroll: [],
    homeHotstar: [],

    advanceFilters: {
        genres: [],
        languages: [],
        countries: [],
        ratingMin: 0,
        ratingMax: 10,
        votesMin: 0,
        yearStart: 1900,
        yearEnd: 2030,
        runtimeMin: 0,
        runtimeMax: 300,
        query: '',
        titleType: 'ALL',
        adult: 'INCLUDE',
        sortBy: 'POPULARITY'
    },

    personFilters: {
        birthStart: 1900,
        birthEnd: 2024,
        gender: 'MALE',
        topic: ''
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query, contentType: 'search', trending: [] });
    },

    setSearchType: (type) => {
        set({ searchType: type });
    },

    updateAdvanceFilters: (updates) => {
        set((state) => ({ 
            advanceFilters: { ...state.advanceFilters, ...updates }
        }));
        
        get().applyLocalFilters();
    },

    updatePersonFilters: (updates) => {
        set((state) => ({ 
            personFilters: { ...state.personFilters, ...updates },
            contentType: 'person',
            trending: [] 
        }));
    },

    applyLocalFilters: () => {
        const { unfilteredResults, advanceFilters } = get();
        let filtered = unfilteredResults.filter(item => {
            let runtime_minutes = null;
            if (item.duration && item.duration !== 'N/A') {
                const matchH = item.duration.match(/(\d+)h/);
                const matchM = item.duration.match(/(\d+)m/);
                runtime_minutes = (parseInt(matchH?.[1] || 0) * 60) + parseInt(matchM?.[1] || 0);
            }

            if (advanceFilters.ratingMin > 0) {
                if (item.rating === null || item.rating < advanceFilters.ratingMin) return false;
            }
            if (advanceFilters.ratingMax < 10) {
                if (item.rating !== null && item.rating > advanceFilters.ratingMax) return false;
            }

            if (advanceFilters.yearStart > 1900) {
                if (item.year === null || parseInt(item.year) < advanceFilters.yearStart) return false;
            }
            if (advanceFilters.yearEnd < 2030) {
                if (item.year !== null && parseInt(item.year) > advanceFilters.yearEnd) return false;
            }
            
            if (advanceFilters.runtimeMin > 0) {
                if (runtime_minutes === null || runtime_minutes < advanceFilters.runtimeMin) return false;
            }
            if (advanceFilters.runtimeMax < 300) {
                if (runtime_minutes !== null && runtime_minutes > advanceFilters.runtimeMax) return false;
            }

            if (advanceFilters.genres?.length) {
                if (!item.genres || !advanceFilters.genres.every(g => item.genres.includes(g))) return false;
            }

            if (advanceFilters.countries?.length) {
                if (item.countries && item.countries.length > 0) {
                    if (!advanceFilters.countries.some(c => item.countries.includes(c))) return false;
                }
            }

            if (advanceFilters.languages?.length) {
                if (item.languages && item.languages.length > 0) {
                    if (!advanceFilters.languages.some(l => item.languages.includes(l))) return false;
                }
            }

            if (advanceFilters.votesMin > 0) {
                if (item.rating_count < advanceFilters.votesMin) return false;
            }

            if (advanceFilters.titleType !== 'ALL') {
                const isMovieMatch = advanceFilters.titleType === 'movie' && item.titleType === 'tvMovie';
                if (!isMovieMatch && advanceFilters.titleType !== item.titleType) return false;
            }

            const isAdult = ['A', 'Adult', 'NC-17', 'X'].includes(item.certificate);
            if (advanceFilters.adult === 'ONLY' && !isAdult) return false;
            if (advanceFilters.adult === 'EXCLUDE' && isAdult) return false;

            return true;
        });

        if (advanceFilters.sortBy) {
            filtered.sort((a, b) => {
                if (advanceFilters.sortBy === 'ALPHABETICAL') return (a.title || "").localeCompare(b.title || "");
                if (advanceFilters.sortBy === 'USER_RATING') return (b.rating || 0) - (a.rating || 0);
                if (advanceFilters.sortBy === 'NUM_VOTES') return (b.rating_count || 0) - (a.rating_count || 0);
                if (advanceFilters.sortBy === 'BOX_OFFICE_GROSS') return (b.rank || 0) - (a.rank || 0);
                if (advanceFilters.sortBy === 'RELEASE_DATE') return (b.year || 0) - (a.year || 0);
                return (a.rank || 0) - (b.rank || 0);
            });
        }

        set({ trending: filtered });
    },

    setContentType: (type) => {
        if (get().contentType === type && type !== 'search') return;
        set({ contentType: type, trending: [] });
    },

    setSelectedCountry: (country) => {
        set({ selectedCountry: country, trending: [] });
    },

    fetchTrending: async () => {
        const { contentType, selectedCountry, searchQuery, advanceFilters, personFilters, isLoading } = get();
        
        set({ isLoading: true, error: null });
        const start = Date.now();

        let resultKey = "trendingMovies";
        let args = "";

        switch (contentType) {
            case 'movies': resultKey = "trendingMovies"; break;
            case 'tv': resultKey = "trendingTVShows"; break;
            case 'top-rated': resultKey = "topRatedMovies"; break;
            case 'top-rated-tv': resultKey = "topRatedTVShows"; break;
            case 'top-english': resultKey = "topEnglishMovies"; break;
            case 'bottom': resultKey = "bottomMovies"; break;
            case 'by-country': 
                resultKey = "topRatedByCountry"; 
                args = `(countryCode: "${selectedCountry}")`; 
                break;
            case 'search': 
                resultKey = "searchMovies"; 
                args = `(query: "${searchQuery}")`; 
                break;
            case 'advanced':
                resultKey = "advancedSearch";
                const filterStr = JSON.stringify(advanceFilters).replace(/"([^"]+)":/g, '$1:');
                args = `(filters: ${filterStr})`;
                break;
            case 'person':
                resultKey = "personSearch";
                const personStr = JSON.stringify(personFilters).replace(/"([^"]+)":/g, '$1:');
                args = `(filters: ${personStr})`;
                break;
        }

        const schemaFields = `
            rank
            imdb_id
            title
            year
            rating
            rating_count
            rating_count_formatted
            certificate
            isAdult
            poster
            duration
            runtime_minutes
            titleType
            genres
            countries
            languages
            description
        `;

        const isMixedTrending = contentType === 'mixed';

        const GQL_QUERY = isMixedTrending
            ? `
                query {
                    trendingMovies {
                        ${schemaFields}
                    }
                    trendingTVShows {
                        ${schemaFields}
                    }
                }
            `
            : `
                query {
                    ${resultKey}${args} {
                        ${schemaFields}
                    }
                }
            `;

        try {
            const response = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: GQL_QUERY }),
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const json = await response.json();
            const { data, errors } = json;
            if (errors) throw new Error(errors[0].message);

            const end = Date.now();
            let fetchedData = [];
            
            if (isMixedTrending) {
                const moves = data?.trendingMovies || [];
                const shows = data?.trendingTVShows || [];
                
                let i = 0; let j = 0;
                while (i < moves.length || j < shows.length) {
                    if (i < moves.length && j < shows.length) {
                        if (Math.random() > 0.6) {
                            fetchedData.push(shows[j++]);
                        } else {
                            fetchedData.push(moves[i++]);
                        }
                    } else if (i < moves.length) {
                        fetchedData.push(moves[i++]);
                    } else {
                        fetchedData.push(shows[j++]);
                    }
                }
            } else {
                fetchedData = data?.[resultKey] || [];
            }

            set({ 
                unfilteredResults: fetchedData,
                isLoading: false, 
                fetchTime: (end - start) / 1000 
            });
            get().applyLocalFilters();
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchHomeData: async () => {
        set({ isLoading: true });
        try {
            const gql_query = `
                query {
                    trendingMovies(enrich: true) {
                        rank imdb_id title titleType year rating poster backdrop logo certificate duration genres
                    }
                    trendingTVShows(enrich: true) {
                        rank imdb_id title titleType year rating poster backdrop logo certificate duration genres
                    }
                }
            `;

            const [gqlRes, netflixRes, platformRes, hotstarRes] = await Promise.all([
                axios.post('/graphql', { query: gql_query }),
                axios.get('/api/netflix-top-10'),
                axios.get('/api/platform-top-10'),
                axios.get('/api/hotstar-popular')
            ]);

            const movies = gqlRes.data?.data?.trendingMovies || [];
            const tvShows = gqlRes.data?.data?.trendingTVShows || [];
            
            // Interleave by rank
            const interleaved = [];
            const maxLength = Math.max(movies.length, tvShows.length);
            for (let i = 0; i < maxLength; i++) {
                const pair = [];
                if (movies[i]) pair.push(movies[i]);
                if (tvShows[i]) pair.push(tvShows[i]);
                // Shuffle the pair to randomize M/T order within the same rank
                interleaved.push(...pair.sort(() => Math.random() - 0.5));
            }

            const platformData = platformRes.data?.results || {};

            set({ 
                homeTrending: interleaved,
                homeNetflix: netflixRes.data?.data || [],
                homePrime: platformData.prime || [],
                homeApple: platformData.apple || [],
                homeZee5: platformData.zee5 || [],
                homeSonyLiv: platformData.sonyliv || [],
                homeMxPlayer: platformData.mxplayer || [],
                homeCrunchyroll: platformData.crunchyroll || [],
                homeHotstar: hotstarRes.data?.data || [],
                isLoading: false 
            });
        } catch (error) {
            console.error('Home Data Fetch Error:', error);
            set({ isLoading: false });
        }
    },
}));
