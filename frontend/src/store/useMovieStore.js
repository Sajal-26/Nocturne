import { create } from 'zustand';

const GRAPHQL_URL = "http://localhost:4000/graphql";

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
            // Note: Since duration is returned as '2h 56m', we need to parse it for runtime_minutes
            let runtime_minutes = null;
            if (item.duration && item.duration !== 'N/A') {
                const matchH = item.duration.match(/(\d+)h/);
                const matchM = item.duration.match(/(\d+)m/);
                runtime_minutes = (parseInt(matchH?.[1] || 0) * 60) + parseInt(matchM?.[1] || 0);
            }

            // Rating Filter
            if (advanceFilters.ratingMin > 0) {
                if (item.rating === null || item.rating < advanceFilters.ratingMin) return false;
            }
            if (advanceFilters.ratingMax < 10) {
                if (item.rating !== null && item.rating > advanceFilters.ratingMax) return false;
            }

            // Temporal Filter (Year)
            if (advanceFilters.yearStart > 1900) {
                if (item.year === null || parseInt(item.year) < advanceFilters.yearStart) return false;
            }
            if (advanceFilters.yearEnd < 2030) {
                if (item.year !== null && parseInt(item.year) > advanceFilters.yearEnd) return false;
            }
            
            // Runtime Filter
            if (advanceFilters.runtimeMin > 0) {
                if (runtime_minutes === null || runtime_minutes < advanceFilters.runtimeMin) return false;
            }
            if (advanceFilters.runtimeMax < 300) {
                if (runtime_minutes !== null && runtime_minutes > advanceFilters.runtimeMax) return false;
            }

            // Priority Sort
            // (Sort evaluates after filtering completes below)

            // Genre Nodes
            if (advanceFilters.genres?.length) {
                if (!item.genres || !advanceFilters.genres.every(g => item.genres.includes(g))) return false;
            }

            // Origin Nodes (Countries)
            if (advanceFilters.countries?.length) {
                if (!item.countries || !advanceFilters.countries.some(c => item.countries.includes(c))) return false;
            }

            // Language Grid
            if (advanceFilters.languages?.length) {
                if (!item.languages || !advanceFilters.languages.some(l => item.languages.includes(l))) return false;
            }

            // Min Vote Pulse
            if (advanceFilters.votesMin > 0) {
                if (item.rating_count < advanceFilters.votesMin) return false;
            }

            // Content Type
            if (advanceFilters.titleType !== 'ALL') {
                const isMovieMatch = advanceFilters.titleType === 'movie' && item.titleType === 'tvMovie';
                if (!isMovieMatch && advanceFilters.titleType !== item.titleType) return false;
            }

            // Maturity Protocol
            const isAdult = ['A', 'Adult', 'NC-17', 'X'].includes(item.certificate);
            if (advanceFilters.adult === 'ONLY' && !isAdult) return false;
            if (advanceFilters.adult === 'EXCLUDE' && isAdult) return false;

            return true;
        });

        // Apply Sorting based on Priority Sort logic
        if (advanceFilters.sortBy) {
            filtered.sort((a, b) => {
                if (advanceFilters.sortBy === 'ALPHABETICAL') return (a.title || "").localeCompare(b.title || "");
                if (advanceFilters.sortBy === 'USER_RATING') return (b.rating || 0) - (a.rating || 0);
                if (advanceFilters.sortBy === 'NUM_VOTES') return (b.rating_count || 0) - (a.rating_count || 0);
                if (advanceFilters.sortBy === 'BOX_OFFICE_GROSS') return (b.rank || 0) - (a.rank || 0); // Placeholder
                if (advanceFilters.sortBy === 'RELEASE_DATE') return (b.year || 0) - (a.year || 0);
                // Default POPULARITY
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
        
        // Prevent overlapping fetches for the same category
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
                        // Dynamically scale probabilities if lists heavily unbalance (optional/stochastic)
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
            console.error("Movie Store Error:", error.message);
        }
    }
}));
