import axios from 'axios';
import * as XLSX from 'xlsx';
import { searchImdbPure, getTitlesBatch, calculateSimilarity } from './imdb.js';

const NETFLIX_URL = 'https://www.netflix.com/tudum/top10/data/all-weeks-global.xlsx';

let excelDataCache = {
  data: null,
  timestamp: 0,
};

const resultsCache = new Map();
const titleMapper = new Map();

const CACHE_DURATION = 1000 * 60 * 60;

async function fetchNetflixData() {
  const now = Date.now();
  if (excelDataCache.data && (now - excelDataCache.timestamp < CACHE_DURATION)) {
    return excelDataCache.data;
  }

  try {
    const response = await axios.get(NETFLIX_URL, {
      responseType: 'arraybuffer',
    });

    const workbook = XLSX.read(response.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    excelDataCache = {
      data,
      timestamp: now,
    };
    return data;
  } catch (err) {
    throw err;
  }
}

async function enrichWithImdb(netflixItems) {
  const enrichedResults = await Promise.all(netflixItems.map(async (item) => {
    try {
      if (titleMapper.has(item.show_title)) {
        return {
          ...item,
          imdb_id: titleMapper.get(item.show_title)
        };
      }

      const searches = await searchImdbPure(item.show_title);
      if (!searches || searches.length === 0) return item;

      const isTv = item.category.toLowerCase().includes('tv');
      const filtered = searches.filter(s => {
        if (isTv) return s.titleType === 'tv' || s.titleType === 'tvSeries';
        return s.titleType === 'movie';
      });

      const candidates = filtered.length > 0 ? filtered : searches;
      
      const best = candidates.reduce((prev, curr) => {
        const prevScore = calculateSimilarity(item.show_title, prev.title);
        const currScore = calculateSimilarity(item.show_title, curr.title);
        return currScore > prevScore ? curr : prev;
      }, candidates[0]);

      if (best.imdb_id) {
        titleMapper.set(item.show_title, best.imdb_id);
      }

      return {
        ...item,
        ...best,
        rank: item.weekly_rank,
        title: item.show_title,
      };
    } catch (e) {
      return item;
    }
  }));

  const imdbIds = enrichedResults.filter(i => i.imdb_id).map(i => i.imdb_id);
  console.log("Netflix Enrichment | Found IMDb IDs:", imdbIds.length, "out of", netflixItems.length);
  const details = await getTitlesBatch(imdbIds);
  const detailsMap = new Map(details.map(d => [d.imdb_id, d]));

  return enrichedResults.map(item => {
    const imdbDetail = detailsMap.get(item.imdb_id);
    if (!imdbDetail) return item;

    // Smart merge: Only update with non-null values from IMDb details
    const merged = { ...item };
    Object.entries(imdbDetail).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        merged[key] = value;
      }
    });

    return {
      ...merged,
      rank: item.weekly_rank,
      title: item.show_title,
      category: item.category,
      week: item.week
    };
  });
}

export async function getNetflixTop10(type = 'movie', date = null) {
  try {
    console.log("Netflix Service | Request:", { type, date });
    const allData = await fetchNetflixData();
    console.log("Netflix Service | Total Excel Rows:", allData.length);

    const categoryFilter = type.toLowerCase() === 'tv' ? 'TV' : 'Film';
    const filteredByCategory = allData.filter((row) =>
      row.category && row.category.includes(categoryFilter)
    );

    if (filteredByCategory.length === 0) return { week: date, data: [] };

    let targetWeek = date;
    if (!targetWeek) {
      targetWeek = filteredByCategory.reduce((max, row) => {
        return new Date(row.week) > new Date(max) ? row.week : max;
      }, filteredByCategory[0].week);
    }

    const resultsCacheKey = `${type}-${targetWeek}`;
    if (resultsCache.has(resultsCacheKey)) {
      return resultsCache.get(resultsCacheKey);
    }

    const latest = filteredByCategory.filter((row) => row.week === targetWeek);
    const top10 = latest
      .sort((a, b) => a.weekly_rank - b.weekly_rank);

    const enriched = await enrichWithImdb(top10);

    const result = enriched.map((movie) => ({
      rank: movie.weekly_rank,
      title: movie.show_title,
      hours_viewed: movie.weekly_hours_viewed,
      weeks_in_top_10: movie.cumulative_weeks_in_top_10,
      category: movie.category,
      week: movie.week,
      imdb_id: movie.imdb_id || null,
      titleType: movie.titleType || (movie.category && movie.category.includes('TV') ? 'tvSeries' : 'movie'),
      year: movie.year || null,
      rating: movie.rating || null,
      rating_count: movie.rating_count || 0,
      rating_count_formatted: movie.rating_count_formatted || '0',
      certificate: movie.certificate || 'NR',
      poster: movie.poster || null,
      duration: movie.duration || null,
      genres: movie.genres || [],
      description: movie.description || null
    }));

    const finalResponse = {
      week: targetWeek,
      data: result,
    };

    console.log("Netflix Service | Response Week:", targetWeek, "Items:", result.length);
    resultsCache.set(resultsCacheKey, finalResponse);

    return finalResponse;
  } catch (err) {
    console.error("Netflix Service | FATAL ERROR:", err.message);
    return { week: date, data: [] };
  }
}
