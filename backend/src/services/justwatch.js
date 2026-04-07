import axios from 'axios';
import { searchImdbPure, getTitlesBatch, calculateSimilarity } from './imdb.js';

const TOP10_QUERY = `query GetProviderTop10Titles(
  $streamingChartsFilter: StreamingChartsFilter
  $first: Int!
  $after: String
  $country: Country!
  $language: Language!
  $watchNowFilter: WatchNowOfferFilter!
  $platform: Platform! = WEB
) {
  streamingCharts(
    filter: $streamingChartsFilter
    first: $first
    after: $after
    country: $country
  ) {
    edges {
      streamingChartInfo {
        rank
        trend
        trendDifference
        daysInTop10
        topRank
      }
      node {
        content(country: $country, language: $language) {
          title
          originalReleaseYear
          runtime
          genres {
            translation(language: $language)
          }
          scoring {
            imdbScore
            imdbVotes
          }
          posterUrl
          backdrops {
            backdropUrl
          }
        }
        watchNowOffer(country: $country, platform: $platform, filter: $watchNowFilter) {
          standardWebURL
          package {
            clearName
            technicalName
          }
        }
      }
    }
  }
}
`;

const POPULAR_QUERY = `query GetPopularTitles(
  $country: Country!
  $first: Int!
  $language: Language!
  $after: String
  $popularTitlesFilter: TitleFilter
  $popularTitlesSortBy: PopularTitlesSorting! = POPULAR
  $sortRandomSeed: Int! = 0
  $watchNowFilter: WatchNowOfferFilter!
  $offset: Int = 0
) {
  popularTitles(
    country: $country
    filter: $popularTitlesFilter
    first: $first
    sortBy: $popularTitlesSortBy
    sortRandomSeed: $sortRandomSeed
    offset: $offset
    after: $after
  ) {
    edges {
      node {
        objectType
        content(country: $country, language: $language) {
          title
          originalReleaseYear
          shortDescription
          runtime
          scoring {
            imdbVotes
            imdbScore
          }
          posterUrl
        }
        watchNowOffer(country: $country, platform: WEB, filter: $watchNowFilter) {
          standardWebURL
          package {
            clearName
            technicalName
          }
        }
      }
    }
  }
}
`;

const PLATFORM_CODES = {
  prime: "prv",
  apple: "atp",
  zee5: "zee",
  sonyliv: "snl",
  crunchyroll: "cru",
};

const MXPLAYER_CODE = "mni";

let cache = { MOVIE: {}, SHOW: {}, timestamp: 0 };
const CACHE_DURATION = 6 * 60 * 60 * 1000;
const titleMapper = new Map();

const JW_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "X-App-Version": "3.13.0-web-web",
};

function extractTop10(data) {
  const edges = data?.data?.streamingCharts?.edges || [];
  return edges.map((edge) => ({
    rank: edge.streamingChartInfo?.rank,
    title: edge.node.content?.title,
    year: edge.node.content?.originalReleaseYear,
    jw_imdb_rating: edge.node.content?.scoring?.imdbScore,
    jw_imdb_votes: edge.node.content?.scoring?.imdbVotes,
    runtime_minutes: edge.node.content?.runtime,
    genres: edge.node.content?.genres?.map((g) => g.translation),
    platform: edge.node.watchNowOffer?.package?.clearName,
    platform_id: edge.node.watchNowOffer?.package?.technicalName,
    poster: edge.node.content?.posterUrl,
    backdrop: edge.node.content?.backdrops?.[0]?.backdropUrl,
    url: edge.node.watchNowOffer?.standardWebURL,
  }));
}

function extractPopular(data) {
  const edges = data?.data?.popularTitles?.edges || [];
  return edges.map((edge, idx) => ({
    rank: idx + 1,
    title: edge.node.content?.title,
    year: edge.node.content?.originalReleaseYear,
    jw_imdb_rating: edge.node.content?.scoring?.imdbScore,
    jw_imdb_votes: edge.node.content?.scoring?.imdbVotes,
    runtime_minutes: edge.node.content?.runtime,
    genres: [],
    platform: edge.node.watchNowOffer?.package?.clearName,
    platform_id: edge.node.watchNowOffer?.package?.technicalName,
    poster: edge.node.content?.posterUrl,
    backdrop: null,
    url: edge.node.watchNowOffer?.standardWebURL,
  }));
}

async function enrichWithImdb(items, typeHint = 'movie') {
  const enriched = await Promise.all(items.map(async (item) => {
    try {
      if (titleMapper.has(item.title)) {
        return { ...item, imdb_id: titleMapper.get(item.title) };
      }

      const searches = await searchImdbPure(item.title, typeHint === 'SHOW' ? 'tvSeries' : 'movie');
      if (!searches || searches.length === 0) return item;

      const best = searches.reduce((prev, curr) => {
        const prevScore = calculateSimilarity(item.title, prev.title);
        const currScore = calculateSimilarity(item.title, curr.title);
        return currScore > prevScore ? curr : prev;
      }, searches[0]);

      if (best?.imdb_id) titleMapper.set(item.title, best.imdb_id);
      return { ...item, imdb_id: best?.imdb_id || null };
    } catch (e) {
      return item;
    }
  }));

  const imdbIds = enriched.filter(i => i.imdb_id).map(i => i.imdb_id);
  if (imdbIds.length === 0) return enriched;

  const details = await getTitlesBatch(imdbIds);
  const detailsMap = new Map(details.map(d => [d.imdb_id, d]));

  return enriched.map(item => {
    const d = detailsMap.get(item.imdb_id);
    if (!d) return item;

    return {
      rank: item.rank,
      title: item.title,
      imdb_id: item.imdb_id,
      year: item.year || d.year,
      rating: d.rating ?? item.jw_imdb_rating,
      rating_count: d.rating_count ?? item.jw_imdb_votes,
      rating_count_formatted: d.rating_count_formatted ?? null,
      certificate: d.certificate ?? null,
      duration: d.duration ?? null,
      runtime_minutes: item.runtime_minutes,
      genres: Array.from(new Set([...(item.genres || []), ...(d.genres || [])])),
      description: d.description ?? null,
      poster: d.poster || item.poster,
      backdrop: item.backdrop,
      platform: item.platform,
      platform_id: item.platform_id,
      url: item.url,
    };
  });
}

export async function fetchPlatformTop10({ platformCode, country = "IN", type = "MOVIE" }) {
  try {
    const res = await axios.post("https://apis.justwatch.com/graphql", {
      operationName: "GetProviderTop10Titles",
      variables: {
        platform: "WEB", after: "", language: "en", country, first: 10,
        watchNowFilter: { packages: [platformCode] },
        streamingChartsFilter: {
          objectType: type,
          category: "WEEKLY_POPULARITY_SAME_CONTENT_TYPE",
          packages: [platformCode],
        },
      },
      query: TOP10_QUERY,
    }, { headers: JW_HEADERS });

    if (res.data.errors) return [];
    return extractTop10(res.data);
  } catch (err) {
    console.error(`[JustWatch] Error fetching ${platformCode}:`, err.message);
    return [];
  }
}

async function fetchMxPlayerPopular({ country = "IN", type = "MOVIE" }) {
  try {
    const objectTypes = type === "SHOW" ? ["SHOW"] : ["MOVIE"];
    const res = await axios.post("https://apis.justwatch.com/graphql", {
      operationName: "GetPopularTitles",
      variables: {
        first: 10,
        popularTitlesSortBy: "POPULAR",
        sortRandomSeed: 0,
        offset: 0,
        after: "",
        popularTitlesFilter: {
          ageCertifications: [],
          excludeGenres: [],
          excludeProductionCountries: [],
          objectTypes,
          productionCountries: [],
          subgenres: [],
          genres: [],
          packages: [MXPLAYER_CODE],
          excludeIrrelevantTitles: false,
          presentationTypes: [],
          monetizationTypes: [],
          searchQuery: "",
        },
        watchNowFilter: {
          packages: [MXPLAYER_CODE],
          monetizationTypes: [],
        },
        language: "en",
        country,
      },
      query: POPULAR_QUERY,
    }, { headers: JW_HEADERS });

    if (res.data.errors) return [];
    return extractPopular(res.data);
  } catch (err) {
    console.error(`[JustWatch] Error fetching MX Player:`, err.message);
    return [];
  }
}

export async function getAllPlatformTop10({ country = "IN", type = "MOVIE" } = {}) {
  const normType = type.toUpperCase() === 'SHOW' ? 'SHOW' : 'MOVIE';
  const now = Date.now();

  if (cache[normType][country] && (now - cache.timestamp < CACHE_DURATION)) {
    return cache[normType][country];
  }

  const rawResults = {};
  await Promise.all([
    ...Object.entries(PLATFORM_CODES).map(async ([name, code]) => {
      rawResults[name] = await fetchPlatformTop10({ platformCode: code, country, type: normType });
    }),
    (async () => {
      rawResults.mxplayer = await fetchMxPlayerPopular({ country, type: normType });
    })(),
  ]);

  const results = {};
  for (const [name, items] of Object.entries(rawResults)) {
    if (items.length > 0) {
      results[name] = await enrichWithImdb(items, normType);
    } else {
      results[name] = [];
    }
    await new Promise(r => setTimeout(r, 300));
  }

  const finalData = {
    country,
    type: normType,
    results,
    updated_at: new Date().toISOString(),
  };

  cache[normType][country] = finalData;
  cache.timestamp = now;
  return finalData;
}
