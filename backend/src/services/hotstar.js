import axios from 'axios';
import { searchImdbPure, getTitlesBatch, calculateSimilarity } from './imdb.js';

const COMMON_LANGUAGES = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Bhojpuri', 'Odia'
];

const parseTags = (tags) => {
  const metadata = { year: null, duration: null, language: null, genres: [], certificate: null };
  tags.forEach(tag => {
    const tagStr = String(tag).trim();
    if (/^\d{4}$/.test(tagStr)) metadata.year = tagStr;
    else if (/h\s*\d*m|\d+m/.test(tagStr)) metadata.duration = tagStr;
    else if (COMMON_LANGUAGES.some(l => tagStr.toLowerCase().includes(l.toLowerCase()))) {
      if (!metadata.language) metadata.language = tagStr;
    }
    else if (/^U\/A|^U$|^A$|^UA$|^PG|^1[368]\+|^7\+/.test(tagStr)) metadata.certificate = tagStr;
    else metadata.genres.push(tagStr);
  });
  return metadata;
};

let hotstarCache = {
  movies: { data: null, timestamp: 0 },
  shows: { data: null, timestamp: 0 },
};

const CACHE_DURATION = 6 * 60 * 60 * 1000;
const titleMapper = new Map();

function findItems(obj) {
  let bestItems = null;
  
  function search(o) {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o.items) && o.items.length > (bestItems?.length || 0)) {
      const first = o.items[0];
      if (first && (first.title || (first.vertical_content_poster && first.vertical_content_poster.data))) {
        bestItems = o.items;
      }
    }
    for (const key in o) {
      search(o[key]);
    }
  }
  
  search(obj);
  return bestItems;
}

function extractItems(data, typeHint) {
  const items = findItems(data) || [];
  
  return items
    .filter(item => {
      const rawContent = item?.vertical_content_poster?.data?.expanded_content_poster?.content_info || item;
      const title = rawContent?.title || item?.title;
      return title && !['Home', 'TV', 'Movies', 'Sports', 'Disney+'].includes(title);
    })
    .map((item, index) => {
      const rawContent = item?.vertical_content_poster?.data?.expanded_content_poster?.content_info || item;
      const rawTags = (rawContent?.tags || item?.tags || []).map(t => typeof t === 'object' ? t.value : t);
      const parsedMeta = parseTags(rawTags);
      
      return {
        rank: index + 1,
        title: rawContent?.title || item?.title || null,
        description: rawContent?.description || item?.description || null,
        tags: rawTags,
        imdb_id: null,
        image: item?.vertical_content_poster?.data?.image?.src || item?.image || null,
        year: parsedMeta.year,
        duration: parsedMeta.duration,
        language: parsedMeta.language,
        genres: parsedMeta.genres,
        certificate: parsedMeta.certificate,
        titleType: typeHint === 'movie' ? 'movie' : 'tvSeries'
      };
    });
}

async function enrichWithImdb(hotstarItems) {
  const enrichedResults = await Promise.all(hotstarItems.map(async (item) => {
    try {
      if (titleMapper.has(item.title)) {
        return { ...item, imdb_id: titleMapper.get(item.title) };
      }

      const searches = await searchImdbPure(item.title, item.titleType);
      if (!searches || searches.length === 0) return item;

      const best = searches.reduce((prev, curr) => {
        const prevScore = calculateSimilarity(item.title, prev.title);
        const currScore = calculateSimilarity(item.title, curr.title);
        return currScore > prevScore ? curr : prev;
      }, searches[0]);

      if (best.imdb_id) titleMapper.set(item.title, best.imdb_id);

      return { ...item, imdb_id: best.imdb_id };
    } catch (e) {
      return item;
    }
  }));

  const imdbIds = enrichedResults.filter(i => i.imdb_id).map(i => i.imdb_id);
  const details = await getTitlesBatch(imdbIds);
  const detailsMap = new Map(details.map(d => [d.imdb_id, d]));

  return enrichedResults.map(item => {
    const imdbDetail = detailsMap.get(item.imdb_id);
    if (!imdbDetail) return item;

    const combinedGenres = Array.from(new Set([...item.genres, ...(imdbDetail.genres || [])]));

    return {
      ...item,
      ...imdbDetail,
      year: item.year || imdbDetail.year,
      duration: item.duration || imdbDetail.duration,
      certificate: item.certificate || imdbDetail.certificate,
      description: item.description || imdbDetail.description,
      genres: combinedGenres,
      rank: item.rank
    };
  });
}

async function fetchHotstarData(deeplink, typeHint) {
  try {
    const response = await axios.post(
      "https://www.hotstar.com/api/internal/bff/v2/freshstart",
      {
        deeplink_url: deeplink,
        app_launch_count: 1,
        device_info: {
          device_ids: [{ id: Math.random().toString(36).substring(2, 10), type: 3 }],
          device_meta: { network_operator: "wifi", os_name: "Windows", os_version: "10" },
        },
      },
      {
        headers: {
          "content-type": "application/json",
          "user-agent": "Mozilla/5.0",
          "x-hs-platform": "web",
          "x-country-code": "in",
          "x-hs-app": "260306000",
        },
      }
    );

    const items = extractItems(response.data, typeHint);
    const enriched = await enrichWithImdb(items);

    return {
      source: "hotstar",
      updated_at: new Date().toISOString(),
      total: enriched.length,
      data: enriched,
    };
  } catch (error) {
    return {
        source: "hotstar",
        updated_at: new Date().toISOString(),
        total: 0,
        data: [],
        error: error.message
    }
  }
}

export async function getHotstarPopular() {
  const now = Date.now();
  if (hotstarCache.movies.data && (now - hotstarCache.movies.timestamp < CACHE_DURATION)) {
    return hotstarCache.movies.data;
  }

  const data = await fetchHotstarData("/in/browse/leaderboard/popular-movies/reco-pop_CgNBbGwaB0FCTW92aWUiA0FsbA", "movie");
  if (data) {
    hotstarCache.movies = { data, timestamp: now };
  }
  return data;
}

export async function getHotstarPopularShows() {
  const now = Date.now();
  if (hotstarCache.shows.data && (now - hotstarCache.shows.timestamp < CACHE_DURATION)) {
    return hotstarCache.shows.data;
  }

  const data = await fetchHotstarData("/in/browse/leaderboard/popular-shows/reco-pop_CgNBbGwaBkFCU2hvdyIDQWxs", "tvSeries");
  if (data) {
    hotstarCache.shows = { data, timestamp: now };
  }
  return data;
}
