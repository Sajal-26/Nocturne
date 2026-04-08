import { 
    getTrendingMovies, 
    getTrendingTVShows, 
    getTopRatedMovies, 
    getTopRatedTVShows, 
    getTopEnglishMovies, 
    getBottomMovies, 
    getTopRatedByCountry, 
    searchMovies,
    getAdvancedSearch,
    getPersonSearch
} from '../services/imdb.js';
import { getNetflixTop10 } from '../services/netflix.js';
import { getHotstarPopular, getHotstarPopularShows } from '../services/hotstar.js';
import { getAllPlatformTop10 } from '../services/justwatch.js';

export const typeDefs = `#graphql
  type Movie {
    rank: Int
    imdb_id: String
    title: String
    year: String
    rating: Float
    rating_count: Int
    rating_count_formatted: String
    certificate: String
    isAdult: Boolean
    poster: String
    backdrop: String
    logo: String
    duration: String
    runtime_minutes: Int
    titleType: String
    genres: [String]
    countries: [String]
    languages: [String]
    description: String
  }

  input AdvanceFilters {
    query: String
    genres: [String]
    languages: [String]
    countries: [String]
    ratingMin: Float
    ratingMax: Float
    votesMin: Int
    yearStart: Int
    yearEnd: Int
    runtimeMin: Int
    runtimeMax: Int
    titleType: String
    adult: String
    sortBy: String
  }

  input PersonFilters {
    birthStart: Int
    birthEnd: Int
    gender: String
    topic: String
  }

  type NetflixMovie {
    rank: Int
    title: String
    hours_viewed: Float
    weeks_in_top_10: Int
    category: String
    week: String
    imdb_id: String
    year: String
    rating: Float
    rating_count: Int
    rating_count_formatted: String
    certificate: String
    poster: String
    duration: String
    genres: [String]
    description: String
  }

  type NetflixTop10Response {
    week: String
    data: [NetflixMovie]
  }

  type HotstarMovie {
    rank: Int
    title: String
    description: String
    tags: [String]
    imdb_id: String
    year: String
    rating: Float
    rating_count: Int
    rating_count_formatted: String
    certificate: String
    poster: String
    duration: String
    genres: [String]
    language: String
  }

  type HotstarPopularResponse {
    source: String
    updated_at: String
    total: Int
    data: [HotstarMovie]
  }

  type JustWatchItem {
    rank: Int
    title: String
    imdb_id: String
    year: Int
    rating: Float
    rating_count: Int
    rating_count_formatted: String
    certificate: String
    duration: String
    runtime_minutes: Int
    genres: [String]
    description: String
    platform: String
    platform_id: String
    poster: String
    backdrop: String
    url: String
  }

  type PlatformResults {
    prime: [JustWatchItem]
    apple: [JustWatchItem]
    zee5: [JustWatchItem]
    sonyliv: [JustWatchItem]
    mxplayer: [JustWatchItem]
    crunchyroll: [JustWatchItem]
  }

  type JustWatchResponse {
    country: String
    type: String
    results: PlatformResults
    updated_at: String
  }

  type Query {
    trendingMovies(enrich: Boolean): [Movie]
    trendingTVShows(enrich: Boolean): [Movie]
    topRatedMovies: [Movie]
    topRatedTVShows: [Movie]
    topEnglishMovies: [Movie]
    bottomMovies: [Movie]
    topRatedByCountry(countryCode: String!): [Movie]
    searchMovies(query: String!): [Movie]
    advancedSearch(filters: AdvanceFilters!): [Movie]
    personSearch(filters: PersonFilters!): [Movie]
    netflixTop10(type: String, date: String): NetflixTop10Response
    hotstarPopular: HotstarPopularResponse
    hotstarPopularShows: HotstarPopularResponse
    platformTop10(country: String, type: String): JustWatchResponse
    hello: String
  }
`;

export const resolvers = {
  Query: {
    hello: () => "Welcome to Nocturne GraphQL API",
    trendingMovies: async (_, { enrich }) => {
      return await getTrendingMovies(enrich);
    },
    trendingTVShows: async (_, { enrich }) => {
      return await getTrendingTVShows(enrich);
    },
    topRatedMovies: async () => {
      return await getTopRatedMovies();
    },
    topRatedTVShows: async () => {
      return await getTopRatedTVShows();
    },
    bottomMovies: async () => {
      return await getBottomMovies();
    },
    topEnglishMovies: async () => {
      return await getTopEnglishMovies();
    },
    topRatedByCountry: async (_, { countryCode }) => {
      return await getTopRatedByCountry(countryCode);
    },
    searchMovies: async (_, { query }) => {
      console.log("GraphQL | searchMovies | Query:", query);
      const res = await searchMovies(query);
      console.log("GraphQL | searchMovies | Count:", res?.length || 0);
      return res;
    },
    advancedSearch: async (_, { filters }) => {
      console.log("GraphQL | advancedSearch | Filters:", filters);
      const res = await getAdvancedSearch(filters);
      console.log("GraphQL | advancedSearch | Count:", res?.length || 0);
      return res;
    },
    personSearch: async (_, { filters }) => {
      return await getPersonSearch(filters);
    },
    netflixTop10: async (_, { type, date }) => {
      console.log("GraphQL | netflixTop10 | Request:", { type, date });
      const res = await getNetflixTop10(type, date);
      console.log("GraphQL | netflixTop10 | Count:", res?.data?.length || 0);
      return res;
    },
    hotstarPopular: async () => {
      return await getHotstarPopular();
    },
    hotstarPopularShows: async () => {
      return await getHotstarPopularShows();
    },
    platformTop10: async (_, { country, type }) => {
      return await getAllPlatformTop10({ country: country || 'IN', type: type || 'MOVIE' });
    },
  },
};
