import { create } from 'zustand';
import axios from 'axios';

const GRAPHQL_URL = import.meta.env.DEV
    ? '/graphql'
    : `${(import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')}/graphql`;

let advanceFilterTimeout = null;

export const useMovieStore = create((set, get) => ({
    trending: [],
    trendingPage: 1,
    trendingPerPage: 50,
    hasMoreTrending: false,
    isFetchingMoreTrending: false,
    contentType: 'mixed',
    selectedCountry: localStorage.getItem('nocturne_region') || 'IN',
    isLocationInitialized: false,
    selectedNetflixDate: null,

    initUserLocation: async () => {
        if (get().isLocationInitialized) return;
        const stored = localStorage.getItem('nocturne_region');
        set({
            selectedCountry: stored || get().selectedCountry || 'IN',
            isLocationInitialized: true
        });
    },
    searchQuery: '',
    searchType: 'ALL',
    isLoading: false,
    error: null,
    fetchTime: 0,
    unfilteredResults: [],
    searchResults: [],
    searchIsLoading: false,
    searchError: null,
    searchFetchTime: 0,
    searchUnfilteredResults: [],

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

    // Home Page Loading States
    homeTrendingLoading: true,
    homeNetflixLoading: true,
    homePrimeLoading: true,
    homeAppleLoading: true,
    homeZee5Loading: true,
    homeSonyLivLoading: true,
    homeMxPlayerLoading: true,
    homeCrunchyrollLoading: true,
    homeHotstarLoading: true,

    // Movies Page Specific State
    moviesTrending: [],
    moviesTop250: [],
    moviesTopEnglish: [],
    moviesTopIndian: [],
    moviesBottom: [],

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
        set({ searchQuery: query });
    },

    setSearchType: (type) => {
        set({ searchType: type });
    },

    updateAdvanceFilters: (updates) => {
        set((state) => ({
            advanceFilters: { ...state.advanceFilters, ...updates }
        }));

        get().applySearchFilters();
    },

    updatePersonFilters: (updates) => {
        set((state) => ({
            personFilters: { ...state.personFilters, ...updates },
            contentType: 'person',
            trending: []
        }));
    },

    applySearchFilters: () => {
        const { searchUnfilteredResults, advanceFilters } = get();
        let filtered = searchUnfilteredResults.filter(item => {
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

        set({ searchResults: filtered });
    },

    setContentType: (type) => {
        if (get().contentType === type && type !== 'search') return;
        set({
            contentType: type,
            trending: [],
            trendingPage: 1,
            hasMoreTrending: false,
            isFetchingMoreTrending: false
        });
    },

    setSelectedCountry: (country) => {
        localStorage.setItem('nocturne_region', country);
        set({
            selectedCountry: country,
            trending: [],
            trendingPage: 1,
            hasMoreTrending: false,
            isFetchingMoreTrending: false
        });
    },

    setSelectedNetflixDate: (date) => {
        set({ selectedNetflixDate: date });
    },

    fetchTrending: async (options = {}) => {
        const {
            contentType,
            selectedCountry,
            searchQuery,
            advanceFilters,
            personFilters,
            trendingPerPage
        } = get();
        const page = Math.max(options.page || 1, 1);
        const append = Boolean(options.append);

        set({
            isLoading: append ? get().isLoading : true,
            isFetchingMoreTrending: append,
            error: null
        });
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
            case 'advanced':
            case 'genre':
                resultKey = "advancedSearch";
                const filterStr = JSON.stringify(advanceFilters).replace(/"([^"]+)":/g, '$1:');
                args = `(filters: ${filterStr}, page: ${page}, perPage: ${trendingPerPage})`;
                break;
            case 'person':
                resultKey = "personSearch";
                const personStr = JSON.stringify(personFilters).replace(/"([^"]+)":/g, '$1:');
                args = `(filters: ${personStr})`;
                break;
            case 'netflix':
                resultKey = "netflixTop10";
                const dateParam = get().selectedNetflixDate;
                let formattedDate = "";
                if (dateParam) {
                    const y = dateParam.getFullYear();
                    const m = String(dateParam.getMonth() + 1).padStart(2, '0');
                    const d = String(dateParam.getDate()).padStart(2, '0');
                    formattedDate = `${y}-${m}-${d}`;
                }
                args = `(type: "movie"${formattedDate ? `, date: "${formattedDate}"` : ""})`;
                break;
            case 'hotstar':
                resultKey = "hotstar";
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

        const netflixSchemaFields = `
            rank
            title
            hours_viewed
            weeks_in_top_10
            category
            week
            imdb_id
            year
            rating
            rating_count
            rating_count_formatted
            certificate
            poster
            duration
            genres
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
                        ${resultKey === 'netflixTop10' ? `week data { ${netflixSchemaFields} }` : schemaFields}
                    }
                }
            `;
        try {
            let fetchedData = [];
            const isRestType = resultKey === 'hotstar';

            if (isRestType) {
                const url = '/api/hotstar-popular';
                const restRes = await axios.get(url);
                fetchedData = restRes.data?.data || [];
            } else {
                const response = await fetch(GRAPHQL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: GQL_QUERY }),
                });

                if (!response.ok) throw new Error(`Server Error: ${response.status}`);

                const json = await response.json();
                const { data, errors } = json;
                if (errors) throw new Error(errors[0].message);

                if (isMixedTrending) {
                    const moves = data?.trendingMovies || [];
                    const shows = data?.trendingTVShows || [];
                    let i = 0; let j = 0;
                    while (i < moves.length || j < shows.length) {
                        if (i < moves.length && j < shows.length) {
                            if (Math.random() > 0.6) fetchedData.push(shows[j++]);
                            else fetchedData.push(moves[i++]);
                        } else if (i < moves.length) {
                            fetchedData.push(moves[i++]);
                        } else {
                            fetchedData.push(shows[j++]);
                        }
                    }
                } else {
                    const fetched = data?.[resultKey] || [];
                    if (resultKey === 'netflixTop10') {
                        fetchedData = fetched.data || [];
                    } else {
                        fetchedData = fetched;
                    }
                }
            }

            const end = Date.now();
            const canPaginate = resultKey === 'advancedSearch';
            const nextTrending = append ? [...get().trending, ...fetchedData] : fetchedData;
            set({
                unfilteredResults: fetchedData,
                trending: nextTrending,
                isLoading: false,
                isFetchingMoreTrending: false,
                fetchTime: (end - start) / 1000,
                trendingPage: page,
                hasMoreTrending: canPaginate && fetchedData.length === trendingPerPage && (page * trendingPerPage) < 250
            });
        } catch (error) {
            set({ error: error.message, isLoading: false, isFetchingMoreTrending: false });
        }
    },

    loadMoreTrending: async () => {
        const { hasMoreTrending, isLoading, isFetchingMoreTrending, trendingPage } = get();
        if (!hasMoreTrending || isLoading || isFetchingMoreTrending) return;
        return get().fetchTrending({ page: trendingPage + 1, append: true });
    },

    fetchSearchResults: async (queryOverride) => {
        const { searchQuery, advanceFilters } = get();
        const resolvedQuery = typeof queryOverride === 'string' ? queryOverride : searchQuery;

        set({
            searchIsLoading: true,
            searchError: null,
            searchQuery: resolvedQuery
        });

        const start = Date.now();

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

        const escapedQuery = resolvedQuery.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        const gqlQuery = `
            query {
                searchMovies(query: "${escapedQuery}") {
                    ${schemaFields}
                }
            }
        `;

        try {
            const response = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: gqlQuery }),
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const json = await response.json();
            const { data, errors } = json;
            if (errors) throw new Error(errors[0].message);

            const fetchedData = data?.searchMovies || [];
            const end = Date.now();

            set({
                searchUnfilteredResults: fetchedData,
                searchResults: fetchedData,
                searchIsLoading: false,
                searchFetchTime: (end - start) / 1000
            });

            if (advanceFilters.query !== resolvedQuery) {
                set((state) => ({
                    advanceFilters: { ...state.advanceFilters, query: resolvedQuery }
                }));
            }

            get().applySearchFilters();
        } catch (error) {
            set({ searchError: error.message, searchIsLoading: false });
        }
    },

    fetchDiscoverDefaults: async () => {
        set({
            searchIsLoading: true,
            searchError: null,
            searchQuery: ''
        });

        const start = Date.now();
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

        const gqlQuery = `
            query {
                trendingMovies {
                    ${schemaFields}
                }
            }
        `;

        try {
            const response = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: gqlQuery }),
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const json = await response.json();
            const { data, errors } = json;
            if (errors) throw new Error(errors[0].message);

            const fetchedData = data?.trendingMovies || [];
            const end = Date.now();

            set((state) => ({
                searchUnfilteredResults: fetchedData,
                searchResults: fetchedData,
                searchIsLoading: false,
                searchFetchTime: (end - start) / 1000,
                advanceFilters: { ...state.advanceFilters, query: '' }
            }));

            get().applySearchFilters();
        } catch (error) {
            set({ searchError: error.message, searchIsLoading: false });
        }
    },

    fetchHomeData: async () => {
        // Set all loading states to true initially
        set({
            homeTrendingLoading: true,
            homeNetflixLoading: true,
            homePrimeLoading: true,
            homeAppleLoading: true,
            homeZee5Loading: true,
            homeSonyLivLoading: true,
            homeMxPlayerLoading: true,
            homeCrunchyrollLoading: true,
            homeHotstarLoading: true,
        });

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

            // Start all API calls in parallel
            const gqlPromise = axios.post('/graphql', { query: gql_query });
            const netflixPromise = axios.get('/api/netflix-top-10');
            const platformPromise = axios.get('/api/platform-top-10');
            const hotstarPromise = axios.get('/api/hotstar-popular');

            // Handle GraphQL response
            gqlPromise.then((gqlRes) => {
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

                set({
                    homeTrending: interleaved,
                    homeTrendingLoading: false
                });
            }).catch((error) => {
                console.error('Trending Data Fetch Error:', error);
                set({ homeTrendingLoading: false });
            });

            // Handle Netflix response
            netflixPromise.then((netflixRes) => {
                set({
                    homeNetflix: netflixRes.data?.data || [],
                    homeNetflixLoading: false
                });
            }).catch((error) => {
                console.error('Netflix Data Fetch Error:', error);
                set({ homeNetflixLoading: false });
            });

            // Handle Platform response
            platformPromise.then((platformRes) => {
                const platformData = platformRes.data?.results || {};
                set({
                    homePrime: platformData.prime || [],
                    homeApple: platformData.apple || [],
                    homeZee5: platformData.zee5 || [],
                    homeSonyLiv: platformData.sonyliv || [],
                    homeMxPlayer: platformData.mxplayer || [],
                    homeCrunchyroll: platformData.crunchyroll || [],
                    homePrimeLoading: false,
                    homeAppleLoading: false,
                    homeZee5Loading: false,
                    homeSonyLivLoading: false,
                    homeMxPlayerLoading: false,
                    homeCrunchyrollLoading: false
                });
            }).catch((error) => {
                console.error('Platform Data Fetch Error:', error);
                set({
                    homePrimeLoading: false,
                    homeAppleLoading: false,
                    homeZee5Loading: false,
                    homeSonyLivLoading: false,
                    homeMxPlayerLoading: false,
                    homeCrunchyrollLoading: false
                });
            });

            // Handle Hotstar response
            hotstarPromise.then((hotstarRes) => {
                set({
                    homeHotstar: hotstarRes.data?.data || [],
                    homeHotstarLoading: false
                });
            }).catch((error) => {
                console.error('Hotstar Data Fetch Error:', error);
                set({ homeHotstarLoading: false });
            });

        } catch (error) {
            console.error('Home Data Fetch Error:', error);
            // Set all loading states to false on general error
            set({
                homeTrendingLoading: false,
                homeNetflixLoading: false,
                homePrimeLoading: false,
                homeAppleLoading: false,
                homeZee5Loading: false,
                homeSonyLivLoading: false,
                homeMxPlayerLoading: false,
                homeCrunchyrollLoading: false,
                homeHotstarLoading: false
            });
        }
    },

    fetchMoviesPageData: async () => {
        set({ isLoading: true });
        try {
            const gql_query = `
                query {
                    trendingMovies(enrich: false) {
                        rank imdb_id title titleType year rating poster certificate duration genres
                    }
                    topRatedMovies {
                        rank imdb_id title titleType year rating poster certificate duration genres
                    }
                    topEnglishMovies {
                        rank imdb_id title titleType year rating poster certificate duration genres
                    }
                    bottomMovies {
                        rank imdb_id title titleType year rating poster certificate duration genres
                    }
                    topRatedByCountry(countryCode: "IN") {
                        rank imdb_id title titleType year rating poster certificate duration genres
                    }
                }
            `;

            const [gqlRes, netflixRes, hotstarRes] = await Promise.all([
                axios.post('/graphql', { query: gql_query }),
                axios.get('/api/netflix-top-10?type=movie'),
                axios.get('/api/hotstar-popular')
            ]);

            const data = gqlRes.data?.data || {};

            set({
                moviesTrending: data.trendingMovies || [],
                moviesTop250: data.topRatedMovies || [],
                moviesTopEnglish: data.topEnglishMovies || [],
                moviesTopIndian: data.topRatedByCountry || [],
                moviesBottom: data.bottomMovies || [],
                homeNetflix: netflixRes.data?.data || [],
                homeHotstar: hotstarRes.data?.data || [],
                isLoading: false
            });
        } catch (error) {
            console.error('Movies Page Data Fetch Error:', error);
            set({ isLoading: false });
        }
    },
}));
