import { create } from 'zustand';

const GRAPHQL_URL = "http://localhost:4000/graphql";

const GET_TRENDING = (type) => {
  const queryMap = {
    'movies': 'trendingMovies',
    'tv': 'trendingTVShows',
    'top-rated': 'topRatedMovies',
    'top-rated-tv': 'topRatedTVShows',
    'top-english': 'topEnglishMovies',
    'bottom': 'bottomMovies'
  };
  
  const queryName = queryMap[type] || 'trendingMovies';

  return `
    query {
      ${queryName} {
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
      }
    }
  `;


};

export const useMovieStore = create((set, get) => ({
    trending: [],
    contentType: 'movies', // 'movies', 'tv', 'top-rated', 'top-rated-tv', 'top-english', 'bottom'
    isLoading: false,
    error: null,
    fetchTime: 0,

    setContentType: (type) => {
        if (get().contentType === type) return;
        set({ contentType: type, trending: [] });
        get().fetchTrending();
    },

    fetchTrending: async () => {
        const { contentType, trending } = get();
        if (trending.length > 0) return;

        set({ isLoading: true, error: null });
        const start = Date.now();

        try {
            const response = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: GET_TRENDING(contentType) }),
            });

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            const { data, errors } = await response.json();

            if (errors) {
                throw new Error(errors[0].message);
            }

            const end = Date.now();
            const timeTaken = (end - start) / 1000;
            
            const queryMap = {
                'movies': 'trendingMovies',
                'tv': 'trendingTVShows',
                'top-rated': 'topRatedMovies',
                'top-rated-tv': 'topRatedTVShows',
                'top-english': 'topEnglishMovies',
                'bottom': 'bottomMovies'
            };
            const resultKey = queryMap[contentType];

            set({ 
                trending: data[resultKey], 
                isLoading: false, 
                fetchTime: timeTaken 
            });
            console.log(`Movie Store: ${contentType} Loaded in ${timeTaken}s!`);
        } catch (err) {
            set({ error: err.message, isLoading: false });
            console.error("Movie Store Error:", err.message);
        }
    },

    refreshTrending: () => {
        set({ trending: [] });
        get().fetchTrending();
    }
}));
