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

  type Query {
    trendingMovies: [Movie]
    trendingTVShows: [Movie]
    topRatedMovies: [Movie]
    topRatedTVShows: [Movie]
    topEnglishMovies: [Movie]
    bottomMovies: [Movie]
    topRatedByCountry(countryCode: String!): [Movie]
    searchMovies(query: String!): [Movie]
    advancedSearch(filters: AdvanceFilters!): [Movie]
    personSearch(filters: PersonFilters!): [Movie]
    hello: String
  }
`;

export const resolvers = {
  Query: {
    hello: () => "Welcome to Nocturne GraphQL API",
    trendingMovies: async () => {
      return await getTrendingMovies();
    },
    trendingTVShows: async () => {
      return await getTrendingTVShows();
    },
    topRatedMovies: async () => {
      return await getTopRatedMovies();
    },
    topRatedTVShows: async () => {
      return await getTopRatedTVShows();
    },
    topEnglishMovies: async () => {
      return await getTopEnglishMovies();
    },
    bottomMovies: async () => {
      return await getBottomMovies();
    },
    topRatedByCountry: async (_, { countryCode }) => {
      return await getTopRatedByCountry(countryCode);
    },
    searchMovies: async (_, { query }) => {
      return await searchMovies(query);
    },
    advancedSearch: async (_, { filters }) => {
      return await getAdvancedSearch(filters);
    },
    personSearch: async (_, { filters }) => {
      return await getPersonSearch(filters);
    }
  },
};
