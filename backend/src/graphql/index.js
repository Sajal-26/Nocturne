import { getTrendingMovies, getTrendingTVShows, getTopRatedMovies, getTopRatedTVShows, getTopEnglishMovies, getBottomMovies } from '../services/imdb.js';

export const typeDefs = `#graphql
  type Movie {
    rank: Int
    imdb_id: String
    title: String

    year: Int
    rating: Float
    rating_count: Int
    rating_count_formatted: String
    certificate: String
    poster: String
    duration: String
  }



  type Query {
    trendingMovies: [Movie]
    trendingTVShows: [Movie]
    topRatedMovies: [Movie]
    topRatedTVShows: [Movie]
    topEnglishMovies: [Movie]
    bottomMovies: [Movie]
    hello: String
  }



`;

export const resolvers = {
  Query: {
    hello: () => "Welcome to Nocturne GraphQL API",
    trendingMovies: async () => {
      console.log("GraphQL: Fetching Trending Movies...");
      return await getTrendingMovies();
    },
    trendingTVShows: async () => {
      console.log("GraphQL: Fetching Trending TV Shows...");
      return await getTrendingTVShows();
    },
    topRatedMovies: async () => {
      console.log("GraphQL: Fetching Top Rated Movies...");
      return await getTopRatedMovies();
    },
    topRatedTVShows: async () => {
      console.log("GraphQL: Fetching Top Rated TV Shows...");
      return await getTopRatedTVShows();
    },
    topEnglishMovies: async () => {
      console.log("GraphQL: Fetching Top English Movies...");
      return await getTopEnglishMovies();
    },
    bottomMovies: async () => {
      console.log("GraphQL: Fetching Bottom 100 Movies...");
      return await getBottomMovies();
    }
  },
};


