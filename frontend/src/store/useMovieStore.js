import { create } from 'zustand';

const GRAPHQL_URL = "http://localhost:4000/graphql";

export const useMovieStore = create((set, get) => ({
    trending: [],
    contentType: 'movies',
    selectedCountry: 'US',
    searchQuery: '',
    searchType: 'ALL', 
    isLoading: false,
    error: null,
    fetchTime: 0,

    advanceFilters: {
        genres: [],
        languages: [],
        countries: [],
        ratingMin: 0,
        ratingMax: 10,
        votesMin: 0,
        yearStart: 1900,
        yearEnd: 2024,
        runtimeMin: 0,
        runtimeMax: 300,
        titleType: 'movie',
        adult: 'EXCLUDE',
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
            advanceFilters: { ...state.advanceFilters, ...updates },
            contentType: 'advanced',
            trending: [] 
        }));
    },

    updatePersonFilters: (updates) => {
        set((state) => ({ 
            personFilters: { ...state.personFilters, ...updates },
            contentType: 'person',
            trending: [] 
        }));
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

        const GQL_QUERY = `
            query {
                ${resultKey}${args} {
                    rank
                    imdb_id
                    title
                    year
                    rating
                    rating_count
                    rating_count_formatted
                    certificate
                    poster
                    duration
                    genres
                    description
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

            const { data, errors } = await response.json();
            if (errors) throw new Error(errors[0].message);

            const end = Date.now();
            set({ 
                trending: data[resultKey] || [], 
                isLoading: false, 
                fetchTime: (end - start) / 1000 
            });
        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.error("Movie Store Error:", err.message);
        }
    }
}));
